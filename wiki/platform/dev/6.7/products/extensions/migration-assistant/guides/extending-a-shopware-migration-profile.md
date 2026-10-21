---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/migration-assistant/guides/extending-a-shopware-migration-profile.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
sourceHash: f1df00e073946edb8a590f09e8e53c59d2d2e674
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/guides/extending-a-shopware-migration-profile.html
title: Extending a Shopware migration profile
version: "6.7"
versions:
  - "6.7"
keywords: ["SwagMigrationAssistant", "plugin data migration", "BundleDataSet", "ProductDataSelection", "DataSelectionStruct", "AbstractReader", "ShopwareConverter", "shopware.migration.reader", "shopware.migration.converter", "shopware.migration.writer", "migration_assistant_extension.php", "SwagAdvDevBundle", "shopware 5 to 6"]
summary: "Migrate SW5 plugin data (SwagAdvDevBundle) via the Shopware profile: DataSet, decorated DataSelection, local reader, converter, writer."
lastBuilt: 2026-10-21
---
## What it is

A guide for extending the Shopware profile of the Migration Assistant (`SwagMigrationAssistant`) so that data of a Shopware 5 plugin — here `SwagAdvDevBundle` bundles (`s_bundles`, `s_bundle_products`) — is migrated into a Shopware 6 plugin entity `swag_bundle`. Only the local gateway is implemented.

## When to use

Your Shopware 6 plugin replaces a Shopware 5 plugin and its data should come across with the standard Shopware migration. The migration features can live in the existing plugin, which must stay installable without the Migration Assistant (optional requirement, see [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)). All services are registered in `migration_assistant_extension.php`.

## Key steps / config

1. **DataSet** — `BundleDataSet extends SwagMigrationAssistant\Migration\DataSelection\DataSet\DataSet`: `getEntity()` returns `'swag_bundle'`, `supports()` checks `instanceof ShopwareProfileInterface` (all Shopware profile versions), `getSnippet()` returns `'swag-migration.index.selectDataCard.entities.' . static::getEntity()`. Register it with the DataSet tag (see Gotchas); the `DataSetRegistry` resolves DataSets via `supports()`.
2. **Decorate the DataSelection** — bundles must be migrated after products, so wrap `SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductDataSelection`. The decorator delegates `supports()` and `getDataSetsRequiredForCount()`, appends `new BundleDataSet()` in `getDataSets()`, and rebuilds the struct in `getData()`:
   ```php
   return new DataSelectionStruct($dataSelection->getId(), $this->getDataSets(),
       $this->getDataSetsRequiredForCount(), $dataSelection->getSnippet(),
       $dataSelection->getPosition(), $dataSelection->getProcessMediaFiles(),
       DataSelectionStruct::PLUGIN_DATA_TYPE);
   ```
   Register with `->decorate(SwagMigrationAssistant\Profile\Shopware\DataSelection\ProductDataSelection::class)` and `->args([service('.inner')])`.
3. **Count snippets** — `en-GB.json` with key `swag-migration.index.selectDataCard.entities.swag_bundle` (e.g. `"Bundles:"`), loaded from `Resources/app/administration/main.js` through the locale factory's `extend('en-GB', enGBSnippets)`.
4. **Local reader** — `LocalBundleReader extends SwagMigrationAssistant\Profile\Shopware\Gateway\Local\Reader\AbstractReader`; `supports()` requires `ShopwareProfileInterface`, `ShopwareLocalGateway::GATEWAY_NAME` and `BundleDataSet::getEntity()`; `read()` uses `fetchIdentifiers('s_bundles', offset, limit)`, `addTableSelection()` and `mapData(..., [], ['bundles'])`, attaching product ids per bundle. Register with `->parent(SwagMigrationAssistant\Profile\Shopware\Gateway\Local\Reader\AbstractReader::class)` and tag `shopware.migration.reader`.
5. **Converter** — `BundleConverter extends SwagMigrationAssistant\Profile\Shopware\Converter\ShopwareConverter` with `supports()` (same condition as the reader), `getSourceIdentifier()`, `convert()`, `writeMapping()`. `convert()` calls `generateChecksum()`, `getOrCreateMapping()`, `convertValue()`, sets defaults `discountType = 'absolute'`, `discount = 0`, resolves products via `getMapping($connectionId, DefaultEntities::PRODUCT . '_mainProduct', ...)`, calls `updateMainMapping()` and returns `ConvertStruct`. Args `MappingService`, `LoggingService`; tag `shopware.migration.converter`.
6. **Target definition** — the converter output follows the Shopware 6 entity definition (use property names). A DAL definition must declare `getEntityName()` and `defineFields()`:
   ```php
   class BundleDefinition extends EntityDefinition
   {
       public function getEntityName(): string { return 'swag_bundle'; }
       protected function defineFields(): FieldCollection { /* id, name, discountType, discount, translations, products */ }
   }
   ```
