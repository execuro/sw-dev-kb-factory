---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/dataselection-and-dataset.md
title: DataSelection and DataSet
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/dataselection-and-dataset.html
sourceHash: 136658f6e07caedbc21202753ffed3d093fc0721
codeCheckedAgainst: "6.7.15.1"
keywords: ["DataSelection", "DataSet", "DataSelectionInterface", "DataSelectionStruct", "ProductDataSelection", "ProductDataSet", "ProductReviewDataSelection", "MediaDataSelection", "getDataSets", "getDataSetsRequiredForCount", "shopware.migration.data_selection", "migration assistant", "migration order", "what to migrate"]
summary: Migration Assistant DataSelection (ordered group of DataSets, with position) and DataSet (one entity) - interfaces, ordering rules, registration.
lastBuilt: 2026-10-21
---
## What it is

`DataSelection` and `DataSet` are the Migration Assistant structures that define what gets migrated. A `DataSet` represents one entity (e.g. a database table); a `DataSelection` is an ordered group of one or more `DataSets` that the user selects in the Administration.

Examples from the Shopware profile:

- `ProductDataSelection` (position 100): `MediaFolderDataSet`, `ProductAttributeDataSet`, `ProductPriceAttributeDataSet`, `ManufacturerAttributeDataSet`, `ProductDataSet`, `PropertyGroupOptionDataSet`, `ProductOptionRelationDataSet`, `ProductPropertyRelationDataSet`, `TranslationDataSet`, `CrossSellingDataSet` (the code example also adds `MainVariantRelationDataSet`)
- `MediaDataSelection` (position 300): `MediaFolderDataSet`, `MediaDataSet`

## When to use

- Adding migration support for your plugin's data (extend a profile with a new `DataSelection`).
- Controlling the order in which entities are migrated, or the counts shown in the Administration.

## Key steps / config

1. Implement `DataSelectionInterface` (e.g. `SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductDataSelection`) with an `IDENTIFIER` constant and:
   - `supports(MigrationContextInterface $migrationContext): bool` — e.g. profile `instanceof ShopwareProfileInterface`
   - `getData(): DataSelectionStruct`
   - `getDataSets(): array` — the `DataSets`, in processing order
   - `getDataSetsRequiredForCount(): array` — `DataSets` whose count is displayed in the Administration
2. Build the `DataSelectionStruct` argument list:

```php
return new DataSelectionStruct(
    self::IDENTIFIER,
    $this->getDataSets(),
    $this->getDataSetsRequiredForCount(),
    'swag-migration.index.selectDataCard.dataSelection.products', // snippet
    100,   // position (lower = migrated earlier)
    true,  // process-media needed
    DataSelectionStruct::BASIC_DATA_TYPE, // core data vs plugin data
    false  // required for every migration (user cannot unselect)
);
```

3. Implement each `DataSet` by extending `DataSet` (e.g. `SwagMigrationAssistant\Profile\Shopware\DataSelection\DataSet\ProductDataSet`): `public static function getEntity(): string` (e.g. `DefaultEntities::PRODUCT`) and `supports(MigrationContextInterface $migrationContext): bool`.
4. Register the `DataSelection` as a service and tag it with the Migration Assistant's DataSelection service tag (tag name as given by the docs — see Gotchas and Code check).

## Essential identifiers

- `DataSelectionInterface`, `DataSelectionStruct`, `DataSelectionStruct::BASIC_DATA_TYPE`
- `DataSet`, `getEntity()`, `supports()`
- `getData()`, `getDataSets()`, `getDataSetsRequiredForCount()`
- `ProductDataSelection` (`IDENTIFIER = 'products'`), `ProductReviewDataSelection` (`IDENTIFIER = 'productReviews'`), `MediaDataSelection`
- `ProductDataSet`, `MediaFolderDataSet`, `CustomerDataSet`, `ProductReviewDataSet`

## Gotchas

- The order of `DataSets` returned by `getDataSets()` is the processing order — it matters.
- The docs register selections with `$services->set(ProductDataSelection::class)->tag('shopware.migration.data_selection');`. That tag is defined by the SwagMigrationAssistant plugin, not by Shopware core.
- The same `DataSet` may appear in several `DataSelections` (only if no other option exists). `ProductReviewDataSelection` repeats the product `DataSets` plus `CustomerAttributeDataSet`, `CustomerDataSet` and `ProductReviewDataSet`, because they are needed even when the product selection is not chosen. If both are selected, each `DataSet` is migrated only once, at its first occurrence.

## Code check (6.7.15.1)
- absent `shopware.migration.data_selection` — tag not found anywhere in the installed core/storefront/administration code; it belongs to the SwagMigrationAssistant plugin
- confirmed `SwagMigrationAssistant` — plugin offered by the admin first-run wizard data import — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/view/sw-first-run-wizard-data-import/index.js:31
- unverified `DataSelectionInterface` — defined in the separate SwagMigrationAssistant plugin, out of scope
- unverified `DataSelectionStruct` — plugin class, out of scope
- unverified `DataSet` — plugin base class, out of scope
- unverified `ProductDataSelection` — plugin class, out of scope
