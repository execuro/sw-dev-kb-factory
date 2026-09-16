---
id: platform/dev/6.6/products/extensions/migration-assistant/guides/extending-a-shopware-migration-profile.md
title: Extending a Shopware migration profile
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/guides/extending-a-shopware-migration-profile.html
sourceHash: db8d7da860804b99f08c220c514beaec43409899
keywords: ["migration profile", "DataSet", "BundleDataSet", "DataSelectionInterface", "ProductDataSelection", "shopware.migration.data_set", "shopware.migration.reader", "shopware.migration.converter", "shopware.migration.writer", "AbstractReader", "AbstractWriter", "ShopwareConverter", "EntityDefinition", "migration_assistant_extension.xml"]
summary: "Example of extending a Shopware migration profile with a custom bundle DataSet, reader, converter, and writer."
lastBuilt: "2026-09-15"
---
## What it is

A worked example of extending a Shopware Migration Assistant profile to migrate a custom Shopware 5 entity (a "bundle") to Shopware 6, using the local gateway, by adding a new `DataSet`, local reader, converter, entity definition, and writer.

## When to use

Use this when your plugin has its own database entity in Shopware 5 that the standard Migration Assistant profile does not know how to migrate, and you need to add that entity type to the existing migration pipeline (data selection, reading, converting, writing) without forking the whole profile.

## Key steps / config

1. Create a `DataSet` for the entity, extending `DataSet`, implementing `getEntity()` (e.g. returns `'swag_bundle'`), `supports(MigrationContextInterface)`, and `getSnippet()`.
2. Decorate `ProductDataSelection` (implementing `DataSelectionInterface`) to append the new `DataSet` in `getDataSets()`, since bundle entities must migrate after products.
3. Register both in `migration_assistant_extension.xml`: decorate `ProductDataSelection` via the `decorates` attribute, and tag the `DataSet` service with `<tag name="shopware.migration.data_set"/>`. The `DataSetRegistry` collects all tagged `DataSet`s and matches by `supports()`.
4. Add snippet entries under `swag-migration.index.selectDataCard.entities.<entity>` for the entity-count description, e.g.:
   ```json
   { "swag-migration": { "index": { "selectDataCard": { "entities": { "swag_bundle": "Bundles:" } } } } }
   ```
   registered in `Resources/app/administration/main.js`.
5. Create a local reader extending `AbstractReader`, implementing `supportsTotal()`, `readTotal()`, `supports()`, and `read()`; tag it `shopware.migration.reader` and set its `parent` to `AbstractReader` in `migration_assistant_extension.xml`.
6. Create a converter extending `ShopwareConverter`, implementing `supports()`, `getSourceIdentifier()`, and `convert()` (using `$this->mappingService->getOrCreateMapping()` and `$this->convertValue()`); tag it `shopware.migration.converter`.
7. Define the Shopware 6 target entity with an `EntityDefinition` subclass (e.g. `BundleDefinition`) declaring fields via `FieldCollection`.
8. Create a writer extending `AbstractWriter`, implementing only `supports()`; register it with `parent="...AbstractWriter"`, injecting `EntityWriter` and the entity's `Definition`, tagged `shopware.migration.writer`.

## Essential identifiers

- `DataSet`, `BundleDataSet::getEntity()`, `DataSelectionInterface`, `DataSelectionStruct`
- `shopware.migration.data_set`, `shopware.migration.reader`, `shopware.migration.converter`, `shopware.migration.writer` (service tags)
- `AbstractReader`, `AbstractWriter`, `ShopwareConverter`, `DataSetRegistry`
- `migration_assistant_extension.xml`

## Gotchas

The bundle `DataSet` must be added to `ProductDataSelection` because bundle entities have to migrate after products are migrated. Always set the `parent` property on readers/writers to `AbstractReader`/`AbstractWriter` so the base class logic is inherited correctly. After implementing, you must install the plugin, clear the cache, and rebuild the Administration for the snippets and migration to take effect.
