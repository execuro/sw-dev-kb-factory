---
id: platform/dev/6.6/guides/plugins/plugins/content/stock/loading-stock-information-from-different-source.md
title: Loading Stock Information from a different Source
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/stock/loading-stock-information-from-different-source.html
sourceHash: b3b8bccd57d09cd068c33b53069d037745c5d0a2
keywords: ["AbstractStockStorage", "load", "StockLoadRequest", "StockDataCollection", "StockData", "StockData::fromArray", "alter", "index", "stock_data", "stock decorator", "third-party stock", "stock loading"]
summary: "Decorate AbstractStockStorage's load method to fetch product stock from a third-party API instead of Shopware's own data."
lastBuilt: "2026-09-15"
---
## What it is

Guide for replacing Shopware's product stock source with a third-party one by decorating the stock storage service.

## When to use

When Shopware is not the source of truth for stock and stock data must come from an external system.

## Key steps / config

1. Decorate `Shopware\Core\Content\Product\Stock\AbstractStockStorage` and implement `load(StockLoadRequest $stockRequest, SalesChannelContext $context): StockDataCollection`.
2. Inside `load`, read `$stockRequest->productIds`, call the external API, and build a `StockDataCollection` of `StockData` instances (one per product).
3. Register the decorator in `services.xml`:

```xml
<service id="Swag\Example\Service\StockStorageDecorator" decorates="Shopware\Core\Content\Product\Stock\StockStorage">
    <argument type="service" id="Swag\Example\Service\StockStorageDecorator.inner" />
</service>
```

4. Also implement `alter(array $changes, Context $context): void` and `index(array $productIds, Context $context): void` by delegating to `$this->decorated`.

`StockData::fromArray()` accepts these attributes:

| Attribute | Type | Required |
|---|---|---|
| productId | string | Required |
| stock | int | Required |
| available | boolean | Required |
| minPurchase | int | Optional |
| maxPurchase | int | Optional |
| isCloseout | boolean | Optional |

Arbitrary extra data can be attached via `$stockData->addArrayExtension('extraData', [...])`.

## Essential identifiers

- `Shopware\Core\Content\Product\Stock\AbstractStockStorage`
- `Shopware\Core\Content\Product\Stock\StockStorage` (decorated service id)
- `Shopware\Core\Content\Product\Stock\StockLoadRequest`
- `Shopware\Core\Content\Product\Stock\StockDataCollection`
- `Shopware\Core\Content\Product\Stock\StockData` / `StockData::fromArray()`
- product extension key `stock_data` (via `$product->getExtension('stock_data')`)

## Gotchas

The values set on the `StockData` instance are used to update the loaded product instance, so `load` must return a `StockData` for every requested product ID to keep stock consistent.
