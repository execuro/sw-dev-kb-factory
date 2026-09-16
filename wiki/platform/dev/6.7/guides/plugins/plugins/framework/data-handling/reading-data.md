---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md
title: Reading Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/reading-data.html
sourceHash: 2b6f43684351331a4767a3df23e298f3501b2e46
codeCheckedAgainst: "6.7.13.0"
keywords: ["read data", "dal", "EntityRepository", "product.repository", "Criteria", "EqualsFilter", "OrFilter", "RangeFilter", "addPostFilter", "addAssociation", "AvgAggregation", "FieldSorting", "RepositoryIterator", "searchIds", "pagination"]
summary: "DAL reads: inject entity_name.repository, build Criteria with filters, associations, aggregations, paging, sorting; batch large sets with RepositoryIterator."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md"]
---
## What it is

How to fetch data in a plugin or core contribution through Shopware's Data Abstraction Layer (DAL) — Shopware uses no ORM. Reads go through the generated repository of each entity and a `Criteria` object carrying IDs, filters, associations, aggregations, paging and sorting. Background: [Data abstraction layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md).

## When to use

Any service, controller or subscriber that loads entities (products, orders, …), filters them, aggregates values, or walks very large data sets in batches.

## Key steps / config

1. **Inject the repository.** Service id pattern `entity_name.repository` (e.g. `product.repository`, `order.repository`), typed as `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`:

```php
$services->set(ReadingData::class)
    ->args([service('product.repository')]);
```

2. **Search.** Imports `Shopware\Core\Framework\Context` and `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`. `search()` returns a result wrapper; take the entity collection from it with `getEntities()`:

```php
$products = $this->productRepository->search(new Criteria(), $context)->getEntities();
$product = $this->productRepository->search(new Criteria([$myId]), $context)->getEntities()->first(); // null if none
```

3. **Filter.** `$criteria->addFilter(new EqualsFilter('name', 'Example name'))`; combine with `new OrFilter([...])` (also `AndFilter`, `NandFilter`). `addPostFilter(...)` filters the result without affecting aggregations. Classes: `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter`, `...\Filter\OrFilter`, `...\Filter\RangeFilter`. Field names come from the entity definition (e.g. `ProductDefinition`); all filters: [filters reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md).
4. **Associations.** `addAssociation('productReviews')`, chainable as `addAssociation('productReviews.customer')`. `getAssociation('productReviews')` returns the association's own `Criteria`; `->addFilter(new RangeFilter('points', [RangeFilter::GTE => 4]))` there limits only which reviews get attached. A root filter on `productReviews.points` instead limits which products are returned.
5. **Aggregations.** `addAggregation(new AvgAggregation('avg-rating', 'productReviews.points'))`, then `->getAggregations()->get('avg-rating')` on the search result. Class: `Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\AvgAggregation`; see [aggregations reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md).
6. **Limit, offset, sorting.** `setLimit(1)`, `setOffset(1)`, `addSorting(new FieldSorting('createdAt', FieldSorting::ASCENDING))` — `Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting`.
7. **Large sets.** `Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\RepositoryIterator` returns one batch per `fetch()` until `null`:

```php
$criteria = (new Criteria())->setLimit(500);
$criteria->addSorting(new FieldSorting('manufacturerNumber'), new FieldSorting('id'));
$iterator = new RepositoryIterator($this->productRepository, $context, $criteria);
while (($result = $iterator->fetch()) !== null) {
    $products = $result->getEntities();
}
```

## Essential identifiers

- `EntityRepository::search()`, `EntityRepository::searchIds()`
- `Criteria`: `addFilter`, `addPostFilter`, `addAssociation`, `getAssociation`, `addAggregation`, `setLimit`, `setOffset`, `addSorting`
- `EqualsFilter`, `OrFilter`, `AndFilter`, `NandFilter`, `RangeFilter`
- `AvgAggregation`, `FieldSorting`, `RepositoryIterator`

## Gotchas

- Mapping entities of `ManyToMany` associations (e.g. `ProductCategoryDefinition`, `product_category.repository`) cannot be read with `search()`; use `searchIds()`.
- `RepositoryIterator` needs a deterministic sorting (add a unique field such as `id` as secondary sort), otherwise entities repeat or get skipped across batches. Each iteration is a query; do not use it for small sets. Without a limit the iterator sets 50; for auto-increment definitions it adds its own `autoIncrement` sorting.
- The source calls `first()` directly on the `EntitySearchResult` and iterates it as an `EntityCollection`. In 6.7.13.0 that class is marked to stop extending `EntityCollection` in 6.8 and its collection methods are deprecated — call `getEntities()` first.

## Code check (6.7.13.0)
- deprecated `EntitySearchResult` — will no longer extend EntityCollection in v6.8.0 — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:25
- deprecated `EntitySearchResult::first()` — removed in v6.8.0, use getEntities()->first() — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:374
- corrected `EntitySearchResult::getEntities()` — docs: call first() on and iterate the search result directly — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:109
- confirmed `EntityRepository::searchIds()` — returns IdSearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:87
- confirmed `Criteria::addPostFilter()` — variadic Filter arguments — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:294
- confirmed `Criteria::getAssociation()` — returns a nested Criteria — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:240
- confirmed `RangeFilter::GTE` — constant value gte — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/RangeFilter.php:18
- confirmed `FieldSorting::ASCENDING` — constant value ASC — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Sorting/FieldSorting.php:12
- confirmed `AvgAggregation` — in Search/Aggregation/Metric namespace — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/AvgAggregation.php:12
- confirmed `RepositoryIterator` — constructor takes repository, context, optional criteria — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/Common/RepositoryIterator.php:19
