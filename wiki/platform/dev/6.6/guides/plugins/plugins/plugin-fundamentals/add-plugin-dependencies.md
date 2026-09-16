---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-plugin-dependencies.md
title: Add plugin dependencies
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/add-plugin-dependencies.html
sourceHash: ea9acf422294a07b5d47cb14bb954fe3b2855e70
keywords: ["plugin dependencies", "composer.json", "require", "composer require", "plugin version constraint", "shopware/core", "version wildcard", "SwagBasicExample", "plugin-dependency", "extra.shopware-plugin-class", "package requirement"]
summary: How to declare that a Shopware 6 plugin requires another plugin, using composer's require feature in composer.json.
lastBuilt: 2026-09-15
---
## What it is

Shopware 6 lets a plugin properly require another plugin to be present in the system, using composer's `require` feature. This is declared in the depending plugin's own `composer.json`.

## When to use

Use this when your plugin's functionality depends on another plugin being installed at a compatible version — for example, extending or reusing services shipped by that other plugin.

## Key steps / config

Every Shopware 6 plugin must own a `composer.json` file. The plugin you depend on exposes its technical `name` and `version` in its own `composer.json`, for example the `SwagBasicExample` plugin:

```json
{
    "name": "swag/swag-basic-example",
    "description": "Plugin quick start plugin",
    "version": "v1.0.0"
}
```

Add that `name` and `version` as a `require` entry in your own plugin's `composer.json`, alongside the mandatory `shopware/core` constraint:

```json
{
    "name": "swag/plugin-dependency",
    "type": "shopware-platform-plugin",
    "require": {
        "shopware/core": "6.1.*",
        "swag/SwagBasicExample": "v1.0.0"
    },
    "extra": {
        "shopware-plugin-class": "Swag\\PluginDependency\\PluginDependency"
    }
}
```

The `shopware/core` version constraint is always required in `composer.json`. Version wildcards are supported, e.g. `v1.0.*` requires only the minor version `1.1` of the dependency, ignoring the patch version.

## Essential identifiers

- `composer.json` — plugin manifest holding `require`
- `require` key — composer's dependency declaration
- `shopware/core` — mandatory Shopware version constraint
- `extra.shopware-plugin-class` — plugin bootstrap class reference

## Gotchas

Once a `require` entry names another plugin, your plugin is no longer installable until that requirement — both the named plugin and its version constraint — is fulfilled in the target system.
