---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/deleting-associated-data.md
title: Removing associated data
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/deleting-associated-data.html
sourceHash: 529f0946ae91b69b06be4a481b6875622f685eaa
keywords: ["productRepository", "delete", "update", "manufacturerId", "ProductCategoryDefinition", "ProductManufacturerDefinition", "ProductMediaDefinition", "EqualsFilter", "searchIds", "OneToMany", "ManyToMany", "ToOne association"]
summary: "How to remove ToOne, ManyToMany and OneToMany associations, including hidden ManyToMany-as-OneToMany cases like product media."
lastBuilt: "2026-09-15"
---
## What it is

Guide on removing associations between entities, covering `ToOne`, `ManyToMany` and `OneToMany` cases, without deleting the associated entity itself.

## When to use

When an association (not the target entity) needs to be removed, and the field is not required.

## Key steps / config

**ToOne (`OneToOne`/`ManyToOne`):** set the foreign key field to `null` via the owning repository:

```php
$this->productRepository->update([
    ['id' => 'myProductId', 'manufacturerId' => null]
], $context);
```

**ManyToMany:** call `delete()` on the mapping repository with both primary keys:

```php
$this->productCategoryRepository->delete([
    ['productId' => 'myProductId', 'categoryId' => 'myCategoryId']
], $context);
```

**OneToMany:** first determine whether it is a genuine `OneToMany` (reverse of a `ManyToOne`, deleted the same way as `ToOne` above) or a hidden `ManyToMany` with extra mapping data (e.g. product media). For the hidden case, look up the mapping entity's own `id` first, then delete by that `id`:

```php
$criteria = new Criteria();
$criteria->addFilter(new EqualsFilter('productId', 'myProductId'));
$criteria->addFilter(new EqualsFilter('mediaId', 'myMediaId'));
$productMediaId = $this->productMediaRepository->searchIds($criteria, $context)->firstId();
$this->productMediaRepository->delete([['id' => $productMediaId]], $context);
```

## Essential identifiers

- `EntityRepository::update()` / `EntityRepository::delete()` / `EntityRepository::searchIds()`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter`
- Mapping repositories, e.g. `product_media.repository`, `product_category.repository` (referenced conceptually)
- `ProductCategoryDefinition`, `ProductManufacturerDefinition`, `ProductMediaDefinition`

## Gotchas

Deletion is only possible for associations that are not required (e.g. `manufacturerId` on a product can be null, but `taxId` cannot). If a product inherits from a parent product, removing an association on the child does not remove it from the parent. Deleting a `ManyToMany` or hidden-`ManyToMany` association only removes the link, never the target entity itself (e.g. removing a product-media link does not delete the media).
