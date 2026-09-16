---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md
title: Replacing associated data
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/replacing-associated-data.html
sourceHash: b0e5d1e0ab0654662454b117ab3464922d269e5a
keywords: ["replacing associated data", "ToMany association", "ManyToMany", "OneToMany", "OneToOne", "ManyToOne", "product_category.repository", "ProductCategoryDefinition", "delete method", "update method", "categories"]
summary: "Shows why an update call alone does not replace ToMany associations, and how to delete the old association row first before assigning the new one."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to correctly replace a `ToMany` association (e.g. a product's category) using the DAL, since a plain `update` call only adds data rather than replacing it.

## When to use
Use when an entity has an existing `ManyToMany` or `OneToMany` association and you need to swap it for a different one (not just add another).

## Key steps / config
1. Wrong approach: calling `update` with a new `categories` array does **not** remove the old association — it results in two categories assigned:
```php
$this->productRepository->update([[
    'id' => 'myProductId',
    'categories' => [['id' => 'newCategoryId']]
]], $context);
```
2. Correct approach: inject the mapping entity's repository (e.g. `product_category.repository`, found via the definition's `getEntityName` method, e.g. `ProductCategoryDefinition`) alongside `product.repository`:
```xml
<service id="Swag\BasicExample\Service\ReplacingData">
    <argument type="service" id="product.repository"/>
    <argument type="service" id="product_category.repository"/>
</service>
```
3. Delete the old association row first:
```php
$this->productCategoryRepository->delete([[
    'productId' => $productId,
    'categoryId' => 'oldCategoryId'
]], $context);
```
4. Then `update` the product with the new category ID.
5. This applies to both `ManyToMany` and `OneToMany` associations.
6. `ToOne` associations (`OneToOne`/`ManyToOne`) can be replaced directly via a plain `update` call (e.g. setting `taxId` to a new value) since there is no mapping table.

## Essential identifiers
- `product.repository`, `product_category.repository`
- `ProductCategoryDefinition` (`getEntityName()`)
- `EntityRepository::delete()`, `EntityRepository::update()`

## Gotchas
- Writing new associated data via `update` never deletes the old association; it only appends.
- Deleting the mapping-table row requires the composite key fields of the mapping entity (e.g. `productId` + `categoryId`), not the mapping row's own generated ID.
