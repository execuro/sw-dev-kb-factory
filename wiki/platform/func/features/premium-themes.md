---
id: platform/func/features/premium-themes.md
title: Premium Themes
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/features/premium-themes
sourceHash: 62968a33ae0b55e51aec9c936296a707f5630a39ba46461cf3e4d6148af67939
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Premium Themes", "Elle", "Showroom", "Shape", "Cinema", "Emporium", "storefront theme", "deprecated theme", "European Accessibility Act", "EAA", "GPL 3.0", "self-hosted"]
summary: "Deprecated Shopware storefront themes (Elle, Showroom, Shape, Cinema, Emporium); unsupported and incompatible with 6.7+ and EAA."
lastBuilt: 2026-09-15
---
## What it is
Premium Themes are storefront design themes — Elle, Showroom, Shape, Cinema and Emporium — developed by Shopware and offered alongside the standard Storefront Theme, available as SaaS, PaaS or self-hosted variants at no extra charge.

## When to use
Historically used to change a shop's storefront design with minimal effort by picking a ready-made Premium Theme instead of building a custom one. Given their deprecated status, review the Gotchas before applying one to a current shop.

## Key steps / config
Premium Themes are applied through the Themes area of the Administration, the same way as any other storefront theme, by selecting one of Elle, Showroom, Shape, Cinema or Emporium.

## Essential identifiers
- Theme names: `Elle`, `Showroom`, `Shape`, `Cinema`, `Emporium`
- Source licence: `GPL 3.0`

## Gotchas
- All five Premium Themes are deprecated and are no longer actively developed or supported by Shopware.
- They are not compatible with Shopware 6.7+ and do not meet European Accessibility Act (EAA) accessibility requirements.
- For Shopware 6.6 and earlier they may continue to function only if no EAA-related changes are enabled; use is at your own risk, with possible functional and legal risk.
- The theme source remains available on GitHub under the GPL 3.0 licence, but without warranty, further development or support from Shopware; switching to an actively maintained theme is strongly recommended.

## Version notes
- Not usable with Shopware 6.7 or when EAA functions are enabled; may still function on 6.6 and earlier as long as no EAA changes are enabled.
