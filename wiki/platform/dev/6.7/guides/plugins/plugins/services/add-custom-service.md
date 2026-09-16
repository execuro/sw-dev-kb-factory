---
id: platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md
title: Add Custom Service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/add-custom-service.html
sourceHash: 8a6f790dd22227081b98fc66b26891be1e6baa81
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom service", "register service", "services.php", "ContainerConfigurator", "autowire", "autoconfigure", "$services->load", "$services->set", "ExampleService", "private services", "DI container", "dependency injection", "XML service config deprecated"]
summary: Registering a plugin service in src/Resources/config/services.php, via autowire/autoconfigure resource loading or an explicit set() declaration.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How to register a custom PHP class of a plugin as a service in the Symfony DI container, using a PHP service configuration file. Builds on the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## When to use

When plugin logic should be a reusable, injectable service — and as the same pattern for registering other plugin classes such as [commands](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md), [scheduled tasks](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md) or [event subscribers](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Key steps / config

1. Create `src/Resources/config/services.php` in the plugin. The plugin's `Bundle` base class picks up any `Resources/config/services.*` file automatically.

```php
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $configurator): void {
    $services = $configurator->services();
};
```

2. Choose one of two approaches.

**Autowire and autoconfigure** — every class under `src` becomes a service; `Resources`, `Migration` and top-level `*.php` files (the plugin base class) are excluded:

```php
$services = $configurator->services()
    ->defaults()
        ->autowire()
        ->autoconfigure();

$services->load('Swag\\BasicExample\\', '../../')
    ->exclude('../../{Resources,Migration,*.php}');
```

**Explicit declaration** — more control per service:

```php
use Swag\BasicExample\Service\ExampleService;

$services->set(ExampleService::class);
```

3. Write the class, e.g. `src/Service/ExampleService.php` with namespace `Swag\BasicExample\Service` and a public `doSomething(): void` method.

## Essential identifiers

- `src/Resources/config/services.php`
- `Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator`
- `->defaults()->autowire()->autoconfigure()`
- `$services->load('Swag\\BasicExample\\', '../../')->exclude('../../{Resources,Migration,*.php}')`
- `$services->set(ExampleService::class)`

## Gotchas

- By default all services in Shopware 6 are private; fetch them via injection, not from the container at runtime.
- The `load()`/`exclude()` paths are relative to `src/Resources/config/`, hence `../../`.

## Version notes

YAML and XML service files are still supported, but XML service configuration is deprecated as of Symfony 7.4 and will not be supported in Symfony 8.0. Shopware 6.7.13.0 core requires `symfony/dependency-injection` `~7.4.0`, so prefer `services.php` for new plugins.

## Code check (6.7.13.0)
- confirmed `services.*` — Bundle globs Resources/config/services.* and loads it — vendor/shopware/core/Framework/Bundle.php:222
- confirmed `PhpFileLoader` — php service files supported alongside xml/yaml loaders — vendor/shopware/core/Framework/Bundle.php:218
- confirmed `XmlFileLoader` — xml service files still loaded in 6.7.13.0 — vendor/shopware/core/Framework/Bundle.php:216
- confirmed `symfony/dependency-injection` — core requires `~7.4.0` — vendor/shopware/core/composer.json:119
- unverified `autowire` — Symfony ContainerConfigurator API, vendor/symfony out of scope
- unverified `private` — default private services is Symfony container behavior, vendor/symfony out of scope
- unverified `XML deprecation` — Symfony 7.4 deprecation notice lives in vendor/symfony, out of scope
