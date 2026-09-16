---
id: platform/dev/6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.md
title: Data loading services reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/script-reference/data-loading-script-services-reference.html
sourceHash: 7745d66ad710b1287400b793337a1576704eee18
keywords: ["RepositoryFacade", "SalesChannelRepositoryFacade", "services.repository", "services.store", "search", "ids", "aggregate", "criteria", "EntitySearchResult", "IdSearchResult", "AggregationResultCollection", "store-api"]
summary: "Script-service facades for loading data: services.repository (all entities) and services.store (public store-api data)."
lastBuilt: "2026-09-15"
---

## What it is
Reference documentation for the script-service facades that let app scripts load data from Shopware: `services.repository` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryFacade`) for full data access, and `services.store` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\SalesChannelRepositoryFacade`) for publicly available store-api data.

## When to use
Use `services.repository` inside an app script when you need to query any entity stored in Shopware and your app has the corresponding read permission. Use `services.store` when you only need entities and associations that are also exposed through the `store-api` — no extra permission is required, and returned entities (e.g. product prices) are already processed for the storefront context.

## Key steps / config
Both facades expose the same three methods, differing only in scope:
- `search(entityName, criteria)` — returns an `EntitySearchResult` of entities matching the criteria.
- `ids(entityName, criteria)` — returns an `IdSearchResult` of matching entity ids.
- `aggregate(entityName, criteria)` — returns an `AggregationResultCollection` for the aggregations defined in the criteria.

`entityName` is the entity name, e.g. `product` or `media`. `criteria` is built from Twig, e.g.:
```twig
{% set criteria = {
    'ids': [ hook.productId ],
    'associations': { 'manufacturer': {} }
} %}
{% set product = services.repository.search('product', criteria).first %}
```
Aggregations use a `name`, `type` (e.g. `sum`), and `field`, e.g. `{ 'name': 'sumOfPrices', 'type': 'sum', 'field': 'price.gross' }`, then read via `.get('sumOfPrices')`.

## Essential identifiers
- `Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryFacade` (`services.repository`)
- `Shopware\Core\Framework\DataAbstractionLayer\Facade\SalesChannelRepositoryFacade` (`services.store`)
- `Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult`, `IdSearchResult`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\AggregationResult\AggregationResultCollection`

## Gotchas
`services.repository` requires the app to have the correct permissions for the queried entity/data. `services.store` is restricted to entities and associations also available through the `store-api`, but needs no additional app permissions, and its results are already storefront-processed (e.g. calculated prices).
