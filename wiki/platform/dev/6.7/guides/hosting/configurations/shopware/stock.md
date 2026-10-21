---
id: platform/dev/6.7/guides/hosting/configurations/shopware/stock.md
title: Stock
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/stock.html
sourceHash: 88e5d9c682b4111453ff2cc6c5a232ff6e22d78f
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.stock.enable_stock_management", "enable_stock_management", "product.stock", "OrderStockSubscriber", "StockStorage", "stock management", "inventory", "disable stock", "stock levels", "order stock", "bundle configuration"]
summary: "shopware.stock.enable_stock_management (default true) controls automatic product.stock updates on orders; set it to false to disable stock management."
lastBuilt: 2026-10-21
---
## What it is

Shopware's stock management system updates product stock levels automatically as orders change. The `product.stock` field is the primary source for real-time product stock values. The system is enabled by default and needs no configuration; it can be switched off entirely with the bundle config key `shopware.stock.enable_stock_management`.

## When to use

- You manage stock in an external system (ERP, warehouse software) and do not want Shopware to change `product.stock` on orders.
- You implement your own stock handling and need to turn off the default behaviour.

## Key steps / config

To disable the default stock management, set the key to `false` in the Shopware bundle configuration (e.g. a file under `config/packages/`):

```yaml
shopware:
    stock:
        enable_stock_management: false
```

The key is a boolean node with default `true`. Its value is injected as `shopware.stock.enable_stock_management` into `OrderStockSubscriber`. When it is `false`, both handlers of that subscriber return early, so `product.stock` is no longer altered:

- `beforeWriteOrderItems` (on `EntityWriteEvent`) — adjusts stock when order line items are written in the live version.
- `stateChanged` (on `StateMachineTransitionEvent` for `order`) — restores stock when an order is transitioned to cancelled, and decreases it again when an order leaves the cancelled state.

Stock changes are applied through `StockStorage::alter()`.

## Essential identifiers

- `shopware.stock.enable_stock_management` — config key / container parameter, default `true`
- `product.stock` — the stock field kept up to date by the system
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber` — the subscriber gated by the flag
- `StockStorage` — storage service that applies the stock alterations

## Gotchas

- With stock management disabled, `product.stock` is not updated automatically when orders are placed or completed; anything relying on it must be kept in sync by your own code.
- Changes on non-live versions (e.g. order edits in a draft version) never alter stock, independent of the flag.

## Code check (6.7.15.1)
- confirmed `enable_stock_management` — boolean node, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1216
- confirmed `enable_stock_management` — shipped bundle default `true` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:687
- confirmed `shopware.stock.enable_stock_management` — parameter injected into OrderStockSubscriber — vendor/shopware/core/Content/DependencyInjection/product.php:384
- confirmed `OrderStockSubscriber::beforeWriteOrderItems()` — returns early when disabled — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:51
- confirmed `OrderStockSubscriber::stateChanged()` — returns early when disabled; handles from/to cancelled — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:95
