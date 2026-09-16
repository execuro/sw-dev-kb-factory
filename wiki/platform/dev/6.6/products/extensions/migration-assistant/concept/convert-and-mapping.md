---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/convert-and-mapping.md
title: Convert and Mapping
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/convert-and-mapping.html
sourceHash: 0996e0528b55d70b98ef4ec92824e9a3d1af1956
keywords: ["Converter", "ShopwareConverter", "ConvertStruct", "MappingService", "getOrCreateMapping", "getMapping", "checksum", "generateChecksum", "getSourceIdentifier", "swag_migration_mapping", "delta", "mainMapping", "mappingIds"]
summary: "How Migration Assistant Converters transform source data into ConvertStruct via MappingService, checksums, and delta detection."
lastBuilt: "2026-09-15"
---
## What it is

Explains how `Converter` objects transform data read by `Reader` objects into a format Shopware 6 can use, and how the mapping table and checksums (deltas) track identifiers across repeated migration runs.

## When to use

Needed when writing or decorating a `Converter` for a new entity or profile, or when investigating why repeated migrations skip or re-migrate certain rows.

## Key steps / config

Converters extend `ShopwareConverter` and are registered per profile:

```xml
<service id="SwagMigrationAssistant\Profile\Shopware\Converter\ProductConverter"
         parent="SwagMigrationAssistant\Profile\Shopware\Converter\ShopwareConverter" abstract="true">
    <argument type="service" id="SwagMigrationAssistant\Migration\Media\MediaFileService"/>
</service>
```

Each converter implements `convert(array $data, Context $context, MigrationContextInterface $migrationContext): ConvertStruct` and `getSourceIdentifier(array $data): string` (the source data's own unique identifier, used for delta detection). `convert` calls `checkForEmptyRequiredDataFields`; if required fields are missing it returns `new ConvertStruct(null, $data)` and logs an `EmptyNecessaryFieldRunLog`. Otherwise it returns `new ConvertStruct($converted, $returnData, $mainMapping)` where `$converted` is the Shopware 6 shape and `$returnData` holds unmapped source fields.

Mapping: `MappingService::getOrCreateMapping($connectionId, $entityName, $oldIdentifier, $context, $checksum, $additionalData, $uuid)` returns an existing mapping or creates one; `MappingService::getMapping($connectionId, $entityName, $oldIdentifier, $context)` only looks up an existing mapping without creating one.

Deltas: `Converter::generateChecksum(array $data): void` sets `$this->checksum = md5(serialize($data))` at the start of `convert`. The checksum is passed into `getOrCreateMapping` for the main mapping; if it matches the stored checksum on a later run, the row is skipped by both converter and writer, speeding up repeated migrations. The `mainMapping` value must be returned inside the `ConvertStruct` so the checksum is saved against the correct mapping. The comparison logic lives in `filterDeltas` on `MigrationDataConverter`.

Performance: the `Converter` base class exposes a `mappingIds` array; append related mapping IDs (`$this->mappingIds[] = $mapping['id'];`) so future runs can fetch related mappings in bulk instead of one `getMapping` call at a time. Call `updateMainMapping` before returning the `ConvertStruct` to persist these related IDs on the main mapping.

## Essential identifiers

`ShopwareConverter`, `ConvertStruct`, `convert()`, `getSourceIdentifier()`, `MappingService::getOrCreateMapping()`, `MappingService::getMapping()`, `generateChecksum()`, `filterDeltas` (`MigrationDataConverter`), `mainMapping`, `mappingIds`, `swag_migration_mapping` table.

## Gotchas

Forgetting to return `mainMapping` inside the `ConvertStruct` breaks checksum persistence for deltas, so unchanged rows won't be correctly skipped on the next migration run.
