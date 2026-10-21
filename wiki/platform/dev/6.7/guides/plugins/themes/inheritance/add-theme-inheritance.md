---
id: platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md
title: Theme Inheritance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/inheritance/add-theme-inheritance.html
sourceHash: ec9ef93df73a84d224e192d135229a1a1f3258ae
codeCheckedAgainst: "6.7.15.1"
keywords: ["theme inheritance", "theme.json", "configInheritance", "views", "style", "script", "asset", "@Storefront", "@Plugins", "parent theme", "extend theme", "child theme", "SwagBasicExampleTheme"]
summary: Extend an existing theme by adding its @ThemeName placeholder to the views, style, script, asset and configInheritance sections of theme.json.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/themes/create-a-theme.md", "platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md"]
---
## What it is

How one theme extends another installed theme by placing the parent's `@<TechnicalName>` placeholder in the inheritance chain of its `theme.json`. Every theme already inherits the default Storefront theme via `@Storefront`.

## When to use

- Reusing a theme from one sales channel in another with slight changes (e.g. a dark variant).
- Customising a store-bought theme without editing its code.
- Building a base theme and deriving client-specific themes from it.

Prerequisite: the parent theme (here `SwagBasicExampleTheme`) is installed, activated and assigned to a sales channel; the extending theme (`SwagBasicExampleThemeExtend`) is created like any theme (see [Create a first theme](platform/dev/6.7/guides/plugins/themes/create-a-theme.md)).

## Key steps / config

Edit `<plugin root>/src/Resources/theme.json` of the extending theme:

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

Section by section:

- `views` — rendering starts from the Storefront templates, then plugin extensions, then `@SwagBasicExampleTheme`, then the current theme. Put the parent right before the current theme.
- `script` — Storefront JS as base, then the parent theme's JS, then the current theme's.
- `style` — same order idea; `overrides.scss` is first because it may set SCSS variables like `$border-radius` before they are defined (see [Override Bootstrap variables in a theme](platform/dev/6.7/guides/plugins/themes/styling/override-bootstrap-variables-in-a-theme.md)). A `@ThemeName` include is resolved recursively into that theme's own `style` list.
- `asset` — add the parent here to use its assets.
- `configInheritance` — the field configuration of the listed themes is inherited. The list is ordered from least to most specific; the last entry that is neither `@Storefront` nor the current theme becomes the parent theme (`parentThemeId`). Details: [Theme inheritance configuration](platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md).

## Essential identifiers

- `theme.json` keys: `views`, `style`, `script`, `asset`, `configInheritance`
- `@Storefront`, `@Plugins`, `@<ThemeTechnicalName>` placeholders

## Gotchas

- Storefront theme configuration is always inherited, even without `configInheritance`: the installed code falls back to the Storefront theme for every theme except the base one.
- Duplicate namespace includes are skipped and circular references between themes are cut off by the file resolver.
- The source calls the file `override.css` in prose, but the entry in the example is `app/storefront/src/scss/overrides.scss`.

## Code check (6.7.15.1)
- confirmed `views` — stored as view inheritance from theme.json — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:102
- confirmed `script` — read into the theme's script file collection — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:85
- confirmed `asset` — read into the theme's asset paths — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:90
- confirmed `configInheritance` — read from theme.json and copied into the base config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `ThemeLifecycleService::addParentTheme()` — last entry other than `@Storefront`/current theme becomes `parentThemeId` — vendor/shopware/storefront/Theme/ThemeLifecycleService.php:563
- confirmed `StorefrontPluginRegistry::BASE_THEME_NAME` — base theme technical name is `Storefront` — vendor/shopware/storefront/Theme/StorefrontPluginRegistry.php:20
- confirmed `ThemeMergedConfigBuilder::getConfigInheritance()` — falls back to Storefront inheritance when none is given — vendor/shopware/storefront/Theme/ThemeMergedConfigBuilder.php:291
- confirmed `@Plugins` — resolves files of all non-theme plugins — vendor/shopware/storefront/Theme/ThemeFileResolver.php:296
- confirmed `ThemeFileResolver::resolve()` — tracks processed configs to prevent circular references — vendor/shopware/storefront/Theme/ThemeFileResolver.php:130
