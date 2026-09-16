---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/reading-data.md
title: Reading data
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/reading-data.html"
sourceHash: "e7552be6def1f1e73167ac3fb2d4514debf20380"
keywords: ["reading data", "DataAbstractionLayer", "DAL", "EntityRepository", "Criteria", "EqualsFilter", "OrFilter", "RangeFilter", "addAssociation", "addAggregation", "RepositoryIterator", "EntitySearchResult", "searchIds"]
summary: "Fetch entity data via a repository and Criteria: filters, associations, aggregations, sorting, paging, and the RepositoryIterator for large sets."
lastBuilt: "2026-09-15"
---
## What it is

A guide on properly fetching data from the database in a plugin (or for core contributions)
using Shopware's Data Abstraction Layer (DAL) — no ORM, but a thin data access layer. It
covers filtering, aggregating, and iterating large result sets.

## When to use

Use this guide whenever a plugin needs to read entity data (e.g. products) from the database:
searching by ID or field, combining filters, following associations, aggregating values, or
paging through very large datasets without exhausting memory.

## Key steps / config

1. Inject the entity's repository service, named `<entity_name>.repository` (e.g.
   `product.repository`), as a constructor argument via `services.xml`.

```xml
<service id="Swag\BasicExample\Service\ReadingData">
    <argument type="service" id="product.repository"/>
</service>
```

2. Basic read: `$this->productRepository->search(new Criteria(), $context)` returns an
   `EntitySearchResult`.
3. Search by ID: pass an array of IDs into `new Criteria([$myId])`, then call `->first()`.
4. Filter by field: `$criteria->addFilter(new EqualsFilter('name', 'Example name'))`.
5. Combine filters with `OrFilter`, `AndFilter`, or `NandFilter`.
6. Post-filter (excluded from aggregation results) with `$criteria->addPostFilter(...)`
   instead of `addFilter`.
7. Load related data with `$criteria->addAssociation('productReviews')`, chainable as
   `'productReviews.customer'`; filter an association via
   `$criteria->getAssociation('productReviews')->addFilter(...)`.
8. Mapping entities (e.g. `ProductCategoryDefinition`, backing `ManyToMany` associations)
   cannot be read with `search()` — use `searchIds()` instead.
9. Aggregate with `$criteria->addAggregation(new AvgAggregation('avg-rating',
   'productReviews.points'))`, then read via `$products->getAggregations()->get('avg-rating')`
   (do not call `first()` when you need the `EntitySearchResult`, not a single entity).
10. Limit/page/sort: `$criteria->setLimit()`, `->setOffset()`, `->addSorting(new
    FieldSorting('createdAt', FieldSorting::ASCENDING))`.
11. For very large datasets, iterate with `RepositoryIterator`, which returns a batch of a
    defined size per `fetch()` call instead of loading everything at once.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\OrFilter`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\RangeFilter`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\AvgAggregation`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Sorting\FieldSorting`
- `Shopware\Core\Framework\DataAbstractionLayer\Dbal\Common\RepositoryIterator`
- `search()`, `searchIds()`, `addAssociation()`, `getAssociation()`, `addPostFilter()`

## Gotchas

`RepositoryIterator` issues a new database request on every iteration, so it should not be
used for small result sets. Its `Criteria` must use a *deterministic* sorting (e.g. sort by
`id`, which is unique) — sorting only by a non-unique field like `manufacturerNumber` can
cause the same entity to appear in multiple batches, or to be skipped entirely, because
different batches may order ties differently.
