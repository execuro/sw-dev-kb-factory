---
id: platform/dev/6.7/guides/plugins/plugins/content/stock/reading-writing-stock.md
title: Reading and Writing Stock
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/stock/reading-writing-stock.html
sourceHash: 5a472bf46b9b55d94b63bc0c343ebbf56374dfca
codeCheckedAgainst: "6.7.13.0"
keywords: ["product.stock", "stock", "getStock", "availableStock", "available_stock", "EntityRepository", "product repository", "Criteria", "update stock", "read stock", "inventory level", "product stock field"]
summary: Read a product's current stock via product.stock (ProductEntity::getStock()) and write it with the product repository update() using the stock field.
lastBuilt: 2026-09-15
---
## What it is

Shopware 6.7 stores the current stock level on the product. This page shows which field to use when a plugin reads or writes that value: `product.stock`, accessed through the product `EntityRepository`.

## When to use

- An extension needs to query a product's current stock level.
- An extension needs to set a product's stock (e.g. an import or sync job).

## Key steps / config

Reading — search the product repository and call `getStock()` on the entity:

```php
$product = $this->productRepository
    ->search(new Criteria([$productId]), $context)
    ->first();
$stock = $product->getStock();
```

Writing — update the `stock` field through the repository:

```php
$this->productRepository->update(
    [['id' => $productId, 'stock' => $stock]],
    $context
);
```

Both examples inject `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` (the product repository) and use `Shopware\Core\Framework\Context` and `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`.

## Essential identifiers

- `product.stock` (entity field `stock`, column `stock`)
- `ProductEntity::getStock()`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` (`search`, `update`)
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`

## Gotchas

- Use `product.stock` for both reads and writes; the source describes it as the real-time value of available stock.
- `stock` is flagged `Required` in `ProductDefinition`, so product creation must supply it.
- `availableStock` (`available_stock`) and `available` are `WriteProtected`; on live-version writes that include `stock`, `AvailableStockMirrorSubscriber` copies the new `stock` value into `available_stock`.
- The source's reading sample uses `$productId` without declaring it as a method parameter — pass the ID in when adapting it.

## Code check (6.7.13.0)
- confirmed `stock` — IntField, ApiAware and Required on product — vendor/shopware/core/Content/Product/ProductDefinition.php:180
- confirmed `ProductEntity::getStock()` — returns int — vendor/shopware/core/Content/Product/ProductEntity.php:387
- confirmed `availableStock` — IntField, WriteProtected — vendor/shopware/core/Content/Product/ProductDefinition.php:179
- confirmed `available` — BoolField, WriteProtected — vendor/shopware/core/Content/Product/ProductDefinition.php:177
- confirmed `AvailableStockMirrorSubscriber` — mirrors stock payload into available_stock on live-version writes — vendor/shopware/core/Content/Product/Stock/AvailableStockMirrorSubscriber.php:17
- confirmed `EntityRepository::search()` — Criteria and Context — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:62
- confirmed `EntityRepository::update()` — array data and Context — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:99
