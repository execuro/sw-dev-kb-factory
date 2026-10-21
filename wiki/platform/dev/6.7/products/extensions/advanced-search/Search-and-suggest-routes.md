---
id: platform/dev/6.7/products/extensions/advanced-search/Search-and-suggest-routes.md
title: Search and suggest routes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/Search-and-suggest-routes.html
sourceHash: aefbe66f175fad8f3ad9e2b19ffbd548d93b1ceb
codeCheckedAgainst: "6.7.15.1"
keywords: ["advanced search", "ProductSearchRoute", "ProductSuggestRoute", "ProductSearchRouteDecorator", "ProductSuggestRouteDecorator", "multiSearchResult", "completionResult", "advanced_search.supported_definition", "MultiContentSearchCriteriaEvent", "MultiContentSuggestCriteriaEvent", "search criteria", "route decoration"]
summary: Advanced Search decorates ProductSearchRoute/ProductSuggestRoute to add multiSearchResult and completionResult extensions; criteria events let you adjust them.
lastBuilt: 2026-10-21
---
## What it is

How the Commercial Advanced Search hooks into the Storefront product search and suggest: it decorates the core Store API routes and attaches extra result extensions to the product listing result instead of adding new routes.

## When to use

You need to know where Advanced Search multi-entity results come from, which events let you change their criteria, or how your own Elasticsearch definition gets included in search/suggest.

## Key steps / config

- `ProductSearchRoute` is decorated by `\Shopware\Commercial\AdvancedSearch\Domain\Search\ProductSearchRouteDecorator`. A product search from the Storefront gets a `multiSearchResult` extension on the search product listing result, holding the results of every Elasticsearch definition tagged `advanced_search.supported_definition` for the given search term.
- `ProductSuggestRoute` is decorated by `\Shopware\Commercial\AdvancedSearch\Domain\Suggest\ProductSuggestRouteDecorator` the same way, and additionally adds the completion search result as the extension `completionResult`.
- To include your own entity, tag its Elasticsearch definition service with `advanced_search.supported_definition`.
- To adjust the search criteria, subscribe to `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSearchCriteriaEvent` (search) or `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSuggestCriteriaEvent` (suggest).

## Essential identifiers

- `ProductSearchRoute`, `ProductSuggestRoute` (core routes, decorated)
- `\Shopware\Commercial\AdvancedSearch\Domain\Search\ProductSearchRouteDecorator`
- `\Shopware\Commercial\AdvancedSearch\Domain\Suggest\ProductSuggestRouteDecorator`
- `advanced_search.supported_definition` (service tag)
- `multiSearchResult`, `completionResult` (result extensions)
- `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSearchCriteriaEvent`, `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSuggestCriteriaEvent`

## Gotchas

- Because Advanced Search decorates the existing routes rather than replacing them, the caching already in place for these search routes keeps working.

## Code check (6.7.15.1)
- confirmed `ProductSearchRoute` — core route extending `AbstractProductSearchRoute` — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:23
- confirmed `AbstractProductSearchRoute::getDecorated()` — decoration hook of the search route — vendor/shopware/core/Content/Product/SalesChannel/Search/AbstractProductSearchRoute.php:16
- confirmed `ProductSuggestRoute` — core route extending `AbstractProductSuggestRoute` — vendor/shopware/core/Content/Product/SalesChannel/Suggest/ProductSuggestRoute.php:19
- confirmed `AbstractProductSuggestRoute::getDecorated()` — decoration hook of the suggest route — vendor/shopware/core/Content/Product/SalesChannel/Suggest/AbstractProductSuggestRoute.php:16
- unverified `ProductSearchRouteDecorator` — Commercial plugin class, not in core/storefront
- unverified `ProductSuggestRouteDecorator` — Commercial plugin class, not in core/storefront
- unverified `advanced_search.supported_definition` — Commercial plugin tag, not in core/storefront
- unverified `MultiContentSearchCriteriaEvent` — Commercial plugin event, not in core/storefront
- unverified `MultiContentSuggestCriteriaEvent` — Commercial plugin event, not in core/storefront
