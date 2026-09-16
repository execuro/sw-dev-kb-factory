---
id: platform/dev/6.7/resources/references/adr/2020-08-14-implement-individual-sorting.md
title: Implement individual sorting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-14-implement-individual-sorting.html
sourceHash: 904d8d770795cfa640aaa9b236f77fa08e31309e
codeCheckedAgainst: "6.7.13.0"
keywords: ["product_sorting", "product_sorting_translation", "ProductSortingEntity", "ProductSortingCollection", "ProductListingCriteriaEvent", "core.listing.defaultSorting", "core.listing.defaultSearchResultSorting", "sortings", "product listing sorting", "custom sort order", "top results", "adr"]
summary: "ADR: product listing sortings live in the product_sorting table, managed in the admin; add them via migration or ProductListingCriteriaEvent."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-08-14): product listing and search sort options are stored as database records (`product_sorting`, labels in `product_sorting_translation`) and managed in the administration, replacing sortings defined as tagged services. A system default listing sorting is stored in system config.

## When to use

You need a custom sort option for product listings or search results from a plugin, or need to know how the default sorting is resolved.

## Key steps / config

**Option 1 (recommended): migration** — insert a `product_sorting` row so it is manageable in the administration.

| Column | Type | Notes |
|---|---|---|
| `id` | binary(16) | |
| `url_key` | varchar(255) | unique, shown in URL (entity property `key`) |
| `priority` | int unsigned | higher is listed first |
| `active` | tinyint(1) [1] | inactive: not shown, does not sort |
| `locked` | tinyint(1) [0] | locked: not editable via DAL |
| `fields` | json | fields to sort by |
| `created_at`, `updated_at` | datetime(3) | |

```json
[
  { "field": "product.name", "order": "desc", "priority": 0, "naturalSorting": 0 },
  { "field": "product.cheapestPrice", "order": "asc", "priority": 100, "naturalSorting": 0 }
]
```

`field`, `order` (`asc`/`desc`) and `priority` (higher applied first) are mandatory.

**Option 2: on the fly** — subscribe to `Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent` and add a `ProductSortingEntity` to the criteria extension `sortings`:

```php
$sortings = $event->getCriteria()->getExtension('sortings') ?? new ProductSortingCollection();
$sorting = new ProductSortingEntity();
$sorting->setId(Uuid::randomHex());
$sorting->setActive(true);
$sorting->setTranslated(['label' => 'My Custom Sorting']);
$sorting->setKey('my-custom-sort');
$sorting->setPriority(5);
$sorting->setFields([['field' => 'product.name', 'order' => 'desc', 'priority' => 1, 'naturalSorting' => 0]]);
$sortings->add($sorting);
$event->getCriteria()->addExtension('sortings', $sortings);
```

**Defaults** — listings use system config `core.listing.defaultSorting`, search uses `core.listing.defaultSearchResultSorting`; both hold a `product_sorting` id and fill the `order` parameter when the request has none. Available sortings are active rows ordered by `priority` descending.

## Essential identifiers

- `Shopware\Core\Content\Product\SalesChannel\Sorting\ProductSortingEntity`, `ProductSortingCollection`
- `Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent`
- `core.listing.defaultSorting`, `core.listing.defaultSearchResultSorting`

## Gotchas

- The sorting listing processor's `prepare()` already resolves and applies the current sorting before `ProductListingCriteriaEvent` is dispatched; a sorting added in the event is listed, but the DAL sort for the requested `order` was chosen earlier.
- The ADR says search and suggest always default to `Top Results` (`_score`); the installed processor reads `core.listing.defaultSearchResultSorting` for search and adds a `_score` fallback sort when the criteria has a term or queries.

## Version notes

- Sortings as services tagged `shopware.sales_channel.product_listing.sorting` were deprecated for removal in v6.4.0.
- A 6.6 migration converted `core.listing.defaultSorting` values from a `url_key` to the sorting id.

## Code check (6.7.13.0)
- confirmed `product_sorting` — entity/table name — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:24
- confirmed `url_key` — column mapped to property `key` — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:56
- confirmed `ProductSortingEntity::setKey()` — setter exists — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:82
- confirmed `ProductSortingEntity::setFields()` — setter exists — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:118
- confirmed `ProductListingCriteriaEvent` — class in `Shopware\Core\Content\Product\Events` — vendor/shopware/core/Content/Product/Events/ProductListingCriteriaEvent.php:14
- confirmed `ProductListingCriteriaEvent` — dispatched after processor prepare — vendor/shopware/core/Content/Product/SalesChannel/Listing/ResolveCriteriaProductListingRoute.php:42
- confirmed `sortings` — criteria extension merged and set in prepare — vendor/shopware/core/Content/Product/SalesChannel/Listing/Processor/SortingListingProcessor.php:50
- corrected `core.listing.defaultSearchResultSorting` — docs: search always defaults to Top Results — vendor/shopware/core/Content/Product/SalesChannel/Listing/Processor/SortingListingProcessor.php:45
- confirmed `core.listing.defaultSorting` — values migrated from url_key to sorting id — vendor/shopware/core/Migration/V6_6/Migration1700746995ReplaceSortingOptionKeysWithSortingOptionIds.php:31
- unverified `shopware.sales_channel.product_listing.sorting` — tag not found in installed core PHP/XML; removed per ADR
