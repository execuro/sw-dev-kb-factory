---
id: platform/func/catalogues/product-overview.md
title: Product Overview
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/catalogues/product-overview
sourceHash: 907fb1891def147c165ec9ff0ac5a66bd21d46e76a402661300f5a088d020b5a
revision:
  current: true
  range: "6.4.8.0 - 6.4.9.0"
  swMin: "6.4.8.0"
  swMax: "6.4.9.0"
keywords: ["product overview", "Catalogues > Products", "product list", "list settings", "compact mode", "product context menu", "bulk edit products", "advanced pricing", "product variants list", "duplicate product", "deactivate product"]
summary: "The Catalogues > Products list view: columns, compact mode, per-product context menu, and bulk edit for changing multiple products at once."
lastBuilt: "2026-09-15"
---
## What it is
Describes the product list view under **Catalogues > Products**, showing created products with key columns, and the tools available from it.

## When to use
When browsing, filtering, editing multiple products at once, or managing product variants from the list rather than the single-product edit screen.

## Key steps / config
Overview columns: Active, Name, Product number, Price (default customer group), In stock (color-coded: 0 red, 1-25 yellow, >25 green), Manufacturer. Columns can be hidden via a button next to each header. List settings (top-right) toggle compact mode and column visibility/order.

Products with variants show an extra icon before the name; clicking it opens a modal listing the variants (name, price, stock, active, product number); double-click a variant row to edit inline, or use the "..." menu for extended editing.

Context menu ("..." per row): Edit, Duplicate (copies the product, assigning the next product number and appending "copy" to the name), Delete.

Bulk edit: select individual products or all products on the page (max 1000 selectable); click **bulk edit** to open a pop-up showing the selection, then **start bulk edit**. Each editable block offers a dropdown: Overwrite, Clear, Add, Remove, controlling how the change is applied. Only checked fields are changed. Confirm with **apply changes**.

Prices & Advanced Prices block fields: Tax rate, Price (gross/net), List price (gross/net), Purchase price (gross/net), Cheapest price last 30 days (gross/net). Advanced Pricing supports scaled/deviating prices per condition rule, editable via a modal with drop-down, delete and duplicate pricing-rule controls.

## Essential identifiers
- `Catalogues > Products`

## Gotchas
Products already referenced in existing orders remain listed in those orders after deletion but point to a non-existent dataset — deactivating rather than deleting such products is recommended. The cover image cannot be set via bulk edit, and updating the gross price via bulk edit does not change the net price.
