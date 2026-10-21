---
id: platform/func/catalogues/product-overview.md
title: Product Overview
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/catalogues/product-overview
sourceHash: a5179b53b36bc16c02e53fd844b88acd304b3ee6f90a0ffc7a570c81f853a5a7
revision:
  current: true
  range: "6.7.0.0 - 6.7.14.2"
  swMax: "6.7.14.2"
  swMin: "6.7.0.0"
keywords: ["product overview", "products list", "bulk edit", "context menu", "duplicate product", "list settings", "compact mode", "variants", "advanced pricing", "Products > Overview", "mass edit", "produktübersicht", "price", "stock"]
summary: "Products > Overview in the Administration: list columns, variant modal, list settings, context menu, and bulk edit of up to 1000 products incl. prices."
lastBuilt: 2026-10-20
---
## What it is

The product list in the Administration under **Products > Overview**. It shows products with key data, lets you sort, filter, duplicate and delete them, and provides bulk editing of many products at once.

## When to use

When finding or sorting products, checking stock and price at a glance, opening variants, or changing the same fields on many products.

## Key steps / config

Default columns: Active, Name, Product number, Price (default customer group), In stock (0 = red, 1-25 = yellow, over 25 = green), Manufacturer. Columns can be hidden, and sorted by clicking the header.

- **Variants**: a symbol before the name marks products with variants; clicking it opens a modal listing variants (generating properties, price, stock, active, product number). Double-click a variant row to edit inline; the "..." menu opens extended editing; a link opens the main product.
- **List settings** (header button): toggle compact mode, show/hide columns, reorder columns.
- **Context menu ("...")**: Edit, Duplicate (copy gets the next product number and "copy" after the name), Delete. For variant products, variant settings are reachable here.
- **Bulk edit**: select individual products, all on the page, or across pages (maximum 1000). Use **bulk edit** or **delete** on the selection, review it, click **start bulk edit**, tick the checkbox of each field to change, set values, **save**, then **apply changes**. Only ticked fields change.
- Block handling dropdown: Overwrite (replace), Clear (remove all in block), Add (keep existing), Remove (remove selected only).
- **Prices block**: tax rate, price gross/net, list price gross/net, purchase price gross/net, cheapest price (last 30 days) gross/net.
- **Advanced Pricing block**: choose a handling option, then **Create new advanced prices**, pick a condition rule, and set scales, list prices and currency-dependent prices; rules can be changed, deleted, duplicated or added.

## Gotchas

- Products already in orders stay in those orders as references to a non-existent record after deletion; deactivating is recommended instead.
- Bulk edit cannot set the cover image.
- Updating the gross price in bulk edit does not change the net price.
- List price is only shown in the frontend when it is higher than the product price.
