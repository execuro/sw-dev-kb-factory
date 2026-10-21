---
id: platform/dev/6.7/guides/development/troubleshooting/phpstan.md
title: PHPStan
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/phpstan.html
sourceHash: fdcd6694fc737a3173c4dbf190fd2e657d8476e5
codeCheckedAgainst: "6.7.15.1"
keywords: ["phpstan", "static analysis", "generics", "EntityRepository", "EntityCollection", "ProductCollection", "EntitySearchResult", "getEntities", "@extends", "null safety", "addAssociation", "getExpectedClass"]
summary: Fixing common PHPStan errors in Shopware DAL code - generic repository/collection docblocks and null checks for single results and associations.
lastBuilt: 2026-10-21
---
## What it is

Fixes for the most common PHPStan errors in Shopware plugin code: missing generic types on DAL repositories and collections, and missing null handling for single results and associations.

## When to use

When PHPStan reports errors such as `Call to an undefined method Shopware\Core\Framework\DataAbstractionLayer\Entity::getName()` or `Cannot call method getManufacturer() on Shopware\Core\Content\Product\ProductEntity|null`.

## Key steps / config

1. Type the injected repository with the **collection** class as generic parameter:

```php
/**
 * @param EntityRepository<ProductCollection> $productRepository
 */
public function __construct(
    private readonly EntityRepository $productRepository,
) {
}
```

`search($criteria, $context)->getEntities()` then returns a `ProductCollection`, and iterating it yields `ProductEntity`.

2. Load associations explicitly and null-check every nullable result:

```php
$criteria = new Criteria();
$criteria->addAssociation('manufacturer');
$product = $this->productRepository->search($criteria, $context)->getEntities()->first();
if ($product === null) { throw new ProductNotFoundException(); }
$manufacturer = $product->getManufacturer();
if ($manufacturer === null) { throw new ManufacturerNotLoadedException(); }
```

Alternative: `$product?->getManufacturer()?->getName() ?? 'Unknown'`.

3. Give custom collections a generic type:

```php
/**
 * @extends EntityCollection<FooEntity>
 */
class FooCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return FooEntity::class;
    }
}
```

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` — `@template TEntityCollection of EntityCollection`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityCollection` — `@template TElement of Entity`
- `EntitySearchResult::getEntities()` — returns `TEntityCollection`
- `Criteria::addAssociation()`
- `ProductEntity::getManufacturer()` — returns `?ProductManufacturerEntity`

## Gotchas

- `EntityRepository` is generic over the collection class (`EntityRepository<ProductCollection>`), not over the entity class as many other repository libraries are.
- Associations are `null` unless added to the criteria, and a collection's `first()` returns `null` when empty — PHPStan is right to complain.
- The source calls `first()` directly on the search result; `EntitySearchResult::first()` is deprecated for v6.8.0 — use `getEntities()->first()`.

## Code check (6.7.15.1)
- confirmed `EntityRepository` — generic `@template TEntityCollection of EntityCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
- confirmed `EntityCollection` — generic `@template TElement of Entity` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCollection.php:14
- confirmed `EntityCollection::getExpectedClass()` — protected, overridable — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCollection.php:252
- confirmed `EntitySearchResult::getEntities()` — `@return TEntityCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:97
- deprecated `EntitySearchResult::first()` — removed in v6.8.0, use `getEntities()->first()` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:357
- confirmed `Collection::first()` — `@return TElement|null` — vendor/shopware/core/Framework/Struct/Collection.php:207
- confirmed `ProductCollection` — `@extends EntityCollection<TElement>` of ProductEntity — vendor/shopware/core/Content/Product/ProductCollection.php:16
- confirmed `ProductEntity::getManufacturer()` — returns `?ProductManufacturerEntity` — vendor/shopware/core/Content/Product/ProductEntity.php:677
- confirmed `Criteria::addAssociation()` — takes a string path — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:333
- unverified `ProductNotFoundException` — example exception from the docs, not checked
