---
id: platform/dev/6.6/resources/references/adr/2023-10-19-bootstrap-css-utils.md
title: Make more use of Bootstrap tooling and remove !important from Bootstrap CSS utils
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-10-19-bootstrap-css-utils.html"
sourceHash: bfc0ede809cf4f61ce62a958c994bd48e861e093
keywords: ["Bootstrap utilities", "$enable-important-utilities", "!important", "storefront scss", "app/storefront/src/scss", "mb-3", "spacing utility", "CustomTheme override", "bootstrap components first", "storefront css", "theme override"]
summary: "ADR: Storefront moves to Bootstrap utility classes and disables `!important` via `$enable-important-utilities` from v6.6.0."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record on replacing unnecessary custom SCSS in the Storefront (`app/storefront/src/scss`) with Bootstrap utility classes, and disabling Bootstrap's default `!important` on those utilities so theme overrides keep working.

## When to use
Relevant when adding Storefront UI and deciding between custom SCSS and Bootstrap utility classes, or when a theme/app needs to override core Storefront styling.

## Key steps / config
- Prefer Bootstrap utility classes (e.g. `mb-3`) over custom SCSS selectors for simple styling like spacing; keep the semantic class in the HTML so themes can still target the element.
- Only fall back to custom SCSS for complex layouts that utilities/components cannot express.
- Follow "Bootstrap components first": (1) build with default components/utilities, (2) use component configuration/variables for customization, (3) only then write custom styling.
- Disable Bootstrap's default `!important` on utility classes by setting `$enable-important-utilities` to `false`, effective from `v6.6.0` onwards — this prevents a utility class in core markup from overruling a theme's plain CSS override.

```diff
- <div class="register-login-collapse-toogle"><div>
+ <div class="register-login-collapse-toogle mb-3"><div>
```

## Essential identifiers
- `$enable-important-utilities` (Bootstrap Sass variable)
- `app/storefront/src/scss`

## Gotchas
Before this change, most Bootstrap utility classes applied `!important` by default, which could overrule a theme's plain-CSS override of the same property, forcing theme authors to use `!important` too or edit the Twig template. The `!important` removal for utilities like `mb-3` takes effect from `v6.6.0`.
