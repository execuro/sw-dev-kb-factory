---
id: platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md
title: Apps as Themes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/apps-as-themes.html
sourceHash: c2d32210bea53c148353f5211452ab0c7fde6ba9
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme.json", "Resources/theme.json", "manifest.xml", "app theme", "themes", "theme app", "migrate plugin theme", "storefront theme", "sales channel theme", "createFromApp"]
summary: An app becomes a theme by shipping Resources/theme.json; theme apps apply only when assigned to a sales channel, other apps apply everywhere.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/_index.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md"]
---
## What it is

How to ship a complete Storefront theme (platform/dev/6.7/guides/plugins/themes/_index.md) inside an app: include a `theme.json` theme configuration (platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md) in the app's `Resources` folder.

## When to use

You want to distribute a theme as an app, or migrate an existing plugin-based theme to the app system.

## Key steps / config

1. Structure:

```text
DemoTheme/
  Resources/
    ...
    theme.json
  manifest.xml
```

2. Migrating a plugin theme: create a new app folder with a `manifest.xml` holding the app metadata (instead of `composer.json` and the plugin base class), then copy `YourThemePlugin/src/Resources` to `YourThemeApp/Resources`. Templates and JavaScript normally need no changes.

## Essential identifiers

- `Resources/theme.json`
- `manifest.xml`

## Gotchas

- Presence of `Resources/theme.json` is what makes the app a theme. A theme app's Storefront changes are visible only on sales channels the theme is assigned to; an app without `theme.json` is an "ordinary" app whose changes apply to all sales channels while the app is active.
- The installed code reads `name` and `author` from `theme.json` unconditionally, so a theme.json without them fails theme compilation.

## Code check (6.7.15.1)
- confirmed `Resources/theme.json` — app is treated as theme only if this file exists — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:61
- confirmed `StorefrontPluginConfigurationFactory::createFromApp()` — theme vs plugin config for apps — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:57
- confirmed `setIsTheme` — theme.json apps flagged as theme — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:77
- confirmed `author` — `name`/`author` read from theme.json — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:79
- confirmed `Unable to parse theme.json` — invalid JSON aborts theme compile — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:159
