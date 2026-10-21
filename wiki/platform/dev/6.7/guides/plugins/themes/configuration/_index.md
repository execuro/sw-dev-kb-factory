---
id: platform/dev/6.7/guides/plugins/themes/configuration/_index.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/configuration/
sourceHash: 6b2bd9a0b66b7bed9382f9a5542fabf2505cdd9a
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme.json", "config", "configInheritance", "theme configuration", "theme config fields", "theme manager", "administration theme settings", "config inheritance", "storefront theme", "theme settings"]
summary: Section index for Shopware theme configuration - theme.json structure, Administration config fields and configInheritance between themes.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md
  - platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md
---
## What it is

Section index for configuring Storefront themes in Shopware. It covers the structure of a theme's `theme.json`, the config fields a theme exposes in the Administration theme manager, and how one theme inherits field configuration from another via `configInheritance`.

## When to use

Start here when you need to change a theme's `theme.json` (views, styles, scripts, assets, config fields) or want a theme to reuse another theme's field configuration.

## Key steps / config

- [Theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md) — the `theme.json` keys (`name`, `author`, `views`, `style`, `script`, `asset`, `previewMedia`, `config`, `configInheritance`) and the per-field parameters shown in the Administration.
- [Theme inheritance configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md) — a worked example of a base corporate-design theme and an extending theme that inherits and overrides its config fields.

## Essential identifiers

- `theme.json` (in `<plugin root>/src/Resources/`)
- `config` / `config.fields`
- `configInheritance`

## Code check (6.7.15.1)
- confirmed `StorefrontPluginConfigurationFactory::createFromThemeJson()` — parses a theme's `theme.json` data into its storefront configuration — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:71
- confirmed `config` — `theme.json` `config` key is stored as the theme config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:98
- confirmed `configInheritance` — `theme.json` key read and copied into the base config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
