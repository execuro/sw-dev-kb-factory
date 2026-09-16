---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/premapping.md
title: Premapping
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/premapping.html
sourceHash: 349cd80b78947b1ffeccd3649a940efcec40d1b3
keywords: ["Premapping", "PremappingStruct", "shopware.migration.pre_mapping_reader", "SalutationReader", "getMapping", "destinationUuid", "generate-premapping", "swag_migration_mapping", "entityUuid", "mappingIds"]
summary: "Premapping readers register choices/mapping pairs as a PremappingStruct, letting users map source values to Shopware 6 identifiers once per connection."
lastBuilt: "2026-09-15"
---
## What it is

Premapping lets users manually associate values from the source system (e.g. salutations) with the equivalent Shopware 6 identifier, using the normal mapping mechanism, so the choice only needs to be made once per connection.

## When to use

Needed when a converter depends on a fixed, small set of source values (like salutations or payment methods) that don't map automatically and must be resolved by the user before a migration run.

## Key steps / config

Premapping readers are registered per profile with the `shopware.migration.pre_mapping_reader` tag:

```xml
<service id="SwagMigrationAssistant\Profile\Shopware\Premapping\SalutationReader">
    <argument type="service" id="salutation.repository" />
    <argument type="service" id="SwagMigrationAssistant\Migration\Gateway\GatewayRegistry"/>
    <tag name="shopware.migration.pre_mapping_reader"/>
</service>
```

Each reader returns a `PremappingStruct` with: entity, `choices` (Shopware 6 equivalents), and `mapping` (source structure entries with a chosen destination). Shape returned by the `generate-premapping` response:

```json
{
  "entity": "salutation",
  "choices": [{ "uuid": "...", "description": "mr", "extensions": [] }],
  "mapping": [{ "sourceId": "mr", "description": "mr", "destinationUuid": "...", "extensions": [] }]
}
```

`destinationUuid` in each `mapping` entry sets the chosen target for that source value and is saved with the connection. To resolve a premapped value in a converter, use `MappingService::getMapping($connectionId, SalutationReader::getMappingName(), $salutation, $context)`; if it returns `null`, no valid mapping exists and the miss must be logged (e.g. via `UnknownEntityLog`). The returned mapping array has `id` (the `swag_migration_mapping` row id, add it to `mappingIds` if preloading) and `entityUuid` (the mapped Shopware 6 UUID).

## Essential identifiers

`PremappingStruct`, `shopware.migration.pre_mapping_reader`, `SalutationReader`, `MappingService::getMapping()`, `destinationUuid`, `swag_migration_mapping`, `entityUuid`, `mappingIds`.
