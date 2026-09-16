---
id: platform/dev/6.6/products/extensions/advanced-search/Cross-search.md
title: Cross search
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/Cross-search.html"
sourceHash: a299ced81f2237a2fe041f97c89dbe62e692cf1d
keywords: ["Cross Search", "CrossSearchLogic", "Elasticsearch", "cross_search", "advanced_search.yaml", "index size", "category search", "manufacturer search", "product index", "experimental feature"]
summary: "Experimental Advanced Search feature letting Elasticsearch cross-index associations (e.g. category/product) to search categories by product name."
lastBuilt: "2026-09-15"
---
## What it is

This page documents Cross Search, an experimental Advanced Search feature (`\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic`) that lets Elasticsearch search categories using product names by indexing associated data across different indexes.

## When to use

Use when you need cross-entity search (e.g. finding categories by product name) but want to control which associations are cross-indexed to limit index size growth.

## Key steps / config

Configure which associations are cross-searched in `config/packages/advanced_search.yaml`:

```yaml
advanced_search:
    cross_search:
        product.product_manufacturer: false
        product.category: false
        category.product: true
        product_manufacturer.product: true
```

By default, only `category - product` and `product_manufacturer - product` associations are enabled. If a mapping is not defined or is `false`, the associated data must be indexed manually instead.

## Essential identifiers

- `\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic`
- `advanced_search.cross_search` config key
- `config/packages/advanced_search.yaml`

## Gotchas

Enabling Cross Search requires an extra aggregated Elasticsearch query to accomplish the search behavior, which increases index size and query cost.
