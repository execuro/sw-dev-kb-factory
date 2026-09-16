---
id: "platform/dev/6.6/resources/references/adr/2020-08-14-implement-individual-sorting.md"
title: "Implement individual sorting"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-14-implement-individual-sorting.html"
sourceHash: "904d8d770795cfa640aaa9b236f77fa08e31309e"
keywords: ["sorting", "product_sorting", "product listing sorting", "ProductListingCriteriaEvent", "ProductSortingEntity", "ProductSortingCollection", "core.listing.defaultSorting", "product_sorting_translation", "system_default", "shopware.sales_channel.product_listing.sorting", "Top Results", "admin sorting"]
summary: "ADR: shop owners can define custom product listing/search sortings via the `product_sorting` table, replacing the deprecated tagged-service approach."
lastBuilt: "2026-09-15"
---
## What it is

This ADR documents how Shopware 6 lets shop owners define custom product listing and search result sorting options from the administration, instead of only via a tagged service.

## When to use

Relevant when a plugin needs to add or manage sorting options for product listing or search result pages, either through the administration UI or programmatically at runtime.

## Key steps / config

- Individual sortings are stored in the `product_sorting` table; translatable labels go in `product_sorting_translation`.
- A system default listing sorting can be configured via `system_default`.`core.listing.defaultSorting`; this does not affect the default `Top Results` sorting used on search pages and the suggest route, which sorts by `_score`.
- To ship custom sortings from a plugin, write a migration that inserts rows into `product_sorting` — recommended, because the entries remain manageable via the administration.
- `product_sorting` columns: `id` (binary(16)), `url_key` (varchar(255), unique, shown in the URL when the sorting is chosen), `priority` (int unsigned, higher sorts to the top), `active` (tinyint(1), default 1 — inactive sortings are hidden and don't sort), `locked` (tinyint(1), default 0 — locked sortings cannot be edited via the DAL), `fields` (json), `created_at`, `updated_at` (datetime(3)).
- `fields` JSON shape:
```json5
[
  { "field": "product.name", "order": "desc", "priority": 0, "naturalSorting": 0 }
]
```
- Alternatively, subscribe to `ProductListingCriteriaEvent` and add a `ProductSortingEntity` to the `sortings` extension of the event's `Criteria` at runtime, via a `ProductSortingCollection`.

## Essential identifiers

- `ProductListingCriteriaEvent`
- `ProductSortingEntity`, `ProductSortingCollection`
- `product_sorting`, `product_sorting_translation` tables
- `core.listing.defaultSorting` system config key
- `shopware.sales_channel.product_listing.sorting` service tag (deprecated path)

## Gotchas

Defining a sorting as a tagged service using `shopware.sales_channel.product_listing.sorting` is deprecated and was removed in v6.4.0 — use the `product_sorting` table or the `ProductListingCriteriaEvent` instead.

## Version notes

The tagged-service sorting mechanism is deprecated and was removed as of v6.4.0.
