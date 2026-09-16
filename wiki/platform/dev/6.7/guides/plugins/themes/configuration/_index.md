---
id: platform/dev/6.7/guides/plugins/themes/configuration/_index.md
title: Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/configuration/
sourceHash: 6b2bd9a0b66b7bed9382f9a5542fabf2505cdd9a
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme.json", "theme configuration", "configInheritance", "config fields", "theme manager", "theme settings", "storefront theme", "theme inheritance", "StorefrontPluginConfigurationFactory", "theme:refresh"]
summary: Section index for Shopware theme configuration - theme.json structure, Administration-editable config fields and configInheritance between themes.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md"]
---
## What it is

Landing page of the theme configuration section. It covers the structure of a theme's `theme.json`, the configurable theme fields shown in the Administration (theme manager), and configuration inheritance between themes.

## When to use

Start here when you need to change how a Storefront theme is described or configured, then go to the guide that matches the task:

- [Theme configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md) — the full `theme.json` reference: `name`, `author`, `description`, `views`, `style`, `script`, `asset`, `previewMedia`, `config` fields (types, tabs/blocks/sections, snippet-based labels) and `configInheritance`.
- [Theme inheritance configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md) — a worked example of a base corporate-design theme and an extending theme that inherits and overrides config fields.

## Key steps / config

A theme is a plugin whose `src/Resources/theme.json` exists; the installed code reads these top-level keys from it:

```json
{
  "name": "...",
  "author": "...",
  "views": [],
  "style": [],
  "script": [],
  "asset": [],
  "previewMedia": "...",
  "config": { "fields": {} },
  "configInheritance": [],
  "iconSets": {}
}
```

After changing `theme.json`, run `bin/console theme:refresh`.

## Essential identifiers

- `theme.json`
- `config`, `configInheritance`
- `bin/console theme:refresh`

## Code check (6.7.13.0)
- confirmed `theme.json` — a bundle with Resources/theme.json is treated as a theme — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:61
- confirmed `author` — name and author are read unconditionally from theme.json — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:79
- confirmed `config` — stored as the theme config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:98
- confirmed `configInheritance` — read and copied into the theme config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `iconSets` — optional top-level key — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:113
- confirmed `theme:refresh` — console command exists — vendor/shopware/storefront/Theme/Command/ThemeRefreshCommand.php:14
