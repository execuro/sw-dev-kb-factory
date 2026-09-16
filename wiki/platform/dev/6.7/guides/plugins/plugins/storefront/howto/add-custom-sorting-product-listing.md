---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.md
title: Add Custom Sorting for Product Listing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.html
sourceHash: 9c7ce3713e68a195a3aed977e63a9bd6dbafbc65
codeCheckedAgainst: "6.7.13.0"
keywords: ["product sorting", "custom sorting", "listing sort order", "product_sorting", "product_sorting_translation", "ProductSortingDefinition", "ProductSortingEntity", "ProductSortingCollection", "ProductListingCriteriaEvent", "MigrationStep", "url_key", "sortings extension", "SortingListingProcessor"]
summary: Add listing sort options via a migration into product_sorting (admin-manageable) or at runtime via ProductListingCriteriaEvent and the sortings extension.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to add individual sorting options for Storefront product listings, either persisted in the `product_sorting` table through a plugin migration (manageable in the Administration) or injected at runtime through an event subscriber (not manageable).

## When to use

You need an extra entry in the Storefront sorting dropdown, e.g. sort by `product.name` descending. Prefer the migration; if the sorting must not be editable, insert it with `locked` set instead of adding it at runtime. Prerequisites: a plugin ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and familiarity with [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md).

## Key steps / config

### Option 1: migration (manageable)

1. Create `<plugin root>/src/Migration/Migration1615470599ExampleSorting.php` extending `Shopware\Core\Framework\Migration\MigrationStep`; it must declare both `getCreationTimestamp()` and `update()`.
2. In `update()`, insert a row into `ProductSortingDefinition::ENTITY_NAME` (`product_sorting`), then `REPLACE INTO product_sorting_translation` (`language_id`, `product_sorting_id`, `label`, `created_at`) for every language you use (e.g. `Defaults::LANGUAGE_SYSTEM`).

```php
class Migration1615470599ExampleSorting extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1615470599; }

    public function update(Connection $connection): void
    {
        $connection->insert(ProductSortingDefinition::ENTITY_NAME, [
            'id' => Uuid::randomBytes(), 'url_key' => 'my-custom-sort', 'priority' => 5,
            'active' => 1, 'locked' => 0,
            'fields' => json_encode([['field' => 'product.name', 'order' => 'desc', 'priority' => 1, 'naturalSorting' => 0]]),
            'created_at' => (new \DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT),
        ]);
        // then REPLACE INTO product_sorting_translation ... label
    }
}
```

Row columns: `url_key` (shown in the URL as `order`, unique system-wide), `priority` (higher = further up in the dropdown), `active`, `locked` (prevents Administration editing), `fields` (JSON list of `field`, `order` asc/desc, `priority` — higher applied first, `naturalSorting`).

### Option 2: runtime (non-manageable, not recommended)

Subscribe to `Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent` (source uses priority 500). Read `$event->getCriteria()->getExtension('sortings') ?? new ProductSortingCollection()`, build a `ProductSortingEntity` with `setId()`, `setActive(true)`, `setTranslated(['label' => ...])`, `setKey('my-custom-runtime-sort')`, `setPriority(5)`, `setFields([...])`, add it to the collection, and write it back with `addExtension('sortings', $availableSortings)`.

## Essential identifiers

- `Shopware\Core\Content\Product\SalesChannel\Sorting\ProductSortingDefinition` (`ENTITY_NAME` = `product_sorting`)
- `Shopware\Core\Content\Product\SalesChannel\Sorting\ProductSortingEntity`
- `Shopware\Core\Content\Product\SalesChannel\Sorting\ProductSortingCollection`
- `Shopware\Core\Content\Product\Events\ProductListingCriteriaEvent`
- `Shopware\Core\Framework\Migration\MigrationStep`
- Criteria extension key `sortings`; table `product_sorting_translation`

## Gotchas

- Never change a migration already shipped; add a new one and re-install/update the plugin.
- The source says subscribing with high priority adds the sorting "before the default shopware logic". In the installed code, `ResolveCriteriaProductListingRoute::load()` runs the listing processor's `prepare()` (which merges DB sortings into the `sortings` extension and applies the current sorting to the criteria) before it dispatches `ProductListingCriteriaEvent`, so subscriber priority does not reorder it relative to that step. A runtime sorting added in the event still lands in the collection that `process()` exposes as available sortings.
- If the request `order` parameter is not a string, `SortingListingProcessor` throws via `ProductException::sortingNotFoundException`.

## Code check (6.7.13.0)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `ProductSortingDefinition::ENTITY_NAME` — value `product_sorting` — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:24
- confirmed `url_key` — StringField mapped to property `key`, required — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:56
- confirmed `fields` — required JsonField — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:59
- confirmed `ProductSortingEntity::setKey()` — setter exists — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:82
- confirmed `ProductSortingEntity::setFields()` — setter exists — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:118
- confirmed `ProductListingCriteriaEvent::getCriteria()` — returns Criteria — vendor/shopware/core/Content/Product/Events/ProductListingCriteriaEvent.php:28
- confirmed `sortings` — extension read and merged with DB sortings — vendor/shopware/core/Content/Product/SalesChannel/Listing/Processor/SortingListingProcessor.php:50
- corrected `ProductListingCriteriaEvent` — docs: high subscriber priority runs before default sorting logic; processor prepare() runs before the event is dispatched — vendor/shopware/core/Content/Product/SalesChannel/Listing/ResolveCriteriaProductListingRoute.php:42
