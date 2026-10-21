---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/premapping.md
title: Premapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/premapping.html
sourceHash: daf6a9e6516da815be5777bdee4d2a21cf132901
codeCheckedAgainst: "6.7.15.1"
keywords: ["premapping", "PremappingStruct", "SalutationReader", "MappingService", "getMapping", "CustomerConverter", "generate-premapping", "destinationUuid", "swag_migration_mapping", "premapping reader", "migration assistant", "value mapping", "choices"]
summary: Migration Assistant premapping - readers returning PremappingStruct (entity, choices, mapping), destinationUuid, and MappingService::getMapping() lookups.
lastBuilt: 2026-10-21
---
## What it is

Premapping in the Shopware Migration Assistant lets the user map source-system values (e.g. salutations) to existing Shopware 6 entities before a run. It reuses the normal mapping storage to keep the old identifier together with the equivalent new one.

## When to use

When a converter needs a user-chosen Shopware 6 target for a source value that cannot be derived automatically, or when you add a premapping reader for a new entity.

## Key steps / config

1. Write a premapping reader (e.g. `SalutationReader`) and register it as a service carrying the Migration Assistant's premapping reader tag (exact tag string: see Gotchas).
2. The reader returns a `PremappingStruct` with: the entity of the premapping, `choices` (Shopware 6 equivalents) and `mapping` (source structure including a destination/choice). Shape in the `generate-premapping` JSON response:

```json
{
  "entity": "salutation",
  "choices": [ { "uuid": "...", "description": "mr", "extensions": [] } ],
  "mapping": [
    { "sourceId": "mr", "description": "mr", "destinationUuid": "...", "extensions": [] },
    { "sourceId": "ms", "description": "ms", "destinationUuid": "", "extensions": [] }
  ]
}
```

3. `destinationUuid` in each `mapping` entry sets the destination; it is saved with the connection so the user does not decide again. `SalutationReader` shows the automatic assignment logic.
4. In the converter, resolve the new id via `MappingService`, as `CustomerConverter::getSalutation()` does:

```php
$mapping = $this->mappingService->getMapping(
    $this->connectionId, SalutationReader::getMappingName(), $salutation, $this->context
);
if ($mapping === null) { /* log ConvertEntityUnknownLog via loggingService */ return null; }
$this->mappingIds[] = $mapping['id'];
return $mapping['entityId'];
```

`getMapping()` looks up `swag_migration_mapping` by old identifier and entity name for the current connection and returns a mapping object with `id`, `entityId` and, depending on mapping type, optional `entityValue` and `additionalData`. A `null` result means no valid mapping: log it with the LoggingService (`MigrationLogBuilder::fromMigrationContext(...)->build(ConvertEntityUnknownLog::class)`).

## Essential identifiers

- `PremappingStruct`, `SalutationReader`, `SalutationReader::getMappingName()`
- `MappingService::getMapping()`
- `SwagMigrationAssistant\Profile\Shopware\Converter\CustomerConverter`
- `MigrationLogBuilder`, `ConvertEntityUnknownLog`
- `swag_migration_mapping`, `generate-premapping`

## Gotchas

- The source registers readers with `->tag('shopware.migration.pre_mapping_reader')`. That tag is defined by the separate SwagMigrationAssistant plugin and does not occur anywhere in Shopware core, storefront or administration; verify it against the installed plugin version.
- An empty `destinationUuid` means the user has not chosen a target yet; `getMapping()` then yields no usable mapping.

## Code check (6.7.15.1)
- absent `shopware.migration.pre_mapping_reader` — not in the installed core code index; plugin-defined tag
- confirmed `CustomerDefinition::ENTITY_NAME` — core constant used as the log entity name, value `customer` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- unverified `PremappingStruct` — SwagMigrationAssistant plugin class, out of scope
- unverified `SalutationReader` — plugin class, out of scope
- unverified `MappingService::getMapping()` — plugin service, out of scope
- unverified `CustomerConverter` — plugin class, out of scope
- unverified `ConvertEntityUnknownLog` — plugin class, out of scope
- unverified `swag_migration_mapping` — plugin table, no definition in core
