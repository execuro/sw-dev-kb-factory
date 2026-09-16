---
id: platform/dev/6.6/guides/plugins/plugins/content/stock/implementing-your-own-stock-storage.md
title: Implementing your own stock storage
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/stock/implementing-your-own-stock-storage.html
sourceHash: f43968477415eb5a8fac087c7ed82ea434268f95
keywords: ["AbstractStockStorage", "StockAlteration", "StockLoadRequest", "StockDataCollection", "OrderStockSubscriber", "alter method", "stock storage decorator", "stock:handling", "third-party stock", "line item stock"]
summary: "Decorate AbstractStockStorage's alter() to forward stock changes to a third-party system while keeping default stock handling."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to implement custom stock storage by decorating `Shopware\Core\Content\Product\Stock\AbstractStockStorage`, so stock alterations can be forwarded to a third-party system instead of (or in addition to) Shopware's default integer stock column on the `product` table.

## When to use

Use this when a more advanced stock management system is needed, or when stock alterations must be written to an external system rather than Shopware's built-in storage.

## Key steps / config

1. Decorate `AbstractStockStorage` and implement `alter(array $changes, Context $context): void`, where `$changes` is a `list<StockAlteration>`. Each `StockAlteration` carries the Product and Line Item IDs and the old/new quantity, exposed as properties/methods: `lineItemId`, `productId`, `quantityBefore`, `newQuantity`, `quantityDelta()`.
2. Forward the call to the decorated service after handling the alteration in the custom system, e.g.:

```php
public function alter(array $changes, Context $context): void
{
    foreach ($changes as $alteration) {
        $this->stockApi->updateStock($alteration->productId, $alteration->newQuantity);
    }
    $this->decorated->alter($changes, $context);
}
```

3. Also implement `load(StockLoadRequest $stockRequest, SalesChannelContext $context): StockDataCollection` and `index(array $productIds, Context $context): void`, typically delegating to the decorated instance.
4. Register the decorator in `services.xml` with `decorates="Shopware\Core\Content\Product\Stock\StockStorage"`.

Stock alterations are triggered by these scenarios, all handled by `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`: order placed, order canceled, order deleted, canceled order reopened, line item added/removed, line item quantity increased/decreased, line item SKU changed.

## Essential identifiers

- `Shopware\Core\Content\Product\Stock\AbstractStockStorage`
- `Shopware\Core\Content\Product\Stock\StockAlteration`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`
- `alter(array $changes, Context $context): void`

## Gotchas

To listen to additional events beyond the built-in scenarios, create an event subscriber and call `AbstractStockStorage::alter()` with a representative `StockAlteration` instance. To fully replace Shopware's stock handling, implement a custom system and instruct the project owner to disable Shopware's default stock management instead.
