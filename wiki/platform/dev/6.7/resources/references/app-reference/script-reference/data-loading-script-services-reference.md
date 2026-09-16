---
id: platform/dev/6.7/resources/references/app-reference/script-reference/data-loading-script-services-reference.md
title: Data Loading script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/data-loading-script-services-reference.html
sourceHash: a10b0f7c8d0f7b4cb95743db664b7df1af809028
codeCheckedAgainst: "6.7.13.0"
keywords: ["services.repository", "services.store", "RepositoryFacade", "SalesChannelRepositoryFacade", "EntitySearchResult", "IdSearchResult", "AggregationResultCollection", "criteria", "data loading", "app scripts", "store-api", "entity search"]
summary: "App script data loading services: services.repository (admin data, needs permissions) and services.store (store-api data) with search, ids, aggregate."
lastBuilt: 2026-09-15
---
## What it is

Reference for the two app-script services that read entity data: `services.repository` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryFacade`) and `services.store` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\SalesChannelRepositoryFacade`). Both expose `search()`, `ids()` and `aggregate()` taking an entity name and a criteria array.

## When to use

When a script (e.g. a page-loaded hook) must load entities, entity ids or aggregations to add to a page or response.

## Key steps / config

**`services.repository`** — queries any data; the app needs read permissions for the queried entities.
**`services.store`** — queries publicly available `store-api` data; no extra permissions, but entities and associations are limited to those available through the `store-api`, and results are already processed for the storefront (e.g. prices calculated for the current context).

Methods (identical signatures on both):
- `search(string entityName, array criteria)` → `Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult`
- `ids(string entityName, array criteria)` → `Shopware\Core\Framework\DataAbstractionLayer\Search\IdSearchResult`
- `aggregate(string entityName, array criteria)` → `Shopware\Core\Framework\DataAbstractionLayer\Search\AggregationResult\AggregationResultCollection`

Criteria array shape:

```twig
{% set criteria = {
    'ids': [ hook.productId ],
    'filter': [ { 'field': 'productNumber', 'type': 'equals', 'value': 'p1' } ],
    'associations': { 'manufacturer': {} },
    'aggregations': [ { 'name': 'sumOfPrices', 'type': 'sum', 'field': 'price.gross' } ]
} %}
{% set product = services.repository.search('product', criteria).getEntities().first %}
{% do hook.page.addExtension('myProduct', product) %}
```

Typical result access: `search(...).getEntities().first`, `ids(...).ids`, `aggregate(...).get('sumOfPrices').getSum`; add plain arrays to a page with `page.addArrayExtension(name, {...})`.

## Essential identifiers

- `services.repository`, `services.store`
- `Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryFacade`
- `Shopware\Core\Framework\DataAbstractionLayer\Facade\SalesChannelRepositoryFacade`
- `EntitySearchResult`, `IdSearchResult`, `AggregationResultCollection`
- `Shopware\Storefront\Page\Page` (type hint for `hook.page` in samples)

## Gotchas

- `services.repository` is permission-bound: the installed facade is built with an ACL criteria validator, so declare read privileges for every entity and association you query.
- `services.store` cannot reach entities or associations not exposed via the `store-api`.

## Code check (6.7.13.0)
- confirmed `RepositoryFacadeHookFactory::getName()` — service name `repository` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacadeHookFactory.php:43
- confirmed `RepositoryFacade::search()` — returns EntitySearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:50
- confirmed `RepositoryFacade::ids()` — returns IdSearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:67
- confirmed `RepositoryFacade::aggregate()` — returns AggregationResultCollection — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:84
- confirmed `AclCriteriaValidator` — injected into RepositoryFacade — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:33
- confirmed `SalesChannelRepositoryFacadeHookFactory::getName()` — service name `store` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacadeHookFactory.php:44
- confirmed `SalesChannelRepositoryFacade::search()` — returns EntitySearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:51
- confirmed `SalesChannelRepositoryFacade::ids()` — returns IdSearchResult — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:68
- confirmed `SalesChannelRepositoryFacade::aggregate()` — returns AggregationResultCollection — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:85
- confirmed `SalesChannelDefinitionInstanceRegistry` — store service resolves sales-channel definitions — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/SalesChannelRepositoryFacade.php:33
