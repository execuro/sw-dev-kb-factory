---
id: platform/dev/6.6/resources/references/adr/2023-04-03-disable-css-autoprefixer.md
title: Disable the CSS autoprefixer in the Storefront by default
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-04-03-disable-css-autoprefixer.html
sourceHash: 12982c0981569309b89a3f0e6bb73a5d1648f5e4
keywords: ["autoprefixer", "storefront.theme.auto_prefix_css", "scssphp/scssphp", "padaliyajay/php-autoprefixer", "theme:compile", ".browserslist", "storefront.yaml", "css vendor prefixes", "SCSS", "theme compiler"]
summary: "ADR: Shopware disables CSS auto-prefixing by default in the storefront theme compiler, configurable via a config key."
lastBuilt: 2026-09-15
---
## What it is
An architecture decision record disabling automatic CSS vendor-prefixing in the storefront theme compiler by default.

## When to use
Relevant when investigating storefront `theme:compile` performance, or when a project needs vendor-prefixed CSS for older browsers.

## Key steps / config
- Context: storefront CSS is compiled by `scssphp/scssphp` and was auto-prefixed via `padaliyajay/php-autoprefixer`; most prefixes are now unnecessary given the Bootstrap v5 browser support baseline in `.browserslist`, the auto-prefixer significantly slows `theme:compile` (notable in the SaaS solution), and the package hard-codes which properties get prefixed instead of reading `.browserslist` dynamically.
- Decision: disable CSS auto-prefixing by default. It can still be re-enabled via the config key `storefront.theme.auto_prefix_css` in `Storefront/Resources/config/packages/storefront.yaml`, though manual SCSS prefixing is recommended instead. Auto-prefixing is deprecated for v6.6.0 in favor of plain SCSS compiling.
- Not considered a hard breaking change: most prefixes are unneeded for supported browsers, some target properties are no longer implemented by any browser, and remaining valid prefixes are mostly cosmetic/appearance properties unlikely to affect storefront functionality.
- Consequence: running `theme:compile` no longer applies vendor prefixes by default to the compiled `all.css`.

## Essential identifiers
- `storefront.theme.auto_prefix_css`
- `Storefront/Resources/config/packages/storefront.yaml`
- `theme:compile`
- `scssphp/scssphp`
- `padaliyajay/php-autoprefixer`
