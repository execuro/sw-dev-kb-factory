---
id: platform/dev/6.6/guides/plugins/themes/add-theme-inheritance-without-resources.md
title: Theme with Bootstrap styling
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/themes/add-theme-inheritance-without-resources.html
sourceHash: 2d5108f72f740a3ffc7aeb402642beda2350524c
keywords: ["StorefrontBootstrap", "Storefront bundle", "theme.json", "style section", "Bootstrap SCSS", "theme without default styling", "sw-color-brand-primary", "Plugins bundle", "SCSS skin"]
summary: Use the @StorefrontBootstrap placeholder in theme.json style to build a theme on plain Bootstrap SCSS without Shopware's default skin.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to build a Shopware theme on top of raw Bootstrap SCSS without the Shopware Storefront "skin", using the `@StorefrontBootstrap` placeholder.

## When to use

Use this when a theme should not inherit Shopware's default storefront styling but still wants Bootstrap's SCSS available.

## Key steps / config

Replace the `@Storefront` bundle with `@StorefrontBootstrap` in the `style` section of `theme.json`:

```javascript
// <plugin root>/src/Resources/theme.json
{
  "style": [
    "@StorefrontBootstrap",
    "@Plugins",
    "app/storefront/src/scss/base.scss"
  ]
}
```

This omits the SCSS under `<plugin root>src/Storefront/Resources/app/storefront/src/scss/skin`.

## Essential identifiers

- `@StorefrontBootstrap` (theme.json style placeholder)
- `@Storefront` (default bundle placeholder, includes Bootstrap SCSS)
- `@Plugins` (theme.json placeholder)
- `theme.json` `style` section

## Gotchas

- `@StorefrontBootstrap` can only be used in the `style` section of `theme.json` — not in `views` or `script`.
- `@StorefrontBootstrap` and `@Storefront` must not be used at the same time; `@Storefront` already includes the Bootstrap SCSS.
- `@StorefrontBootstrap` does not include `@Plugins` — it must be added separately.
- All theme variables such as `$sw-color-brand-primary` remain available when using `@StorefrontBootstrap`.
