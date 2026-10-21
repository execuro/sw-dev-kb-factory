---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/implementing-your-own-stock-storage.md
title: Implementing Your Own Stock Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/implementing-your-own-stock-storage.html
sourceHash: 0d30f8dcf6af5c95b190eb5af8b3e317a5598e05
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractStockStorage", "StockStorage", "StockAlteration", "OrderStockSubscriber", "alter", "quantityDelta", "stock storage decorator", "stock management", "inventory", "third-party stock system", "erp stock sync", "decorate service"]
summary: Decorate AbstractStockStorage and implement alter() to push order-driven StockAlteration changes to your own or an external stock system.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

Shopware keeps stock as plain integers in the `product` table. To write stock changes to another system or run your own stock logic, decorate the stock storage service `\Shopware\Core\Content\Product\Stock\AbstractStockStorage` and implement its `alter` method. The method receives `StockAlteration` objects, each carrying product and line item IDs plus the old and new quantity.

## When to use

- An ERP, WMS or other external system needs to receive stock changes caused by orders.
- You need a more advanced stock model than the single integer Shopware stores.

Decorating a service is covered in [Adjusting a Service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Extend `AbstractStockStorage`. All four abstract methods must be declared: `getDecorated()`, `load()`, `alter()`, `index()`. Forward to the inner service wherever you don't change behaviour.

```php
class StockStorageDecorator extends AbstractStockStorage
{
    public function __construct(private AbstractStockStorage $decorated, private MyStockApi $stockApi) {}
    public function getDecorated(): AbstractStockStorage { return $this->decorated; }
    public function load(StockLoadRequest $stockRequest, SalesChannelContext $context): StockDataCollection
    { return $this->decorated->load($stockRequest, $context); }
    /** @param list<StockAlteration> $changes */
    public function alter(array $changes, Context $context): void
    { /* push $alteration->productId / ->newQuantity to the API */ $this->decorated->alter($changes, $context); }
    public function index(array $productIds, Context $context): void
    { $this->decorated->index($productIds, $context); }
}
```

2. Register the decorator against the core service id `Shopware\Core\Content\Product\Stock\StockStorage` in `src/Resources/config/services.php`: `$services->set(StockStorageDecorator::class)->decorate(StockStorage::class)->args([service('.inner')])`. The example constructor also takes `MyStockApi`, so add that service to `args` as well.

`StockAlteration` (final readonly) exposes:

| Member | Type | Meaning |
|---|---|---|
| `lineItemId` | string | Line item that triggered the change |
| `productId` | string | Product to update |
| `quantityBefore` | int | Old stock level |
| `newQuantity` | int | New stock level |
| `quantityDelta()` | int | `quantityBefore - newQuantity` |

Your implementation has to handle every stock-changing scenario: order placed, cancelled, deleted, cancelled order reopened, line item added, removed, quantity increased or decreased, and product (SKU) changed. All of these are dispatched by `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`.

To react to more events, write your own event subscriber that calls `AbstractStockStorage::alter()` with matching `StockAlteration` instances. If you replace Shopware's stock handling entirely, the project owner can switch off the built-in system with `shopware.stock.enable_stock_management: false`.

## Essential identifiers

- `\Shopware\Core\Content\Product\Stock\AbstractStockStorage`
- `Shopware\Core\Content\Product\Stock\StockStorage` (service id to decorate)
- `Shopware\Core\Content\Product\Stock\StockAlteration`
- `Shopware\Core\Content\Product\Stock\OrderStockSubscriber`
- `StockLoadRequest`, `StockDataCollection`
- `shopware.stock.enable_stock_management`

## Gotchas

- The core `StockStorage::alter()` and `index()` return early when the context version is not the live version.
- `OrderStockSubscriber` returns early when `shopware.stock.enable_stock_management` is false, so `alter()` is then never called for order changes.
- The core `StockStorage::getDecorated()` throws `DecorationPatternException`. Decorators must return the inner service.
- The delta is `quantityBefore - newQuantity`, and core applies it as `stock = stock + delta`.

## Code check (6.7.15.1)
- confirmed `AbstractStockStorage::getDecorated()` — abstract, must be declared — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:12
- confirmed `AbstractStockStorage::load()` — abstract, signature matches docs — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:24
- confirmed `AbstractStockStorage::alter()` — abstract, takes list of StockAlteration — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:31
- confirmed `AbstractStockStorage::index()` — abstract, takes list of product IDs — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:38
- confirmed `StockAlteration::$quantityBefore` — constructor-promoted public property, alongside lineItemId, productId, newQuantity — vendor/shopware/core/Content/Product/Stock/StockAlteration.php:13
- confirmed `StockAlteration::quantityDelta()` — returns quantityBefore minus newQuantity — vendor/shopware/core/Content/Product/Stock/StockAlteration.php:18
- confirmed `StockStorage` — core implementation registered under its class name as service id — vendor/shopware/core/Content/DependencyInjection/product.php:717
- confirmed `StockStorage::getDecorated()` — throws DecorationPatternException — vendor/shopware/core/Content/Product/Stock/StockStorage.php:32
- confirmed `OrderStockSubscriber` — receives StockStorage service and stock-management flag — vendor/shopware/core/Content/DependencyInjection/product.php:380
- confirmed `shopware.stock.enable_stock_management` — injected into OrderStockSubscriber; boolean node defaults to true — vendor/shopware/core/Content/DependencyInjection/product.php:384
