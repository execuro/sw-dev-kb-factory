---
id: platform/dev/6.7/guides/development/troubleshooting/phpstan.md
title: PHPStan
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/phpstan.html
sourceHash: fdcd6694fc737a3173c4dbf190fd2e657d8476e5
codeCheckedAgainst: "6.7.13.0"
keywords: ["phpstan", "EntityRepository", "EntityCollection", "EntitySearchResult", "getEntities", "@extends", "generics", "static analysis", "null safety", "ProductCollection", "getExpectedClass", "template type"]
summary: "PHPStan fixes for DAL code - EntityRepository<ProductCollection> generics, @extends EntityCollection<FooEntity>, null-safe first() and associations."
lastBuilt: 2026-09-15
---
## What it is

Fixes for common PHPStan issues in Shopware extensions: typing DAL repositories and collections with generics, and handling nullable results and associations.

## When to use

When PHPStan reports "Call to an undefined method ...Entity::getName()" on repository results, "Cannot call method ... on ...|null", or loses the element type of a custom `EntityCollection`.

## Key steps / config

1. Type the repository with the collection class (not the entity class). `EntityRepository` is declared `@template TEntityCollection of EntityCollection`:

```php
/**
 * @param EntityRepository<ProductCollection> $productRepository
 */
public function __construct(
    private readonly EntityRepository $productRepository,
) {
}
// $this->productRepository->search($criteria, $context)->getEntities() is ProductCollection
```

2. Load associations explicitly and null-check results and associations:

```php
$criteria = new Criteria([$productId]);
$criteria->addAssociation('manufacturer');

$product = $this->productRepository->search($criteria, $context)->getEntities()->first();
if ($product === null) {
    throw new ProductNotFoundException($productId);
}
$manufacturer = $product->getManufacturer(); // ?ProductManufacturerEntity
if ($manufacturer === null) { /* not loaded or not set */ }
```

Or null-safe: `$product?->getManufacturer()?->getName() ?? 'Unknown'`.

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

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` (`@template TEntityCollection of EntityCollection`)
- `Shopware\Core\Framework\DataAbstractionLayer\EntityCollection` (`@template TElement of Entity`)
- `EntitySearchResult::getEntities()`
- `EntityCollection::getExpectedClass()`
- `ProductCollection`, `ProductEntity::getManufacturer()`
- `Criteria::addAssociation()`

## Gotchas

- The generic parameter of `EntityRepository` is the collection (`EntityRepository<ProductCollection>`), unlike other repository libraries that use the entity class; this is how PHPStan learns the type returned by `search()`.
- Without `@extends EntityCollection<FooEntity>`, `first()` is typed as the base `Shopware\Core\Framework\DataAbstractionLayer\Entity`; the default `getExpectedClass()` also falls back to `Entity::class`.
- Associations are `null` when not added to the criteria, so getters like `getManufacturer()` are nullable.
- The docs call `first()` directly on the search result; `EntitySearchResult::first()` is deprecated for 6.8 — call `getEntities()->first()`.
- The docs throw `new ProductNotFoundException()` without arguments; the installed constructor requires the product id string. `ManufacturerNotLoadedException` in the docs is an example class, not a core class.

## Version notes

- 6.8 (announced in 6.7 code): `EntitySearchResult` will no longer extend `EntityCollection` (it keeps extending `Struct`), and its collection methods such as `first()` are deprecated in favour of `getEntities()`.

## Code check (6.7.13.0)
- confirmed `EntityRepository` — @template TEntityCollection of EntityCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:33
- confirmed `EntityRepository::search()` — returns EntitySearchResult<TEntityCollection> — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:62
- confirmed `EntitySearchResult::getEntities()` — returns TEntityCollection — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:109
- deprecated `EntitySearchResult::first()` — tag v6.8.0, use getEntities()->first() — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:374
- confirmed `EntityCollection` — @template TElement of Entity — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCollection.php:14
- confirmed `EntityCollection::getExpectedClass()` — defaults to Entity::class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCollection.php:252
- confirmed `ProductCollection` — @extends EntityCollection<TElement>, TElement of ProductEntity — vendor/shopware/core/Content/Product/ProductCollection.php:11
- confirmed `ProductEntity::getManufacturer()` — returns ?ProductManufacturerEntity — vendor/shopware/core/Content/Product/ProductEntity.php:653
- corrected `ProductNotFoundException` — docs: constructed without arguments; constructor requires string $productId — vendor/shopware/core/Content/Product/Exception/ProductNotFoundException.php:16
- unverified `ManufacturerNotLoadedException` — docs example class, not found in vendor/shopware/core
