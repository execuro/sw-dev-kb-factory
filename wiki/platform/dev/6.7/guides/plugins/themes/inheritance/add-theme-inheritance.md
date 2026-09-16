---
id: platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md
title: Theme Inheritance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/inheritance/add-theme-inheritance.html
sourceHash: ec9ef93df73a84d224e192d135229a1a1f3258ae
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme inheritance", "theme.json", "configInheritance", "views", "style", "script", "asset", "@Storefront", "@Plugins", "extend theme", "parent theme", "child theme", "base theme"]
summary: Extend an existing Shopware theme by adding its @ThemeName placeholder to the views, style, script, asset and configInheritance arrays in theme.json.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md"]
---
## What it is

How a theme extends another installed theme. Inheritance is declared in the extending theme's `theme.json` (`<plugin root>/src/Resources/theme.json`): each section lists placeholders (`@Storefront`, `@Plugins`, `@<ThemeName>`) and own files in the order they are applied.

## When to use

- Reuse a theme already used in one sales channel for another sales channel with slight changes (e.g. a dark variant).
- Change the look of a store-bought theme without editing its code.
- Build a base theme and customize it per client.

Prerequisite: the base theme (example `SwagBasicExampleTheme`) is installed, activated and assigned to a sales channel; the extending theme (example `SwagBasicExampleThemeExtend`) is created as described in [Create a first theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md).

## Key steps / config

Add the base theme placeholder to each section of the extending theme's `theme.json`:

```json
{
  "name": "SwagBasicExampleThemeExtend",
  "author": "Shopware AG",
  "views": ["@Storefront", "@Plugins", "@SwagBasicExampleTheme", "@SwagBasicExampleThemeExtend"],
  "style": ["app/storefront/src/scss/overrides.scss", "@SwagBasicExampleTheme", "app/storefront/src/scss/base.scss"],
  "script": ["@Storefront", "@SwagBasicExampleTheme", "app/storefront/dist/storefront/js/swag-example-plugin-theme-extended/swag-example-plugin-theme-extended.js"],
  "asset": ["@Storefront", "@SwagBasicExampleTheme", "app/storefront/src/assets"],
  "configInheritance": ["@Storefront", "@SwagBasicExampleTheme"]
}
```

- `views`: templates render from Storefront, then installed plugin extensions (`@Plugins`), then `@SwagBasicExampleTheme`, then the current theme.
- `script`: Storefront JS is the base, then the base theme's JS, then the current theme's JS.
- `style`: same layering; `overrides.scss` comes first because it may set SCSS variables such as `$border-radius` (see [Override Bootstrap variables in a theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md)).
- `asset`: add `@SwagBasicExampleTheme` to use its assets.
- `configInheritance`: uses the field configuration of the listed themes; the last listed theme that differs from the current theme becomes the parent theme, and config values are inherited from the listed themes. Details: [Theme inheritance configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md).

## Essential identifiers

- `theme.json` sections `views`, `style`, `script`, `asset`, `configInheritance`
- `@Storefront` — the default Shopware theme every theme inherits
- `@Plugins` — installed non-theme plugin extensions
- `@SwagBasicExampleTheme` — placeholder form `@<ThemeTechnicalName>`

## Gotchas

- The Storefront theme configuration is always inherited, even without `configInheritance`: when the list is empty the code falls back to `@Storefront` for every theme except the Storefront base theme itself.
- A theme without the `@Storefront` placeholder in a section does not get the default theme's files for that section.

## Code check (6.7.13.0)
- confirmed `configInheritance` — read from theme.json and stored into the theme base config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `views` — theme.json views becomes the view inheritance — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:102
- confirmed `script` — theme.json script array read as script files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:85
- confirmed `asset` — theme.json asset array read as asset paths — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:90
- confirmed `style` — theme.json style array resolved as style files — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:81
- confirmed `@Plugins` — placeholder expanding to non-theme plugin files — vendor/shopware/storefront/Theme/ThemeFileResolver.php:296
- confirmed `ThemeMergedConfigBuilder::getConfigInheritance()` — falls back to @Storefront when configInheritance is empty (fallback at line 318) — vendor/shopware/storefront/Theme/ThemeMergedConfigBuilder.php:291
- confirmed `StorefrontPluginRegistry::BASE_THEME_NAME` — value 'Storefront' — vendor/shopware/storefront/Theme/StorefrontPluginRegistry.php:20
