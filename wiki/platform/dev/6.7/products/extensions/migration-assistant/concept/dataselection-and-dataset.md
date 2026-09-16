---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/dataselection-and-dataset.md
title: DataSelection and DataSet
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/dataselection-and-dataset.html
sourceHash: 136658f6e07caedbc21202753ffed3d093fc0721
codeCheckedAgainst: "6.7.13.0"
keywords: ["DataSelection", "DataSet", "DataSelectionInterface", "DataSelectionStruct", "ProductDataSelection", "ProductDataSet", "ProductReviewDataSelection", "getDataSetsRequiredForCount", "getEntity", "SwagMigrationAssistant", "migration assistant", "migration order", "data to migrate"]
summary: "Migration Assistant DataSelection groups ordered DataSets; position sets migration order, getDataSetsRequiredForCount drives the Admin count."
lastBuilt: 2026-09-15
---
## What it is

In the Shopware Migration Assistant (`SwagMigrationAssistant`), a `DataSelection` is the unit a user selects for migration; each one consists of one or more `DataSets`, and each `DataSet` stands for one entity type to migrate. Example from the docs:

- `ProductDataSelection` (position 100): `MediaFolderDataSet`, `ProductAttributeDataSet`, `ProductPriceAttributeDataSet`, `ManufacturerAttributeDataSet`, `ProductDataSet`, `PropertyGroupOptionDataSet`, `ProductOptionRelationDataSet`, `ProductPropertyRelationDataSet`, `TranslationDataSet`, `CrossSellingDataSet`
- `MediaDataSelection` (position 300): `MediaFolderDataSet`, `MediaDataSet`

## When to use

When adding a new migratable data group to a Migration Assistant profile, or when you need to understand in which order entities are migrated.

## Key steps / config

1. Implement `DataSelectionInterface` (docs example: `SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductDataSelection`):
   - `supports(MigrationContextInterface $migrationContext): bool`: e.g. checks `$migrationContext->getProfile() instanceof ShopwareProfileInterface`.
   - `getData(): DataSelectionStruct`: returns `new DataSelectionStruct(IDENTIFIER, getDataSets(), getDataSetsRequiredForCount(), snippetName, position, processMediaNeeded, DataSelectionStruct::BASIC_DATA_TYPE, requiredForEveryMigration)`.
   - `getDataSets(): array`: the `DataSet` instances. **The array order is the processing order.**
   - `getDataSetsRequiredForCount(): array`: the `DataSets` whose count is shown in the Administration (for products: only `ProductDataSet`).
2. Give the class a `public const IDENTIFIER` (e.g. `'products'`, `'productReviews'`) and a snippet name such as `'swag-migration.index.selectDataCard.dataSelection.products'`.
3. Implement each `DataSet` by extending `DataSet`:

```php
class ProductDataSet extends DataSet
{
    public static function getEntity(): string { return DefaultEntities::PRODUCT; }
    public function supports(MigrationContextInterface $migrationContext): bool { /* ... */ }
}
```

4. Register the `DataSelection` class as a tagged service in the plugin's service configuration. See Gotchas for the tag name.

## Essential identifiers

- `DataSelectionInterface`, `DataSelectionStruct`, `DataSelectionStruct::BASIC_DATA_TYPE`
- `DataSet`, `DataSet::getEntity()`, `DefaultEntities::PRODUCT`
- `getDataSets()`, `getDataSetsRequiredForCount()`
- `SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductDataSelection`
- `SwagMigrationAssistant\Profile\Shopware\DataSelection\DataSet\ProductDataSet`
- `SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductReviewDataSelection`

## Gotchas

- `DataSelection` position: lower numbers are migrated earlier.
- The same `DataSet` may appear in several `DataSelections` (only if no other option exists). `ProductReviewDataSelection` repeats the product `DataSets` plus `CustomerAttributeDataSet`, `CustomerDataSet` and `ProductReviewDataSet`, so reviews still work when products are not selected. If both are selected, each `DataSet` is migrated once, at its first occurrence.
- The docs register selections with the tag `shopware.migration.data_selection`. The Migration Assistant plugin is not part of the installed code index, so this tag could not be checked. Confirm it against the installed plugin version.
- The prose list for `ProductDataSelection` leaves out `MainVariantRelationDataSet`, but the code example lists it last in `getDataSets()`.

## Code check (6.7.13.0)
- absent `shopware.migration.data_selection` — not found in the installed code index; SwagMigrationAssistant is not installed under vendor/shopware
- confirmed `SwagMigrationAssistant` — core only refers to the plugin by name (first-run wizard data import) — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:38
- unverified `DataSelectionInterface` — plugin class, plugin not installed in vendor/shopware
- unverified `DataSelectionStruct` — plugin class, plugin not installed in vendor/shopware
- unverified `DataSet` — plugin base class, plugin not installed in vendor/shopware
- unverified `getDataSetsRequiredForCount` — plugin method, plugin not installed in vendor/shopware
- unverified `DefaultEntities::PRODUCT` — plugin constant, plugin not installed in vendor/shopware
