---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/loading-stock-information-from-different-source.md
title: Loading Stock Information from a Different Source
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/loading-stock-information-from-different-source.html
sourceHash: cf829a0b73b6492040cb170add4eab2e6e0db9d4
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractStockStorage", "StockStorage", "StockLoadRequest", "StockDataCollection", "StockData", "StockData::fromArray", "stock_data", "LoadProductStockSubscriber", "external stock source", "third-party stock api", "inventory", "load stock"]
summary: Decorate AbstractStockStorage::load() to return a StockDataCollection of StockData from an external system; values overwrite the loaded products' stock.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

When Shopware is not the source of truth for stock, decorate `\Shopware\Core\Content\Product\Stock\AbstractStockStorage` and implement `load`. It is called with the IDs of the products being loaded and returns stock data from a third-party source. That data is then written onto the loaded products.

## When to use

Stock levels, availability or purchase limits live in an ERP or external API and must be shown on products loaded in a sales channel. Decorating a service is covered in [Adjusting a Service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

1. Extend `AbstractStockStorage`, declaring all four abstract methods. Forward `alter` and `index` to the inner service.

```php
class StockStorageDecorator extends AbstractStockStorage
{
    public function __construct(private AbstractStockStorage $decorated) {}
    public function getDecorated(): AbstractStockStorage { return $this->decorated; }
    public function load(StockLoadRequest $stockRequest, SalesChannelContext $context): StockDataCollection
    {
        $ids = $stockRequest->productIds; // query your API with these
        return new StockDataCollection([new StockData('product-1', 5, true)]);
    }
    public function alter(array $changes, Context $context): void { $this->decorated->alter($changes, $context); }
    public function index(array $productIds, Context $context): void { $this->decorated->index($productIds, $context); }
}
```

2. In `src/Resources/config/services.php`, register it with `->decorate(StockStorage::class)` and `->args([service('.inner')])`, using `Shopware\Core\Content\Product\Stock\StockStorage`.
3. Build each entry with the constructor or with `\Shopware\Core\Content\Product\Stock\StockData::fromArray([...])`:

| Attribute | Type | Required |
|---|---|---|
| `productId` | string | yes |
| `stock` | int | yes |
| `available` | bool | yes |
| `minPurchase` | int | no |
| `maxPurchase` | int | no |
| `isCloseout` | bool | no |

4. To attach arbitrary data, call `$stockData->addArrayExtension('extraData', ['foo' => 'bar'])`.
5. Read the data back from a loaded product with `$product->getExtension('stock_data')`.

## Essential identifiers

- `\Shopware\Core\Content\Product\Stock\AbstractStockStorage::load()`
- `Shopware\Core\Content\Product\Stock\StockStorage` (service to decorate)
- `StockLoadRequest::$productIds`
- `StockDataCollection`, `StockData`, `StockData::fromArray()`
- product extension `stock_data`

## Gotchas

- The docs name `Shopware\Core\Content\Product\Stock::fromArray()`. That class does not exist. The static factory is `StockData::fromArray()`.
- `fromArray()` does not copy an `extraData` key, even though its PHPDoc shape lists one. Attach extra data with `addArrayExtension()` instead.
- `LoadProductStockSubscriber` overwrites `stock` and `available` on the product. It overwrites `minPurchase`/`maxPurchase`/`isCloseout` only when they are non-null and keeps the product's own value otherwise. Products missing from the collection are left alone.
- `stock_data` holds the `StockData` object itself, not a plain array.
- The core `StockStorage::load()` returns an empty collection, so forwarding to the inner service adds no data.
- `load` runs on the sales channel product loaded and partial-loaded events and in `AvailableCombinationLoader`. It does not run for plain repository reads.

## Code check (6.7.15.1)
- confirmed `AbstractStockStorage::load()` — abstract; signature as in docs — vendor/shopware/core/Content/Product/Stock/AbstractStockStorage.php:24
- confirmed `StockLoadRequest::$productIds` — public array property — vendor/shopware/core/Content/Product/Stock/StockLoadRequest.php:13
- corrected `StockData::fromArray()` — docs: static method `Shopware\Core\Content\Product\Stock::fromArray()`; it lives on StockData, with productId/stock/available required — vendor/shopware/core/Content/Product/Stock/StockData.php:24
- confirmed `StockData::$isCloseout` — nullable optional constructor arg, like minPurchase/maxPurchase — vendor/shopware/core/Content/Product/Stock/StockData.php:17
- confirmed `StockDataCollection` — constructor takes array of StockData keyed by productId — vendor/shopware/core/Content/Product/Stock/StockDataCollection.php:8
- confirmed `stock_data` — StockData added as product extension — vendor/shopware/core/Content/Product/Stock/LoadProductStockSubscriber.php:58
- confirmed `LoadProductStockSubscriber::salesChannelLoaded()` — calls load on sales-channel product loads — vendor/shopware/core/Content/Product/Stock/LoadProductStockSubscriber.php:33
- confirmed `StockStorage::load()` — core returns empty StockDataCollection — vendor/shopware/core/Content/Product/Stock/StockStorage.php:35
- confirmed `addArrayExtension` — available on structs via ExtendableTrait — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:32
