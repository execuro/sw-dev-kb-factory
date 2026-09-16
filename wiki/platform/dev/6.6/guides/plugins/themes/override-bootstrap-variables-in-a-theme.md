---
id: platform/dev/6.6/guides/plugins/themes/override-bootstrap-variables-in-a-theme.md
title: Override Bootstrap variables in a Theme
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/themes/override-bootstrap-variables-in-a-theme.html
sourceHash: 1c7c2ab42efd124cd90e114902417bd61b4a92a2
keywords: ["overrides.scss", "border-radius variable", "Bootstrap 4 !default flag", "theme.json style", "theme:compile", "SCSS variable override", "watch:storefront", "bin/watch-storefront.sh"]
summary: How to override Bootstrap/Storefront default SCSS variables via the overrides.scss entry point declared in theme.json before @Storefront.
lastBuilt: "2026-09-15"
---
## What it is

This guide shows how to override default Bootstrap or Storefront SCSS variables (e.g. `$border-radius`) using the `overrides.scss` entry point.

## When to use

Use this when a theme needs to change SCSS variable defaults (colors, spacing, etc.) without rewriting the whole style.

## Key steps / config

`overrides.scss` must be declared before `@Storefront` in the `style` section of `theme.json`, since Bootstrap 4 uses `!default` flags and overrides must come first:

```javascript
// <plugin root>/src/Resources/theme.json
{
  "style": [
    "app/storefront/src/scss/overrides.scss",
    "@Storefront",
    "app/storefront/src/scss/base.scss"
  ]
}
```

In `<plugin root>/src/Resources/app/storefront/src/scss/overrides.scss`, set the variables:

```css
$border-radius: 0;
$icon-base-color: #f00;
```

After saving, run `bin/console theme:compile` and check the Storefront in the browser.

## Essential identifiers

- `overrides.scss` (SCSS entry point)
- `$border-radius` (example Bootstrap variable)
- `bin/console theme:compile`
- `composer run watch:storefront`
- `bin/watch-storefront.sh`

## Gotchas

- Only variable overrides belong in `overrides.scss` — do not write plain CSS rules like `.container { background: #f00 }` there.
- When running `composer run watch:storefront` (platform setups) or `./bin/watch-storefront.sh` (production template), SCSS variables are injected dynamically by webpack, and selectors/properties written in `overrides.scss` can appear multiple times in the built CSS.
