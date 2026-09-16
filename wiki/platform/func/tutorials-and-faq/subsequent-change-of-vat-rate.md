---
id: platform/func/tutorials-and-faq/subsequent-change-of-vat-rate.md
title: Subsequent Change Of Vat Rate
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/subsequent-change-of-vat-rate"
sourceHash: "28be96e13bc44dc40f249a42a33d82f8540bcdea85fcfea637221cbfcb83359a"
revision:
  current: true
  range: "6.1.0"
  swMax: null
  swMin: null
keywords: ["vat rate change", "tax rate", "price_net", "price_gross", "tax_rate", "import export", "promotions", "product rule", "discount", "order tax rate", "per-country tax rate"]
summary: "How to adjust stored tax rates, product net prices and existing orders when a country's VAT rate changes after go-live."
lastBuilt: "2026-09-15"
---

## What it is

Guidance on what to do when a shop's stored tax rates need to change after go-live (e.g.
due to a change in law): adjusting the settings, recalculating product prices, applying
temporary discounts to compensate customers, and correcting existing orders.

## When to use

When a country's statutory VAT rate changes and a store's tax settings, stored product
prices, and already-placed orders all need to reflect it.

## Key steps / config

- As of Shopware 6.5.7.3, per-country tax rates can be created for each tax rate under
  **Settings > Shop > Tax**, including a validity start date. Note: changing a tax rate
  here does **not** change stored product prices — the database stores fixed prices and
  only the tax portion is calculated dynamically in the cart.
- To update stored net prices, export products with the standard product profile via
  import/export, then in the exported `price_net` column apply the formula
  `=Gross/(1+(VAT rate/100))` (Gross = the `price_gross` cell, VAT rate = the `tax_rate`
  cell), fill it down the sheet, and re-import the file.
- To compensate customers whose stored prices reflect the old rate, create a
  **Promotion** (Marketing > Promotions): set **total redemptions**/**individual
  redemptions** to 0 for unlimited use, then add two **discounts** limited via
  **Apply to a specific range of products only** and a **product rule**, e.g.
  `line item with tax rate is one of standard rate AND billing country is one of
  Germany` for a 19%→16% change (discount value 2.52), and `line item with tax rate is
  one of reduced rate` for a 7%→5% change (discount value 1.87). The percentage
  reduction is not the raw rate delta because prices move from 119%→116% (or
  107%→105%), not 100%→97%.
- To adjust the tax rate on an already-placed order, open the order, click **Edit**,
  double-click the tax rate to edit it, and save.

## Essential identifiers

- **Settings > Shop > Tax** (per-country tax rate, validity date)
- `price_net`, `price_gross`, `tax_rate` (import/export columns)
- **Marketing > Promotions** (discount, product rule)

## Gotchas

- Changing a tax rate under Settings > Shop > Tax has no effect on already-stored
  product prices — only the import/export price adjustment changes those.
- The compensating discount value is not simply the percentage-point difference between
  old and new rates (e.g. 19%→16% needs 2.52%, not 3%), because prices are being reduced
  from 119%/107% baselines, not 100%.

## Version notes

Per-country tax rates with a validity start date were introduced in Shopware 6.5.7.3.
