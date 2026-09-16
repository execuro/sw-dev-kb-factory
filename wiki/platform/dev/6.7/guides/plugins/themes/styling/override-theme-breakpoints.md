---
id: platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md
title: Override responsive breakpoints in a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/override-theme-breakpoints.html
sourceHash: 7c6e90835b9328071241da2a4a0edd1eb4bbc0d3
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-breakpoint-xs", "sw-breakpoint-md", "sw-breakpoint-xxl", "$grid-breakpoints", "theme.json", "overrides.scss", "window.breakpoints", "responsive breakpoints", "viewport", "bootstrap grid", "theme config fields", "media queries"]
summary: "Override Storefront breakpoints via hidden sw-breakpoint-xs..xxl theme.json fields (6.7.8.0+); mirror them into Bootstrap $grid-breakpoints for SCSS."
lastBuilt: 2026-09-15
---
## What it is

Shopware uses Bootstrap's default breakpoints for responsive layout, and also passes them to Twig and JavaScript. Since Shopware 6.7.8.0 the Storefront base theme defines six theme config fields, `sw-breakpoint-xs` through `sw-breakpoint-xxl`, that a custom theme can override. They are not editable in the Administration (`"editable": false`) and serve as a developer feature.

## When to use

Your theme needs breakpoint widths other than Bootstrap's defaults (0 / 576 / 768 / 992 / 1200 / 1400 px) consistently in Twig, JS and SCSS.

## Key steps / config

1. Override the fields in your theme's `PLUGIN_ROOT/src/Resources/theme.json`:

```json
{
  "name": "My custom theme",
  "config": {
    "fields": {
      "sw-breakpoint-xs": { "value": 0 },
      "sw-breakpoint-sm": { "value": 576 },
      "sw-breakpoint-md": { "value": 768 },
      "sw-breakpoint-lg": { "value": 992 },
      "sw-breakpoint-xl": { "value": 1200 },
      "sw-breakpoint-xxl": { "value": 1400 }
    }
  }
}
```

   The values replace the Twig/JS breakpoints automatically: the theme config accessor builds `breakpoint.xs` … `breakpoint.xxl` from these fields (falling back to the defaults above), and the Storefront layout exposes them as `window.breakpoints`. They are also readable like any other theme variable.

2. SCSS is **not** updated automatically. The Shopware default theme has no breakpoint SCSS configuration, since it uses Bootstrap's defaults. To make CSS match, reuse the theme variables in `PLUGIN_ROOT/src/Resources/app/storefront/src/scss/overrides.scss`:

```scss
$grid-breakpoints: (
    xs: $sw-breakpoint-xs,
    sm: $sw-breakpoint-sm,
    md: $sw-breakpoint-md,
    lg: $sw-breakpoint-lg,
    xl: $sw-breakpoint-xl,
    xxl: $sw-breakpoint-xxl
);
```

   This keeps a single source of truth for the breakpoints.

## Essential identifiers

- Theme config fields: `sw-breakpoint-xs`, `sw-breakpoint-sm`, `sw-breakpoint-md`, `sw-breakpoint-lg`, `sw-breakpoint-xl`, `sw-breakpoint-xxl`
- SCSS variables: `$sw-breakpoint-xs` … `$sw-breakpoint-xxl`, Bootstrap `$grid-breakpoints`
- Twig: `theme_config('breakpoint.md')` etc.; JS: `window.breakpoints`

## Gotchas

- Overriding the fields changes Twig and JS only; without the `$grid-breakpoints` override in `overrides.scss`, CSS media queries keep Bootstrap's defaults.
- The SCSS variable dump skips fields that have no `type` after config merging; the Storefront base theme declares these fields as `"type": "number"`, so a child theme setting only `value` still gets `$sw-breakpoint-*` variables when it inherits from the Storefront.

## Version notes

- The six `sw-breakpoint-*` fields exist since Shopware 6.7.8.0.

## Code check (6.7.13.0)
- confirmed `sw-breakpoint-xs` — base theme field, type number, value 0, editable false — vendor/shopware/storefront/Resources/theme.json:176
- confirmed `sw-breakpoint-sm` — default 576 — vendor/shopware/storefront/Resources/theme.json:183
- confirmed `sw-breakpoint-md` — default 768 — vendor/shopware/storefront/Resources/theme.json:190
- confirmed `sw-breakpoint-lg` — default 992 — vendor/shopware/storefront/Resources/theme.json:197
- confirmed `sw-breakpoint-xl` — default 1200 — vendor/shopware/storefront/Resources/theme.json:204
- confirmed `sw-breakpoint-xxl` — default 1400 — vendor/shopware/storefront/Resources/theme.json:211
- confirmed `breakpoint` — accessor maps fields to breakpoint.xs..xxl with the same fallbacks — vendor/shopware/storefront/Theme/ThemeConfigValueAccessor.php:203
- confirmed `window.breakpoints` — set from theme_config breakpoint values in layout head — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:263
- confirmed `ThemeCompiler::dumpVariables()` — emits typed config fields as SCSS variables, skips fields without type — vendor/shopware/storefront/Theme/ThemeCompiler.php:688
- unverified `$grid-breakpoints` — Bootstrap SCSS variable from node dependency, out of scope
