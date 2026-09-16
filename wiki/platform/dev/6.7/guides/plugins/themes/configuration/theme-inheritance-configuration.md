---
id: platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md
title: Theme Inheritance Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/configuration/theme-inheritance-configuration.html
sourceHash: 84e93e82d97df6070eb1d640af78427bbf147b26
codeCheckedAgainst: "6.7.13.0"
keywords: ["configInheritance", "theme.json", "theme inheritance", "inherited config fields", "base theme", "child theme", "corporate design theme", "sw-color-brand-primary", "sw-brand-icon", "theme:refresh", "parent theme"]
summary: Use configInheritance in theme.json so an extending theme inherits config fields from a base theme and overrides or adds only the fields it needs.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md", "platform/dev/6.7/guides/plugins/themes/configuration/theme-configuration.md", "platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md"]
---
## What it is

A worked example of `configInheritance`: a base corporate-design theme (`SwagBasicExampleTheme`) defines config fields, and a second theme (`SwagBasicExampleThemeExtend`) inherits them, overrides some defaults and adds fields only it needs (e.g. for a holiday or sales week design).

## When to use

- You keep one base theme with colors, logo and other settings, and need variant themes (seasonal, per sales channel) that reuse those settings without copying them.

## Key steps / config

1. Create two themes as described in [Theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md).
2. Define fields in the base theme's `theme.json`:

```json
{
  "name": "SwagBasicExampleTheme",
  "config": {
    "fields": {
      "sw-color-brand-primary": { "type": "color", "value": "#399", "editable": true,
        "tab": "colors", "block": "themeColors", "section": "importantColors" },
      "sw-brand-icon": { "type": "url", "value": "/our-logo.png", "editable": true }
    }
  }
}
```

3. In the extending theme list the parents in `configInheritance` and declare only overrides and new fields:

```json
{
  "name": "SwagBasicExampleThemeExtend",
  "configInheritance": ["@Storefront", "@SwagBasicExampleTheme"],
  "config": {
    "fields": {
      "sw-brand-icon": { "type": "url", "value": "/our-logo-holidays.png", "editable": true },
      "sw-advent-calendar-background-color": { "type": "color", "value": "#399", "editable": true }
    }
  }
}
```

Result: all fields from `Storefront` and `SwagBasicExampleTheme` are inherited and shown in the Administration with an inherit anchor, using the parent value until changed. `sw-brand-icon` gets a new default in the extending theme, so it is not inherited even though `SwagBasicExampleTheme` defines it. `sw-advent-calendar-background-color` exists only in the extending theme.

The parent relationship is set when the theme is installed; run `bin/console theme:refresh` after changing `configInheritance`.

## Essential identifiers

- `configInheritance`
- `theme.json`, `config.fields`
- `@Storefront` (base theme, always inherited)
- `bin/console theme:refresh`

## Version notes

- `configInheritance` is available since Shopware 6.4.8.0.
- The source also shows a "Before v6.8.0.0" variant with translated `label` arrays on fields and `blocks`/`sections`/`tabs`; those are deprecated for v6.8 in favor of Administration snippets.

## Code check (6.7.13.0)
- confirmed `configInheritance` — read from theme.json and copied into the theme config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `StorefrontPluginConfiguration::getConfigInheritance()` — parent theme is linked during theme lifecycle when non-empty — vendor/shopware/storefront/Theme/ThemeLifecycleService.php:105
- confirmed `StorefrontPluginRegistry::BASE_THEME_NAME` — base theme 'Storefront' — vendor/shopware/storefront/Theme/StorefrontPluginRegistry.php:20
- confirmed `isInherited` — computed per field for the Administration inherit state — vendor/shopware/storefront/Theme/ThemeMergedConfigBuilder.php:143
- deprecated `ThemeConfigField::$label` — tag:v6.8.0, use labelSnippetKey — vendor/shopware/storefront/Theme/ThemeConfigField.php:19
- confirmed `theme:refresh` — console command — vendor/shopware/storefront/Theme/Command/ThemeRefreshCommand.php:14
