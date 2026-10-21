---
id: platform/dev/6.7/resources/references/adr/2022-11-21-replace-drop-shadow-with-box-shadow.md
title: Replace drop-shadow with box-shadow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-11-21-replace-drop-shadow-with-box-shadow.html
sourceHash: 6ddf6bc2f15058a5e8cd9098f9488a7fb8c3d005
codeCheckedAgainst: "6.7.15.1"
keywords: ["drop-shadow", "box-shadow", "css filter", "shadow", "safari", "performance", "scss", "drop-shadow-default", "storefront styling", "adr"]
summary: "ADR 2022-11-21: CSS drop-shadow is replaced with box-shadow because drop-shadow causes severe rendering performance problems in Safari."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: storefront, 2022-11-21) that replaces CSS `drop-shadow` with `box-shadow` because Safari has drastic performance issues rendering `drop-shadow`.

## When to use

When adding shadows in Storefront (or Administration) SCSS, or when a shadow looks slightly different from an older design and you want to know why.

## Key steps / config

- Use `box-shadow` for shadows, not the `drop-shadow` filter. The switch resolves the Safari performance issues.
- In the 6.7 Administration, the SCSS mixin still named `drop-shadow-default` already emits a `box-shadow`, so including it does not use the filter.

## Gotchas

The look differs slightly from the original `drop-shadow` and is "not as perfect as before", but almost the same and much faster.

## Code check (6.7.15.1)
- confirmed `drop-shadow-default` — Administration mixin keeps the old name but outputs `box-shadow` — vendor/shopware/administration/Resources/app/administration/src/app/assets/scss/mixins.scss:86
- confirmed `box-shadow` — Storefront SCSS uses `box-shadow`; no `drop-shadow` remains in the Storefront SCSS sources — vendor/shopware/storefront/Resources/app/storefront/src/scss/skin/shopware/component/_modal.scss:10
