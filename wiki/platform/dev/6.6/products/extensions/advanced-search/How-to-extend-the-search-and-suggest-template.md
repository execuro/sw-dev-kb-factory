---
id: platform/dev/6.6/products/extensions/advanced-search/How-to-extend-the-search-and-suggest-template.md
title: Extending search template
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/How-to-extend-the-search-and-suggest-template.html"
sourceHash: 5c6975afa12617be75b0f2ee2ebb32c2b4f6e6c5
keywords: ["search/index.html.twig", "search-suggest.html.twig", "multiSearchResult", "multiSuggestResult", "completionResult", "getResult", "storefront template", "Twig extension", "SwagCommercial"]
summary: "How to extend the storefront search overview and suggest-dropdown Twig templates to render extra search results."
lastBuilt: "2026-09-15"
---
## What it is

This page documents extending the storefront search overview template (`search/index.html.twig`) and the suggest dropdown template (`Storefront/storefront/layout/header/search-suggest.html.twig`) to show extra search results such as manufacturers, categories, or custom entities.

## When to use

Use when Advanced Search results (manufacturers, categories, custom entities, completions) need to be rendered in the storefront search overview or the header suggest dropdown.

## Key steps / config

Search overview template, example from `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/views/storefront/page/search/index.html.twig`:

```twig
{% set searchResult = page.listing.extensions.multiSearchResult %}
{% set products = page.listing %}
{% set manufacturers = searchResult.getResult('product_manufacturer') %}
{% set categories = searchResult.getResult('category') %}
{% set customEntities = searchResult.getResult('custom_entity') %}
```

Suggest dropdown template, example from `custom/plugins/SwagCommercial/src/AdvancedSearch/Resources/views/storefront/layout/header/search-suggest.html.twig`:

```twig
{% set suggestResult = page.searchResult.extensions.multiSuggestResult %}
{% set products = page.searchResult %}
{% set completions = page.searchResult.extensions.completionResult %}
{% set manufacturers = suggestResult.getResult('product_manufacturer') %}
{% set categories = suggestResult.getResult('category') %}
{% set customEntities = suggestResult.getResult('custom_entity') %}
```

## Essential identifiers

- `search/index.html.twig`
- `Storefront/storefront/layout/header/search-suggest.html.twig`
- `page.listing.extensions.multiSearchResult`
- `page.searchResult.extensions.multiSuggestResult`
- `page.searchResult.extensions.completionResult`
