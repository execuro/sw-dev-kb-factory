---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/reading-writing-stock.md
title: Reading and Writing Stock
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/reading-writing-stock.html
sourceHash: 5a472bf46b9b55d94b63bc0c343ebbf56374dfca
codeCheckedAgainst: "6.7.15.1"
keywords: ["product.stock", "stock", "getStock", "EntityRepository", "product.repository", "availableStock", "available_stock", "AvailableStockMirrorSubscriber", "read stock", "update stock", "inventory level", "stock quantity"]
summary: Read and write a product's current stock level through the product.stock field via the product EntityRepository (getStock() / update with 'stock').
lastBuilt: 2026-10-21
---
## What it is

Shopware stores the current stock level on the product itself. Use the `product.stock` field both to read and to write it. The docs describe it as the real-time value of the available product stock.

## When to use

An extension needs to query a product's stock or set a new stock level, for example during an import or a sync job.

## Key steps / config

Inject the product `EntityRepository` (`Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`) into your service.

Read the stock:

```php
$product = $this->productRepository
    ->search(new Criteria([$productId]), $context)
    ->first();
$stock = $product->getStock();
```

Write the stock with a plain DAL update of the `stock` field:

```php
$this->productRepository->update(
    [['id' => $productId, 'stock' => $stock]],
    $context
);
```

Classes used: `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`, `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`, `Shopware\Core\Framework\Context`.

## Essential identifiers

- `product.stock` (`IntField('stock', 'stock')`, required)
- `ProductEntity::getStock()`
- `EntityRepository::search()` / `EntityRepository::update()`
- `Criteria`

## Gotchas

- `availableStock` (`available_stock`) is write-protected and cannot be written directly. On every product insert or stock write in the live version, `AvailableStockMirrorSubscriber` copies the written `stock` into `available_stock`.
- After a product write, `ProductIndexer` calls the stock storage `index()`, which recalculates the `available` flag from stock, closeout and min purchase. `available` is write-protected too.
- The source's read snippet uses `$productId` without defining it. Pass the ID into the method.

## Code check (6.7.15.1)
- confirmed `product.stock` — IntField `stock`, ApiAware and Required — vendor/shopware/core/Content/Product/ProductDefinition.php:181
- confirmed `ProductEntity::getStock()` — returns int — vendor/shopware/core/Content/Product/ProductEntity.php:411
- confirmed `availableStock` — IntField marked WriteProtected — vendor/shopware/core/Content/Product/ProductDefinition.php:180
- confirmed `available_stock` — mirrored from written stock payload — vendor/shopware/core/Content/Product/Stock/AvailableStockMirrorSubscriber.php:28
- confirmed `available` — BoolField marked WriteProtected — vendor/shopware/core/Content/Product/ProductDefinition.php:178
- confirmed `stockStorage->index` — ProductIndexer recalculates availability after product writes — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:121
