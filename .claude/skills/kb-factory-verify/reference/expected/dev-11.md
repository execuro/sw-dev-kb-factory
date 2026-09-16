# `dev-11` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-11` · `dev` · `Services & DI` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 (6.7.14.0 and trunk checked on GitHub) |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** On Shopware 6.7, which file do I declare my plugin's services in, and how do I get a core service passed into my service's constructor?

**Expected answer — every fact an answer must contain:**

1. The file is `PLUGIN_ROOT/src/Resources/config/services.*` — the bundle globs `Resources/config/services.*` and loads every match through a DelegatingLoader carrying `XmlFileLoader`, `YamlFileLoader` and `PhpFileLoader`, so `services.xml`, `services.yaml`/`.yml` and `services.php` all load on every 6.7. Which one to use is version-sensitive within 6.7: up to 6.7.13.0 XML loads silently and `bin/console plugin:create` scaffolds `services.xml`; from 6.7.14.0 onward loading an `.xml` config triggers a deprecation (and throws `FeatureException` when the `v6.8.0.0` flag is active), the scaffolding emits `services.php`, and XML is slated not to be loaded at all in 6.8 — so `services.php` is the forward-compatible answer. (`Resources/config/services_test.*` is loaded additionally, only when `kernel.environment === 'test'`.) `[code: Framework/Bundle.php:212-231; Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:55-59; shopware/shopware v6.7.14.0 src/Core/Framework/Bundle.php:237-268]`
2. Autowiring is **not** on by default for a plugin's services: the generated skeleton is a bare `<services>` element with no `<defaults autowire="true" autoconfigure="true"/>` and there is no PSR-4/resource auto-registration anywhere in `Bundle`, so every plugin service must be declared and autowiring works only if the plugin's own file opts in (`->defaults()->autowire()->autoconfigure()` in PHP, `<defaults autowire="true"/>` in XML). With that opt-in, a typed constructor parameter such as `private readonly SystemConfigService $systemConfigService` is injected with no further wiring. `[code: Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:14-29; Framework/Bundle.php:212-231]`
3. Without autowiring — the default — the core service is passed by an explicit argument in constructor-parameter order: `$services->set(ExampleService::class)->args([service(SystemConfigService::class)]);` in `services.php` (with `use function Symfony\Component\DependencyInjection\Loader\Configurator\service;`), or the positional `<argument type="service" id="Shopware\Core\System\SystemConfig\SystemConfigService"/>` in `services.xml`. Core service ids are the fully-qualified class names; DAL repositories are the exception and use the `<entity_name>.repository` id (`sales_channel.` prefix for the sales-channel variant), though a repository is also registered as a named autowiring alias, so a parameter typed `EntityRepository` and named after the entity (`EntityRepository $productRepository`) resolves under autowiring. `[code: Content/DependencyInjection/product_export_tracking.php:13-45; Content/DependencyInjection/product.xml:417-422; Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:67-87]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/services/dependency-injection.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The services file is loaded by `Bundle::registerContainerFile()`, which globs `<bundle path>/Resources/config/services.*` through a DelegatingLoader over XmlFileLoader, YamlFileLoader and PhpFileLoader | `Framework/Bundle.php:212-231` | `new XmlFileLoader(...), new YamlFileLoader(...), new PhpFileLoader(...)` … `foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }` |
| A test-only `Resources/config/services_test.*` is loaded in addition, only when `kernel.environment === 'test'` | `Framework/Bundle.php:226-230` | `if ($container->getParameter('kernel.environment') === 'test') { … services_test.* … }` |
| The path is relative to the bundle path — for a plugin, `<plugin>/src/Resources/config/services.xml` in 6.7.13.0's scaffolding | `Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:55-59` | `Stub::raw('src/Resources/config/services.xml', $this->servicesXmlIntro)` |
| The generated skeleton is a bare `<services>` element — no `<defaults autowire="true" autoconfigure="true"/>`, no resource/PSR-4 auto-registration | `Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:14-29` | `<services>` with nothing else |
| The default way to get a core service into a constructor is an explicit positional `<argument type="service" id="..."/>` | `Framework/Plugin/Command/Scaffolding/Generator/StoreApiRouteGenerator.php:25-29`; `Content/DependencyInjection/product.xml:417-422` | `<argument type="service" id="product.repository"/>` … `<argument type="service" id="Shopware\Core\System\SystemConfig\SystemConfigService"/>` |
| Core service ids are FQCNs; DAL repositories use `<entity_name>.repository` (`sales_channel.` prefix for the sales-channel variant) | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:67-85` | `$repositoryId = $instance->getEntityName() . '.repository';` |
| Repositories are also registered as named autowiring aliases, so `EntityRepository $productRepository` resolves without an explicit argument when autowiring is on | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:87`; `symfony/dependency-injection ContainerBuilder.php:1501-1518` | `$container->registerAliasForArgument($repositoryId, EntityRepository::class);` |
| Autowiring is not globally on; core enables it only in a few files, and the project's `config/services.yaml` `_defaults` applies to `App\` only, not to plugin bundles | `DevOps/DependencyInjection/services.xml:7`; `Framework/DependencyInjection/cache.xml:200`; `config/services.yaml:12-15` | `<defaults autowire="true"/>` |
| If a service opts into `autoconfigure="true"`, `AutoconfigureCompilerPass` adds Shopware's own tags by base type (EntityDefinition, EntityExtension, AbstractRouteScope, SalesChannelDefinition, `#[Entity]`) | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:50-77` | `->registerForAutoconfiguration(EntityExtension::class)->addTag('shopware.entity.extension');` |
| Tags are declared inline on the service element — `kernel.event_subscriber`, `shopware.scheduled.task` in the scaffolding | `Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:23-29`; `.../ScheduledTaskGenerator.php:23-29` | `<tag name="kernel.event_subscriber"/>` |
| `Resources/config` also holds `{packages}/*` config and `routes.*`; these are three distinct load paths | `Framework/Bundle.php:159-172` | `$configLoader->load($confDir . '/{packages}/*' . Kernel::CONFIG_EXTS, 'glob');` |
| Constructor injection with promoted readonly properties is the only style core uses for its own services | `Content/Product/SalesChannel/Listing/ProductListingRoute.php:32-45` | `public function __construct(private readonly ProductListingLoader $listingLoader, private readonly EntityRepository $categoryRepository, …)` |
| **Deep, Q1:** in the installed 6.7.13.0, loading a plugin `services.xml` emits no deprecation and does not throw — `registerContainerFile()` has no `trigger_deprecation` / `Feature::triggerDeprecationOrThrow` call, and `getServicesFilePathArray()` is a bare `glob()` wrapper | `Framework/Bundle.php:212-245` | `private function getServicesFilePathArray(string $path): array { $pathArray = glob($path); … }` |
| **Deep, Q1:** the deprecation landed one patch later, in released tag v6.7.14.0 (and trunk): `triggerXmlConfigDeprecation()` runs before each load, no-ops for non-`.xml` paths, and routes through `Feature::triggerDeprecationOrThrow('v6.8.0.0', …)` — silent-but-deprecated by default, throwing `FeatureException` with the 6.8 flag on. The same helper is wired into `configureRoutes()`, `configureRouteOverwrites()` and `buildDefaultConfig()`, and `Kernel.php` carries an identical helper for the project config dir | `shopware/shopware v6.7.14.0 src/Core/Framework/Bundle.php:237-268`; `Framework/Feature.php:267-289` (6.7.13.0) | `// @deprecated tag:v6.8.0 - remove the deprecation trigger, XML service definitions are no longer loaded` … `Feature::triggerDeprecationOrThrow('v6.8.0.0', sprintf('The XML configuration file "%s" in bundle "%s" is deprecated and will not be loaded in v6.8.0.0. %s', …))` |
| **Deep, Q2:** `Kernel::CONFIG_EXTS` still lists xml in 6.7.13.0, in v6.7.14.0 (:41) and on trunk; the constant is on `Shopware\Core\Kernel`, not `Framework/Kernel.php` | `Kernel.php:40` | `final public const CONFIG_EXTS = '.{php,xml,yaml,yml}';` |
| **Deep, Q3:** from v6.7.14.0 the scaffolding writes `src/Resources/config/services.php` and `routes.php` — the XML heredocs are replaced by `$servicesPhpIntro`/`$routesPhpIntro` and every generator appends to `services.php`. At v6.7.13.0 the collector is byte-identical to the installed copy and still writes `services.xml` | `shopware/shopware v6.7.14.0 src/Core/Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:14-22,80-91` | `$stubCollection->add(Stub::raw('src/Resources/config/services.php', $this->servicesPhpIntro));` |
| **Deep, Q4:** services.xml / .yaml / .php remain three accepted formats on every 6.7 including trunk; only the XML branch changes. YAML is not deprecated — the trigger early-returns on non-`.xml` paths and the package-config hint reads "Migrate the package configuration to YAML or PHP format." | `Framework/Bundle.php:215-224`; `shopware/shopware v6.7.14.0 src/Core/Framework/Bundle.php:230-241` | glob is `services.*` with all three loaders registered |
| **Deep, Q5b:** core 6.7.13.0 ships fourteen `<Domain>/DependencyInjection/*.php` files loaded by an explicit `PhpFileLoader` alongside the XML siblings, and `product_export_tracking.php` exercises the documented `$services->set(...)->args([service(...)])` idiom | `Content/DependencyInjection/product_export_tracking.php:13-45`, loaded at `Content/Content.php:53-54` | `$services->set(SalesChannelTrackingListener::class)->args([service('sales_channel.repository'), …])->tag('kernel.event_subscriber');` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| 6.7 auto-registers all classes under a plugin's `src/` as services (PSR-4 resource auto-registration) | absent | `registerContainerFile()` loads only the `services.*` file(s); no resource-scanning code in `Bundle`, and the generated `services.xml` has no `<prototype resource="…"/>` (`Framework/Bundle.php:212-231`) |
| Autowiring is enabled by default for plugin services in 6.7 | absent | the generated skeleton has a bare `<services>` element and nothing in `Bundle` or the compiler passes sets autowiring on plugin definitions (`ScaffoldingCollector.php:14-22`) |
| There is a Shopware-specific service file name or location other than `Resources/config/services.*` | absent | the glob is exactly `<bundle path>/Resources/config/services.*` plus `services_test.*` in the test env (`Framework/Bundle.php:222-230`) |
| A plugin service must be `public="true"` to receive injected core services | absent | no compiler pass requires it; the scaffolding's injected service carries no `public` attribute (`StoreApiRouteGenerator.php:25-29`) |
| Constructor argument names matter when arguments are listed explicitly in XML | absent | `<argument type="service" id="…"/>` entries are positional; names matter only on the named-alias autowiring path (`Content/DependencyInjection/product.xml:425-431`) |
| Loading a plugin `services.xml` triggers a deprecation on 6.7.13.0 | absent | no `trigger_deprecation`/`triggerDeprecationOrThrow` hit in `Framework/Bundle.php`; the helper first appears in v6.7.14.0 |
| `Framework/Kernel.php` defines `CONFIG_EXTS` | absent | that file does not exist; the constant is on `Shopware\Core\Kernel` (`Kernel.php:40`) |
| `xml` was dropped from `Kernel::CONFIG_EXTS` as part of the migration | absent | the constant is identical in 6.7.13.0, v6.7.14.0:41 and trunk; the 6.8 cut is enforced by the deprecation triggers, not by narrowing the glob |
| A Shopware core bundle ships `Resources/config/services.php` in 6.7.13.0 | absent | the only match under `vendor/shopware` is `deployment-helper`, which is a standalone Console Application, not a Bundle; core's PHP DI lives in `<Domain>/DependencyInjection/*.php` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| DI shape core itself emits for a new plugin service consuming a core service | `Framework/Plugin/Command/Scaffolding/Generator/StoreApiRouteGenerator.php:25-29` |
| Production core DI block with FQCN ids and positional arguments | `Content/DependencyInjection/product.xml:417-431` |
| The XML deprecation, its throw path, and that XML still loads when deprecations are off | `shopware/shopware v6.7.14.0 tests/unit/Core/Framework/BundleTest.php:50-87` |
| The same deprecation for the project-level config dir | `shopware/shopware trunk tests/unit/Core/KernelTest.php` |
| Scaffolding emits `services.php` and the emitted file is loadable container config | `shopware/shopware v6.7.14.0 tests/unit/Core/Framework/Plugin/Command/Scaffolding/ScaffoldingCollectorTest.php:44-46,146-173` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| No report found of `Resources/config/services.xml` ceasing to work for plugins in 6.7 | 6.7 | — | https://github.com/shopware/shopware/issues?q=services.xml |
| Complaint that plugin services are loaded in the Plugin/Bundle class rather than a Symfony Extension, making `replaceArgument` fire too late | 6.4 era (2021) | closed | https://github.com/shopware/shopware/issues/1930 |
| Core services that look public in XML are inlined/removed at compile time, so `$container->get()` fails — the error steers people to constructor injection | 6.3.0.2 | closed | https://github.com/shopware/shopware/issues/1303 |
| Community how-to: plugin autowiring is opted into inside the plugin's own `services.xml` via `autowire="true" autoconfigure="true"` plus a `prototype` block excluding `Resources` | unclear | — | https://jop-software.de/blog/shopware-6-plugins-autowiring/ |
| Forum: replacing a core service works by a `services.xml` entry reusing the core service id with the plugin's own class | 6.x | closed | https://forum.shopware.com/t/extend-core-services-via-custom-plugin/99722 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which file(s) does the plugin base class load — `services.xml` only, or also `.php`/`.yaml`? Is `.xml` hard-coded? | code | glob is `services.*`; XML, YAML and PHP loaders are all registered — nothing is hard-coded to `.xml` |
| Are plugin services registered with autowire/autoconfigure by default? | code | no — the plugin's own file must opt in |
| Are core services autowirable by type, or must they be referenced by explicit `<argument type="service" id="…">`? | code | explicit arguments by default; autowiring works only under the plugin's own opt-in |
| What is the service id for an entity repository, and is there a type-hintable alias? | code | `<entity_name>.repository`, plus a named autowiring alias `EntityRepository $productRepository` from `EntityCompilerPass:87` |
| Did 6.7 change the visibility of injected services such that constructor injection is the only route? | code | no — no `public="true"` requirement for injection; repositories are public for unrelated reasons |
| Does loading `services.xml` deprecate or throw on 6.7? | deep code pass | not on 6.7.13.0; from v6.7.14.0 it deprecates, and throws under the `v6.8.0.0` feature flag |
| Has the ADR's XML-to-PHP migration landed in a released 6.7 tag? | deep code pass | yes — v6.7.14.0: scaffolding switched to `services.php`/`routes.php` |
| Is `services.php` required for a 6.7 plugin? | deep code pass | no — one of three accepted formats, and the forward-compatible one |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The plugin service file is `src/Resources/config/services.php` returning a closure taking a `ContainerConfigurator` | `Create a services.php file at src/Resources/config/services.php in your plugin.` | `guides/plugins/plugins/services/add-custom-service.md:18` | partially — the path/loader is confirmed, but `services.xml` and `services.yaml` load equally on all of 6.7 (`Framework/Bundle.php:212-231`) |
| Two approaches: autowire/autoconfigure defaults with `load()`/`exclude()`, or explicit `$services->set()` | `Set autowire and autoconfigure to true in your services.php file.` | same `:38-39,81` | yes as an option — but it is an opt-in, not a default (`ScaffoldingCollector.php:14-29`) |
| The autowiring example registers every PHP class under `src` as a service, excluding `Resources`/`Migration` | `Now every PHP class in the src directory of your plugin will be registered as a service.` | same `:62-63` | only because the plugin's own file declares `load()`/`exclude()`; core performs no resource auto-registration |
| All services in Shopware 6 are private by default | `By default, all services in Shopware 6 are marked as private.` | same `:110` | consistent with code — no `public` attribute in the scaffolding; repositories are explicitly set public by `EntityCompilerPass` |
| A core service is obtained by declaring it as a constructor parameter (`SystemConfigService`, promoted property) | `The following example injects SystemConfigService into ExampleService…` | `…/services/dependency-injection.md:22,36-39` | yes — `ProductListingRoute.php:32-45` is core's own idiom |
| With autowire/autoconfigure declared, no further wiring is needed | `you do not need to do anything else. The SystemConfigService will be injected … automatically.` | same `:52-53` | yes, conditional on the plugin's own opt-in |
| With an explicit declaration, pass the core service via `->args([service(SystemConfigService::class)])` | `$services->set(ExampleService::class)->args([service(SystemConfigService::class)]);` | same `:73-74` | yes — the idiom is exercised in core at `Content/DependencyInjection/product_export_tracking.php:13-45` |
| XML service configuration is deprecated from Symfony 7.4 and unsupported in Symfony 8.0 | `starting with Symfony 7.4, XML service configuration has been deprecated…` | `add-custom-service.md:116-117` | out of scope for the core lanes; Shopware's own XML deprecation is confirmed from v6.7.14.0 |
| ADR: plugin XML config deprecated in 6.7, removed in 6.8; XML load triggers a deprecation and throws under the 6.8 flag; `xml` removed from `Kernel::CONFIG_EXTS` in 6.8 | `Loading XML service, route, or package configuration triggers a deprecation … and throws with the 6.8 major feature flag` | `…/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md:30` | yes from v6.7.14.0 — not in the installed 6.7.13.0; `CONFIG_EXTS` still contains `xml` through trunk |
| ADR: core does not use autowiring and keeps wiring explicit | `Explicit wiring, no autowiring.` | same `:29` | yes — core DI files list arguments positionally |
| ADR: the platform contains no XML container or route configuration | `The platform contains no XML container or route configuration.` | same `:34` | no — the installed 6.7.13.0 ships XML DI files throughout (`Content/DependencyInjection/product.xml`, `Framework/DependencyInjection/cache.xml`); only fourteen `DependencyInjection/*.php` files exist so far |
| shopware-cli converts deprecated `services.xml`/`routes.xml` to YAML | `shopware-cli extension fix can convert them to YAML` | `products/tools/cli/validation.md:66` | not settled in core code; the loader accepts YAML equally and YAML is not deprecated |

