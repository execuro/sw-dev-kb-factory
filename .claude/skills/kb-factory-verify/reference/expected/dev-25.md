# `dev-25` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-25` · `dev` · `Config & CLI` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I add a `bin/console` command to my plugin for a maintenance task?

**Expected answer — every fact an answer must contain:**

1. The command is a plain Symfony console command: a class extending `Symfony\Component\Console\Command\Command`, named and described with the `#[AsCommand(name: '…', description: '…')]` attribute, with arguments and options declared in `configure()` and the work done in `execute(InputInterface $input, OutputInterface $output): int` returning `Command::SUCCESS`/`FAILURE`. Shopware has no console base class of its own and no plugin-side command registry — `bin/console` is a FrameworkBundle `Application` over the Shopware kernel. `[code: System/SystemConfig/Command/ConfigGet.php:14-50]`
2. It becomes visible by being a service in the plugin's own DI file: `Framework\Bundle::build()` globs `<plugin root>/src/Resources/config/services.*` (`services.xml`, `services.yaml` or `services.php`; `services_test.*` only in the test env), and the `console.command` tag is what the console consumes. Core tags its commands explicitly, and Symfony's FrameworkExtension autoconfigures the tag for any service whose class extends `Command`, so with `autoconfigure="true"` the explicit tag is not required. Dependencies come in through the constructor. `[code: Framework/Bundle.php:212-232; System/DependencyInjection/configuration.xml:94-98]`
3. The command appears in `bin/console list` only while the plugin is installed **and** active: `KernelPluginLoader::getBundles()` yields only `getActives()`, and `DbalKernelPluginLoader` counts a plugin active only when `active = 1 AND installed_at IS NOT NULL` — an installed-but-deactivated plugin contributes no services and therefore no command. `[code: Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:89-95; Framework/Plugin/KernelPluginCollection.php:62-69]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `bin/console` is a plain FrameworkBundle `Application` over the Shopware kernel | `bin/console:59-65` (project root) | `$application = new Application($kernel);` … `$application->setName('Shopware');` |
| Core commands extend Symfony's `Command` and use `#[AsCommand]` | `System/SystemConfig/Command/ConfigGet.php:14-20` | `#[AsCommand(name: 'system:config:get', description: 'Get a config value',)]` … `class ConfigGet extends Command` |
| Arguments/options in `configure()`, entry point `execute(): int` | `System/SystemConfig/Command/ConfigGet.php:41-50` | `->addArgument('key', InputArgument::REQUIRED)` … `protected function execute(InputInterface $input, OutputInterface $output): int` |
| Constructor injection; core commands are services carrying `console.command` | `System/DependencyInjection/configuration.xml:94-98` | `<service id="Shopware\Core\System\SystemConfig\Command\ConfigGet">` … `<tag name="console.command"/>` |
| Symfony autoconfigures the tag for any `Command` subclass | `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:703-704` | `$container->registerForAutoconfiguration(Command::class)->addTag('console.command');` |
| A plugin's service definitions are loaded from `<bundle path>/Resources/config/services.*` | `Framework/Bundle.php:34-38,212-232` | `foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) {` |
| Only active plugin bundles reach the kernel | `Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:89-95`; `Framework/Plugin/KernelPluginCollection.php:62-69`; `Framework/Plugin/KernelPluginLoader/DbalKernelPluginLoader.php:30` | `foreach ($this->pluginInstances->getActives() as $plugin) {` … `IF(\`active\` = 1 AND \`installed_at\` IS NOT NULL, 1, 0) AS active,` |
| Which plugins the console sees depends on the bootstrap loader: `DbalKernelPluginLoader` with `DATABASE_URL`, `ComposerPluginLoader` with `COMPOSER_PLUGIN_LOADER=1`, `StaticKernelPluginLoader` (no plugins) for `system:install` | `bin/console:37-50` (project root) | `if ($input->getFirstArgument() === 'system:install') { $context['INSTALL'] = true; }` |
| `ShopwareStyle` is deprecated for removal in 6.8 in favour of `SymfonyStyle` | `Framework/Adapter/Console/ShopwareStyle.php:11-23` | `@deprecated tag:v6.8.0 - Will be removed. Use {@see SymfonyStyle} instead` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Shopware has its own console command base class plugin commands must extend | absent | `Framework/Console/` holds only `OutputFormatTrait.php`; every core command extends `Symfony\Component\Console\Command\Command` directly — `System/SystemConfig/Command/ConfigGet.php:19` |
| A plugin must register commands through a Shopware mechanism (compiler pass, plugin base-class hook, XML manifest entry) | absent | No Shopware compiler pass reads `console.command`; the only Shopware-side step is `Bundle::build()` loading the plugin's `services.*` — `Framework/Bundle.php:212-226`; `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:703-704` |
| `ShopwareStyle` is the recommended output style for new 6.7 commands | absent | Marked `@deprecated tag:v6.8.0` in 6.7.13.0, pointing at `SymfonyStyle` — `Framework/Adapter/Console/ShopwareStyle.php:11-13` |
| A plugin command works while the plugin is merely installed | absent | Only `getActives()` is iterated, and DBAL marks active only on `active = 1 AND installed_at IS NOT NULL` — `Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:89-95` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A shipped example of the exact pattern a plugin copies: `#[AsCommand]` + constructor injection + `configure()`/`execute()` | `System/SystemConfig/Command/ConfigGet.php:14-50` |
| The matching DI registration that makes it visible to `bin/console` | `System/DependencyInjection/configuration.xml:94-98` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| After 6.7.1.2 → 6.7.3.0 every `bin/console` command produced no output; in dev it failed with a lazy-proxy error for `HttpClientInterface`, traced to a Symfony 7.3.4 incompatibility | 6.7.2.2 / 6.7.3.0 | closed | https://github.com/shopware/shopware/issues/12765 |
| Duplicate report of the same console boot failure | 6.7.3.0 | closed | https://github.com/shopware/shopware/issues/12975 |
| Feature request to trigger plugin commands from the Administration — i.e. plugin commands are CLI-only | unclear (2021) | closed | https://github.com/shopware/shopware/issues/1990 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is `console.command` still the consumed tag, or does autoconfiguration make it optional? | code | Both: the tag is what the console consumes, and `FrameworkExtension` autoconfigures it for every `Command` subclass — `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:703-704` |
| Must a plugin command class be named with a `Command` suffix, as community guides claim? | code | No. Registration is tag/attribute-based; no name check exists in Shopware's DI path — `Framework/Bundle.php:212-226` |
| Where is a plugin's `services.*` loaded from? | code | `<bundle path>/Resources/config/services.*` by glob in `Bundle::build()`, plus `services_test.*` in the test env — `Framework/Bundle.php:212-232` |
| Are commands of an installed-but-deactivated plugin registered? | code | No — only active plugin bundles are yielded — `Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:89-95` |
| Do core 6.7 commands use `Command` + `#[AsCommand]` with an explicit tag, and what file is the pattern? | code | Yes; `System/SystemConfig/Command/ConfigGet.php` with `System/DependencyInjection/configuration.xml:94-98` |
| Does the console require a bootable kernel with a reachable database? | not settled | The bootstrap picks `DbalKernelPluginLoader` when `DATABASE_URL` is set and a plugin-less `StaticKernelPluginLoader` for `system:install` (`bin/console:37-50`), but whether a plugin command can run on a not-yet-installed system was not executed end to end. Not part of the facts this case scores. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Shopware CLI commands are Symfony Console; custom plugin commands follow the standard Symfony approach | "creating custom commands in Shopware plugins follows the standard Symfony approach" | add-custom-commands.md | yes — `bin/console:59-65`; `System/SystemConfig/Command/ConfigGet.php:14-20` |
| The command must be registered in `src/Resources/config/services.php` and tagged `console.command` | "you must register it as a service in your plugin's `src/Resources/config/services.php` and tag it with `console.command`" | add-custom-commands.md | partly — the directory and the tag are right, but `Bundle::build()` globs `services.*`, so `services.xml`/`services.yaml` work identically, and autoconfiguration makes the explicit tag optional |
| Registration snippet `$services->set(...)->tag('console.command');` | as quoted | add-custom-commands.md | yes as one valid form |
| Commands registered as services are automatically available via `bin/console` | "Commands registered as services in a Shopware plugin are automatically available via `bin/console`." | add-custom-commands.md | partly — only while the plugin is installed and active |
| The class lives at `<plugin root>/src/Command/`, extends `Command`, uses `#[AsCommand]`, implements `execute(): int` returning `Command::SUCCESS` | `#[AsCommand(name: 'swag:example', …)] class ExampleCommand extends Command` | add-custom-commands.md | yes for the class shape; the directory is convention, not enforced by any code path |
| Plugin service definitions are found automatically when `services.php` sits in `Resources/config/` relative to the plugin base class | "relative to the location of your plugin's base class" | add-scheduled-task.md | yes — `Framework/Bundle.php:212-232` |
| Commands are executed with `bin/console [command] [parameters]` from within the project | as quoted | commands-reference.md | yes — `bin/console:59-65` |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| Registration requires `src/Resources/config/services.php` | `Bundle::build()` globs `Resources/config/services.*` — `services.xml`, `services.yaml` and `services.php` are equally loaded, and core itself uses XML | `Framework/Bundle.php:212-232`; `System/DependencyInjection/configuration.xml:94-98` |
| You "must" tag the service `console.command` | The tag is what the console consumes, but Symfony autoconfigures it for every service whose class extends `Command`, so an autoconfigured plugin service needs no explicit tag | `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:703-704` |
| Commands registered as services "are automatically available via `bin/console`" | Only when the plugin is installed and active; an installed-but-deactivated plugin's `services.*` is never loaded, so the command does not exist | `Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:89-95` |
| The page is silent on output helpers | `ShopwareStyle` still exists but is `@deprecated tag:v6.8.0`; `SymfonyStyle` is the replacement for new commands | `Framework/Adapter/Console/ShopwareStyle.php:11-23` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| "Register the command class as a service in `src/Resources/config/services.php` and tag it `console.command`; commands registered this way appear automatically under `bin/console`." | rewritten | Over-narrow and over-promising: `Bundle::build()` globs `services.*` so XML and YAML work identically, the tag is autoconfigured for `Command` subclasses, and "appear automatically" is only true while the plugin is installed and active. |
| "The class extends `Symfony\\Component\\Console\\Command\\Command` and carries the `#[AsCommand(name: 'swag:example', description: '...')]` attribute from `Symfony\\Component\\Console\\Attribute\\AsCommand`." | kept, merged | Confirmed by `System/SystemConfig/Command/ConfigGet.php:14-20`; merged into fact 1 together with `configure()`/`execute()` and the absence of any Shopware base class. |
| "The logic goes into `execute(InputInterface $input, OutputInterface $output): int`, returning `Command::SUCCESS`; the class lives at `<plugin root>/src/Command/ExampleCommand.php`." | rewritten | The `execute()` half is confirmed (`ConfigGet.php:41-50`) and folded into fact 1. The class path is a docs convention with no code enforcing it — no Shopware code inspects the command's directory or class name — so it is not a fact an answer must contain. Replaced by the installed-and-active precondition, which the code shows is load-bearing. |
