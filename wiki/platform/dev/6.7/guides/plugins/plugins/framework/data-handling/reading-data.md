---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md
title: Reading Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/reading-data.html
sourceHash: c540e9ed773d41a3e9b56b9e30c60b629a779eab
codeCheckedAgainst: "6.7.15.1"
keywords: ["EntityRepository", "Criteria", "EqualsFilter", "OrFilter", "RangeFilter", "addPostFilter", "getAssociation", "AvgAggregation", "FieldSorting", "RepositoryIterator", "setTotalCountMode", "product.repository", "dal search", "read entities", "pagination"]
summary: Reading entities via DAL repositories with Criteria - filters, post filters, associations, aggregations, paging, sorting, count modes, RepositoryIterator.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md"]
---
## What it is

How to read data from the database in a plugin through the Data Abstraction Layer (DAL): inject the auto-generated entity repository, build a `Criteria`, and call `search()`. Covers filters, post filters, associations (incl. filtered associations), aggregations, limit/offset/sorting, total count modes, and batch reading with `RepositoryIterator`. Shopware uses no ORM; the DAL is a thin abstraction layer. See [Data abstraction layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md).

## When to use

Any service, subscriber or controller that needs to fetch entities (products, orders, custom entities) from the database, or iterate over large data sets without exhausting memory.

## Key steps / config

1. Inject the repository. Service id pattern: `<entity_name>.repository`, e.g. `product.repository`, `order.repository`:
   ```php
   $services->set(ReadingData::class)
       ->args([service('product.repository')]);
   // constructor: __construct(EntityRepository $productRepository)
   ```
   Type: `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`.
2. Search: `$this->productRepository->search(new Criteria(), $context)` returns an `EntitySearchResult` (an iterable collection). `$context` (`Shopware\Core\Framework\Context`) is usually passed down from a controller or event. `Criteria` lives in `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`.
3. By IDs: `new Criteria([$myId])` accepts an array of IDs; call `->first()` on the result to get one entity (or `null`).
4. Filters: `$criteria->addFilter(new EqualsFilter('name', 'Example name'))`. Combine with `OrFilter`, `AndFilter`, `NandFilter`, e.g. `new OrFilter([new EqualsFilter('id', ...), new EqualsFilter('name', ...)])`. Available fields come from the entity definition (e.g. `ProductDefinition`).
5. Post filters: `$criteria->addPostFilter(...)` filters the result but not aggregation results.
6. Associations: `$criteria->addAssociation('productReviews')`; chain with dots: `'productReviews.customer'`. To filter loaded association data, use `$criteria->getAssociation('productReviews')->addFilter(new RangeFilter('points', [RangeFilter::GTE => 4]))` — this keeps the parent and only loads matching reviews. A root filter on `productReviews.points` instead returns only products having a matching review.
7. Aggregations: `$criteria->addAggregation(new AvgAggregation('avg-rating', 'productReviews.points'))`, then `$result->getAggregations()->get('avg-rating')` (do not call `first()`).
8. Paging/sorting: `setLimit(1)`, `setOffset(1)`, `addSorting(new FieldSorting('createdAt', FieldSorting::ASCENDING))`.
9. Total count: `$criteria->setTotalCountMode(Criteria::TOTAL_COUNT_MODE_NEXT_PAGES)`. Modes: `TOTAL_COUNT_MODE_NONE` (default, no count), `TOTAL_COUNT_MODE_EXACT` (exact, slow), `TOTAL_COUNT_MODE_NEXT_PAGES` (bounded look-ahead of limit * 6 + 1 rows).
10. Debug labels: `$criteria->setTitle('acme-plugin::product-export')` — the DAL adds it as an SQL comment with the operation appended (e.g. `-- acme-plugin::product-export::search-ids`); association queries inherit it.
11. Large data sets:
    ```php
    $criteria = new Criteria();
    $criteria->setLimit(500);
    $iterator = new RepositoryIterator($this->productRepository, $context, $criteria);
    while (($result = $iterator->fetch()) !== null) {
        $products = $result->getEntities();
    }
    ```
    Use `fetchIds()` when only IDs are needed. If no limit is set, the iterator uses 50.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`, `EntitySearchResult`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter`, `...\Filter\OrFilter`, `...\Filter\RangeFilter`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\AvgAggregation`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting`
- `Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\RepositoryIterator`
- `search()`, `searchIds()`, `addFilter()`, `addPostFilter()`, `addAssociation()`, `getAssociation()`, `addAggregation()`, `setTotalCountMode()`, `setTitle()`

## Gotchas

- Mapping entities of `ManyToMany` associations (e.g. `ProductCategoryDefinition`, `product_category.repository`) cannot be read with `search()`; use `searchIds()` — they consist only of two primary keys.
- `search()` always returns a collection even for a single ID; use `first()`.
- `RepositoryIterator` issues a new query per batch — do not use it for small data sets.
- Without explicit sorting, entities with an auto-increment field are paginated by that field (key-set, efficient for `fetch()` and `fetchIds()`). Explicit sorting disables this and must be deterministic — e.g. add `new FieldSorting('id')` after `manufacturerNumber`, otherwise entities can be duplicated or skipped across batches.
- Without sorting, offset/limit results are unpredictable.

## Code check (6.7.15.1)
- confirmed `EntityRepository::search()` — returns `EntitySearchResult` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:66
- confirmed `EntityRepository::searchIds()` — returns `IdSearchResult` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:97
- confirmed `Criteria::TOTAL_COUNT_MODE_NEXT_PAGES` — value 2, fetches limit * 6 + 1 rows — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:54
- confirmed `Criteria::$totalCountMode` — default `TOTAL_COUNT_MODE_NONE` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:92
- confirmed `Criteria::getAssociation()` — returns a nested `Criteria` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:252
- confirmed `Criteria::addPostFilter()` — variadic `Filter` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:306
- confirmed `Criteria::setTitle()` — accepts `?string` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:635
- confirmed `RepositoryIterator::__construct()` — default limit 50 when unset — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/Common/RepositoryIterator.php:35
- confirmed `RepositoryIterator::fetchIds()` — auto-increment key-set pagination when no sorting — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/Common/RepositoryIterator.php:78
- confirmed `AvgAggregation` — in `Search\Aggregation\Metric` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/AvgAggregation.php:12
