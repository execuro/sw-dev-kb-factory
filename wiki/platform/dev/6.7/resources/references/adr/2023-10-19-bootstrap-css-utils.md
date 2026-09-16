---
id: platform/dev/6.7/resources/references/adr/2023-10-19-bootstrap-css-utils.md
title: "Make more use of Bootstrap tooling and remove !important from Bootstrap CSS utils"
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-10-19-bootstrap-css-utils.html
sourceHash: bfc0ede809cf4f61ce62a958c994bd48e861e093
codeCheckedAgainst: "6.7.13.0"
keywords: ["$enable-important-utilities", "!important", "bootstrap utilities", "utility classes", "mb-3", "storefront scss", "theme override", "custom scss", "css specificity", "bootstrap components", "adr", "storefront styling"]
summary: "ADR: Storefront prefers Bootstrap utility classes over custom SCSS and sets $enable-important-utilities to false (since 6.6.0) so themes can override them."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (storefront area, 2023-10-19): the Storefront should use Bootstrap utilities and default components instead of unneeded custom SCSS in `app/storefront/src/scss`, and Bootstrap utility classes no longer emit `!important`, so themes/apps can still override the same CSS property.

## When to use

- Writing or reviewing Storefront templates/SCSS and deciding between a utility class (e.g. `mb-3`) and a custom rule.
- Understanding why a theme override now wins over a Bootstrap utility class without `!important`.

## Key steps / config

1. Replace simple custom rules (spacing, borders) with a utility class in the HTML and delete the SCSS rule:

```diff
- <div class="register-login-collapse-toogle"><div>
+ <div class="register-login-collapse-toogle mb-3"><div>
```

2. Keep the semantic class (`register-login-collapse-toogle`, `shipping-modal-actions`, `shipping-submit`) next to the utilities, so themes have a selector for individual styling.
3. Importance is switched off via the Bootstrap variable in the Storefront SCSS variables:

```scss
$enable-important-utilities: false !default;
```

4. Principle order: Bootstrap default components and utilities first; then component configuration/variables; custom SCSS only when config is insufficient or the layout is too complex (or would need too many generic utility classes).

## Essential identifiers

- `$enable-important-utilities` (Bootstrap "Importance" variable, Storefront sets `false`)
- `mb-3`, `$spacer` (equals `1rem`)
- `app/storefront/src/scss`

## Gotchas

- With `!important` enabled, a core migration to `mb-3` would overrule a theme rule such as `.register-login-collapse-toogle { margin-bottom: 80px; }`, leaving the theme only `!important` or a Twig template change. With it disabled, the theme rule can win on normal specificity/order.
- Themes that relied on utilities overruling "almost everything" must not assume that anymore.
- Complex layouts may still justify custom SCSS.

## Version notes

- From `v6.6.0` Bootstrap CSS utilities like `mb-3` no longer apply `!important`; unneeded custom Storefront SCSS is migrated to utilities.

## Code check (6.7.13.0)
- confirmed `$enable-important-utilities` — Storefront overrides it to `false !default` — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_bootstrap.scss:26
- confirmed `$enable-important-utilities` — bundled Bootstrap default is `true !default`, hence the Storefront override — vendor/shopware/storefront/Resources/app/storefront/vendor/bootstrap/scss/_variables.scss:385
- confirmed `$enable-important-utilities` — utility mixin only appends `!important` when the variable is true — vendor/shopware/storefront/Resources/app/storefront/vendor/bootstrap/scss/mixins/_utilities.scss:74
- confirmed `register-login-collapse-toogle` — template now uses the class together with `mb-3` — vendor/shopware/storefront/Resources/views/storefront/page/checkout/address/index.html.twig:16
