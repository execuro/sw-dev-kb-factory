---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md
title: Product Search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/product-search.html
sourceHash: fba90ce570cf33211e285d186c517a4df68aad63
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "product search", "autocompletion", "autocomplete", "storefront plugin", "elasticsearch", "variants filter", "product variants", "basic settings", "filter menu"]
summary: B2B Suite Storefront plugin for product input fields with autocompletion; with Elasticsearch, enable the variants filter to list all variants.
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite product search is a small Storefront plugin that turns input fields into product fields with autocompletion. It deactivates the browser's own autocompletion for such a field.

## When to use

When a B2B Suite Storefront form needs a product lookup with autocomplete suggestions, or when the product search does not show all variants on a shop running Elasticsearch.

## Key steps / config

- Use the B2B Suite product search Storefront plugin on the input field that should autocomplete products; the browser's default autocompletion is switched off for that field by the plugin.
- Elasticsearch: enable the variants filter in the filter menu of the B2B Suite basic settings, otherwise not all variants are shown in the product search.

## Gotchas

- Without the variants filter enabled in the basic settings, an Elasticsearch-backed shop does not list all variants in the product search results.

## Code check (6.7.13.0)
- unverified `product search` — B2B Suite Storefront plugin is not part of vendor/shopware/{core,storefront,administration}; not installed, out of scope
- unverified `variants filter` — B2B Suite basic-settings option; plugin code not installed, out of scope
