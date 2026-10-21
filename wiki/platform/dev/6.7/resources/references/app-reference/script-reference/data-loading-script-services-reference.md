---
id: platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md
title: Data Loading script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/data-loading-script-services-reference.html
sourceHash: a10b0f7c8d0f7b4cb95743db664b7df1af809028
codeCheckedAgainst: "6.7.15.1"
keywords: ["services.repository", "services.store", "RepositoryFacade", "SalesChannelRepositoryFacade", "search()", "ids()", "aggregate()", "EntitySearchResult", "IdSearchResult", "AggregationResultCollection", "app scripts", "data loading", "criteria", "store-api"]
summary: App script services services.repository (DAL, ACL-checked) and services.store (store-api data) with search(), ids() and aggregate() methods.
lastBuilt: 2026-10-21
---
## What it is

Reference for the two read-only data loading services available inside app scripts (Twig script hooks): `services.repository` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryFacade`) and `services.store` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\SalesChannelRepositoryFacade`). Both expose `search()`, `ids()` and `aggregate()` with the same signature: an entity name and a criteria array.

## When to use

- Load entities (e.g. a product with its manufacturer) in a script hook and attach them to the page via `page.addExtension()` / `page.addArrayExtension()`.
- Use `services.repository` for any DAL entity your app has permissions for; use `services.store` for publicly available `store-api` data processed for the storefront (prices already calculated for the current context), which needs no additional permissions.

## Key steps / config

Methods (identical on both services):

| Method | Arguments | Returns |
|---|---|---|
| `search()` | `string entityName`, `array criteria` | `Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult` |
| `ids()` | `string entityName`, `array criteria` | `Shopware\Core\Framework\DataAbstractionLayer\Search\IdSearchResult` |
| `aggregate()` | `string entityName`, `array criteria` | `Shopware\Core\Framework\DataAbstractionLayer\Search\AggregationResult\AggregationResultCollection` |

Criteria is a plain array in the same shape as the API criteria (`ids`, `filter`, `associations`, `aggregations`):

```twig
{% set criteria = {
    'ids': [ hook.productId ],
    'filter': [ { 'field': 'productNumber', 'type': 'equals', 'value': 'p1' } ],
    'associations': { 'manufacturer': {} },
    'aggregations': [ { 'name': 'sumOfPrices', 'type': 'sum', 'field': 'price.gross' } ]
} %}
{% set product = services.repository.search('product', criteria).getEntities().first %}
{% set productIds = services.store.ids('product', criteria).ids %}
{% set sumResult = services.repository.aggregate('product', criteria).get('sumOfPrices') %}
{% do page.addExtension('myProduct', product) %}
{% do page.addArrayExtension('myProductAggregations', { 'sum': sumResult.getSum }) %}
```

Results: `search(...).getEntities().first` for a single entity, `ids(...).ids` for the id list, `aggregate(...).get('<name>')` for a named aggregation result (e.g. `.getSum`).

## Essential identifiers

- `services.repository` — `Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryFacade`
- `services.store` — `Shopware\Core\Framework\DataAbstractionLayer\Facade\SalesChannelRepositoryFacade`
- `search()`, `ids()`, `aggregate()`
- `EntitySearchResult`, `IdSearchResult`, `AggregationResultCollection`

## Gotchas

- `services.repository` validates the criteria against the app's ACL privileges; missing privileges (including for loaded associations) raise an exception instead of returning partial data.
- `services.store` can only query and associate entities that are also exposed through the `store-api`; returned entities are already storefront-processed (e.g. calculated prices), so they differ from raw DAL data.

## Code check (6.7.15.1)
- confirmed `RepositoryFacade::search()` — `search(string $entityName, array $criteria): EntitySearchResult` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:50
- confirmed `RepositoryFacade::ids()` — returns `IdSearchResult` via `searchIds()` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:67
- confirmed `RepositoryFacade::aggregate()` — returns `AggregationResultCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:84
- confirmed `DataAbstractionLayerException::missingPrivileges` — thrown when ACL criteria validation reports missing permissions — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:104
- confirmed `RepositoryFacadeHookFactory::getName()` — registers the service as `repository` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacadeHookFactory.php:43
- confirmed `SalesChannelRepositoryFacade::search()` — same signature as the repository facade — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:51
- confirmed `SalesChannelRepositoryFacade::ids()` — returns `IdSearchResult` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:68
- confirmed `SalesChannelRepositoryFacade::aggregate()` — returns `AggregationResultCollection` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:85
- confirmed `SalesChannelRepositoryFacadeHookFactory::getName()` — registers the service as `store` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacadeHookFactory.php:44
