---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/convert-and-mapping.md
title: Convert and Mapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/convert-and-mapping.html
sourceHash: 99f86a10fc8de40986ed68677d0b58e1983cdb34
codeCheckedAgainst: "6.7.13.0"
keywords: ["ShopwareConverter", "convert()", "getSourceIdentifier()", "ConvertStruct", "MappingService", "getOrCreateMapping()", "getMapping()", "swag_migration_mapping", "generateChecksum()", "updateMainMapping()", "mainMapping", "mappingIds", "deltas", "checksum", "migration converter"]
summary: "Migration Assistant converters: extend ShopwareConverter, implement convert()/getSourceIdentifier(), MappingService mappings, checksum deltas, mappingIds."
lastBuilt: 2026-09-15
---
## What it is

How Migration Assistant `Converter` objects turn reader data into Shopware 6 format, and how the `MappingService` maps source identifiers to Shopware 6 IDs in table `swag_migration_mapping`, including checksum-based deltas. Converted data is removed after the migration; mappings persist per connection.

## When to use

When writing or decorating a migration converter, resolving related-entity IDs across repeated migrations, or making re-migrations skip unchanged data.

## Key steps / config

1. Register the converter with `ShopwareConverter` as parent service:
   ```php
   $services->set(ProductConverter::class)
       ->abstract()
       ->parent(ShopwareConverter::class)
       ->args([/* ... */]);
   ```
2. Extend `ShopwareConverter`; implement `convert()` (one data entry per call) and `getSourceIdentifier()` (main identifier of incoming data, used for deltas):
   ```php
   abstract class ProductConverter extends ShopwareConverter
   {
       public function convert(array $data, Context $context, MigrationContextInterface $migrationContext): ConvertStruct
       {
           $this->generateChecksum($data);
           // ... build $converted and mappings ...
           $this->updateMainMapping($migrationContext, $context);
           $mainMapping = $this->mainMapping['id'] ?? null;
           return new ConvertStruct($converted, $returnData, $mainMapping);
       }
       public function getSourceIdentifier(array $data): string { /* e.g. $data['detail']['ordernumber'] */ }
   }
   ```
3. Map IDs through the mapping service:
   - `getOrCreateMapping($connectionId, $entityName, $oldIdentifier, $context, ?$checksum, ?$additionalData, ?$uuid, ?$entityValue)` returns the existing mapping or creates one (no duplicates); use its `entityId`. Entity names come from `DefaultEntities` (e.g. `DefaultEntities::PRODUCT`).
   - `getMapping($connectionId, $entityName, $oldIdentifier, $context)` only reads (cached), never creates, and returns `null` if none exists — typical for premapped entities.
4. Deltas: call `generateChecksum()` (base `Converter`) first with the raw reader data and set `mainMapping`. If the main mapping's checksum equals the incoming one, converter and writer skip the entry (`filterDeltas()` in `MigrationDataConverter`). Return `mainMapping` in the `ConvertStruct`.
5. Performance: add related mapping IDs to `$this->mappingIds[]`; they are fetched at once in later migrations. Call `updateMainMapping()` before returning to store them.

## Essential identifiers

- `ShopwareConverter`, base `SwagMigrationAssistant\Migration\Converter\Converter`
- `convert()`, `getSourceIdentifier()`, `generateChecksum()`, `updateMainMapping()`, `mainMapping`, `mappingIds`
- `SwagMigrationAssistant\Migration\Mapping\MappingService`: `getOrCreateMapping()`, `getMapping()`
- `ConvertStruct`, `MigrationContextInterface`, `DefaultEntities`
- `swag_migration_mapping`

## Gotchas

- Converters do not validate required/invalid fields; Error Resolution does (`MigrationEntityValidationService`, `MigrationFieldValidationService`). Return early with a `ConvertStruct` without converted entity when data cannot reasonably be converted.
- Without `mainMapping` set and returned, deltas do not work.

## Code check (6.7.13.0)
- confirmed `Hasher::hash()` — core hash helper used by `generateChecksum()` — vendor/shopware/core/Framework/Util/Hasher.php:17
- confirmed `Uuid::fromHexToBytes()` — used by the mapping lookup query — vendor/shopware/core/Framework/Uuid/Uuid.php:116
- confirmed `Uuid::fromBytesToHex()` — converts mapping IDs back to hex — vendor/shopware/core/Framework/Uuid/Uuid.php:67
- confirmed `Context` — `Shopware\Core\Framework\Context` parameter of convert/mapping methods — vendor/shopware/core/Framework/Context.php:17
- confirmed `SwagMigrationAssistant` — plugin name referenced in core translation config — vendor/shopware/core/System/Resources/translation.yaml:10
- unverified `ShopwareConverter` — SwagMigrationAssistant plugin code not installed; out of scope
- unverified `MappingService::getOrCreateMapping()` — plugin code not installed; out of scope
- unverified `MappingService::getMapping()` — plugin code not installed; out of scope
- unverified `MigrationDataConverter::filterDeltas()` — plugin code not installed; out of scope
- unverified `swag_migration_mapping` — plugin table, not referenced in vendor/shopware; out of scope
