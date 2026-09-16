---
id: platform/dev/6.7/guides/hosting/configurations/shopware/stock.md
title: Stock
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/stock.html
sourceHash: 346e7a497943bd12567be64e03e55d5548b98715
codeCheckedAgainst: "6.7.13.0"
keywords: ["stock", "stock management", "inventory", "shopware.stock.enable_stock_management", "enable_stock_management", "product.stock", "OrderStockSubscriber", "StockStorage", "disable stock updates", "bundle configuration"]
summary: "shopware.stock.enable_stock_management (default true) toggles automatic product.stock updates on order placement, cancellation and completion."
lastBuilt: 2026-09-15
---
## What it is

Bundle configuration for Shopware's built-in stock management system, which updates product stock levels automatically when orders are placed, cancelled or completed. `product.stock` is the primary source for real-time product stock values.

## When to use

- You manage stock in an external system (ERP, warehouse) and Shopware must not change `product.stock` on order events.
- You replace the default stock handling with your own implementation.

## Key steps / config

Stock management is enabled by default; nothing needs configuring to use it.

To disable it, set `shopware.stock.enable_stock_management` to `false` in a `config/packages/*.yaml` file:

```yaml
shopware:
  stock:
    enable_stock_management: false
```

When disabled, `Shopware\Core\Content\Product\Stock\OrderStockSubscriber` returns early for both order line item writes and order state machine transitions, so `product.stock` is no longer altered via `StockStorage`.

## Essential identifiers

- `shopware.stock.enable_stock_management` (bool, default `true`)
- `product.stock`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`
- `Shopware\Core\Content\Product\Stock\StockStorage` (extends `AbstractStockStorage`)

## Gotchas

- Disabling means `product.stock` is not updated automatically when orders are placed or completed; any stock updates must come from elsewhere.
- For custom stock implementations, see the plugin Stock guide section (not linked here).

## Code check (6.7.13.0)
- confirmed `enable_stock_management` — boolean node, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1180
- confirmed `enable_stock_management` — shipped value true under `stock:` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:645
- confirmed `shopware.stock.enable_stock_management` — injected into OrderStockSubscriber — vendor/shopware/core/Content/DependencyInjection/product.xml:211
- confirmed `OrderStockSubscriber::beforeWriteOrderItems()` — returns early when disabled — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:51
- confirmed `OrderStockSubscriber::stateChanged()` — returns early when disabled — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:95
- confirmed `StockStorage` — extends AbstractStockStorage — vendor/shopware/core/Content/Product/Stock/StockStorage.php:19
- confirmed `stock` — required IntField on product — vendor/shopware/core/Content/Product/ProductDefinition.php:180