Intent/business context code cannot express:

- The migration exists to unblock the Symfony 8 upgrade, not to improve plugin ergonomics.
- PHP was chosen over YAML so that every class reference is a `::class` constant static analysis and IDE tooling can verify.
- Explicit declaration is recommended over autowiring when the author wants control over argument order, which is part of the decoration contract.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The plugin's container configuration file is `services.php` at `src/Resources/config/services.php` | `Bundle::registerContainerFile()` globs `Resources/config/services.*` through XmlFileLoader, YamlFileLoader and PhpFileLoader, so all three formats load on every 6.7 including trunk; 6.7.13.0's own scaffolding writes `services.xml`, and v6.7.14.0's writes `services.php` | `Framework/Bundle.php:212-231`; `ScaffoldingCollector.php:55-59`; `shopware/shopware v6.7.14.0 .../ScaffoldingCollector.php:80-91` |
| ADR 2026-07-30: plugin XML config is deprecated in 6.7 and "every XML config load is logged as a deprecation"; the platform contains no XML container or route configuration | The ADR states an intended direction, not what the installed version does. In 6.7.13.0 no deprecation exists at all and core ships XML DI files throughout; the deprecation is real only from v6.7.14.0, where XML still loads (throwing only under the `v6.8.0.0` flag) | `Framework/Bundle.php:212-245`; `Content/DependencyInjection/product.xml:417-431`; `shopware/shopware v6.7.14.0 src/Core/Framework/Bundle.php:237-268` |
| ADR: in 6.8 `xml` is removed from `Kernel::CONFIG_EXTS` | The constant is `'.{php,xml,yaml,yml}'` in 6.7.13.0, v6.7.14.0 and on trunk; the 6.8 cut is enforced by the deprecation triggers, not by narrowing the glob | `Kernel.php:40` |
| Autowire/autoconfigure in `services.php` is a first-class option, and "every PHP class in the `src` directory of your plugin will be registered as a service" | Autowiring is never on for plugin bundles unless the plugin's own file opts in, and there is no resource/PSR-4 auto-registration in `Bundle`; the generated skeleton has a bare `<services>` element | `ScaffoldingCollector.php:14-29`; `Framework/Bundle.php:212-231` |
| `shopware-cli extension fix` converts deprecated `services.xml`/`routes.xml` to YAML, while the ADR and plugin guides prescribe PHP | Not settled in core code; the loader accepts all three formats equally and the XML deprecation trigger early-returns on any non-`.xml` path, so YAML is a valid migration target as far as core is concerned | `Framework/Bundle.php:212-231`; `shopware/shopware v6.7.14.0 src/Core/Framework/Bundle.php:237-268` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `The container configuration file is `services.php`, located at `PLUGIN_ROOT/src/Resources/config/services.php`, configured through Symfony's `ContainerConfigurator`.` | rewritten | wrong as written for 6.7: `Bundle::registerContainerFile()` globs `services.*` and loads XML, YAML and PHP alike on every 6.7 (`Framework/Bundle.php:212-231`), and 6.7.13.0's own scaffolding still emits `services.xml` (`ScaffoldingCollector.php:55-59`). The ADR's PHP-only direction is intent, not what the installed version requires. Replaced by a fact that names all three accepted formats and states the in-6.7 boundary the code shows: silent XML up to 6.7.13.0, deprecated from v6.7.14.0 (throwing under the `v6.8.0.0` flag), with `services.php` the forward-compatible choice |
| `With `autowire` and `autoconfigure` declared in `services.php`, adding the dependency as a typed constructor parameter (e.g. `private SystemConfigService $systemConfigService`) is all that is needed.` | kept, extended | confirmed as an option, but the old text left the reader to assume autowiring is available by default. Code shows the generated skeleton has no `<defaults autowire="true"/>` and there is no PSR-4 auto-registration, so the opt-in is load-bearing and now stated in the fact |
| `Without autowiring, declare the argument explicitly: `$services->set(ExampleService::class)->args([service(SystemConfigService::class)]);` using the `service()` helper from `Symfony\Component\DependencyInjection\Loader\Configurator`.` | kept, extended | confirmed — core exercises exactly this idiom at `Content/DependencyInjection/product_export_tracking.php:13-45`. Extended with the XML equivalent (positional `<argument type="service" id="…"/>`, the default in 6.7.13.0) and with the service-id convention (FQCN ids, `<entity_name>.repository` for DAL repositories plus the named autowiring alias), without which an answer cannot be written |
