# `dev-12` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-12` · `dev` · `Services & DI` |
| Version | `6.6` |
| Status | **confirmed** — verified against shopware/core at github ref `refs/tags/v6.6.10.24` |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.6.10.24` (6.6 facts read at `refs/tags/v6.6.10.24`); installed tree `6.7.13.0` used only for the Symfony cross-checks |

**Query:** I am on Shopware 6.6 — which file do I declare my plugin's service dependencies in, and how do I pass another service into the constructor?

**Expected answer — every fact an answer must contain:**

1. On 6.6 the plugin declares its services in `<plugin root>/src/Resources/config/`, loaded by `Bundle::registerContainerFile()` through the glob `<bundle path>/Resources/config/services.*`. `XmlFileLoader`, `YamlFileLoader` and `PhpFileLoader` are the registered loaders, so `services.xml` (the 6.6 documented convention), `services.yaml`/`.yml` and `services.php` are all picked up, and every file matching the glob is loaded, not only one; in the `test` environment `services_test.*` is loaded on top. `[code: github v6.6.10.24 src/Core/Framework/Bundle.php:188-210]`
2. Another service is passed into the constructor by adding `<argument type="service" id="…"/>` children to the `<service>` definition in positional constructor order and declaring the matching constructor parameter in the PHP class — core pair: `<service id="Shopware\Core\Checkout\Cart\RuleLoader"><argument type="service" id="rule.repository"/></service>` against `public function __construct(private readonly EntityRepository $repository)`. Service ids are normally the FQCN; DAL repositories use the `<entity>.repository` id. `[code: github v6.6.10.24 src/Core/Checkout/DependencyInjection/cart.xml:403-405 + src/Core/Checkout/Cart/RuleLoader.php:26]`
3. Constructor arguments are not autowired by default: Symfony's `Definition` defaults to `autowired = false` / `autoconfigured = false` and `registerContainerFile()` injects no `<defaults>` block, so every dependency must be listed explicitly unless the plugin's own services file declares `<defaults autowire="true" autoconfigure="true"/>`. The mechanism is unchanged in 6.7 — the glob, the loader set and `getServicesFilePathArray()` are byte-identical. `[code: vendor/symfony/dependency-injection/Definition.php:35,43; Framework/Bundle.php:212-231]`

**Official reference URL:** https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| A plugin is a Bundle, so bundle service-file loading applies to every plugin | github `v6.6.10.24` `src/Core/Framework/Plugin.php:16` | `abstract class Plugin extends Bundle` |
| `Bundle::build()` calls `registerContainerFile($container)` on every container build — the only hook loading a plugin's DI file | github `v6.6.10.24` `src/Core/Framework/Bundle.php:34-42` | `public function build(ContainerBuilder $container): void { parent::build($container); $this->registerContainerFile($container);` |
| The file must live at `<bundle path>/Resources/config/services.*`; XML, YAML and PHP loaders are registered | github `v6.6.10.24` `src/Core/Framework/Bundle.php:188-204` | `new XmlFileLoader(...), new YamlFileLoader(...), new PhpFileLoader(...)` … `foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }` |
| The glob result is iterated whole — several matching files are loaded | github `v6.6.10.24` `src/Core/Framework/Bundle.php:213-222` | `$pathArray = glob($path); … return $pathArray;` |
| In the `test` environment `Resources/config/services_test.*` is loaded additionally | github `v6.6.10.24` `src/Core/Framework/Bundle.php:206-210` | `if ($container->getParameter('kernel.environment') === 'test') { … services_test.* … }` |
| `$this->getPath()` is the directory of the plugin class file, i.e. `<plugin root>/src` | `vendor/symfony/http-kernel/Bundle/Bundle.php:99-107` | `$reflected = new \ReflectionObject($this); $this->path = \dirname($reflected->getFileName());` |
| `Plugin::computePluginClassPath()` rewrites that path back onto the plugin base path, confirming `getPath()` is the class directory, not the plugin root | github `v6.6.10.24` `src/Core/Framework/Plugin.php:128-137` | `$canonicalizedPluginClassPath = $this->getPath(); $canonicalizedPluginPath = realpath($this->basePath);` |
| Constructor injection via positional `<argument type="service">`, matched pair in 6.6 core | github `v6.6.10.24` `src/Core/Checkout/DependencyInjection/cart.xml:403-405` + `src/Core/Checkout/Cart/RuleLoader.php:26` | `<argument type="service" id="rule.repository"/>` / `public function __construct(private readonly EntityRepository $repository)` |
| Symfony `Definition` defaults: not autowired, not autoconfigured | `vendor/symfony/dependency-injection/Definition.php:35,43` | `private bool $autoconfigured = false;` … `private bool $autowired = false;` |
| Shopware registers autoconfiguration interfaces/attributes (`EntityDefinition`, `EntityExtension`, `AbstractRouteScope`, …); they apply only to definitions that are themselves autoconfigured. Present in 6.6 and 6.7 | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:49-74` (6.7.13.0; same path HTTP 200 at `v6.6.10.24`) | `->registerForAutoconfiguration(EntityDefinition::class)->addTag('shopware.entity.definition');` |
| 6.6 vs 6.7 diff for this question: none (only a dropped docblock) | `Framework/Bundle.php:212-231` (6.7.13.0) vs github `v6.6.10.24` `src/Core/Framework/Bundle.php:192-211` | `foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path)` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Shopware enables autowiring for plugin service files by default | absent | `grep '<defaults'` over installed core/storefront/administration returns three hits, all DevOps/test-only (`core/DevOps/DependencyInjection/services.xml:7`, `services_e2e.xml:7`, `Framework/DependencyInjection/services_test.xml:20`). `registerContainerFile()` sets no defaults on the loaded file. |
| A plugin may put service definitions elsewhere (plugin root, `DependencyInjection/`, an overridable method) | absent | `Bundle.php` exposes no overridable hook; `registerContainerFile()` is private and hard-codes `$this->getPath() . '/Resources/config/services.*'` and `services_test.*`. Nothing else in `Bundle.php` loads service files. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A real 6.6 plugin fixture `services.xml` at `<plugin>/src/Resources/config/`, plain `<container>/<services>` with no `<defaults>`, explicit `<argument type="service">` injection and tag usage | github `v6.6.10.24` `src/Core/Framework/Test/Plugin/_fixture/plugins/SwagTestPlugin/src/Resources/config/services.xml:7-26` |
| That fixture's `<argument>` is a constructor argument — `SwagTestTaskHandler` inherits `ScheduledTaskHandler::__construct(EntityRepository $scheduledTaskRepository, ?LoggerInterface $exceptionLogger = null)` | github `v6.6.10.24` `src/Core/Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:21-24` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Maintainer: Symfony 7.4 deprecates XML service definitions; Shopware is converting core definitions and docs to PHP config, removal in Symfony 8 / Shopware 6.8 | trunk / 6.8 | open | https://github.com/shopware/shopware/issues/13072 |
| Services should be loaded in the container Extension rather than the Plugin/Bundle; `setArgument`/`replaceArgument` run too late | 6.4-era | closed | https://github.com/shopware/shopware/issues/1930 |
| Docs `services.xml` example for a Storefront controller injects `service_container` via `setContainer` instead of using `controller.service_arguments` | 2023, pre-6.6 | closed | https://github.com/shopware/docs/issues/1221 |
| Recurring "dependency on a non-existent service" after adding a constructor argument in a plugin | 6.x, unclear | open | https://forum.shopware.com/t/error-the-service-xxx-has-a-dependency-on-a-non-existent-service/96804 |
| Own service not retrievable from the container inside `Plugin::activate()` | 6.x, unclear | open | https://forum.shopware.com/t/eigener-service-in-plugin-activate-you-have-requested-a-non-existent-service/59821 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which file(s) does the plugin base class auto-load in 6.6; is `services.yaml`/`services.php` also picked up? | code | `Resources/config/services.*` glob with XML, YAML and PHP loaders; all three formats load, several files at once; not recursive. |
| Does 6.6 enable `autowire`/`autoconfigure` by default for plugin services? | code | No. Symfony defaults are false and `registerContainerFile()` adds no `<defaults>`; dependencies must be declared explicitly unless the plugin's own file opts in. |
| Are plugin services public or private by default in 6.6; can `$this->container->get()` work in `Plugin::activate()`? | not settled | Out of scope of this query (file location + constructor injection); no fact in the expected answer depends on it. |
| Does 6.6 emit a deprecation for XML service configuration? | code | No — `XmlFileLoader` is registered unconditionally in 6.6 and identically in 6.7; the deprecation in #13072 targets Symfony 7.4/8 and Shopware 6.8. |
| Does 6.6 still use the `setContainer` controller registration docs issue #1221 called wrong? | not settled | Not examined; no fact in the expected answer concerns controller registration. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| 6.6 docs: services are registered in `services.xml` in `src/Resources/config/` | "This is done by placing a file with name `services.xml` into a directory called `src/Resources/config/`." | live v6.6 `plugin-fundamentals/add-custom-service.html` | yes — as one accepted filename of the `services.*` glob |
| 6.6 docs: injection via `<argument type="service" id="…"/>` | `<service id="Swag\BasicExample\Service\ExampleService"><argument type="service" id="…\SystemConfigService"/></service>` | live v6.6 `plugin-fundamentals/dependency-injection.html` | yes — `cart.xml:403-405` |
| 6.6 docs: the injected service must also be a constructor argument of the PHP class | "Now we have to add the injected service as argument to our service constructor." | live v6.6 `plugin-fundamentals/dependency-injection.html` | yes — `RuleLoader.php:26` |
| Current-branch (6.7) docs: create `services.php` at `src/Resources/config/services.php` | "Create a `services.php` file at `src/Resources/config/services.php` in your plugin." | clone `guides/plugins/plugins/services/add-custom-service.md:18` | yes as a loadable filename (`PhpFileLoader` is registered in 6.6 too); the page carries no version marker |
| XML service config deprecated from Symfony 7.4, unsupported in Symfony 8 | "starting with Symfony 7.4, XML service configuration has been deprecated…" | clone `services/add-custom-service.md:114-117` | no code check in 6.6 — XML loads without deprecation at `v6.6.10.24` |
| ADR: plugins can already ship `services.php` on all supported 6.x versions | "Plugins can already ship `services.php`, `routes.php`, and PHP package config on all supported 6.x versions." | clone `adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md:30` | yes — `PhpFileLoader` is in the 6.6 loader resolver |
| ADR: plugin XML config deprecated in 6.7, removed in 6.8 (still supported in 6.6) | "**Plugin XML configuration is deprecated in 6.7 and removed in 6.8…**" | same ADR:30 | consistent with code for 6.6 (XML loads); 6.7/6.8 not checked |
| Current-branch docs: with `autowire`/`autoconfigure` declared, no explicit argument is needed | "If you previously declared `autowire` and `autoconfigure` in your `services.php` file, you do not need to do anything else." | clone `services/dependency-injection.md:52-53` | consistent — but code shows the opt-in is the plugin's own, not a Shopware default |
| Current-branch docs: all services in Shopware 6 are private by default | "By default, all services in Shopware 6 are marked as _private_." | clone `services/add-custom-service.md:110` | not checked — no fact depends on it |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The live v6.6 page names `services.xml`; the clone (6.7, same guide relocated to `services/`) names `services.php`. The clone pages carry no version marker, so read alone they answer a 6.6 question with 6.7 guidance. | Neither filename is special: `Bundle::registerContainerFile()` globs `Resources/config/services.*` and resolves it through XML, YAML and PHP loaders — in 6.6 exactly as in 6.7. `services.xml` is the 6.6 convention; `services.php` also loads. | github `v6.6.10.24` `src/Core/Framework/Bundle.php:188-204` |
| The docs present `autowire`/`autoconfigure` as an available convenience without stating it is off unless the plugin declares it. | Symfony defaults are `autowired = false` / `autoconfigured = false`, and Shopware adds no `<defaults>` when loading a plugin's file. | `vendor/symfony/dependency-injection/Definition.php:35,43`; `Framework/Bundle.php:212-231` |
| `add-custom-service.md` frames the XML deprecation on the Symfony 7.4/8.0 axis, the ADR on the Shopware 6.7/6.8 axis. | Not a 6.6 concern: the 6.6 loader set registers `XmlFileLoader` with no deprecation path. | github `v6.6.10.24` `src/Core/Framework/Bundle.php:188-204` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| On 6.6 the container configuration file is `services.xml` at `<plugin root>/src/Resources/config/services.xml`, using the schema `http://symfony.com/schema/dic/services/services-1.0.xsd`. | rewritten | The path is right but the filename is not exclusive: code globs `services.*` with XML, YAML and PHP loaders in 6.6, and loads every match. The XSD clause was asserted by no code finding and is not what decides whether an answer is usable. |
| The dependency is declared as `<service id="Swag\BasicExample\Service\ExampleService"><argument type="service" id="Shopware\Core\System\SystemConfig\SystemConfigService"/></service>`. | rewritten | Kept in substance and re-anchored to a code-verified core pair (`cart.xml:403-405` / `RuleLoader.php:26`), with the positional-order and `<entity>.repository` id rules the code shows. |
| The same service is then taken as a constructor parameter and stored on a property; the example reads config with `$this->systemConfigService->getString('core.basicInformation.shopName', $context->getSalesChannel()->getId())`. | removed | The constructor-parameter half is folded into fact 2. The `getString(...)` example is doc illustration, backed by no code finding, and scoring an answer on it rewards reciting the docs page rather than declaring services correctly. |
| — | added (fact 3) | Code shows autowiring is off by default for plugin definitions (`Definition` defaults false, no `<defaults>` injected). An answer that omits the explicit `<argument>` requirement produces a container that does not build; this is load-bearing and the old set missed it. |
