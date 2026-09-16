---
id: platform/dev/6.7/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md
title: Migrate container configuration from XML to PHP
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.html
sourceHash: ca9ed456142ad30e1593b1eaace8f62579d9c563
codeCheckedAgainst: "6.7.13.0"
keywords: ["services.xml", "services.php", "routes.php", "ContainerConfigurator", "RoutingConfigurator", "Kernel::CONFIG_EXTS", "XmlFileLoader", "dependency injection", "service container", "symfony 8", "xml deprecation", "plugin config", "adr"]
summary: "ADR: platform DI/route config moves from XML to PHP; plugin XML config deprecated in 6.7, removed in 6.8. Installed 6.7.13.0 still mixes XML and PHP."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2026-07-30, accepted): because Symfony 7.4 deprecates and Symfony 8 removes the XML loaders for services and routes, all platform service and route definitions move to PHP configuration (`ContainerConfigurator` / `RoutingConfigurator`), and XML configuration support for plugins is deprecated in 6.7 and removed in 6.8.

## When to use

When writing or maintaining a plugin's `Resources/config/services.xml`, routes or package config and planning the move to `services.php` / `routes.php` before Shopware 6.8, or when adding core services and choosing the file format.

## Key steps / config

1. Ship plugin service definitions as `Resources/config/services.php` (PHP `ContainerConfigurator`), routes as `routes.php`, package config as PHP. The installed bundle loader already accepts PHP: `Bundle` globs `Resources/config/services.*` and loads through XML, YAML and PHP file loaders.
2. Use `::class` constants for every class reference so static analysis and IDE refactoring verify the wiring.
3. Wire explicitly, no autowiring: keep argument order deliberate (it is part of the decoration contract).
4. When converting, map each XML file 1:1 to a PHP file with the same basename loaded at the same position; the platform proved equivalence by diffing `debug:container` and `debug:router` JSON dumps before and after.
5. In core, register new services in the existing `DependencyInjection/*.php` files following their style.
6. `UPGRADE-6.8.md` documents the XML-to-PHP mapping.

## Essential identifiers

- `Resources/config/services.xml` → `services.php`, `routes.php`
- `ContainerConfigurator`, `RoutingConfigurator`
- `Kernel::CONFIG_EXTS` (currently `.{php,xml,yaml,yml}`)
- `debug:container`, `debug:router`

## Gotchas

- Installed 6.7.13.0 is mid-migration: `Framework::build()` still loads many XML files (`services.xml`, `acl.xml`, `cache.xml`, ...) next to PHP ones (`app.php`, `webhook.php`, `plugin.php`, ...). The ADR's "platform contains no XML" state is not reached in this version.
- The ADR says loading plugin XML triggers a deprecation (with bundle and file context) and throws with the 6.8 major feature flag; in 6.7.13.0 `Bundle` uses Symfony's `XmlFileLoader` directly with no Shopware deprecation call, so do not rely on seeing that notice.
- No vendored XML loader will be kept; YAML remains supported by Symfony but was rejected as the target.

## Version notes

- 6.7: plugin XML service/route/package config deprecated; PHP config works on all supported 6.x versions.
- 6.8: XML loaders dropped and `xml` removed from `Kernel::CONFIG_EXTS`.

## Code check (6.7.13.0)
- confirmed `Kernel::CONFIG_EXTS` — still includes xml — vendor/shopware/core/Kernel.php:40
- confirmed `XmlFileLoader` — plugin services.* loaded via XML/YAML/PHP loaders — vendor/shopware/core/Framework/Bundle.php:216
- confirmed `services.*` — bundle globs Resources/config/services.* — vendor/shopware/core/Framework/Bundle.php:222
- corrected `Bundle::registerContainerFile()` — docs: XML load triggers deprecation in 6.7; no Shopware deprecation trigger in loader — vendor/shopware/core/Framework/Bundle.php:212
- corrected `Framework::build()` — docs: platform has no XML container config; still loads services.xml via XmlFileLoader — vendor/shopware/core/Framework/Framework.php:72
- confirmed `webhook.php` — PHP DI file loaded via PhpFileLoader — vendor/shopware/core/Framework/Framework.php:101
- confirmed `XmlFileLoader` — package config loaders include XML — vendor/shopware/core/Framework/Bundle.php:150
