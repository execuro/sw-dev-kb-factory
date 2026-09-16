---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/product-search.md
title: Product Search
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/storefront/product-search.html
sourceHash: fba90ce570cf33211e285d186c517a4df68aad63
keywords: ["product search", "storefront plugin", "autocompletion", "Elasticsearch", "variants filter", "basic settings", "b2b-suite", "input field", "browser autocomplete"]
summary: A B2B Suite storefront plugin adds autocompleting product-search input fields, and with Elasticsearch requires enabling the variants filter to show variants.
lastBuilt: 2026-09-15
---
## What it is

Documents the B2B Suite's product search: a small Storefront plugin that adds input fields with product autocompletion, disabling the browser's own default autocompletion for that field.

## When to use

Use this when adding or troubleshooting a storefront search input that should autocomplete against products, particularly if the shop runs Elasticsearch and variant products are not appearing in the suggestions.

## Key steps / config

The plugin replaces the browser's native autocompletion behavior on the search input with its own product-autocomplete suggestions. When Elasticsearch is used for product search, the variants filter must be enabled in the filter menu of the basic settings for all product variants to be shown in the product search results.

## Gotchas

With Elasticsearch active, variants are hidden from product search results by default unless the variants filter is explicitly enabled in the basic settings' filter menu — a plain database-driven search does not have this same prerequisite mentioned in the source.
