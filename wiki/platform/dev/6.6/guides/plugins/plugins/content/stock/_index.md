---
id: platform/dev/6.6/guides/plugins/plugins/content/stock/_index.md
title: Stock
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/stock/"
sourceHash: 85777c4c32fb9c9e51e2bf4dec2b9b5ca915c1b7
keywords: ["stock", "stock management", "STOCK_HANDLING", "feature flag", "stock configuration", "inventory", "order stock", "product stock", "stock allocation", "shop owner"]
summary: "Index page for the Stock plugin area: allocating and tracking product stock, gated behind the STOCK_HANDLING feature flag."
lastBuilt: 2026-09-15
---
## What it is
Index page for the plugin Stock guide section. The stock management system allows allocation of stock quantities to products, available from Shopware 6.5.5.0 and gated behind the `STOCK_HANDLING` feature flag.

## When to use
Use this section when a plugin needs to work with product stock, or when a shop owner needs to enable, disable, or configure the stock management system.

## Key steps / config
- Stock is incremented and decremented automatically as orders are placed, modified, canceled, and refunded.
- The system is deliberately kept simple to accommodate various use cases, and the shop owner can deactivate it entirely if it is not required.
- Enabling or disabling this feature is done via the stock configuration guide referenced from this page.

## Essential identifiers
- `STOCK_HANDLING` feature flag

## Version notes
Available starting with Shopware 6.5.5.0.
