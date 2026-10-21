---
id: platform/dev/6.7/guides/plugins/plugins/dependencies/add-plugin-dependencies.md
title: Add Plugin Dependencies
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/dependencies/add-plugin-dependencies.html
sourceHash: 2d1735b8570e23e71c5e4fbad53a278856a2ba88
codeCheckedAgainst: "6.7.15.1"
keywords: ["plugin dependency", "composer.json", "require", "shopware-platform-plugin", "shopware-plugin-class", "shopware/core", "version constraint", "RequirementsValidator", "shared foundation plugin", "plugin requirements", "depends on plugin", "extension family"]
summary: Require another plugin by its Composer package name and version constraint in composer.json require; Shopware validates it on install.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md", "platform/dev/6.7/guides/development/extensions/code-structure.md"]
---
## What it is

A plugin that cannot work without another plugin declares that plugin in the `require` section of its own `composer.json`, using standard Composer package links. Shopware validates these requirements before the dependent plugin can be installed.

## When to use

- Your plugin relies on services or logic shipped by another Shopware plugin (e.g. a shared foundation plugin for a family of related extensions).
- You need to constrain both the supported Shopware version and the version of the required plugin.

## Key steps / config

1. Look up the required plugin's Composer package name (the `name` in its `composer.json`) — not its Store label or PHP class name. Example shared plugin:

```json
{
    "name": "swag/basic-example",
    "type": "shopware-platform-plugin",
    "require": { "shopware/core": "~6.7.0" }
}
```

2. In the dependent plugin's `composer.json`, add that package to `require` with a compatible constraint:

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
        "label": { "de-DE": "...", "en-GB": "..." }
    },
    "autoload": { "psr-4": { "Swag\\PluginDependency\\": "src/" } }
}
```

3. Use normal Composer ranges; avoid pinning an exact patch version unless truly required.
4. Install: Shopware cannot install the dependent plugin until its Composer requirements are fulfilled (the installed code also re-checks them on activation).

If you have no plugin yet, start with the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Essential identifiers

- `composer.json` → `require` (e.g. `"swag/basic-example": "^1.0"`, `"shopware/core": "~6.7.0"`)
- `"type": "shopware-platform-plugin"`
- `extra.shopware-plugin-class`
- `Shopware\Core\Framework\Plugin\Requirement\RequirementsValidator`

## Gotchas

- Keep required plugin dependencies few: each one adds a version relationship to test whenever Shopware, the shared plugin, or the dependent plugin changes.
- A change to a shared foundation can force compatibility testing and releases across all dependent extensions.
- Alternatives: merge tightly coupled features into one plugin; use a Composer library or project bundle for reusable code that needn't be a separate plugin; use [theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) for presentation-only shared layers. See [Code structure](platform/dev/6.7/guides/development/extensions/code-structure.md) and [Using Composer dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md).

## Code check (6.7.15.1)
- confirmed `PluginFinder::COMPOSER_TYPE` — value `shopware-platform-plugin` — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `shopware-plugin-class` — extra key read to find the plugin base class — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:21
- confirmed `RequirementsValidator::validateRequirements()` — validates the plugin's Composer `require` — vendor/shopware/core/Framework/Plugin/Requirement/RequirementsValidator.php:50
- confirmed `getRequires` — dependencies read from the package's require links — vendor/shopware/core/Framework/Plugin/Requirement/RequirementsValidator.php:116
- confirmed `validateRequirements` — called on install when Composer commands are not executed — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:137
- confirmed `PluginLifecycleService::activatePlugin()` — validates requirements on activation too — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:352
