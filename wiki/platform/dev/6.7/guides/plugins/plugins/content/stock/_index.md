---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/_index.md
title: Stock
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/
sourceHash: 0942764362a984eb77386208a2847a619797c880
codeCheckedAgainst: "6.7.13.0"
keywords: ["stock", "stock management", "inventory", "product stock", "shopware.stock.enable_stock_management", "enable_stock_management", "AbstractStockStorage", "StockStorage", "OrderStockSubscriber", "disable stock", "order stock decrement"]
summary: Overview of Shopware 6.7 stock management - stock changes on order placement, edits, cancellation and refunds; can be disabled via configuration.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/shopware/stock.md"]
---
## What it is

Entry page for the stock management system in Shopware 6.7. It allocates stock to products; stock is incremented and decremented as orders are placed, modified, canceled and refunded. The system is kept deliberately simple so it fits many use cases, and the shop owner can deactivate it entirely when it is not needed.

## When to use

- You need an overview before reading, writing or customising product stock in a plugin (custom stock storage, loading stock from an external source, reading/writing `product.stock`).
- You want to know whether stock handling can be switched off for a project.

## Key steps / config

- Enabling or disabling stock management is a system configuration topic, documented in [Stock configuration](platform/dev/6.7/guides/hosting/configurations/shopware/stock.md).
- In the installed code the switch is the bundle parameter `shopware.stock.enable_stock_management` (boolean, default `true`):

```yaml
shopware:
    stock:
        enable_stock_management: true
```

- The parameter is injected into `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`, which returns early (no stock alteration) when it is `false`.
- Stock writes and loads go through `Shopware\Core\Content\Product\Stock\AbstractStockStorage`; the default implementation is `Shopware\Core\Content\Product\Stock\StockStorage`, which plugins decorate to customise behaviour.

## Essential identifiers

- `shopware.stock.enable_stock_management`
- `Shopware\Core\Content\Product\Stock\AbstractStockStorage`
- `Shopware\Core\Content\Product\Stock\StockStorage`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`

## Gotchas

- Disabling stock management stops the order-driven stock updates performed by `OrderStockSubscriber`; anything relying on automatic decrements must then be handled by your own system.

## Code check (6.7.13.0)
- confirmed `enable_stock_management` — boolean node under `stock`, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1180
- confirmed `enable_stock_management` — default value in shipped bundle config — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:645
- confirmed `OrderStockSubscriber` — receives `%shopware.stock.enable_stock_management%` as argument — vendor/shopware/core/Content/DependencyInjection/product.xml:211
- confirmed `OrderStockSubscriber::beforeWriteOrderItems()` — returns early when stock management is disabled — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:51
- confirmed `AbstractStockStorage` — abstract stock storage base class — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:10
- confirmed `StockStorage` — default service implementation — vendor/shopware/core/Content/DependencyInjection/product.xml:510
