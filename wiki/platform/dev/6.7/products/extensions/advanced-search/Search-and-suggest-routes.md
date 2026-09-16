---
id: platform/dev/6.7/products/extensions/advanced-search/Search-and-suggest-routes.md
title: Search and suggest routes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/Search-and-suggest-routes.html
sourceHash: aefbe66f175fad8f3ad9e2b19ffbd548d93b1ceb
codeCheckedAgainst: "6.7.13.0"
keywords: ["ProductSearchRoute", "ProductSuggestRoute", "ProductSearchRouteDecorator", "ProductSuggestRouteDecorator", "MultiContentSearchCriteriaEvent", "MultiContentSuggestCriteriaEvent", "multiSearchResult", "completionResult", "advanced_search.supported_definition", "advanced search", "search criteria", "route decoration"]
summary: "Advanced Search decorates ProductSearchRoute/ProductSuggestRoute, adding multiSearchResult and completionResult; criteria events allow adjusting the search"
lastBuilt: 2026-09-15
---
## What it is

Advanced Search (SwagCommercial) extends the core product search and suggest Store API routes by decorating them, not by replacing them:

- `\Shopware\Commercial\AdvancedSearch\Domain\Search\ProductSearchRouteDecorator` decorates `ProductSearchRoute`. It adds a `multiSearchResult` extension to the product listing result. The extension holds the results for the search term from every Elasticsearch definition tagged `advanced_search.supported_definition`.
- `\Shopware\Commercial\AdvancedSearch\Domain\Suggest\ProductSuggestRouteDecorator` decorates `ProductSuggestRoute` the same way. It also adds the completion result as a `completionResult` extension.

## When to use

- You need to know where the extra search/suggest result extensions come from.
- You want to change the criteria Advanced Search uses for its multi-content search or suggest.

## Key steps / config

- To adjust the criteria, subscribe to one of these events:
  - `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSearchCriteriaEvent` (search)
  - `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSuggestCriteriaEvent` (suggest)
- To include a custom entity in the results, tag its Elasticsearch definition with `advanced_search.supported_definition`.
- Core defines the decorated routes as `Shopware\Core\Content\Product\SalesChannel\Search\ProductSearchRoute` (extends `AbstractProductSearchRoute`) and `Shopware\Core\Content\Product\SalesChannel\Suggest\ProductSuggestRoute` (extends `AbstractProductSuggestRoute`). Both expose `load(Request, SalesChannelContext, Criteria)` and `getDecorated()`.

## Essential identifiers

- `\Shopware\Commercial\AdvancedSearch\Domain\Search\ProductSearchRouteDecorator`
- `\Shopware\Commercial\AdvancedSearch\Domain\Suggest\ProductSuggestRouteDecorator`
- `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSearchCriteriaEvent`, `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSuggestCriteriaEvent`
- Extensions `multiSearchResult`, `completionResult`; tag `advanced_search.supported_definition`

## Gotchas

- Because the routes are decorated rather than replaced, the existing caching of the search routes still applies.

## Code check (6.7.13.0)
- confirmed `ProductSearchRoute` — core class extending AbstractProductSearchRoute — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:23
- confirmed `ProductSearchRoute::load()` — takes Request, SalesChannelContext, Criteria — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:45
- confirmed `ProductSuggestRoute` — core class extending AbstractProductSuggestRoute — vendor/shopware/core/Content/Product/SalesChannel/Suggest/ProductSuggestRoute.php:19
- confirmed `ProductSuggestRoute::load()` — takes Request, SalesChannelContext, Criteria — vendor/shopware/core/Content/Product/SalesChannel/Suggest/ProductSuggestRoute.php:42
- confirmed `AbstractProductSearchRoute` — decoration base class — vendor/shopware/core/Content/Product/SalesChannel/Search/AbstractProductSearchRoute.php:14
- confirmed `AbstractProductSuggestRoute` — decoration base class — vendor/shopware/core/Content/Product/SalesChannel/Suggest/AbstractProductSuggestRoute.php:14
- unverified `ProductSearchRouteDecorator` — SwagCommercial plugin, not in installed vendor roots
- unverified `MultiContentSearchCriteriaEvent` — SwagCommercial plugin, not in installed vendor roots
- unverified `MultiContentSuggestCriteriaEvent` — SwagCommercial plugin, not in installed vendor roots
- unverified `multiSearchResult` — extension name not present in installed vendor roots
