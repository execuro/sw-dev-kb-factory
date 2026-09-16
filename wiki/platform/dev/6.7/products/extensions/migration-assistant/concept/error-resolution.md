---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/error-resolution.md
title: Error Resolution
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/error-resolution.html
sourceHash: 12e4a75d9743f8de1677bda98b68311a88aeef5f
codeCheckedAgainst: "6.7.13.0"
keywords: ["error resolution", "MigrationEntityValidationService", "MigrationFieldValidationService", "MigrationErrorResolutionService", "MigrationFix", "swag_migration_fix", "MigrationStep::ERROR_RESOLUTION", "MigrationValidationContext", "MigrationPreValidationEvent", "MigrationPostErrorResolutionEvent", "validation errors", "fix migration data", "migration assistant"]
summary: "Migration Assistant Error Resolution: manual step to fix validation errors before write; swag_migration_fix table, MigrationFix paths, events."
lastBuilt: 2026-09-15
---
## What it is

Error Resolution is a **manual step** in the Migration Assistant workflow (`MigrationStep::ERROR_RESOLUTION = 'error-resolution'`, listed in `MigrationStep::MANUAL_STEPS` together with `WAITING_FOR_APPROVE`). The migration pauses there so users can review validation errors in the Administration and create fixes before data is written. Validation itself runs earlier, during conversion in the Fetching step. Errors are stored in the database.

## When to use

When you extend the Migration Assistant's validation, add user-fixable log types, or hook into how fixes are applied to converted data before it is written.

## Key steps / config

**Components** (namespaces relative to `SwagMigrationAssistant`):

| Component | Namespace | Purpose |
|---|---|---|
| `MigrationEntityValidationService` | `Migration\Validation` | validates whole entities incl. nested associations |
| `MigrationFieldValidationService` | `Migration\Validation` | validates single field values via DAL field serializers |
| `MigrationErrorResolutionService` | `Migration\ErrorResolution` | loads fixes from DB and applies them |
| `MigrationFix` | `Migration\ErrorResolution` | value object, path-based fix application |
| `ErrorResolutionController` | `Controller` | validation and example-value API endpoints |

**Entity validation** checks: presence of required fields, field values (DAL serializers, or basic checks as fallback), and nested associations (recursively). `SYSTEM_MANAGED_FIELDS` are skipped in the required-field check: `CreatedAtField`, `UpdatedAtField`, `VersionField`, `ReferenceVersionField`, `TranslationsAssociationField`. A field counts as required only if all of these hold: it is flagged `Required` in the definition, it is not system-managed, it is not nullable in the DB schema, and it has no default in the schema or the definition.

**Fix storage**: table `swag_migration_fix`, defined by `SwagMigrationAssistant\Migration\ErrorResolution\Entity\SwagMigrationFixDefinition`:

```php
class SwagMigrationFixDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'swag_migration_fix';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([ /* id (PrimaryKey, Required), connection_id (Required),
            value AnyJsonField (Required), path (Required), entity_id, entity_name,
            CreatedAtField, UpdatedAtField */ ]);
    }
}
```

The fix properties are `id`, `connectionId`, `value` (JSON-encoded), `path` (dot notation), `entityId` and `entityName`.

**Applying fixes**: `MigrationDataWriter::writeData()` calls `$this->errorResolutionService->applyFixes($convertedValues, $connectionId, $runUuid, $context)` before `$currentWriter->writeData(...)`. `MigrationFix::apply(array &$item)` resolves paths as follows:

- `name` resolves to `$item['name']`
- `translations.name` resolves to `$item['translations'][*]['name']`
- `categories.translations.name` resolves to `$item['categories'][*]['translations'][*]['name']`
- `manufacturer.name` resolves to `$item['manufacturer']['name']`

**Extension points**: `MigrationPreValidationEvent` and `MigrationPostValidationEvent` (context: `MigrationValidationContext`, with `getConvertedData()`, `getSourceData()`, `getEntityDefinition()` and `getValidationResult()`). `MigrationPreErrorResolutionEvent` and `MigrationPostErrorResolutionEvent` (context: `MigrationErrorResolutionContext`, with `getData()`/`setData()`, `getFixes()`/`setFixes()`, `getConnectionId()` and `getRunId()`).

## Essential identifiers

- `SwagMigrationAssistant\Migration\Validation\MigrationEntityValidationService`
- `SwagMigrationAssistant\Migration\Validation\MigrationFieldValidationService`
- `SwagMigrationAssistant\Migration\ErrorResolution\MigrationFix`, `MigrationFix::fromDatabaseQuery()`
- `SwagMigrationAssistant\Migration\Run\MigrationStep`
- Log classes: `MigrationValidationRequiredFieldMissingLog`, `MigrationValidationRequiredFieldValueInvalidLog`, `MigrationValidationOptionalFieldValueInvalidLog`, `MigrationValidationAssociationInvalidLog` (user fixable); `MigrationValidationRequiredTranslationInvalidLog`, `MigrationValidationExceptionLog` (not fixable)

## Gotchas

- Only the four log types listed as user fixable can get fixes in the Administration. Translation-structure errors and generic validation exceptions cannot.
- A `path` like `translations.name` changes every list element, not just one translation.

## Code check (6.7.13.0)
- confirmed `EntityDefinition::getEntityName()` — abstract, must be declared by the fix definition — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract protected, returns FieldCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `CreatedAtField` — core DAL field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/CreatedAtField.php:10
- confirmed `UpdatedAtField` — core DAL field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/UpdatedAtField.php:9
- confirmed `VersionField` — core DAL field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/VersionField.php:12
- confirmed `ReferenceVersionField` — core DAL field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ReferenceVersionField.php:11
- confirmed `TranslationsAssociationField` — core DAL field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:10
- confirmed `Required` — core DAL flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Required.php:8
- unverified `AnyJsonField` — not a core DAL field class; presumably plugin-provided, plugin not installed in vendor/shopware
- unverified `MigrationErrorResolutionService` — plugin class, plugin not installed in vendor/shopware
