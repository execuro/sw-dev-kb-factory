---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-extend-the-search-and-suggest-template.md
title: Extending search template
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-extend-the-search-and-suggest-template.html
sourceHash: 5c6975afa12617be75b0f2ee2ebb32c2b4f6e6c5
codeCheckedAgainst: "6.7.15.1"
keywords: ["advanced search", "search/index.html.twig", "search-suggest.html.twig", "multiSearchResult", "multiSuggestResult", "completionResult", "getResult", "product_manufacturer", "custom_entity", "SwagCommercial", "search page template", "suggest dropdown", "storefront twig"]
summary: Twig variables for rendering Advanced Search results (multiSearchResult, multiSuggestResult, completionResult) in the search page and suggest dropdown.
lastBuilt: 2026-10-21
---
## What it is

How to render Advanced Search (Commercial plugin) results for manufacturers, categories and custom entities in the Storefront search results page and the header search-suggest dropdown, by extending two Storefront templates and reading the extensions the Advanced Search attaches to the page result.

## When to use

You use Advanced Search and want additional result types (manufacturers, categories, your own entity) shown on the search page or in the suggest dropdown, styled your own way.

## Key steps / config

1. **Search page:** extend `search/index.html.twig` (the Storefront file is `@Storefront/storefront/page/search/index.html.twig`). The reference implementation is `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/views/storefront/page/search/index.html.twig`. Read the results from the `multiSearchResult` extension on `page.listing`:

```twig
{% set searchResult = page.listing.extensions.multiSearchResult %}
{% set products = page.listing %}
{% set manufacturers = searchResult.getResult('product_manufacturer') %}
{% set categories = searchResult.getResult('category') %}
{% set customEntities = searchResult.getResult('custom_entity') %}
```

2. **Suggest dropdown:** extend `Storefront/storefront/layout/header/search-suggest.html.twig`, as done in `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/views/storefront/layout/header/search-suggest.html.twig`. Results hang off `page.searchResult`, plus a separate `completionResult` extension:

```twig
{% set suggestResult = page.searchResult.extensions.multiSuggestResult %}
{% set products = page.searchResult %}
{% set completions = page.searchResult.extensions.completionResult %}
{% set manufacturers = suggestResult.getResult('product_manufacturer') %}
{% set categories = suggestResult.getResult('category') %}
{% set customEntities = suggestResult.getResult('custom_entity') %}
```

`getResult()` takes the entity name of the Elasticsearch definition (e.g. `product_manufacturer`, `category`, or your custom entity name).

## Essential identifiers

- `@Storefront/storefront/page/search/index.html.twig` — search page template; `page` is a `SearchPage` (`page.listing`)
- `@Storefront/storefront/layout/header/search-suggest.html.twig` — suggest dropdown; `page` is a `SuggestPage` (`page.searchResult`)
- `page.listing.extensions.multiSearchResult` — Advanced Search multi-entity search result
- `page.searchResult.extensions.multiSuggestResult` — Advanced Search multi-entity suggest result
- `page.searchResult.extensions.completionResult` — completion suggestions
- `getResult('<entity_name>')` — fetches one entity's results

## Gotchas

- The `multiSearchResult`, `multiSuggestResult` and `completionResult` extensions only exist when the Commercial Advanced Search is active; core Shopware does not add them, so guard against them being undefined.
- The core `index.html.twig` delegates the listing to `@Storefront/storefront/page/search/search-pagelet.html.twig`; pick the block you override accordingly.

## Code check (6.7.15.1)
- confirmed `search/index.html.twig` — core search page template, includes search-pagelet — vendor/shopware/storefront/Resources/views/storefront/page/search/index.html.twig:23
- confirmed `search-suggest.html.twig` — core suggest template iterates `page.searchResult.entities` — vendor/shopware/storefront/Resources/views/storefront/layout/header/search-suggest.html.twig:30
- confirmed `SearchPage::getListing()` — backs `page.listing` — vendor/shopware/storefront/Page/Search/SearchPage.php:26
- confirmed `SuggestPage::getSearchResult()` — backs `page.searchResult` — vendor/shopware/storefront/Page/Suggest/SuggestPage.php:23
- unverified `multiSearchResult` — added by the Commercial plugin, not in core/storefront
- unverified `multiSuggestResult` — added by the Commercial plugin, not in core/storefront
- unverified `completionResult` — added by the Commercial plugin, not in core/storefront
