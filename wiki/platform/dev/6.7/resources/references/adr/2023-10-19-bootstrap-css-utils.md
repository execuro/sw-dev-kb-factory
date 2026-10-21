---
id: platform/dev/6.7/resources/references/adr/2023-10-19-bootstrap-css-utils.md
title: Make more use of Bootstrap tooling and remove !important from Bootstrap CSS utils
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-10-19-bootstrap-css-utils.html
sourceHash: bfc0ede809cf4f61ce62a958c994bd48e861e093
codeCheckedAgainst: "6.7.15.1"
keywords: ["$enable-important-utilities", "!important", "bootstrap utilities", "utility classes", "mb-3", "storefront scss", "theme override", "register-login-collapse-toogle", "bootstrap variables", "custom scss", "css specificity", "adr"]
summary: "ADR: from v6.6.0 the Storefront sets $enable-important-utilities false, so Bootstrap utilities like mb-3 drop !important."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-10-19, area storefront) to use Bootstrap utilities and default components instead of custom SCSS in `app/storefront/src/scss`, and to drop `!important` from Bootstrap utility classes so themes can still override them.

## When to use

- You write Storefront templates or themes and decide between a Bootstrap utility class and a custom SCSS rule.
- A theme override of a core selector stops working after the core template gained a utility class, or you wonder why utilities like `mb-3` do not carry `!important` in Shopware 6.6+.

## Key steps / config

1. Prefer utilities over custom SCSS for simple styling ("add a border here, add some spacing there"). Instead of a rule like `.register-login-collapse-toogle { margin-bottom: $spacer; }`, add the utility in the HTML and delete the SCSS:

```html
<div class="register-login-collapse-toogle mb-3"></div>
```

2. Keep the semantic class (`register-login-collapse-toogle`) in the markup so themes can still target that element. When building new UI mostly from utilities, still add such classes:

```html
<div class="border p-3 mb-3 shipping-modal-actions">
    <button class="btn btn-light shipping-abort">Abort</button>
    <button class="btn btn-primary shipping-submit">Submit</button>
</div>
```

3. Utility importance is switched off via the Bootstrap variable override in the Storefront: `$enable-important-utilities: false !default;`. A theme can now override e.g. the margin of `.register-login-collapse-toogle` (say `80px`) without `!important` or editing the Twig template.

4. Order of preference ("Bootstrap components first"):
   1. Bootstrap default components and utilities.
   2. Component configuration and Sass variables for customisation.
   3. Custom styling only when config is insufficient or for complex layouts that would otherwise need too many generic utility classes.

## Essential identifiers

- `$enable-important-utilities` (set to `false`)
- `!important`
- Utility classes such as `mb-3`, `p-3`, `border`
- `app/storefront/src/scss`

## Gotchas

- With Bootstrap's default (`!important` on utilities), moving core styling to a utility class would silently overrule a theme's override of the same property — the reason importance was turned off.
- Utilities are not suitable everywhere: complex layouts may still justify custom SCSS.
- `$spacer` equals `1rem`, which is what `mb-3` applies.

## Version notes

- From `v6.6.0`: Bootstrap CSS utilities like `mb-3` no longer apply `!important`; unneeded custom SCSS is removed and migrated to utilities. Before 6.6 utilities still overruled almost everything.

## Code check (6.7.15.1)
- confirmed `$enable-important-utilities` — overridden to `false !default` in Storefront Bootstrap variables — vendor/shopware/storefront/Resources/app/storefront/src/scss/abstract/variables/_bootstrap.scss:26
- confirmed `register-login-collapse-toogle` — markup now uses the semantic class plus `mb-3` utility — vendor/shopware/storefront/Resources/views/storefront/page/checkout/address/index.html.twig:16
- unverified `$spacer` — Bootstrap core variable value (1rem), not defined in Shopware packages checked
