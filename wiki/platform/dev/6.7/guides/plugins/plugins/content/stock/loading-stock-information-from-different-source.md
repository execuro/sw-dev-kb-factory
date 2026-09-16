---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/loading-stock-information-from-different-source.md
title: Loading Stock Information from a Different Source
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/loading-stock-information-from-different-source.html
sourceHash: cf829a0b73b6492040cb170add4eab2e6e0db9d4
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractStockStorage", "StockLoadRequest", "StockDataCollection", "StockData", "StockData::fromArray", "stock_data", "load", "external stock source", "third-party stock api", "erp stock", "stock decorator", "minPurchase", "isCloseout"]
summary: Decorate StockStorage and implement AbstractStockStorage::load() to return a StockDataCollection of StockData from an external stock source.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How to supply product stock from a third-party source when Shopware is not the source of truth. A decorator of `Shopware\Core\Content\Product\Stock\StockStorage` (base `Shopware\Core\Content\Product\Stock\AbstractStockStorage`) implements `load()`, which receives the loaded product IDs and returns stock values that overwrite the product's own. Background on decoration: [Adjusting a Service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## When to use

- Stock levels live in an ERP, warehouse or other API and must be shown/used on storefront product loads.

## Key steps / config

1. Extend `AbstractStockStorage`, declaring all four abstract members; only `load()` is customised:

```php
class StockStorageDecorator extends AbstractStockStorage
{
    public function __construct(private AbstractStockStorage $decorated) {}
    public function getDecorated(): AbstractStockStorage { return $this->decorated; }
    public function load(StockLoadRequest $stockRequest, SalesChannelContext $context): StockDataCollection
    { /* use $stockRequest->productIds, call API, return new StockDataCollection([...StockData]) */ }
    public function alter(array $changes, Context $context): void { $this->decorated->alter($changes, $context); }
    public function index(array $productIds, Context $context): void { $this->decorated->index($productIds, $context); }
}
```

2. Register in `services.php`: `$services->set(StockStorageDecorator::class)->decorate(StockStorage::class)->args([service('.inner')]);`
3. Build one `StockData` per product, either `new StockData($productId, $stock, true)` or `\Shopware\Core\Content\Product\Stock\StockData::fromArray([...])`:

| Attribute | Type | Required |
|---|---|---|
| `productId` | string | yes |
| `stock` | int | yes |
| `available` | bool | yes |
| `minPurchase` | int | no |
| `maxPurchase` | int | no |
| `isCloseout` | bool | no |

4. Extra data: `$stockData->addArrayExtension('extraData', ['foo' => 'bar']);`
5. Read it back from a loaded product: `$product->getExtension('stock_data');`

## Essential identifiers

- `Shopware\Core\Content\Product\Stock\AbstractStockStorage::load()`
- `Shopware\Core\Content\Product\Stock\StockStorage`
- `Shopware\Core\Content\Product\Stock\StockLoadRequest` (`productIds`)
- `Shopware\Core\Content\Product\Stock\StockDataCollection`
- `Shopware\Core\Content\Product\Stock\StockData::fromArray()`
- `stock_data` product extension

## Gotchas

- The source text names the factory as `Shopware\Core\Content\Product\Stock::fromArray()`; the real method is `StockData::fromArray()`.
- `load()` is invoked by `LoadProductStockSubscriber` on sales-channel product loaded/partial-loaded events and by `AvailableCombinationLoader` — i.e. sales channel loads, with a `SalesChannelContext`.
- Products without a `StockData` entry in the collection keep their stored values; `null` optional fields (`minPurchase`, `maxPurchase`, `isCloseout`) fall back to the product's own values.
- The `stock_data` extension holds the `StockData` object itself, so custom array extensions are reachable through it.
- The source sample assigns `$productsIds` but comments refer to `$productIds` — a typo in the docs.
- Core `StockStorage::load()` returns an empty collection, so without a decorator the database values are used.

## Code check (6.7.13.0)
- confirmed `AbstractStockStorage::load()` — abstract, StockLoadRequest + SalesChannelContext to StockDataCollection — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:24
- confirmed `StockLoadRequest::$productIds` — public array of product IDs — vendor/shopware/core/Content/Product/Stock/StockLoadRequest.php:13
- corrected `StockData::fromArray()` — docs: `Shopware\Core\Content\Product\Stock::fromArray()`; productId, stock, available required, others optional — vendor/shopware/core/Content/Product/Stock/StockData.php:24
- confirmed `StockDataCollection` — constructor takes array of StockData keyed by productId — vendor/shopware/core/Content/Product/Stock/StockDataCollection.php:8
- confirmed `LoadProductStockSubscriber::salesChannelLoaded()` — assigns stock data and adds the stock_data extension — vendor/shopware/core/Content/Product/Stock/LoadProductStockSubscriber.php:33
- confirmed `AvailableCombinationLoader::loadCombinations()` — also calls stockStorage load — vendor/shopware/core/Content/Product/SalesChannel/Detail/AvailableCombinationLoader.php:34
- confirmed `ExtendableTrait::addArrayExtension()` — available on StockData via Struct — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:32
- confirmed `StockStorage::load()` — core implementation returns empty collection — vendor/shopware/core/Content/Product/Stock/StockStorage.php:35
