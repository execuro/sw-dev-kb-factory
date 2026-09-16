---
id: platform/dev/6.7/products/extensions/migration-assistant/guides/extending-a-shopware-migration-profile.md
title: Extending a Shopware migration profile
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/extending-a-shopware-migration-profile.html
sourceHash: f1df00e073946edb8a590f09e8e53c59d2d2e674
codeCheckedAgainst: "6.7.13.0"
keywords: ["extend migration profile", "plugin data migration", "BundleDataSet", "ProductDataSelection", "DataSelectionStruct", "LocalBundleReader", "BundleConverter", "BundleWriter", "AbstractWriter", "EntityDefinition", "shopware.migration.reader", "shopware.migration.converter", "shopware.migration.writer", "migration_assistant_extension.php", "SwagAdvDevBundle"]
summary: "Extend the SW5 profile of SwagMigrationAssistant for plugin data: BundleDataSet, decorated ProductDataSelection, local reader, converter, writer."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md"]
---
## What it is

Example of extending the Migration Assistant's Shopware profile so a Shopware 5 plugin's data (`SwagAdvDevBundle`, tables `s_bundles`/`s_bundle_products`) migrates into a Shopware 6 plugin entity `swag_bundle`. Only the local gateway is implemented.

## When to use

A Shopware 6 plugin replaces a Shopware 5 plugin and its data must follow the standard migration. Services go into `migration_assistant_extension.php`, loaded only when the Migration Assistant is installed (see [database migrations guide](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)).

## Key steps / config

1. **DataSet** — `BundleDataSet extends SwagMigrationAssistant\Migration\DataSelection\DataSet\DataSet`: `static getEntity()` returns `'swag_bundle'`; `supports()` checks `ShopwareProfileInterface`; `getSnippet()` returns `'swag-migration.index.selectDataCard.entities.' . static::getEntity()`. Register it as a tagged service (tag in Gotchas); `DataSetRegistry` picks DataSets via `supports()`.
2. **Decorate `ProductDataSelection`** (bundles after products) — implements `DataSelectionInterface`, wraps the inner one; `getDataSets()` appends `new BundleDataSet()`; `getData()` returns a new `DataSelectionStruct` copying id, snippet, position and process-media flag, with `DataSelectionStruct::PLUGIN_DATA_TYPE` as last argument.

```php
$services->set(SwagMigrationBundleExample\Profile\Shopware\DataSelection\ProductDataSelection::class)
    ->decorate(SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductDataSelection::class)
    ->args([service('.inner')]);
```

3. **Count snippet** — key `swag-migration.index.selectDataCard.entities.swag_bundle` in `en-GB.json`, registered in `Resources/app/administration/main.js` via `Shopware.Locale.extend('en-GB', enGBSnippets)`.
4. **Local reader** — `LocalBundleReader extends SwagMigrationAssistant\Profile\Shopware\Gateway\Local\Reader\AbstractReader`; `supports()` (Shopware profile, local gateway, bundle entity) and `read()` using `fetchIdentifiers()`, `addTableSelection()`, `mapData()`. Service: `->parent(SwagMigrationAssistant\Profile\Shopware\Gateway\Local\Reader\AbstractReader::class)->tag('shopware.migration.reader')`.
5. **Converter** — `BundleConverter extends SwagMigrationAssistant\Profile\Shopware\Converter\ShopwareConverter`: `supports()` (same condition as the reader), `getSourceIdentifier()`, `convert()` returning `ConvertStruct` (`getOrCreateMapping()`, `convertValue()`, defaults `discountType`/`discount`, product ids via mapping `DefaultEntities::PRODUCT . '_mainProduct'`), `writeMapping()`. Args `MappingService`, `LoggingService`; tag `shopware.migration.converter`. Use property names from the target definition:

```php
class BundleDefinition extends EntityDefinition
{
    public function getEntityName(): string { return 'swag_bundle'; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new StringField('discount_type', 'discountType'))->addFlags(new Required()),
            new ManyToManyAssociationField('products', ProductDefinition::class, BundleProductDefinition::class, 'bundle_id', 'product_id'),
        ]);
    }
}
```

6. **Writer** — `BundleWriter` extends the plugin's `SwagMigrationAssistant\Migration\Writer\AbstractWriter`, implementing only `supports()` (returns `BundleDataSet::getEntity()`).

```php
$services->set(BundleWriter::class)
    ->parent(SwagMigrationAssistant\Migration\Writer\AbstractWriter::class)
    ->args([
        service(Shopware\Core\Framework\DataAbstractionLayer\Write\EntityWriter::class),
        service(Swag\BundleExample\Core\Content\Bundle\BundleDefinition::class),
    ])
    ->tag('shopware.migration.writer');
```

Then install the plugin, clear the cache, rebuild the Administration.

## Essential identifiers

- `DataSet`, `DataSelectionStruct`, `DataSetRegistry`, `AbstractReader`, `ShopwareConverter`, `SwagMigrationAssistant\Migration\Writer\AbstractWriter`
- `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`, `Shopware\Core\Framework\DataAbstractionLayer\Write\EntityWriter`
- `shopware.migration.reader`, `shopware.migration.converter`, `shopware.migration.writer`

## Gotchas

- The source tags DataSets `shopware.migration.data_set`; that plugin string is absent from installed Shopware packages.
- The source reader also has `supportsTotal()`/`readTotal()` (a `COUNT(*)` on `s_bundles`); plugin methods, not in vendor/shopware.
- The plugin's `AbstractWriter` is unrelated to core's ImportExport `AbstractWriter` (`append`/`flush`/`finish`).
- Core marks `EntityWriter` `@internal`.
- The source registers snippets with `Application.addInitializerDecorator`, not present in the installed Administration.

## Code check (6.7.13.0)
- absent `supportsTotal` — reader total-support method from the plugin, no hit in the installed code index
- absent `readTotal` — reader total-count method from the plugin, no hit in the installed code index
- absent `shopware.migration.data_set` — plugin DataSet tag, not in installed Shopware packages
- confirmed `EntityDefinition::getEntityName()` — abstract, must be declared — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract protected, must be declared — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\Write\EntityWriter` — exists, marked internal — vendor/shopware/core/Framework/DataAbstractionLayer/Write/EntityWriter.php:39
- confirmed `Shopware\Core\Content\Product\ProductDefinition` — association target — vendor/shopware/core/Content/Product/ProductDefinition.php:83
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToManyAssociationField` — products association — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyAssociationField.php:11
- absent `addInitializerDecorator` — not found in any installed Shopware package
- confirmed `LocaleFactory.extend` — exposed as `Shopware.Locale.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:192
