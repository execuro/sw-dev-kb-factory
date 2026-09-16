---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md
title: Add Plugin Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/add-plugin-dependencies.html
sourceHash: 2d1735b8570e23e71c5e4fbad53a278856a2ba88
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin dependency", "composer.json", "require", "shopware-platform-plugin", "shopware-plugin-class", "RequirementsValidator", "version constraint", "shared foundation plugin", "extension family", "hasActiveDependants", "plugin requires plugin", "composer package name"]
summary: "Declare that a Shopware 6.7 plugin requires another plugin via composer.json require (package name + version constraint); install/activate fail until met."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md", "platform/dev/6.7/guides/development/extensions/code-structure.md"]
---
## What it is

How to declare that a plugin cannot work without another plugin. Shopware uses Composer's `require` section in the plugin's `composer.json` for this (Composer package links semantics).

## When to use

Your plugin depends on functionality of another installed plugin, e.g. a shared foundation plugin reused by several related extensions. If you have no plugin yet, start with the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Key steps / config

1. Take the Composer package name from the other plugin's `composer.json` `name` (e.g. `swag/basic-example`) — not its Store label or PHP class name.
2. Add it with a version constraint to the dependent plugin's `require`, next to the Shopware constraint:

```json
{
    "name": "swag/plugin-dependency",
    "type": "shopware-platform-plugin",
    "require": {
        "shopware/core": "~6.7.0",
        "swag/basic-example": "^1.0"
    },
    "extra": {
        "shopware-plugin-class": "Swag\\PluginDependency\\PluginDependency",
        "label": { "de-DE": "...", "en-GB": "..." },
        "description": { "de-DE": "...", "en-GB": "..." }
    },
    "autoload": { "psr-4": { "Swag\\PluginDependency\\": "src/" } }
}
```

3. Use normal Composer constraints covering the range you support; avoid pinning an exact patch version unless required.
4. The dependent plugin cannot be installed until its requirements are fulfilled: for plugins not managed by Composer, Shopware checks the `require` entries on install and update; activation is always validated.

## Essential identifiers

- `composer.json` keys `require`, `type: shopware-platform-plugin`, `extra.shopware-plugin-class`, `extra.label`
- `Shopware\Core\Framework\Plugin\Requirement\RequirementsValidator`

## Gotchas

- Plugin discovery requires a non-empty `extra.shopware-plugin-class` and a non-empty `extra.label`; otherwise the package is not a valid plugin.
- Deactivating a plugin that still has active dependants fails (`PluginException::hasActiveDependants`).
- Every dependency adds a version relationship to test when Shopware, the shared plugin, or the dependent plugin changes; keep dependencies few and intentional.
- Alternatives to a dependency: consolidate tightly coupled features into one plugin, use a Composer library or project bundle for reusable non-plugin code, or use [theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) for presentation layers. See [Code structure](platform/dev/6.7/guides/development/extensions/code-structure.md), [Using Composer dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md) and [Using NPM dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md).

## Code check (6.7.13.0)
- confirmed `shopware-platform-plugin` — required composer type — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `shopware-plugin-class` — extra key for the plugin base class — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:21
- confirmed `label` — non-empty extra.label required for a valid plugin — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:100
- confirmed `RequirementsValidator::validateRequirements()` — checks composer require entries — vendor/shopware/core/Framework/Plugin/Requirement/RequirementsValidator.php:50
- confirmed `getManagedByComposer` — Composer-managed plugins skip the manual check except on activate — vendor/shopware/core/Framework/Plugin/Requirement/RequirementsValidator.php:52
- confirmed `validateRequirements` — run on install — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:137
- confirmed `hasActiveDependants` — deactivation blocked by active dependants — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:456
- confirmed `shopware-plugin-class` — read by ComposerPluginLoader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:43
