---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-sorting-product-listing.md
title: Add custom sorting for product listing
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-sorting-product-listing.html
sourceHash: f8e36bbc532b1611609fdfd1330b3f89aab8c7c1
keywords: ["sorting", "product listing", "ProductSortingDefinition", "ProductSortingEntity", "ProductSortingCollection", "ProductListingCriteriaEvent", "MigrationStep", "url_key", "priority", "locked", "naturalSorting", "storefront sort options"]
summary: How to add a custom product-listing sort option via a DB migration or at runtime through ProductListingCriteriaEvent.
lastBuilt: 2026-09-15
---
## What it is

Explains how to add individual sorting options ("sortings") for product listings in the Storefront, either persisted via a migration (manageable in Administration) or added on the fly at runtime.

## When to use

When a plugin needs to offer a custom sort order in the Storefront product listing dropdown, optionally editable by shop admins.

## Key steps / config

Manageable sorting (via migration):

```php
class Migration1615470599ExampleSorting extends MigrationStep
{
    public function update(Connection $connection): void { /* ... */ }
    public function updateDestructive(Connection $connection): void {}
}
```

Insert into `ProductSortingDefinition::ENTITY_NAME` with fields:

```
id, url_key, priority, active, locked, fields (json), created_at
```

Each entry in `fields` has `field`, `order` (`asc`/`desc`), `priority`, `naturalSorting`. Also insert a row into `product_sorting_translation` with `language_id`, `product_sorting_id`, `label`, `created_at`.

Runtime sorting (non-manageable): subscribe to `ProductListingCriteriaEvent` with high priority (e.g. `500`), build a `ProductSortingEntity`, add it to the `ProductSortingCollection` extension named `sortings` on the criteria.

## Essential identifiers

- `ProductSortingDefinition::ENTITY_NAME`
- `ProductSortingEntity`
- `ProductSortingCollection`
- `ProductListingCriteriaEvent`
- `product_sorting_translation` table

## Gotchas

- Do not edit an existing migration once the plugin is in use; create a new migration instead.
- Set `locked` to prevent Administration users from editing a sorting.
- Subscribers must use a high priority so their sorting is added before Shopware's default logic, otherwise the Storefront throws `ProductSortingNotFoundException`.
- Adding a sorting at runtime is not recommended when a persisted, editable sorting would suffice.
