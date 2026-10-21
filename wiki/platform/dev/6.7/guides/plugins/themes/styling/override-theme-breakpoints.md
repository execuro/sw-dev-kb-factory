---
id: platform/dev/6.7/guides/plugins/themes/styling/override-theme-breakpoints.md
title: Override responsive breakpoints in a Theme
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/themes/styling/override-theme-breakpoints.html
sourceHash: 7c6e90835b9328071241da2a4a0edd1eb4bbc0d3
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-breakpoint-xs", "sw-breakpoint-sm", "sw-breakpoint-md", "sw-breakpoint-lg", "sw-breakpoint-xl", "sw-breakpoint-xxl", "$grid-breakpoints", "theme.json", "responsive breakpoints", "bootstrap grid", "media queries", "theme config fields"]
summary: Override Storefront responsive breakpoints via the sw-breakpoint-* theme.json fields (6.7.8.0+) and reuse them in SCSS $grid-breakpoints.
lastBuilt: 2026-10-21
---
## What it is

Shopware's Storefront uses Bootstrap's default breakpoints for responsive layout. The same breakpoint values are also passed to Twig and JavaScript. Since Shopware 6.7.8.0 the Storefront base theme defines six theme config fields, `sw-breakpoint-xs` through `sw-breakpoint-xxl`, that a custom theme can override to change those values.

## When to use

- Your theme needs different responsive breakpoints than Bootstrap's defaults (0 / 576 / 768 / 992 / 1200 / 1400 px).
- You want Twig, JS and SCSS to share one source of truth for breakpoints.

## Key steps / config

1. In your theme's `PLUGIN_ROOT/src/Resources/theme.json`, override the breakpoint fields under `config.fields`. Only the `value` needs to be set:

```json
{
  "name": "My custom theme",
  "config": {
    "fields": {
      "sw-breakpoint-xs":  { "value": 0 },
      "sw-breakpoint-sm":  { "value": 576 },
      "sw-breakpoint-md":  { "value": 768 },
      "sw-breakpoint-lg":  { "value": 992 },
      "sw-breakpoint-xl":  { "value": 1200 },
      "sw-breakpoint-xxl": { "value": 1400 }
    }
  }
}
```

2. Overridden values replace the defaults in Twig and JS automatically. You read them like any other theme variable. In the installed code, the theme config accessor exposes them as a `breakpoint` map with keys `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, falling back to the Bootstrap defaults when a field is missing.
3. SCSS is **not** updated automatically. To make Bootstrap's CSS grid use the same values, override `$grid-breakpoints` in your theme, e.g. in `PLUGIN_ROOT/src/Resources/app/storefront/src/scss/overrides.scss`, reusing the theme variables:

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

## Essential identifiers

- Theme config fields: `sw-breakpoint-xs`, `sw-breakpoint-sm`, `sw-breakpoint-md`, `sw-breakpoint-lg`, `sw-breakpoint-xl`, `sw-breakpoint-xxl`
- SCSS variables: `$sw-breakpoint-xs` … `$sw-breakpoint-xxl`, Bootstrap map `$grid-breakpoints`
- File: `src/Resources/theme.json`

## Gotchas

- The fields are hidden in the Administration (`"editable": false` in the base theme). They are a developer feature, set only through `theme.json`.
- The default Shopware theme has no SCSS breakpoint configuration, because it uses Bootstrap's defaults. Changing the theme fields alone does not change the CSS grid. You also need the `$grid-breakpoints` override.
- Bootstrap's own breakpoint documentation (Bootstrap 5.3) covers the SCSS map in detail.

## Version notes

- The six `sw-breakpoint-*` fields are available since Shopware 6.7.8.0.

## Code check (6.7.15.1)
- confirmed `sw-breakpoint-xs` — defined in base Storefront theme config, type number, value 0, not editable — vendor/shopware/storefront/Resources/theme.json:176
- confirmed `sw-breakpoint-sm` — default value 576 — vendor/shopware/storefront/Resources/theme.json:183
- confirmed `sw-breakpoint-md` — default value 768 — vendor/shopware/storefront/Resources/theme.json:190
- confirmed `sw-breakpoint-lg` — default value 992 — vendor/shopware/storefront/Resources/theme.json:197
- confirmed `sw-breakpoint-xl` — default value 1200 — vendor/shopware/storefront/Resources/theme.json:204
- confirmed `sw-breakpoint-xxl` — default value 1400, `editable: false` — vendor/shopware/storefront/Resources/theme.json:211
- confirmed `breakpoint` — theme config accessor maps the fields to `breakpoint.xs`…`xxl` with Bootstrap fallbacks — vendor/shopware/storefront/Theme/ThemeConfigValueAccessor.php:203
- unverified `$grid-breakpoints` — Bootstrap SCSS variable, out of scope
