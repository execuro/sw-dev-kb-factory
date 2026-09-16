---
id: platform/dev/6.6/products/extensions/advanced-search/Search-and-suggest-routes.md
title: Search and suggest routes
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/Search-and-suggest-routes.html"
sourceHash: aefbe66f175fad8f3ad9e2b19ffbd548d93b1ceb
keywords: ["ProductSearchRoute", "ProductSuggestRoute", "ProductSearchRouteDecorator", "ProductSuggestRouteDecorator", "multiSearchResult", "completionResult", "MultiContentSearchCriteriaEvent", "MultiContentSuggestCriteriaEvent", "advanced_search.supported_definition", "decoration caching"]
summary: "How Advanced Search decorates ProductSearchRoute/ProductSuggestRoute to add multi-definition search results and completion, plus adjustment events."
lastBuilt: "2026-09-15"
---
## What it is

This page documents how Advanced Search decorates `ProductSearchRoute` and `ProductSuggestRoute` to enrich the search product listing result with additional Elasticsearch definition results.

## When to use

Use when you need to understand or hook into how the storefront search/suggest results are extended with cross-definition results and completion data.

## Key steps / config

- `ProductSearchRoute` is decorated (`\Shopware\Commercial\AdvancedSearch\Domain\Search\ProductSearchRouteDecorator`), adding a `multiSearchResult` extension to the search product listing result. This includes results for each Elasticsearch definition tagged `advanced_search.supported_definition` matching the search term.
- `ProductSuggestRoute` is decorated similarly (`\Shopware\Commercial\AdvancedSearch\Domain\Suggest\ProductSuggestRouteDecorator`), additionally adding a `completionResult` extension for completion search results.
- Subscribe to `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSearchCriteriaEvent` or `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSuggestCriteriaEvent` to adjust the search criteria.
- Because this uses decoration, the existing caching mechanism for the decorated routes continues to work.

## Essential identifiers

- `\Shopware\Commercial\AdvancedSearch\Domain\Search\ProductSearchRouteDecorator`
- `\Shopware\Commercial\AdvancedSearch\Domain\Suggest\ProductSuggestRouteDecorator`
- `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSearchCriteriaEvent`
- `\Shopware\Commercial\AdvancedSearch\Event\MultiContentSuggestCriteriaEvent`
- Extensions: `multiSearchResult`, `completionResult`
- Tag: `advanced_search.supported_definition`
