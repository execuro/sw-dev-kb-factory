---
id: platform/func/tutorials-and-faq/Calculation-of-the-shopping-cart.md
title: Calculation Of The Shopping Cart
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/Calculation-of-the-shopping-cart
sourceHash: c3e0d9faf55139b140996815a80edb8fadcf677bcb28d2207076e96846fb835f
revision:
  current: true
  range: "6.4.7.0 - 6.6.10.6"
  swMax: "6.6.10.6"
  swMin: "6.4.7.0"
keywords: ["shopping cart calculation", "VAT calculation", "horizontal calculation", "vertical calculation", "tax rounding", "price rounding", "sales channel tax settings", "tax-free countries", "cart debugging", "rounding difference"]
summary: "Explains horizontal vs vertical VAT calculation methods for the shopping cart, related rounding settings, and how to debug cart-total discrepancies."
lastBuilt: "2026-09-15"
---
## What it is

This article explains how Shopware calculates shopping cart sums, items and VAT, using either the horizontal (line-by-line) or vertical (column-by-column) method, and how to verify or debug the calculation.

## When to use

Consult this when a customer reports incorrect cart totals or when deciding/checking which VAT calculation method a sales channel uses.

## Key steps / config

- **Horizontal calculation**: VAT is calculated per line item (price × quantity, tax computed and rounded per item), then all item tax amounts are summed.
- **Vertical calculation**: net amounts are summed first, VAT is applied once to the total net amount and rounded once.
- Both methods are legally valid but can produce rounding differences (example in the source: €1.71 horizontal vs €1.70 vertical VAT total on the same €8.97 net, a €0.01 difference).
- The tax calculation method is stored per sales channel under **Payment and shipping** in the sales channel settings.
- Price rounding for individual items and cart totals is configured under **Settings > Localisation > Currencies**.
- Whether tax calculation is free for a given country is set under **Settings > Localisation > Countries**.
- Shopware always displays and calculates with values rounded to 2 decimal places in the storefront.

## Essential identifiers

- Sales channel setting: tax calculation method (Payment and shipping area)
- `Settings > Localisation > Currencies` (price rounding)
- `Settings > Localisation > Countries` (tax-free flag)

## Gotchas

- The cart calculation is not centralized: front-end and back-end calculations are separate, so a suspected error should be traced through the full path (reconstruct cart, check `/checkout/finish`, order overview, PDF invoice, and an Excel cross-check).
- Extensions can hook into cart calculation and alter results; testing in an extension-free environment helps isolate such issues.
