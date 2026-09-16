---
id: platform/dev/6.6/guides/hosting/configurations/shopware/stock.md
title: Stock
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/shopware/stock.html
sourceHash: caa8fd813df162a62405b2e367cb6e1dfa012771
keywords: ["stock management", "STOCK_HANDLING", "product.stock", "shopware.stock.enable_stock_management", "OrderStockSubscriber", "feature flag", "order transition subscribers", "real-time stock", "inventory configuration", "disable stock handling"]
summary: "Documents the STOCK_HANDLING feature flag for the rewritten stock system and shopware.stock.enable_stock_management to disable it."
lastBuilt: 2026-09-15
---
## What it is
Documents the Shopware 6 stock management system configuration, including enabling the rewritten stock engine and disabling default stock handling.

## When to use
Use it when you need to know how to turn on the new real-time stock system or fully disable Shopware's built-in stock event subscribers, e.g., when using a custom or external stock management solution.

## Key steps / config
- Feature flag `STOCK_HANDLING` (set in `.env`) enables the rewritten stock management system introduced in Shopware 6.5.5, where the `product.stock` field becomes the primary source for real-time stock values.
- To disable the default stock management (only relevant when `STOCK_HANDLING` is enabled), set `shopware.stock.enable_stock_management` to `false`.

## Essential identifiers
- `STOCK_HANDLING` feature flag
- `product.stock` field
- `shopware.stock.enable_stock_management`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`

## Gotchas
When stock management is disabled, none of the order-transition event subscribers in `Shopware\Core\Content\Product\Stock\OrderStockSubscriber` will be executed.

## Version notes
The rewritten stock system dates from Shopware 6.5.5; it is planned to become the default in the next major version of Shopware.
