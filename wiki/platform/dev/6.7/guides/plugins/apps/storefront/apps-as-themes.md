---
id: platform/dev/6.7/guides/plugins/apps/storefront/apps-as-themes.md
title: Apps as Themes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/apps-as-themes.html
sourceHash: c2d32210bea53c148353f5211452ab0c7fde6ba9
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme.json", "Resources/theme.json", "manifest.xml", "app theme", "theme app", "StorefrontPluginConfigurationFactory", "migrate plugin theme", "storefront theme", "sales channel theme", "themes"]
summary: An app becomes a theme by shipping Resources/theme.json; otherwise its Storefront changes apply to all sales channels. Migrating plugin themes to apps.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/_index.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md"]
---
## What it is

How to ship a complete [theme](platform/dev/6.7/guides/plugins/themes/_index.md) inside an app: add the theme configuration as a [theme.json](platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md) file in the app's `Resources` folder. The presence of that file is what distinguishes a theme app from an "ordinary" app.

## When to use

- Building a Storefront theme distributed as an app.
- Migrating an existing plugin-based Shopware 6 theme to the app system.

## Key steps / config

1. Create the app folder with `manifest.xml` and `Resources/theme.json`:

```text
DemoTheme/
  Resources/
    ...
    theme.json
  manifest.xml
```

2. `theme.json` must contain at least `name` and `author`; other keys read by the Storefront include `style`, `script`, `asset`, `previewMedia`, `config`, `views`, `configInheritance`, `iconSets` (see the theme configuration page).
3. Migrating a plugin theme: instead of `composer.json` and the plugin base class, provide a `manifest.xml` with the app metadata, then copy `YourThemePlugin/src/Resources` to `YourThemeApp/Resources`. Templates and JavaScript should not need changes.

## Essential identifiers

- `Resources/theme.json`
- `manifest.xml`

## Gotchas

- With `theme.json`: Storefront changes are visible only on sales channels the theme is assigned to.
- Without `theme.json`: the app is an ordinary app and its Storefront changes apply to all sales channels while the app is active.
- The file must be exactly at `Resources/theme.json`; an unreadable or invalid JSON file raises a theme compile exception.

## Code check (6.7.13.0)
- confirmed `StorefrontPluginConfigurationFactory::createFromApp()` — `Resources/theme.json` present makes the app a theme, else plugin config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:57
- confirmed `StorefrontPluginConfigurationFactory::createFromThemeJson()` — sets isTheme, reads `name` and `author` — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:71
- confirmed `StorefrontPluginConfigurationFactory::createPluginConfig()` — non-theme app gets isTheme false — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:120
- confirmed `Unable to parse theme.json` — invalid JSON throws a theme compile exception — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:159
- confirmed `iconSets` — optional theme.json key — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:113
- unverified `sales channel assignment` — per-sales-channel visibility of theme vs. ordinary app not traced in code
