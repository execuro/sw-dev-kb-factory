---
id: platform/dev/6.6/resources/references/adr/2022-21-11-replace-drop-shadow-with-box-shadow.md
title: Replace drop-shadow with box-shadow
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-21-11-replace-drop-shadow-with-box-shadow.html
sourceHash: d80208cc90e646f5680326ab184e455a3c859410
keywords: ["drop-shadow", "box-shadow", "safari", "performance", "storefront", "css", "adr", "architecture decision record", "rendering"]
summary: "ADR: Shopware replaced CSS drop-shadow with box-shadow in the storefront to fix Safari performance issues."
lastBuilt: 2026-09-15
---
## What it is
An architecture decision record (ADR) documenting the switch from CSS `drop-shadow` to `box-shadow` in the storefront.

## Key steps / config
- Context: Safari has drastic performance issues with `drop-shadow`.
- Decision: change styling from `drop-shadow` to `box-shadow`, which resolves the performance issues.
- Consequence: the visual design/optic of the shadow is slightly different from the original `drop-shadow` — not as perfect as before, but looks almost the same and is much faster.

## Essential identifiers
- `drop-shadow` (CSS property, replaced)
- `box-shadow` (CSS property, replacement)
