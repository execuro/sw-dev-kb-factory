---
id: platform/dev/6.7/products/extensions/advanced-search/Cross-search.md
title: Cross search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/Cross-search.html
sourceHash: a299ced81f2237a2fe041f97c89dbe62e692cf1d
codeCheckedAgainst: "6.7.15.1"
keywords: ["cross search", "cross_search", "advanced_search", "CrossSearchLogic", "advanced search", "elasticsearch", "opensearch", "association search", "search categories by product name", "manufacturer search", "index size", "SwagCommercial"]
summary: "Advanced Search cross_search config: search category/manufacturer via product index associations instead of indexing product data into their indexes."
lastBuilt: 2026-10-21
---
## What it is

Cross Search is an **experimental** feature of the commercial Advanced Search extension (implemented in `\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic`). It lets a search on one entity's index resolve fields of an associated entity by querying that entity's own index, instead of copying the associated data into every index.

## When to use

When you need to find, for example, categories or manufacturers by product name. Without Cross Search, such searches require indexing product data inside the category and manufacturer indexes, which notably increases overall index size.

## Key steps / config

Configure which associations may be cross-searched in `config/packages/advanced_search.yaml`. Keys are `<entity>.<associated entity>` pairs, values are booleans:

```yaml
advanced_search:
    cross_search:
        product.product_manufacturer: false
        product.category: false
        category.product: true
        product_manufacturer.product: true
```

- Example from the source: when searching `manufacturer.product.name` with `product_manufacturer.product` enabled, the `product` index is used for the search field `name`.
- Defaults: only `category.product` and `product_manufacturer.product` are enabled, so product data does not need to be indexed inside the category and manufacturer indexes.
- You can add your own association mappings to the `cross_search` parameter.

## Essential identifiers

- `advanced_search.cross_search` (bundle config parameter)
- `\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic`
- Mapping keys: `category.product`, `product_manufacturer.product`, `product.category`, `product.product_manufacturer`

## Gotchas

- The feature is marked experimental.
- If a mapping is not defined or is `false`, you must index the associated data into the searching entity's index yourself.
- Enabling Cross Search costs an extra aggregated Elasticsearch query per search.

## Code check (6.7.15.1)
- unverified `\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic` — SwagCommercial plugin, outside the installed core/storefront/administration roots
- unverified `advanced_search.cross_search` — config tree defined by SwagCommercial, out of scope
- unverified `category.product` — default-enabled mapping lives in SwagCommercial config, out of scope
- unverified `product_manufacturer.product` — default-enabled mapping lives in SwagCommercial config, out of scope
