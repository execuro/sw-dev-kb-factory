---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/deleting-associated-data.md
title: Removing Associated Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/deleting-associated-data.html
sourceHash: 62fb9e804ce625da94c3dcd061339216b56a029b
codeCheckedAgainst: "6.7.15.1"
keywords: ["remove association", "unassign", "delete mapping", "ManyToOne", "OneToOne", "ManyToMany", "OneToMany", "EntityRepository::delete", "ProductCategoryDefinition", "ProductMediaDefinition", "product_media.repository", "manufacturerId"]
summary: "Removing DAL associations: null the FK for ToOne, delete mapping rows by primary keys for ManyToMany and product_media."
lastBuilt: 2026-10-21
---
## What it is

How to remove the link between two DAL entities (not the associated entity itself), split by association type: ToOne, ManyToMany, and OneToMany (plain vs. hidden ManyToMany with extra mapping data).

## When to use

You need to unassign e.g. a manufacturer, a category or a media item from a product via the DAL repositories. Removing an association without replacement only works if it is **not** required: a product's `taxId` cannot be removed because a product always needs a tax.

## Key steps / config

**ToOne (`OneToOne`, `ManyToOne`)** — set the FK field to `null` via `update()` on the owning repository:

```php
$this->productRepository->update([
    ['id' => 'myProductId', 'manufacturerId' => null],
], $context);
```

**ManyToMany** — call `delete()` on the mapping entity's repository and pass *all* its primary keys. `ProductCategoryDefinition` has `productId` and `categoryId`:

```php
$this->productCategoryRepository->delete([
    ['productId' => 'myProductId', 'categoryId' => 'myCategoryId'],
], $context);
```

**OneToMany** — first decide which kind it is:
- Plain OneToMany (the other side of a ManyToOne, e.g. manufacturer → products): work on the *many* side's repository and null the FK, exactly as in the ToOne case (`manufacturerId => null` on the product).
- Hidden ManyToMany (mapping entity with extra data and its own `id`, e.g. product `media` → `ProductMediaDefinition`): treat it as ManyToMany, but delete via the mapping repository (`product_media.repository`) using its single `id` primary key. Look the id up first:

```php
$criteria = new Criteria();
$criteria->addFilter(new EqualsFilter('productId', 'myProductId'));
$criteria->addFilter(new EqualsFilter('mediaId', 'myMediaId'));
$id = $this->productMediaRepository->searchIds($criteria, $context)->firstId();
$this->productMediaRepository->delete([['id' => $id]], $context);
```

## Essential identifiers

- `EntityRepository::update()`, `EntityRepository::delete()`, `EntityRepository::searchIds()`, `IdSearchResult::firstId()`
- `ProductCategoryDefinition` (primary keys `productId`, `categoryId`)
- `ProductMediaDefinition` (`product_media`, primary key `id`)
- `product_media.repository`

## Gotchas

- `delete()` always needs the entity's primary key(s) in the data array; check the mapping definition to see which fields are primary keys.
- Nulling `manufacturerId` on a variant that inherits from a parent does not unset the parent's manufacturer.
- Deleting a `product_media` row removes only the product–media link, not the media entity.
- In 6.7.15.1 `ProductCategoryDefinition` also flags the two reference-version fields as primary keys; the guide's example passes only `productId` and `categoryId`.

## Code check (6.7.15.1)
- confirmed `manufacturerId` — FkField on product without Required flag, so removable — vendor/shopware/core/Content/Product/ProductDefinition.php:158
- confirmed `taxId` — FkField flagged Required, cannot be nulled — vendor/shopware/core/Content/Product/ProductDefinition.php:161
- confirmed `media` — OneToManyAssociationField to ProductMediaDefinition — vendor/shopware/core/Content/Product/ProductDefinition.php:254
- confirmed `productId` — PrimaryKey FkField of the product_category mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:42
- confirmed `categoryId` — PrimaryKey FkField of the product_category mapping — vendor/shopware/core/Content/Product/Aggregate/ProductCategory/ProductCategoryDefinition.php:45
- confirmed `ProductMediaDefinition::ENTITY_NAME` — 'product_media' — vendor/shopware/core/Content/Product/Aggregate/ProductMedia/ProductMediaDefinition.php:30
- confirmed `id` — single IdField primary key of product_media — vendor/shopware/core/Content/Product/Aggregate/ProductMedia/ProductMediaDefinition.php:65
- confirmed `EntityRepository::delete()` — takes array of primary-key arrays — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:154
- confirmed `EntityRepository::searchIds()` — returns IdSearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:97
- confirmed `IdSearchResult::firstId()` — returns ?string — vendor/shopware/core/Framework/DataAbstractionLayer/Search/IdSearchResult.php:68
