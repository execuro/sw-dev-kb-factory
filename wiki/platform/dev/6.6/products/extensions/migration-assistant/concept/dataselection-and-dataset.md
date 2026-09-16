---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/dataselection-and-dataset.md
title: DataSelection and DataSet
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/dataselection-and-dataset.html
sourceHash: 8db1b3854aa3b0282226ba9d0859171710f4c0b6
keywords: ["DataSelection", "DataSet", "DataSelectionInterface", "DataSelectionStruct", "getDataSets", "getDataSetsRequiredForCount", "shopware.migration.data_selection", "ProductDataSelection", "ProductDataSet", "ProductReviewDataSelection", "processing order"]
summary: "DataSelection groups ordered DataSets defining what to migrate; explains getData/getDataSets and registration tag shopware.migration.data_selection."
lastBuilt: "2026-09-15"
---
## What it is

`DataSelection` and `DataSet` are the fundamental data structures defining what the Migration Assistant migrates: each `DataSet` represents one entity (e.g. a database table), and each `DataSelection` groups an ordered list of `DataSets`.

## When to use

Needed when adding a new migratable entity, or grouping several entities into a selectable migration option shown in the Administration.

## Key steps / config

The order of `DataSets` inside a `DataSelection` is significant — it defines processing order. `DataSelection` also carries a position controlling the order in which selections migrate (lower numbers run earlier). `getDataSetsRequiredForCount` returns the `DataSets` whose count is shown in the Administration.

`DataSelection` example shape (`ProductDataSelection implements DataSelectionInterface`):

```php
class ProductDataSelection implements DataSelectionInterface {
    public const IDENTIFIER = 'products';
    public function supports(MigrationContextInterface $migrationContext): bool { /* ... */ }
    public function getData(): DataSelectionStruct { /* ... */ }
    public function getDataSets(): array { /* ordered DataSet list */ }
    public function getDataSetsRequiredForCount(): array { /* ... */ }
}
```

`getData()` returns `new DataSelectionStruct(self::IDENTIFIER, $this->getDataSets(), $this->getDataSetsRequiredForCount(), 'swag-migration.index.selectDataCard.dataSelection.products', 100, true, DataSelectionStruct::BASIC_DATA_TYPE, false)` — arguments are identifier, data sets, count data sets, snippet name, position, whether media processing is needed, data type, and whether the selection is required.

A `DataSet` example (`ProductDataSet extends DataSet`) implements `getEntity(): string` (returning e.g. `DefaultEntities::PRODUCT`) and `supports()`.

Registration:

```xml
<service id="SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductDataSelection">
    <tag name="shopware.migration.data_selection"/>
</service>
```

The same `DataSet` can appear in multiple `DataSelection`s (only if unavoidable) — e.g. `ProductReviewDataSelection` repeats several `ProductDataSelection` data sets because they're required even if the user doesn't select the product `DataSelection`; if the user selects both, the shared `DataSets` migrate only once (first occurrence).

## Essential identifiers

`DataSelectionInterface`, `DataSelectionStruct`, `DataSet`, `getDataSets()`, `getDataSetsRequiredForCount()`, `DataSelectionStruct::BASIC_DATA_TYPE`, `shopware.migration.data_selection` tag, `ProductDataSelection`, `ProductDataSet`, `ProductReviewDataSelection`.

## Gotchas

Order matters twice: the position within `getDataSets()` sets processing order for the `DataSets` inside one `DataSelection`, and the `DataSelectionStruct` position argument sets the order between different `DataSelections`. Duplicating a `DataSet` across selections is only recommended when there is no other option.
