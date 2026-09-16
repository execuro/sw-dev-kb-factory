---
id: platform/dev/6.7/products/extensions/advanced-search/Cross-search.md
title: Cross search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/Cross-search.html
sourceHash: a299ced81f2237a2fe041f97c89dbe62e692cf1d
codeCheckedAgainst: "6.7.13.0"
keywords: ["cross search", "cross_search", "advanced_search", "CrossSearchLogic", "Advanced Search", "elasticsearch", "opensearch", "association search", "category.product", "product_manufacturer.product", "search categories by product name", "index size"]
summary: "Advanced Search experimental Cross Search: advanced_search.cross_search map decides which associations are searched via the other entity's index."
lastBuilt: 2026-09-15
---
## What it is

Cross Search is an **experimental** feature of the commercial Advanced Search extension (`\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic`). It lets Elasticsearch search an entity through an association's own index (for example find categories by product name) instead of indexing the associated data into the entity's index, which would notably increase index size.

## When to use

- You need to search categories or manufacturers by fields of their products.
- You add a custom association mapping and must decide between cross-searching it or indexing its data into the parent index.

## Key steps / config

Configure the association map in `config/packages/advanced_search.yaml`:

```yaml
advanced_search:
    cross_search:
        product.product_manufacturer: false
        product.category: false
        category.product: true
        product_manufacturer.product: true
```

- Keys are `<entity>.<association entity>`. Example from the source: searching `manufacturer.product.name` with `product_manufacturer.product` enabled uses the `product` index for the field `name`.
- Defaults: only `category - product` and `product_manufacturer - product` are enabled, so product data does not have to be indexed inside the category and manufacturer indexes.
- You can add your own mappings to the parameter.

## Essential identifiers

- `\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic`
- `advanced_search.cross_search`
- `config/packages/advanced_search.yaml`

## Gotchas

- If a mapping is not defined or set to `false`, you must index the associated data into the entity's index yourself.
- With Cross Search enabled, each such search needs an extra aggregated Elasticsearch query.
- The feature is marked experimental.

## Code check (6.7.13.0)
- unverified `\Shopware\Commercial\AdvancedSearch\Domain\CrossSearch\CrossSearchLogic` — commercial extension code, not in vendor/shopware core/storefront/administration
- unverified `advanced_search.cross_search` — config tree defined by the commercial extension, out of scope
- confirmed `category` — entity name used in the mapping keys — vendor/shopware/core/Content/Category/CategoryDefinition.php:55
- confirmed `product_manufacturer` — entity name used in the mapping keys — vendor/shopware/core/Content/Product/Aggregate/ProductManufacturer/ProductManufacturerDefinition.php:28
- confirmed `product` — entity name used in the mapping keys — vendor/shopware/core/Content/Product/ProductDefinition.php:85
