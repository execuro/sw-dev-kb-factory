---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/_index.md
title: Stock
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/
sourceHash: 0942764362a984eb77386208a2847a619797c880
codeCheckedAgainst: "6.7.15.1"
keywords: ["stock", "stock management", "inventory", "shopware.stock.enable_stock_management", "enable_stock_management", "OrderStockSubscriber", "StockStorage", "disable stock", "order stock decrement", "product stock"]
summary: Shopware 6.7 stock management - stock is adjusted on order placement, changes, cancellation and refunds; can be disabled via config.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/hosting/configurations/shopware/stock.md
---
## What it is

Entry page for stock guides. The stock management system allocates stock to products; stock is incremented and decremented as orders are placed, modified, canceled and refunded. It is kept deliberately simple, and the shop owner can deactivate it entirely.

## When to use

You need to know whether Shopware adjusts product stock on order events, or want to switch that behaviour off.

## Key steps / config

Enabling/disabling is described in [Stock configuration](platform/dev/6.7/guides/hosting/configurations/shopware/stock.md). In the installed code this is the boolean `shopware.stock.enable_stock_management` (default `true`), passed to `OrderStockSubscriber`.

## Essential identifiers

- `shopware.stock.enable_stock_management`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`

## Code check (6.7.15.1)
- confirmed `enable_stock_management` — boolean, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1216
- confirmed `shopware.stock.enable_stock_management` — injected into OrderStockSubscriber — vendor/shopware/core/Content/DependencyInjection/product.php:384
- confirmed `OrderStockSubscriber` — skips stock updates when disabled — vendor/shopware/core/Content/DependencyInjection/product.php:380
