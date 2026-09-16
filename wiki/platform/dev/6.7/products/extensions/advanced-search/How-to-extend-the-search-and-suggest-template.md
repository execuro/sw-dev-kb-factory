---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-extend-the-search-and-suggest-template.md
title: Extending search template
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-extend-the-search-and-suggest-template.html
sourceHash: 5c6975afa12617be75b0f2ee2ebb32c2b4f6e6c5
codeCheckedAgainst: "6.7.13.0"
keywords: ["search/index.html.twig", "layout/header/search-suggest.html.twig", "multiSearchResult", "multiSuggestResult", "completionResult", "getResult", "page.listing", "page.searchResult", "advanced search", "search suggest dropdown", "storefront template", "twig"]
summary: "Advanced Search: read multiSearchResult / multiSuggestResult / completionResult extensions in the storefront search page and suggest dropdown Twig templates"
lastBuilt: 2026-09-15
---
## What it is

This page covers the Twig variables Advanced Search (SwagCommercial) adds to the Storefront. You use them to render manufacturer, category, completion and custom-entity results on the search result page and in the search suggest dropdown.

## When to use

You want your theme or plugin to show Advanced Search results beyond products, or you have added a custom Elasticsearch definition and want its results displayed.

## Key steps / config

**Search result page:** extend `@Storefront/storefront/page/search/index.html.twig`. Style the results however you like. A reference implementation ships in `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/views/storefront/page/search/index.html.twig`.

```twig
{% set searchResult = page.listing.extensions.multiSearchResult %}
{% set products = page.listing %}
{% set manufacturers = searchResult.getResult('product_manufacturer') %}
{% set categories = searchResult.getResult('category') %}
{% set customEntities = searchResult.getResult('custom_entity') %}
```

**Suggest dropdown:** extend `@Storefront/storefront/layout/header/search-suggest.html.twig`. The reference is `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/views/storefront/layout/header/search-suggest.html.twig`.

```twig
{% set suggestResult = page.searchResult.extensions.multiSuggestResult %}
{% set products = page.searchResult %}
{% set completions = page.searchResult.extensions.completionResult %}
{% set manufacturers = suggestResult.getResult('product_manufacturer') %}
{% set categories = suggestResult.getResult('category') %}
{% set customEntities = suggestResult.getResult('custom_entity') %}
```

`getResult()` takes the entity name of the Elasticsearch definition, e.g. `product_manufacturer`, `category`, or your own entity.

## Essential identifiers

- Templates `page/search/index.html.twig`, `layout/header/search-suggest.html.twig`
- Extensions `multiSearchResult` (on `page.listing`), `multiSuggestResult` and `completionResult` (on `page.searchResult`)
- `getResult('<entity_name>')`

## Gotchas

- The extensions exist only when Advanced Search is active. Core Storefront templates do not reference them.
- On the search page the extension hangs off `page.listing`; in the suggest template it hangs off `page.searchResult`.

## Code check (6.7.13.0)
- confirmed `page/search/index.html.twig` — core search page template uses page.listing — vendor/shopware/storefront/Resources/views/storefront/page/search/index.html.twig:15
- confirmed `layout/header/search-suggest.html.twig` — core suggest template iterates page.searchResult — vendor/shopware/storefront/Resources/views/storefront/layout/header/search-suggest.html.twig:12
- confirmed `SearchPage::getListing()` — backs page.listing — vendor/shopware/storefront/Page/Search/SearchPage.php:26
- confirmed `SuggestPage::getSearchResult()` — backs page.searchResult — vendor/shopware/storefront/Page/Suggest/SuggestPage.php:23
- unverified `multiSearchResult` — extension added by SwagCommercial, not in installed vendor roots
- unverified `multiSuggestResult` — extension added by SwagCommercial, not in installed vendor roots
- unverified `completionResult` — extension added by SwagCommercial, not in installed vendor roots
