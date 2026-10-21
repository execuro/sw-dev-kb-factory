---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/convert-and-mapping.md
title: Convert and Mapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/convert-and-mapping.html
sourceHash: 99f86a10fc8de40986ed68677d0b58e1983cdb34
codeCheckedAgainst: "6.7.15.1"
keywords: ["ShopwareConverter", "ConvertStruct", "MappingService", "getOrCreateMapping", "getMapping", "generateChecksum", "updateMainMapping", "getSourceIdentifier", "swag_migration_mapping", "mappingIds", "mainMapping", "deltas", "checksum", "converter", "migration assistant"]
summary: Migration Assistant converters and mapping - ShopwareConverter::convert(), MappingService getOrCreateMapping/getMapping, checksum deltas, mappingIds.
lastBuilt: 2026-10-21
---
## What it is

How the Migration Assistant turns data read by `Reader` objects into Shopware 6 format with `Converter` classes, and how it maps source identifiers to new Shopware 6 IDs in the `swag_migration_mapping` table. Mappings are stored per connection and persist after the migration; converted data is removed.

## When to use

- Writing or decorating a converter for a migration profile.
- Resolving source-system IDs of related entities (manufacturer, unit, payment method) to Shopware 6 IDs.
- Making repeated migrations skip unchanged data (deltas) and batch mapping lookups.

## Key steps / config

1. Register the converter in the service container with `ShopwareConverter` as parent:

```php
$services->set(ProductConverter::class)
    ->abstract()
    ->parent(ShopwareConverter::class)
    ->args([/* ... */]);
```

2. Extend `ShopwareConverter` and implement `convert()`; it receives one data entry at a time and returns a `ConvertStruct` usable by the writer:

```php
public function convert(array $data, Context $context, MigrationContextInterface $migrationContext): ConvertStruct
{
    $this->generateChecksum($data);          // first line, on raw reader data
    // ... build $converted, create mappings ...
    $this->updateMainMapping($migrationContext, $context);
    $mainMapping = $this->mainMapping['id'] ?? null;
    return new ConvertStruct($converted, $returnData, $mainMapping);
}
```

3. Implement `getSourceIdentifier(array $data): string` returning the main identifier of the incoming data (e.g. `$data['detail']['ordernumber']` for products); it is used to find already migrated data.
4. Resolve IDs through the mapping service:
   - `getOrCreateMapping($connectionId, $entityName, $oldIdentifier, $context, ?$checksum, ?$additionalData, ?$uuid, ?$entityValue)` returns the existing mapping or creates a new `swag_migration_mapping` row; passing `$uuid`, `$additionalData` or `$entityValue` updates and saves an existing mapping.
   - `getMapping($connectionId, $entityName, $oldIdentifier, $context)` only reads (returns `null` if missing, cached per entity + old identifier) — use it for premapped entities such as payment methods; log a `ConvertEntityUnknownLog` via `MigrationLogBuilder` when it returns `null`.
5. Assign the result of the entity's own `getOrCreateMapping()` (with the checksum) to `$this->mainMapping`, and append every related mapping's `id` to `$this->mappingIds`.
6. Call `updateMainMapping()` before returning, and return the main mapping ID in the `ConvertStruct`.

## Essential identifiers

- `ShopwareConverter`, base `Converter` (implements `ConverterInterface`)
- `convert()`, `getSourceIdentifier()`, `generateChecksum()`, `updateMainMapping()`
- `ConvertStruct`, `$mainMapping`, `$mappingIds`
- `MappingService` (implements `MappingServiceInterface`, `ResetInterface`): `getOrCreateMapping()`, `getMapping()`
- `DefaultEntities::PRODUCT`, `DefaultEntities::PRODUCT_MAIN`, `DefaultEntities::UNIT`
- table `swag_migration_mapping`
- `MigrationEntityValidationService`, `MigrationFieldValidationService`, `MigrationDataConverter::filterDeltas()`

## Gotchas

- Converters do not validate required or invalid fields; validation runs in Error Resolution (`MigrationEntityValidationService`, `MigrationFieldValidationService`). Converters should still return early with a `ConvertStruct` without a converted entity when data cannot reasonably be converted (e.g. unknown type).
- Deltas: if the main mapping's checksum equals the incoming data's checksum, the record is skipped by the converter and the writer (see `filterDeltas()` in `MigrationDataConverter`). This only works if `mainMapping` is set and returned in the `ConvertStruct`.
- `generateChecksum()` hashes `serialize($data)` — call it on the raw reader data, before modifying it.
- Related mappings in `mappingIds` are prefetched at once in later migrations, reducing `getMapping()` database queries; they are only stored if `updateMainMapping()` runs before returning.

## Code check (6.7.15.1)
- confirmed `Context` — core context class used in converter and mapping signatures — vendor/shopware/core/Framework/Context.php:18
- confirmed `Hasher::hash()` — core hasher used by `generateChecksum()` — vendor/shopware/core/Framework/Util/Hasher.php:17
- confirmed `Uuid::fromHexToBytes()` — used by `getMapping()` for the connection ID — vendor/shopware/core/Framework/Uuid/Uuid.php:116
- confirmed `Uuid::fromBytesToHex()` — used to convert mapping IDs back to hex — vendor/shopware/core/Framework/Uuid/Uuid.php:67
- confirmed `CustomerDefinition::ENTITY_NAME` — value `customer`, used in the payment-method mapping log — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- unverified `ShopwareConverter` — defined in the separate SwagMigrationAssistant plugin, out of scope
- unverified `MappingService::getOrCreateMapping()` — plugin class, out of scope
- unverified `MappingService::getMapping()` — plugin class, out of scope
- unverified `swag_migration_mapping` — table created by the plugin, out of scope
- unverified `MigrationDataConverter::filterDeltas()` — plugin class, out of scope
