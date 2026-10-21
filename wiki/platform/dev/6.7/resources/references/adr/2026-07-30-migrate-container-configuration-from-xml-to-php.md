---
id: platform/dev/6.7/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md
title: Migrate container configuration from XML to PHP
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.html
sourceHash: bf853324f8b8b5777fd4205d86d29b9cc67c104e
codeCheckedAgainst: "6.7.15.1"
keywords: ["services.xml", "services.php", "routes.php", "ContainerConfigurator", "RoutingConfigurator", "Kernel::CONFIG_EXTS", "debug:container", "debug:router", "UPGRADE-6.8.md", "dependency injection", "xml to php migration", "plugin service definitions", "symfony 8", "autowiring"]
summary: "ADR: platform DI and route config moved from XML to PHP; plugin XML service/route/package config is deprecated in 6.7 and removed in 6.8."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-07-30). Symfony 7.4 deprecates the XML configuration loaders for service definitions and routes and Symfony 8 removes them. At the time the platform defined roughly 2,350 services across 101 XML files plus 12 XML route files, and plugins ship `Resources/config/services.xml` by convention — both blocked the Symfony 8 upgrade. Decision: migrate all platform service and route definitions to PHP configuration (`ContainerConfigurator` / `RoutingConfigurator`) and deprecate, then remove, XML configuration support for plugins.

## When to use

- Maintaining a plugin or app server that still ships `services.xml`, XML route files or XML package config.
- Adding new services to core — they go into the existing `DependencyInjection/*.php` files, following their style.
- Seeing an "XML configuration file ... is deprecated and will not be loaded in v6.8.0.0" deprecation.

## Key steps / config

1. Replace `Resources/config/services.xml` with `Resources/config/services.php` (and `services_test.xml` with `services_test.php`).
2. Replace XML route files (`routes.xml`, `routes/*.xml`, `routes_<env>.xml`, `routes_overwrite.xml`) with their `.php` counterparts.
3. Move XML package configuration under `Resources/config/packages/` to YAML or PHP.
4. PHP service config shape (as used by core):

```php
return static function (ContainerConfigurator $containerConfigurator): void {
    $services = $containerConfigurator->services();
    $services->set(MyService::class)
        ->args([service(OtherService::class)]);
};
```

5. Keep wiring explicit; core does not use autowiring. Argument order is part of the decoration contract.
6. To verify a 1:1 migration, diff `debug:container` and `debug:router` JSON dumps (including hidden services and parameters) before and after.

Plugins can already ship `services.php`, `routes.php` and PHP package config on all supported 6.x versions. `UPGRADE-6.8.md` documents the XML-to-PHP mapping.

## Essential identifiers

- `ContainerConfigurator`, `RoutingConfigurator`
- `Resources/config/services.php`, `routes.php`
- `Kernel::CONFIG_EXTS` (currently `.{php,xml,yaml,yml}`)
- `debug:container`, `debug:router`
- `UPGRADE-6.8.md`

## Gotchas

- Every XML config load triggers a deprecation naming the bundle and file; with the 6.8 major feature flag (`v6.8.0.0`) active it throws instead.
- No vendored XML loader will be maintained — maintaining one was rejected as long-term cost for a format Symfony abandoned.
- PHP was chosen over YAML because `::class` references are checked by static analysis, IDEs and refactoring tools.

## Version notes

- 6.7: platform has no XML container or route configuration; plugin XML config still loads but is deprecated.
- 6.8: XML loaders are dropped and `xml` is removed from `Kernel::CONFIG_EXTS`.

## Code check (6.7.15.1)
- confirmed `Kernel::CONFIG_EXTS` — still `.{php,xml,yaml,yml}` in 6.7 — vendor/shopware/core/Kernel.php:41
- confirmed `Bundle::triggerXmlConfigDeprecation()` — `Feature::triggerDeprecationOrThrow('v6.8.0.0', …)` with file and bundle name — vendor/shopware/core/Framework/Bundle.php:87
- confirmed `Bundle::registerContainerFile()` — loads `Resources/config/services.*` via XML/YAML/PHP loaders — vendor/shopware/core/Framework/Bundle.php:227
- deprecated `XmlFileLoader` — plugin XML service loader marked `@deprecated tag:v6.8.0` — vendor/shopware/core/Framework/Bundle.php:232
- confirmed `Bundle::configureRoutes()` — XML route files trigger deprecation, then glob import — vendor/shopware/core/Framework/Bundle.php:79
- confirmed `ContainerConfigurator` — core DI files are PHP closures, e.g. webhook services — vendor/shopware/core/Framework/DependencyInjection/webhook.php:60
