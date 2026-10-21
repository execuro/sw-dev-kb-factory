---
id: platform/dev/6.7/guides/plugins/themes/configuration/theme-inheritance-configuration.md
title: Theme Inheritance Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/configuration/theme-inheritance-configuration.html
sourceHash: 84e93e82d97df6070eb1d640af78427bbf147b26
codeCheckedAgainst: "6.7.15.1"
keywords: ["configInheritance", "theme.json", "config.fields", "SwagBasicExampleTheme", "SwagBasicExampleThemeExtend", "sw-brand-icon", "sw-color-brand-primary", "parentThemeId", "theme config inheritance", "child theme", "seasonal theme", "inherited config fields"]
summary: Example of a base corporate-design theme and an extending theme that inherits its config fields via configInheritance and overrides selected values.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md
  - platform/dev/6.7/guides/plugins/themes/styling/add-css-js-to-theme.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md
---
## What it is

Worked example of config inheritance between two themes: a base theme (`SwagBasicExampleTheme`) holds the corporate-design config fields, and an extending theme (`SwagBasicExampleThemeExtend`) inherits them through `configInheritance`, overriding some values and adding fields needed only for a special period (e.g. a holiday week with an advent calendar).

## When to use

When you need a temporary or sales-channel-specific variant of an existing theme without copying its whole `config` block into the new `theme.json`.

## Key steps / config

1. Create both themes as described in [Theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md).
2. Define the base fields in `SwagBasicExampleTheme`'s `theme.json`:

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

3. In the extending theme, list the parents in `configInheritance` and add/override fields:

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

Result: all fields of `Storefront` and `SwagBasicExampleTheme` are inherited and shown in the Administration with an inherit anchor, using the parent value until changed. `sw-brand-icon` gets a new default and is no longer inherited; `sw-advent-calendar-background-color` exists only in the extending theme.

`configInheritance` is ordered least to most specific. When the theme is installed or refreshed, the last entry that is neither `@Storefront` nor the theme itself (here `SwagBasicExampleTheme`) is stored as the theme's `parentThemeId`.

## Essential identifiers

- `configInheritance` (in `theme.json`)
- `config.fields`
- `parentThemeId`

## Gotchas

- Field labels written into `theme.json` (`label` maps per field, tab, block or section) are the pre-snippet style; the docs show them only in the "Before v6.8.0.0" variant. Translate via Administration snippets instead.
- A field redefined in the child theme's `theme.json` with its own `value` is not inherited, even though the parent defines it.

## Version notes

- `configInheritance` is available since Shopware 6.4.8.0.

## Code check (6.7.15.1)
- confirmed `configInheritance` — read from `theme.json` and copied into the base config — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `getConfigInheritance()` — least-to-most-specific order; Storefront and self entries skipped — vendor/shopware/storefront/Theme/ThemeLifecycleService.php:567
- confirmed `parentThemeId` — set from the last non-Storefront `configInheritance` entry — vendor/shopware/storefront/Theme/ThemeLifecycleService.php:584
- confirmed `configInheritance` — merged config output carries the inheritance list for the Administration — vendor/shopware/storefront/Theme/ThemeMergedConfigBuilder.php:127
- confirmed `ThemeConfigField::$labelSnippetKey` — snippet-based field labels — vendor/shopware/storefront/Theme/ThemeConfigField.php:23
