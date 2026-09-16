---
id: platform/dev/6.7/resources/references/adr/2022-11-21-replace-drop-shadow-with-box-shadow.md
title: Replace drop-shadow with box-shadow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-11-21-replace-drop-shadow-with-box-shadow.html
sourceHash: 6ddf6bc2f15058a5e8cd9098f9488a7fb8c3d005
codeCheckedAgainst: "6.7.13.0"
keywords: ["drop-shadow", "box-shadow", "filter drop-shadow", "css shadow", "safari", "safari performance", "storefront scss", "storefront styling", "rendering performance", "adr"]
summary: "ADR 2022-11-21: storefront styles use box-shadow instead of CSS drop-shadow, because drop-shadow causes severe rendering performance issues in Safari."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-11-21, area storefront) replacing CSS `drop-shadow` with `box-shadow` in the Storefront styles because of Safari performance problems.

## When to use

When writing or overriding Storefront SCSS and choosing how to render shadows, or when wondering why Storefront shadows use `box-shadow`.

## Key steps / config

- Context: Safari has drastic performance issues with `drop-shadow`.
- Decision: use `box-shadow` instead; this removes the performance issues.
- For custom themes, follow the same approach and prefer `box-shadow` for shadows on Storefront elements.

## Essential identifiers

- `box-shadow`
- `drop-shadow`

## Gotchas

- The visual result differs slightly: `box-shadow` does not look exactly like `drop-shadow`, but is almost the same and much faster.

## Code check (6.7.13.0)
- confirmed `box-shadow` — used for Storefront shadows, e.g. the search suggest dropdown — vendor/shopware/storefront/Resources/app/storefront/src/scss/layout/_search-suggest.scss:18
- unverified `drop-shadow` — no match in the Storefront SCSS sources; whole-index absence not checked
