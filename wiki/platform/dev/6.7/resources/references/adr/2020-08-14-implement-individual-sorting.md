---
id: platform/dev/6.7/resources/references/adr/2020-08-14-implement-individual-sorting.md
title: Implement individual sorting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-14-implement-individual-sorting.html
sourceHash: 904d8d770795cfa640aaa9b236f77fa08e31309e
codeCheckedAgainst: "6.7.15.1"
keywords: ["product sorting", "listing sorting", "product_sorting", "ProductSortingEntity", "ProductSortingCollection", "ProductListingCollectSortingEvent", "ProductListingCriteriaEvent", "core.listing.defaultSorting", "core.listing.defaultSearchResultSorting", "url_key", "custom sorting", "sort order", "adr"]
summary: "ADR: product listing sortings stored in product_sorting and managed in admin; add them via migration or ProductListingCollectSortingEvent."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2020-08-14) making product listing sort options configurable from the administration. Sortings are stored as database rows in `product_sorting` (label in `product_sorting_translation`) instead of being defined as tagged services, and a system-wide default listing sorting is configurable.

## When to use

- You want a plugin to ship an additional sort option for product listings or search results.
- You need the column layout or the `fields` JSON shape of `product_sorting`.
- You look for where the default listing sorting is configured.

## Key steps / config

**Option 1 (recommended): a migration inserting into `product_sorting`.** Sortings created this way can be managed in the administration.

| Column | Type | Notes |
|---|---|---|
| `id` | binary(16) | |
| `url_key` | varchar(255) | unique; shown in the URL when chosen (entity property `key`) |
| `priority` | int unsigned | higher = listed further up |
| `active` | tinyint(1), default 1 | inactive sortings are neither shown nor applied |
| `locked` | tinyint(1), default 0 | locked sortings cannot be edited via the DAL |
| `fields` | json | fields to sort by |
| `created_at` / `updated_at` | datetime(3) | |

`fields` JSON shape (`field`, `order` = `asc`/`desc` and `priority` are mandatory; higher `priority` is applied first):

```json
[
  { "field": "product.name", "order": "desc", "priority": 0, "naturalSorting": 0 },
  { "field": "product.cheapestPrice", "order": "asc", "priority": 100, "naturalSorting": 0 }
]
```

**Option 2: add a sorting on the fly.** In 6.7.15.1 subscribe to `ProductListingCollectSortingEvent` and add a `ProductSortingEntity` to `getSortings()`; the processor dispatches this event after loading the active database sortings:

```php
public static function getSubscribedEvents(): array
{
    return [ProductListingCollectSortingEvent::class => 'addSorting'];
}

public function addSorting(ProductListingCollectSortingEvent $event): void
{
    $sorting = new ProductSortingEntity();
    $sorting->setId(Uuid::randomHex());
    $sorting->setActive(true);
    $sorting->setTranslated(['label' => 'My Custom Sorting']);
    $sorting->setKey('my-custom-sort');
    $sorting->setPriority(5);
    $sorting->setFields([['field' => 'product.name', 'order' => 'desc', 'priority' => 1, 'naturalSorting' => 0]]);
    $event->getSortings()->add($sorting);
}
```

**Default sorting.** System config `core.listing.defaultSorting` holds the default for product listings. For search requests the installed processor reads `core.listing.defaultSearchResultSorting` instead; when the criteria has a search term or queries, `_score` descending is added as fallback sorting.

## Essential identifiers

- `product_sorting`, `product_sorting_translation`
- `Shopware\Core\Content\Product\SalesChannel\Sorting\ProductSortingEntity`, `ProductSortingCollection`
- `Shopware\Core\Content\Product\Events\ProductListingCollectSortingEvent`
- `core.listing.defaultSorting`, `core.listing.defaultSearchResultSorting`

## Gotchas

- The ADR's example subscribes to `ProductListingCriteriaEvent` and reads/writes the criteria extension `sortings`. In 6.7.15.1 that extension (`SortingListingProcessor::SORTINGS_EXTENSION`) is marked `@internal` and "not an extension point"; use `ProductListingCollectSortingEvent` to add or remove sortings and `ProductListingResult::getAvailableSortings()` to read them.
- The ADR says the default sorting does not affect the `Top Results` sorting on search pages; in the installed code the search default is its own config key (`core.listing.defaultSearchResultSorting`).
- `core.listing.defaultSorting` may hold a sorting ID (a 6.6 migration replaced stored keys with IDs); the processor resolves an ID to the sorting's key.

## Version notes

Defining sortings as services tagged `shopware.sales_channel.product_listing.sorting` was deprecated by this ADR for removal in v6.4.0; the tag no longer exists in the installed code.

## Code check (6.7.15.1)
- confirmed `product_sorting` — entity/table name — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:27
- confirmed `url_key` — storage name of the `key` property, required — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:59
- confirmed `fields` — required JSON field — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:62
- confirmed `ProductSortingEntity::setKey()` — setter used in the example — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:82
- confirmed `ProductSortingEntity::setFields()` — setter for sort fields — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:118
- confirmed `ProductListingCollectSortingEvent::getSortings()` — collection to add sortings to — vendor/shopware/core/Content/Product/Events/ProductListingCollectSortingEvent.php:28
- corrected `SORTINGS_EXTENSION` — docs: add sortings via the criteria `sortings` extension on `ProductListingCriteriaEvent`; code: internal, use ProductListingCollectSortingEvent — vendor/shopware/core/Content/Product/SalesChannel/Listing/Processor/SortingListingProcessor.php:35
- confirmed `ProductListingCriteriaEvent` — event class still exists — vendor/shopware/core/Content/Product/Events/ProductListingCriteriaEvent.php:17
- corrected `core.listing.defaultSearchResultSorting` — docs: search always uses Top Results; code: configurable search default — vendor/shopware/core/Content/Product/SalesChannel/Listing/Processor/SortingListingProcessor.php:57
- absent `shopware.sales_channel.product_listing.sorting` — tag removed, not found in installed code
