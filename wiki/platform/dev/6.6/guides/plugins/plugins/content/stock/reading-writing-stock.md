---
id: platform/dev/6.6/guides/plugins/plugins/content/stock/reading-writing-stock.md
title: Reading and Writing Stock
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/stock/reading-writing-stock.html
sourceHash: 5a472bf46b9b55d94b63bc0c343ebbf56374dfca
keywords: ["product.stock", "EntityRepository", "Criteria", "stock", "read stock", "write stock", "upsert", "update", "productRepository", "getStock", "DataAbstractionLayer", "stock level"]
summary: "Read a product's real-time stock via the product.stock field and write it back through the product repository's update method."
lastBuilt: "2026-09-15"
---
## What it is

Short guide on how to read and write a product's current stock level, which Shopware stores alongside the product.

## When to use

When an extension needs to query or change a product's stock value.

## Key steps / config

Reading stock via the product repository:

```php
$product = $this->productRepository
    ->search(new Criteria([$productId]), $context)
    ->first();

$stock = $product->getStock();
```

Writing stock via the product repository:

```php
$this->productRepository->update(
    [[ 'id' => $productId, 'stock' => $stock ]],
    $context
);
```

Both examples use `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` and `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`.

## Essential identifiers

- `product.stock` field
- `EntityRepository::search()` / `EntityRepository::update()`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`
- `ProductEntity::getStock()`

## Gotchas

`product.stock` is always a real-time calculated value, so it should be used whenever extensions need to query a product's stock rather than relying on a cached value.
