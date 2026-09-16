---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/premapping.md
title: Premapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/premapping.html
sourceHash: daf6a9e6516da815be5777bdee4d2a21cf132901
codeCheckedAgainst: "6.7.13.0"
keywords: ["premapping", "PremappingStruct", "SalutationReader", "MappingService", "getMapping", "CustomerConverter", "swag_migration_mapping", "generate-premapping", "destinationUuid", "premapping reader", "migration assistant", "mapping choices"]
summary: "Migration Assistant premapping: readers return PremappingStruct (entity, choices, mapping); MappingService::getMapping resolves stored destination IDs."
lastBuilt: 2026-09-15
---
## What it is

Premapping in the Shopware Migration Assistant lets the user map source-system values (e.g. salutations) to Shopware 6 entities before a run. It uses the normal mapping storage to link the old identifier to the new one. Premapping readers provide the mapping choices; the decisions are saved with the connection so the user does not repeat them.

## When to use

When adding a premapping reader for a new entity in a migration profile, or when a converter needs the Shopware 6 identifier the user picked for a source value.

## Key steps / config

1. Register a premapping reader service (example: `SalutationReader`) in the plugin's service configuration with its arguments and the premapping reader tag (tag name: see Gotchas).
2. The reader returns a `PremappingStruct` with: the entity, `choices` (Shopware 6 equivalents), and `mapping` (source structure with a destination/choice). Shape in the `generate-premapping` JSON response:

```json
{
  "entity": "salutation",
  "choices": [ { "uuid": "...", "description": "mr", "extensions": [] } ],
  "mapping": [
    { "sourceId": "mr", "description": "mr", "destinationUuid": "...", "extensions": [] }
  ]
}
```

3. `destinationUuid` in `mapping` sets the destination for that entity and is stored with the connection. See `SalutationReader` for automatic assignment.
4. In a converter, resolve the new ID via `MappingService`, as `SwagMigrationAssistant\Profile\Shopware\Converter\CustomerConverter::getSalutation()` does:

```php
$mapping = $this->mappingService->getMapping(
    $this->connectionId,
    SalutationReader::getMappingName(),
    $salutation,
    $this->context
);
if ($mapping === null) { /* log ConvertEntityUnknownLog via loggingService, return null */ }
$this->mappingIds[] = $mapping['id'];
return $mapping['entityId'];
```

5. `getMapping()` looks up `swag_migration_mapping` for the old identifier + entity name of the current connection. The result has `id`, `entityId`, and depending on mapping type optional `entityValue` and `additionalData`.

## Essential identifiers

- `PremappingStruct`, `SalutationReader`, `SalutationReader::getMappingName()`
- `MappingService::getMapping()`
- `SwagMigrationAssistant\Profile\Shopware\Converter\CustomerConverter`
- `MigrationLogBuilder::fromMigrationContext()`, `ConvertEntityUnknownLog`
- `swag_migration_mapping`, `generate-premapping`, `destinationUuid`

## Gotchas

- The docs register readers with the tag `shopware.migration.pre_mapping_reader`; the Migration Assistant plugin is not installed here, so the tag could not be verified — confirm it in the plugin's service definitions.
- When `getMapping()` returns `null` there is no valid mapping; log it (the example logs `ConvertEntityUnknownLog` for `CustomerDefinition::ENTITY_NAME`, field `salutationId`) instead of writing an invalid reference.
- A `destinationUuid` of `""` means the user has not chosen a destination for that source value.

## Code check (6.7.13.0)
- absent `shopware.migration.pre_mapping_reader` — tag not in the installed code index (plugin not installed)
- confirmed `CustomerDefinition::ENTITY_NAME` — value `customer` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `SalutationDefinition::ENTITY_NAME` — `salutation` entity matches the premapping example — vendor/shopware/core/System/Salutation/SalutationDefinition.php:29
- unverified `PremappingStruct` — SwagMigrationAssistant plugin code, out of scope
- unverified `SalutationReader` — plugin code, out of scope
- unverified `MappingService::getMapping()` — plugin code, out of scope
- unverified `CustomerConverter` — plugin code, out of scope
- unverified `swag_migration_mapping` — plugin table, out of scope
- unverified `ConvertEntityUnknownLog` — plugin code, out of scope