7. **Writer** — `BundleWriter` extends the plugin's `SwagMigrationAssistant\Migration\Writer\AbstractWriter` and only implements `supports()` returning `BundleDataSet::getEntity()`. Register with `->parent(...AbstractWriter::class)`, args `Shopware\Core\Framework\DataAbstractionLayer\Write\EntityWriter` and `Swag\BundleExample\Core\Content\Bundle\BundleDefinition`, tag `shopware.migration.writer`.
8. Install the plugin, clear the cache, rebuild the Administration.

## Essential identifiers

- `DataSet`, `DataSelectionInterface`, `DataSelectionStruct::PLUGIN_DATA_TYPE`, `DataSetRegistry`
- `AbstractReader`, `ShopwareLocalGateway`, `TotalStruct`, `ShopwareConverter`, `ConvertStruct`, `DefaultEntities`
- `MappingService`, `LoggingService`, `EntityWriter`, `EntityDefinition`
- Tags: `shopware.migration.reader`, `shopware.migration.converter`, `shopware.migration.writer`

## Gotchas

- DataSets are tagged `shopware.migration.data_set` in the guide. The reader additionally implements `supportsTotal()` (local gateway check) and `readTotal()` returning `new TotalStruct(BundleDataSet::getEntity(), $total)` from `COUNT(*)` on `s_bundles`. These are Migration Assistant plugin APIs, not present in installed Shopware core, so verify them against your plugin version.
- The plugin's `AbstractWriter` is not core's `AbstractWriter` (ImportExport), which requires `append()`, `flush()`, `finish()`.
- The guide registers snippets with `Application.addInitializerDecorator(...)`, which the installed 6.7 Administration does not define.
- The reader snippet uses older DBAL calls (`ResultStatement`, `fetchColumn()`, `fetchAll()`, `Connection::PARAM_STR_ARRAY`).

## Code check (6.7.15.1)
- absent `supportsTotal` — Migration Assistant reader method, not in the installed code index
- absent `readTotal` — Migration Assistant reader method, not in the installed code index
- absent `shopware.migration.data_set` — plugin DI tag, not in the installed code index
- absent `addInitializerDecorator` — not defined anywhere in the installed 6.7 code index
- confirmed `EntityDefinition::getEntityName()` — abstract, must be implemented — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract protected, must be implemented — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `EntityWriter` — core DAL writer passed to the migration writer — vendor/shopware/core/Framework/DataAbstractionLayer/Write/EntityWriter.php:39
- confirmed `ProductDefinition` — core product definition referenced by the bundle association — vendor/shopware/core/Content/Product/ProductDefinition.php:83
- confirmed `ManyToManyAssociationField` — core field used for bundle products — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ManyToManyAssociationField.php:11
- confirmed `AbstractWriter::finish()` — core ImportExport writer, unrelated to the migration AbstractWriter — vendor/shopware/core/Content/ImportExport/Processing/Writer/AbstractWriter.php:19
