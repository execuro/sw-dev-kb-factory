---
id: platform/dev/6.7/guides/plugins/themes/inheritance/_index.md
title: Inheritance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/inheritance/
sourceHash: acf3d99c4bd4baf7e715490032a4e11cc372df9e
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme inheritance", "theme.json", "@Storefront", "@StorefrontBootstrap", "@Plugins", "configInheritance", "extend theme", "parent theme", "child theme", "bootstrap only theme", "storefront theme"]
summary: Section index for Shopware 6.7 theme inheritance guides - extending a theme via theme.json and building on Bootstrap SCSS without Storefront skin.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md", "platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md"]
---
## What it is

Section overview for extending and composing Storefront themes with Shopware's theme inheritance system. The source page only lists the two guides in this section:

- [Theme inheritance](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance.md) — a theme builds on another installed theme by listing that theme's `@<ThemeName>` placeholder in the `views`, `style`, `script`, `asset` and `configInheritance` arrays of its own `theme.json`.
- [Theme with Bootstrap styling (add theme inheritance without resources)](platform/dev/6.7/guides/plugins/themes/inheritance/add-theme-inheritance-without-resources.md) — uses the `@StorefrontBootstrap` placeholder in `style` instead of `@Storefront` to compile Bootstrap SCSS without the Shopware default skin.

## When to use

Start here when a theme should reuse another theme (the default `@Storefront` theme or a base/store-bought theme) and only change parts of it — for example a dark variant for a second sales channel — or when a theme should start from plain Bootstrap SCSS instead of the Shopware skin. Open the linked guide for the concrete `theme.json` shape.

## Key steps / config

Inheritance is declared only in `<plugin root>/src/Resources/theme.json`; each section is an ordered list, applied from first to last:

```json
{
  "views": ["@Storefront", "@Plugins", "@BaseTheme", "@CurrentTheme"],
  "style": ["...overrides.scss", "@BaseTheme", "...base.scss"],
  "configInheritance": ["@Storefront", "@BaseTheme"]
}
```

## Essential identifiers

- `theme.json` (at `<plugin root>/src/Resources/theme.json`)
- `@Storefront`, `@Plugins`, `@StorefrontBootstrap`
- `configInheritance`

## Gotchas

- `@StorefrontBootstrap` and `@Storefront` are mutually exclusive in `style`, and `@StorefrontBootstrap` does not pull in `@Plugins`.
- Storefront theme configuration is inherited even when `configInheritance` is not set.

## Code check (6.7.13.0)
- confirmed `@StorefrontBootstrap` — resolved as a special style placeholder by the theme file resolver — vendor/shopware/storefront/Theme/ThemeFileResolver.php:302
- confirmed `@Plugins` — expands to the files of all non-theme plugins — vendor/shopware/storefront/Theme/ThemeFileResolver.php:296
- confirmed `configInheritance` — read from theme.json by the configuration factory — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:106
- confirmed `ThemeMergedConfigBuilder::getConfigInheritance()` — falls back to @Storefront when configInheritance is empty (fallback at line 318) — vendor/shopware/storefront/Theme/ThemeMergedConfigBuilder.php:291
