---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md
sourceHash: 740ec3d304583c64e6b6ec6cf597aad302bb3b94
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/replacing-associated-data.html
title: Replacing Associated Data
version: "6.7"
versions:
  - "6.7"
keywords: ["replacing associated data", "product_category.repository", "ProductCategoryDefinition", "MappingEntityDefinition", "EntityRepository::delete", "EntityRepository::update", "ManyToMany", "OneToMany", "ToOne association", "remove category assignment", "reassign category", "mapping table"]
summary: "Replace ToMany associations via DAL: update() only adds, so delete the mapping row (e.g. product_category.repository) first; ToOne ids change via update()."
lastBuilt: 2026-09-15
---
## What it is

A short guide on replacing associated `ToMany` data (e.g. a product's categories) with the Data Abstraction Layer, and why a plain write does not replace existing assignments.

## When to use

A product (or other entity) has the wrong entity assigned in a `ManyToMany` or `OneToMany` association and you need to swap it for another, or you need to change a `OneToOne`/`ManyToOne` reference such as the product's tax.

## Key steps / config

1. **Do not rely on `update` alone.** Writing `'categories' => [['id' => 'newCategoryId']]` for a product does **not** remove the old category — writes only add data; the product ends up with both categories.
2. **Inject the mapping repository.** Product categories are a `ManyToMany` association with the mapping entity `ProductCategoryDefinition`; its entity name (from `getEntityName`/`ENTITY_NAME`) is `product_category`, so the service id is `product_category.repository`:
   ```php
   $services->set(ReplacingData::class)->args([
       service('product.repository'),
       service('product_category.repository'),
   ]);
   ```
3. **Delete the old mapping by its composite primary key, then add the new one:**
   ```php
   $this->productCategoryRepository->delete([
       ['productId' => $productId, 'categoryId' => 'oldCategoryId'],
   ], $context);
   $this->productRepository->update([
       ['id' => $productId, 'categories' => [['id' => 'newCategoryId']]],
   ], $context);
   ```
   This pattern works for `ManyToMany` and `OneToMany` associations.
4. **ToOne associations** (`OneToOne`/`ManyToOne`) are replaced by a normal `update`, e.g. `['id' => 'myProductId', 'taxId' => 'newTaxId']`.

## Essential identifiers

- `product.repository`, `product_category.repository`
- `ProductCategoryDefinition` (entity `product_category`, keys `productId`, `categoryId`)
- `EntityRepository::delete()`, `EntityRepository::update()`
- product fields `categories`, `taxId`

## Gotchas

- An `update` with a partial association list is additive, not a replace — always delete the obsolete mapping rows explicitly.
- See the writing-data guide for the basics of `update`/`delete` payloads.

## Code check (6.7.13.0)
- confirmed `ProductCategoryDefinition` — extends MappingEntityDefinition — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:17
- confirmed `ProductCategoryDefinition::ENTITY_NAME` — value `product_category` — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:19
- confirmed `productId` — primary-key FkField of the mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:39
- confirmed `categoryId` — primary-key FkField of the mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:42
- confirmed `EntityRepository::update()` — array payload plus Context — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:99
- confirmed `EntityRepository::delete()` — array of ids plus Context — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:141
- confirmed `categories` — product ManyToManyAssociationField via ProductCategoryDefinition — vendor/shopware/core/Content/Product/ProductDefinition.php:277
- confirmed `taxId` — product FkField to TaxDefinition — vendor/shopware/core/Content/Product/ProductDefinition.php:161
