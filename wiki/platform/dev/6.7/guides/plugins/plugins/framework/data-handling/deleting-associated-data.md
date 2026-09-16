---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/deleting-associated-data.md
title: Removing Associated Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/deleting-associated-data.html
sourceHash: 62fb9e804ce625da94c3dcd061339216b56a029b
codeCheckedAgainst: "6.7.13.0"
keywords: ["ProductCategoryDefinition", "ProductMediaDefinition", "ProductManufacturerDefinition", "product_media.repository", "manufacturerId", "EqualsFilter", "Criteria", "delete association", "unassign category", "remove manufacturer", "mapping entity", "ManyToMany", "OneToMany"]
summary: "Remove DAL associations: null the FK for ToOne, delete mapping rows by primary keys for ManyToMany, or by id for OneToMany mapping entities."
lastBuilt: 2026-09-15
---
## What it is

How to remove the link between entities via the DAL (not the associated entity itself), with the approach depending on association type: ToOne, ManyToMany, or OneToMany (plain or a "hidden" ManyToMany with its own mapping entity).

## When to use

You need to unassign a manufacturer, category, media etc. from a product (or equivalent on other entities) from plugin code. Removing without replacement is only possible when the association is **not** required — e.g. a product's `taxId` cannot be removed.

## Key steps / config

**ToOne (`OneToOne` / `ManyToOne`)** — update the owning entity and set the FK property to `null`:

```php
$this->productRepository->update([
    ['id' => 'myProductId', 'manufacturerId' => null],
], $context);
```

**ManyToMany** — call `delete` on the mapping entity's repository, passing all its primary keys (see the mapping definition):

```php
$this->productCategoryRepository->delete([
    ['productId' => 'myProductId', 'categoryId' => 'myCategoryId'],
], $context);
```

**OneToMany, plain** — it is the inverse of a ManyToOne; update the "many" side instead (e.g. `ProductManufacturerDefinition` → products: set the product's `manufacturerId` to `null` via the product repository).

**OneToMany hiding a ManyToMany** (mapping entity with extra data and its own `id`, e.g. product `media` → `ProductMediaDefinition`) — look up the mapping row id, then delete by `id` on `product_media.repository`:

```php
$criteria = new Criteria();
$criteria->addFilter(new EqualsFilter('productId', 'myProductId'));
$criteria->addFilter(new EqualsFilter('mediaId', 'myMediaId'));
$productMediaId = $this->productMediaRepository->searchIds($criteria, $context)->firstId();
$this->productMediaRepository->delete([['id' => $productMediaId]], $context);
```

## Essential identifiers

- `ProductCategoryDefinition` (primary keys `productId` + `categoryId`)
- `ProductMediaDefinition` (primary key `id`), `product_media.repository`
- `ProductManufacturerDefinition`, product field `manufacturerId`
- `Criteria`, `EqualsFilter`, `searchIds(...)->firstId()`, repository `update` / `delete`

## Gotchas

- If a product inherits from a parent, nulling `manufacturerId` on the variant does not unset it on the parent.
- Deleting a `product_media` row removes only the assignment, not the media entity.
- `delete` always needs every primary key of the target definition; for `ProductCategoryDefinition` the installed definition also lists reference version fields as primary keys alongside `product_id`/`category_id`.

## Code check (6.7.13.0)
- confirmed `ProductCategoryDefinition` — extends MappingEntityDefinition — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:17
- confirmed `productId` — FkField flagged PrimaryKey in the mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:39
- confirmed `categoryId` — FkField flagged PrimaryKey in the mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:42
- confirmed `ProductMediaDefinition` — regular EntityDefinition with its own id primary key — vendor/shopware/core/Content/Product/Aggregate/ProductMedia/ProductMediaDefinition.php:25
- confirmed `manufacturerId` — FkField without Required flag — vendor/shopware/core/Content/Product/ProductDefinition.php:158
- confirmed `taxId` — FkField flagged Required — vendor/shopware/core/Content/Product/ProductDefinition.php:161
- confirmed `media` — product OneToManyAssociationField to ProductMediaDefinition — vendor/shopware/core/Content/Product/ProductDefinition.php:251
- confirmed `categories` — product ManyToManyAssociationField via ProductCategoryDefinition — vendor/shopware/core/Content/Product/ProductDefinition.php:277
- confirmed `ProductManufacturerDefinition` — has OneToMany products association — vendor/shopware/core/Content/Product/Aggregate/ProductManufacturer/ProductManufacturerDefinition.php:26
- confirmed `product_media.repository` — service id in use — vendor/shopware/core/Content/DependencyInjection/import_export.xml:193
