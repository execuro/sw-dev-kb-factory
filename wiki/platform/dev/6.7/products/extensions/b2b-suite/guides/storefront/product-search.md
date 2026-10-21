---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md
title: Product Search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/product-search.html
sourceHash: fba90ce570cf33211e285d186c517a4df68aad63
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "product search", "autocompletion", "autocomplete input", "storefront plugin", "elasticsearch", "variants filter", "show variants", "basic settings", "SwagB2bPlatform"]
summary: B2B Suite product search storefront plugin - product autocompletion inputs; with Elasticsearch enable the variants filter in basic settings to list variants.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite product search is a small Storefront (JavaScript) plugin for creating input fields with product autocompletion. It deactivates the browser's own autocompletion on the field it is attached to.

## When to use

Use it when a B2B Suite storefront form needs a product input with suggestions, e.g. for adding products by name or number.

## Gotchas

- With Elasticsearch, variants do not all show in the product search unless you enable the variants filter in the filter menu of the basic settings.

## Code check (6.7.15.1)
- confirmed `SwagB2bPlatform` — the B2B Suite is a separate plugin, listed among translatable plugins — vendor/shopware/core/System/Resources/translation.yaml:9
- unverified `product search` — B2B Suite storefront JS plugin, not in the core/storefront/administration checkout
- unverified `variants filter` — Elasticsearch basic-settings option; the Elasticsearch package is outside the checked roots
