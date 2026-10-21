---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.md
title: Add Custom Sorting for Product Listing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.html
sourceHash: f8497ff215f204dbc004e2782f267ce8efc22ddd
codeCheckedAgainst: "6.7.15.1"
keywords: ["ProductSortingDefinition", "ProductSortingEntity", "ProductListingCollectSortingEvent", "product_sorting", "product_sorting_translation", "MigrationStep", "url_key", "naturalSorting", "custom sorting", "listing sort order", "sort options", "product listing"]
summary: Add product listing sortings via a migration into product_sorting (manageable) or at runtime via ProductListingCollectSortingEvent (6.7.15.0+)
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md"]
---
## What it is

Individual sortings are groups of sorting options for Storefront product listings. They can be added through a migration (stored in the database, manageable in the Administration) or at runtime through an event (not manageable).

## When to use

You want an extra entry in the Storefront listing sort dropdown. Requires a plugin ([plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and familiarity with [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md).

## Key steps / config

### Via migration (manageable)

Create e.g. `<plugin root>/src/Migration/Migration1615470599ExampleSorting.php` extending `Shopware\Core\Framework\Migration\MigrationStep`:

```php
class Migration1615470599ExampleSorting extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1615470599; }

    public function update(Connection $connection): void
    {
        $connection->insert(ProductSortingDefinition::ENTITY_NAME, [
            'id' => ..., 'url_key' => 'my-custom-sort', 'priority' => 5,
            'active' => 1, 'locked' => 0, 'fields' => json_encode([...]), 'created_at' => ...,
        ]);
        // then REPLACE INTO product_sorting_translation (language_id, product_sorting_id, label, created_at)
    }
}
```

Row columns:
- `url_key` — shown in the URL, must be unique system-wide.
- `priority` — higher shows further up in the Storefront dropdown.
- `active` — enable/disable; `locked` — prevents editing in the Administration.
- `fields` — JSON list of `{ "field": "product.name", "order": "asc|desc", "priority": 1, "naturalSorting": 0 }`; higher field priority is applied first.
- `created_at` formatted with `Defaults::STORAGE_DATE_TIME_FORMAT`.

The `label` lives in `product_sorting_translation`; insert it for `Uuid::fromHexToBytes(Defaults::LANGUAGE_SYSTEM)` and every other language you use.

### At runtime (not manageable)

Subscribe to `Shopware\Core\Content\Product\Events\ProductListingCollectSortingEvent` (see [listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)), build a `ProductSortingEntity` and add it to `$event->getSortings()`:

```php
$sorting = new ProductSortingEntity();
$sorting->setId(Uuid::randomHex());
$sorting->setActive(true);
$sorting->setTranslated(['label' => 'My Custom Sorting at runtime']);
$sorting->setKey('my-custom-runtime-sort');
$sorting->setPriority(5);
$sorting->setFields([['field' => 'product.name', 'order' => 'desc', 'priority' => 1, 'naturalSorting' => 0]]);
$event->getSortings()->add($sorting);
```

## Essential identifiers

- `Shopware\Core\Content\Product\SalesChannel\Sorting\ProductSortingDefinition` (`ENTITY_NAME` = `product_sorting`), table `product_sorting_translation`
- `Shopware\Core\Content\Product\SalesChannel\Sorting\ProductSortingEntity` — `setKey()`, `setPriority()`, `setActive()`, `setFields()`, `setTranslated()`
- `Shopware\Core\Content\Product\Events\ProductListingCollectSortingEvent::getSortings()`
- `Shopware\Core\Framework\Migration\MigrationStep`, `Defaults::LANGUAGE_SYSTEM`, `Defaults::STORAGE_DATE_TIME_FORMAT`

## Gotchas

- Never change a migration already in use; create a new one. Adjusting a migration requires re-installing or updating the plugin.
- Runtime sortings are discouraged. If you only want a sorting users cannot edit, add it via migration with `locked` set to true.
- The entity property is `key`, mapped to the `url_key` column — use `url_key` in raw SQL inserts, `setKey()` on the entity.

## Version notes

- `ProductListingCollectSortingEvent` is available since Shopware 6.7.15.0.

## Code check (6.7.15.1)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be implemented — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, must be implemented — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `ProductSortingDefinition::ENTITY_NAME` — value `product_sorting` — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:27
- confirmed `url_key` — StringField mapped to property `key` — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:59
- confirmed `fields` — required JsonField — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingDefinition.php:62
- confirmed `ProductListingCollectSortingEvent::getSortings()` — returns `ProductSortingCollection` — vendor/shopware/core/Content/Product/Events/ProductListingCollectSortingEvent.php:28
- confirmed `ProductListingCollectSortingEvent` — dispatched in SortingListingProcessor::prepare() — vendor/shopware/core/Content/Product/SalesChannel/Listing/Processor/SortingListingProcessor.php:65
- confirmed `ProductSortingEntity::setKey()` — setter for the url_key value — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:82
- confirmed `ProductSortingEntity::setFields()` — takes the sort field array — vendor/shopware/core/Content/Product/SalesChannel/Sorting/ProductSortingEntity.php:118
- confirmed `Defaults::LANGUAGE_SYSTEM` — system language id constant — vendor/shopware/core/Defaults.php:18
