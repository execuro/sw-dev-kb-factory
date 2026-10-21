---
id: platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md
title: Add Custom Service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/add-custom-service.html
sourceHash: 8a6f790dd22227081b98fc66b26891be1e6baa81
codeCheckedAgainst: "6.7.15.1"
keywords: ["services.php", "ContainerConfigurator", "autowire", "autoconfigure", "ExampleService", "src/Resources/config/services.php", "services.xml", "dependency injection", "di container", "service registration", "private service", "symfony services"]
summary: Register a custom service in a Shopware 6.7 plugin via src/Resources/config/services.php, using autowire/autoconfigure or an explicit set() call.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How to register your own service class in a Shopware plugin using the Symfony DI container. Service definitions live in a PHP configuration file that the plugin bundle loads automatically from its `Resources/config` directory.

## When to use

You have a plugin class (a service, but also commands, scheduled tasks or event subscribers) that should be built by the container and injected elsewhere. Builds on the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md). To change an existing service instead, see [Adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Create `src/Resources/config/services.php` in the plugin, returning a closure over `Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator`:

```php
return static function (ContainerConfigurator $configurator): void {
    $services = $configurator->services();
};
```

2. Choose one of two approaches.

**Autowire and autoconfigure** — set both as defaults and load the plugin's `src` directory; every PHP class there becomes a service, with `Resources` and `Migration` excluded because they usually contain no services:

```php
$services = $configurator->services()
    ->defaults()
        ->autowire()
        ->autoconfigure();

$services->load('Swag\\BasicExample\\', '../../')
    ->exclude('../../{Resources,Migration,*.php}');
```

**Explicit declaration** — for more control, declare each service yourself:

```php
use Swag\BasicExample\Service\ExampleService;

$services = $configurator->services();
$services->set(ExampleService::class);
```

3. Write the service class itself, e.g. `src/Service/ExampleService.php` with namespace `Swag\BasicExample\Service` and a plain class `ExampleService` exposing methods such as `doSomething(): void`.

The same file is where other plugin classes get registered: [commands](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md), [scheduled tasks](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md), or a [subscriber to listen to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Essential identifiers

- `src/Resources/config/services.php`
- `Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator`
- `->defaults()->autowire()->autoconfigure()`, `->load()`, `->exclude()`
- `$services->set(ExampleService::class)`

## Gotchas

- By default all services in Shopware 6 are marked private.
- Symfony also supports YAML and XML service files, but XML service configuration is deprecated as of Symfony 7.4 and unsupported in Symfony 8.0. In Shopware 6.7.15.1 a bundle's `Resources/config/services.*` loader still reads `services.xml`, but triggers a deprecation asking to migrate the definitions to PHP format; XML files will not be loaded in v6.8.0.0.

## Version notes

- 6.7: PHP service configuration is the documented format; XML service definitions are deprecated in the Shopware bundle loader for removal in v6.8.0.0.

## Code check (6.7.15.1)
- confirmed `Resources/config` — bundles look for service definition files in this directory — vendor/shopware/core/Framework/Bundle.php:224
- deprecated `XmlFileLoader` — XML service definition loading marked tag:v6.8.0 — vendor/shopware/core/Framework/Bundle.php:232
- deprecated `triggerXmlConfigDeprecation` — fires for services.xml files, removed with v6.8.0 — vendor/shopware/core/Framework/Bundle.php:254
- unverified `ContainerConfigurator` — Symfony DependencyInjection, vendor/symfony out of scope
- unverified `autowire` — Symfony DependencyInjection configurator, vendor/symfony out of scope
- unverified `private` — default service visibility is Symfony container behaviour, out of scope
