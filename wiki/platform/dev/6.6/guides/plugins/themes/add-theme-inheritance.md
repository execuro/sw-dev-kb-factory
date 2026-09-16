---
id: platform/dev/6.6/guides/plugins/themes/add-theme-inheritance.md
title: Theme inheritance
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/themes/add-theme-inheritance.html
sourceHash: 7837b724f10977f1db5d32bdaf425d105faa512f
keywords: ["theme inheritance", "theme.json", "views section", "style section", "script section", "asset section", "configInheritance", "SwagBasicExampleTheme", "Storefront placeholder", "sales channel theme", "overrides.scss"]
summary: How to make one Shopware theme extend another by adding its placeholder to the views, style, script, asset and configInheritance sections of theme.json.
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how a theme can extend an existing installed theme by editing `theme.json`, so changes cascade from the Storefront default, through the base theme, to the extending theme.

## When to use

Use this to reuse an existing theme (e.g. a purchased theme or a corporate base theme) for a different sales channel with only slight changes, without duplicating its code.

## Key steps / config

Edit `theme.json` in `<plugin root>/src/Resources` and add the base theme's placeholder (here `@SwagBasicExampleTheme`) into each relevant section, before the extending theme's own placeholder:

```javascript
// <plugin root>/src/Resources/theme.json
{
  "name": "SwagBasicExampleThemeExtend",
  "author": "Shopware AG",
  "views": ["@Storefront", "@Plugins", "@SwagBasicExampleTheme", "@SwagBasicExampleThemeExtend"],
  "style": ["app/storefront/src/scss/overrides.scss", "@SwagBasicExampleTheme", "app/storefront/src/scss/base.scss"],
  "script": ["@Storefront", "@SwagBasicExampleTheme", "app/storefront/dist/storefront/js/.../swag-example-plugin-theme-extended.js"],
  "asset": ["@Storefront", "@SwagBasicExampleTheme", "app/storefront/src/assets"],
  "configInheritance": ["@Storefront", "@SwagBasicExampleTheme"]
}
```

- `views`: template rendering order — Storefront base, then plugin extensions, then `@SwagBasicExampleTheme`, then the current theme.
- `script`: same order for JavaScript — Storefront JS base, then the base theme's JS, then the current theme's JS.
- `style`: `overrides.scss` stays at the top of the list because it can affect SCSS variables (e.g. `$border-radius`).
- `asset`: add `@SwagBasicExampleTheme` explicitly if its assets should be usable.
- `configInheritance`: uses the field configuration of the listed themes; the last theme different from the current one becomes the parent theme. The Storefront theme configuration is always inherited, even without `configInheritance`.

## Essential identifiers

- `theme.json` sections: `views`, `style`, `script`, `asset`, `configInheritance`
- `@Storefront` (default theme placeholder)
- `@Plugins` (plugin extensions placeholder)

## Version notes

`configInheritance` behavior and detailed examples are covered separately in [Theme inheritance configuration](platform/dev/6.6/guides/plugins/themes/theme-inheritance-configuration.md).
