---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md
title: Replacing Associated Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/replacing-associated-data.html
sourceHash: 740ec3d304583c64e6b6ec6cf597aad302bb3b94
codeCheckedAgainst: "6.7.15.1"
keywords: ["product_category.repository", "ProductCategoryDefinition", "ManyToMany", "OneToMany", "EntityRepository", "delete", "update", "replace association", "remove category from product", "mapping entity", "taxId"]
summary: Replacing ToMany associations in the DAL - delete the mapping entry (e.g. product_category) first, then update; ToOne is replaced by updating the FK.
lastBuilt: 2026-10-21
---
## What it is

How to replace associated `ToMany` data (e.g. swap a product's category) with the Data Abstraction Layer. A write operation never removes existing association entries; it only adds to them.

## When to use

You assigned the wrong entity to a `ManyToMany` or `OneToMany` association and want the old one removed and a new one assigned, or you need to change a `OneToOne`/`ManyToOne` reference such as a product's tax.

## Key steps / config

1. Inject both the owning repository and the mapping entity's repository. The mapping repository id comes from the mapping definition's `getEntityName()` — for product categories `ProductCategoryDefinition` uses `product_category`:
   ```php
   $services->set(ReplacingData::class)
       ->args([
           service('product.repository'),
           service('product_category.repository'),
       ]);
   ```
2. Delete the old mapping row by its composite primary key:
   ```php
   $this->productCategoryRepository->delete([
       ['productId' => $productId, 'categoryId' => 'oldCategoryId'],
   ], $context);
   ```
3. Assign the new entity via `update`:
   ```php
   $this->productRepository->update([
       ['id' => $productId, 'categories' => [['id' => 'newCategoryId']]],
   ], $context);
   ```
4. `ToOne` associations (`OneToOne`, `ManyToOne`): just `update` the foreign key, e.g. `['id' => 'myProductId', 'taxId' => 'newTaxId']`.

## Essential identifiers

- `product_category.repository`, `product.repository`
- `Shopware\Core\Content\Product\Aggregate\ProductCategory\ProductCategoryDefinition`
- `EntityRepository::delete()`, `EntityRepository::update()`
- Mapping fields `productId`, `categoryId`; association `categories`; FK `taxId`

## Gotchas

- Calling `update` with only the new `categories` entry does not remove the old one — the product ends up with both categories.
- The delete-then-update approach applies to both `ManyToMany` and `OneToMany` associations.

## Code check (6.7.15.1)
- confirmed `ProductCategoryDefinition::ENTITY_NAME` — `product_category`, extends `MappingEntityDefinition` — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:22
- confirmed `productId` — FK field with `PrimaryKey` flag on the mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:42
- confirmed `categoryId` — FK field with `PrimaryKey` flag on the mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:45
- confirmed `categories` — `ManyToManyAssociationField` via `ProductCategoryDefinition` — vendor/shopware/core/Content/Product/ProductDefinition.php:280
- confirmed `taxId` — `FkField` on product — vendor/shopware/core/Content/Product/ProductDefinition.php:161
- confirmed `EntityDefinition::getEntityName()` — abstract, source of the repository id — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityRepository::delete()` — takes array of primary-key arrays — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:154
- confirmed `EntityRepository::update()` — returns `EntityWrittenContainerEvent` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:112
