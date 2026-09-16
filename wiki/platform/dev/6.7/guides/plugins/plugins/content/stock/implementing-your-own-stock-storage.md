---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/implementing-your-own-stock-storage.md
title: Implementing Your Own Stock Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/implementing-your-own-stock-storage.html
sourceHash: 0d30f8dcf6af5c95b190eb5af8b3e317a5598e05
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractStockStorage", "StockStorage", "StockAlteration", "OrderStockSubscriber", "alter", "quantityDelta", "stock storage decorator", "custom stock storage", "external inventory system", "stock sync", "decorate service", "inventory"]
summary: Decorate StockStorage via AbstractStockStorage and implement alter() to push StockAlteration changes from orders and line item edits to another system.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How to replace or extend where Shopware writes stock changes. By default stock is a plain integer in the `product` table, updated by `Shopware\Core\Content\Product\Stock\StockStorage`. A plugin decorates it (base class `Shopware\Core\Content\Product\Stock\AbstractStockStorage`) and implements `alter()` to forward alterations to a third-party system. Requires knowledge of service decoration ([Adjusting a Service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)).

## When to use

- You need a more advanced stock management system than the integer column.
- Stock alterations must be written to an ERP/warehouse or other external service.

## Key steps / config

1. Create a decorator extending `AbstractStockStorage`. All four abstract members must be declared; delegate the ones you do not customise to the inner service:

```php
class StockStorageDecorator extends AbstractStockStorage
{
    public function __construct(private AbstractStockStorage $decorated, private MyStockApi $stockApi) {}
    public function getDecorated(): AbstractStockStorage { return $this->decorated; }
    public function load(StockLoadRequest $stockRequest, SalesChannelContext $context): StockDataCollection { /* delegate */ }
    /** @param list<StockAlteration> $changes */
    public function alter(array $changes, Context $context): void { /* push to API, then $this->decorated->alter(...) */ }
    public function index(array $productIds, Context $context): void { /* delegate */ }
}
```

2. Register it in `src/Resources/config/services.php` decorating the core service id `Shopware\Core\Content\Product\Stock\StockStorage`:

```php
$services->set(StockStorageDecorator::class)
    ->decorate(StockStorage::class)
    ->args([service('.inner')]);
```

3. Each `StockAlteration` (readonly) exposes: `lineItemId` (string), `productId` (string), `quantityBefore` (int, old level), `newQuantity` (int, new level), and `quantityDelta()` (int, computed as `quantityBefore - newQuantity`).

4. Implementations must handle every scenario raised by `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`: order placed, canceled, deleted; canceled order reopened; line item added, removed; line item quantity increased/decreased; line item product (SKU) changed.

5. Further extension: subscribe to additional events yourself and call `AbstractStockStorage::alter()` with representative `StockAlteration` instances; or run a fully separate system and have the project owner disable Shopware stock management.

## Essential identifiers

- `Shopware\Core\Content\Product\Stock\AbstractStockStorage` (`getDecorated`, `load`, `alter`, `index`)
- `Shopware\Core\Content\Product\Stock\StockStorage` (service id to decorate)
- `Shopware\Core\Content\Product\Stock\StockAlteration`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`
- `StockLoadRequest`, `StockDataCollection`

## Gotchas

- The source's `services.php` passes only `service('.inner')`, although its decorator constructor also takes a `MyStockApi` argument; that second argument has to be wired as well.
- Core `StockStorage::alter()` returns without changes for non-live versions and for an empty change list; the core `OrderStockSubscriber` also skips non-live-version writes.
- `quantityDelta()` is before minus new, so a decrease in stock yields a positive delta.
- `OrderStockSubscriber` does nothing when `shopware.stock.enable_stock_management` is `false`.

## Code check (6.7.13.0)
- confirmed `AbstractStockStorage::getDecorated()` — abstract member — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:12
- confirmed `AbstractStockStorage::load()` — abstract member with StockLoadRequest/SalesChannelContext — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:24
- confirmed `AbstractStockStorage::alter()` — abstract, takes list of StockAlteration and Context — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:31
- confirmed `AbstractStockStorage::index()` — abstract, product IDs and Context — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:38
- confirmed `StockStorage` — service id to decorate — vendor/shopware/core/Content/DependencyInjection/product.xml:510
- confirmed `StockAlteration::$quantityBefore` — constructor-promoted readonly properties lineItemId, productId, quantityBefore, newQuantity — vendor/shopware/core/Content/Product/Stock/StockAlteration.php:13
- confirmed `StockAlteration::quantityDelta()` — returns quantityBefore minus newQuantity — vendor/shopware/core/Content/Product/Stock/StockAlteration.php:18
- confirmed `OrderStockSubscriber` — calls stockStorage alter on order line item writes — vendor/shopware/core/Content/Product/Stock/OrderStockSubscriber.php:24
- confirmed `StockStorage::alter()` — skips non-live versions and empty changes — vendor/shopware/core/Content/Product/Stock/StockStorage.php:43
