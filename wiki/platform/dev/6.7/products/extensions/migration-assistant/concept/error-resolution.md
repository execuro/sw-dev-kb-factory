---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/error-resolution.md
title: Error Resolution
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/error-resolution.html
sourceHash: 12e4a75d9743f8de1677bda98b68311a88aeef5f
codeCheckedAgainst: "6.7.15.1"
keywords: ["error resolution", "MigrationEntityValidationService", "MigrationFieldValidationService", "MigrationErrorResolutionService", "MigrationFix", "ErrorResolutionController", "swag_migration_fix", "SwagMigrationFixDefinition", "MigrationStep", "MANUAL_STEPS", "MigrationPreValidationEvent", "MigrationPostErrorResolutionEvent", "validation errors", "migration fix", "migration assistant"]
summary: Migration Assistant Error Resolution step - validation of converted data, fixes stored in swag_migration_fix, path-based MigrationFix application, events.
lastBuilt: 2026-10-21
---
## What it is

Error Resolution is a manual step in the Shopware Migration Assistant (`SwagMigrationAssistant` plugin) workflow. Converted data is validated during the Fetching step; validation errors are stored in the database, and in the Error Resolution step users review them in the Administration and create fixes before the data is written to Shopware.

## When to use

When extending or debugging the Migration Assistant's validation, adding fixable log types, or hooking into fix application before writing.

## Key steps / config

1. **Manual step.** `SwagMigrationAssistant\Migration\Run\MigrationStep` is a string enum; `ERROR_RESOLUTION = 'error-resolution'` and `WAITING_FOR_APPROVE = 'waiting-for-approve'` are listed in `MANUAL_STEPS`. The run pauses there, users review errors and create fixes for fixable ones, and the migration resumes when the user continues to the writing phase.
2. **Entity validation** (`SwagMigrationAssistant\Migration\Validation\MigrationEntityValidationService`): checks required-field presence, validates each field value (DAL serializers if possible, basic checks as fallback), and recursively validates nested associations. Field types excluded from required-field checks (`SYSTEM_MANAGED_FIELDS`): `CreatedAtField`, `UpdatedAtField`, `VersionField`, `ReferenceVersionField`, `TranslationsAssociationField`.
3. **Required field rule**: a field is required only if it has the `Required` flag in the entity definition, is not system-managed, is not nullable in the DB schema, and has no default value in either the DB schema or the entity definition.
4. **Field validation** (`SwagMigrationAssistant\Migration\Validation\MigrationFieldValidationService`): validates single field values via DAL field serializers plus basic rules for association fields.
5. **Fix storage**: table `swag_migration_fix`, defined by `SwagMigrationAssistant\Migration\ErrorResolution\Entity\SwagMigrationFixDefinition`:

```php
class SwagMigrationFixDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'swag_migration_fix';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection
    {
        // id (PK, Required), connection_id (Required), value (JSON, Required),
        // path (Required), entity_id, entity_name, created_at, updated_at
    }
}
```

   Properties: `id`, `connectionId`, `value` (JSON-encoded fix value), `path` (dot notation, e.g. `category.translations.name`), `entityId`, `entityName`.
6. **Fix application**: `MigrationErrorResolutionService` loads fixes and `SwagMigrationAssistant\Migration\ErrorResolution\MigrationFix` (readonly; `id`, `value`, `path`; `fromDatabaseQuery()`, `apply(array &$item)`) applies them. `MigrationDataWriter::writeData()` calls `applyFixes()` with the converted values, connection id and run id right before the entity writer runs.

Path examples for `MigrationFix::apply()`: `name` → `$item['name']`; `translations.name` → every `$item['translations'][*]['name']`; `categories.translations.name` → nested list traversal; `manufacturer.name` → `$item['manufacturer']['name']`.

## Essential identifiers

- Log types (user fixable): `MigrationValidationRequiredFieldMissingLog`, `MigrationValidationRequiredFieldValueInvalidLog`, `MigrationValidationOptionalFieldValueInvalidLog`, `MigrationValidationAssociationInvalidLog`
- Log types (not fixable): `MigrationValidationRequiredTranslationInvalidLog`, `MigrationValidationExceptionLog`
- Events: `MigrationPreValidationEvent` (modify validation context), `MigrationPostValidationEvent` (read results), `MigrationPreErrorResolutionEvent` (modify resolution context), `MigrationPostErrorResolutionEvent` (read modified data)
- Context objects: `SwagMigrationAssistant\Migration\Validation\MigrationValidationContext` (`getContext()`, `getMigrationContext()`, `getConvertedData()`, `getSourceData()`, `getEntityDefinition()`, `getValidationResult()`); `SwagMigrationAssistant\Migration\ErrorResolution\MigrationErrorResolutionContext` (`getData()`/`setData()`, `getFixes()`/`setFixes()`, `getConnectionId()`, `getRunId()`, `getContext()`)
- `ErrorResolutionController` — API controller for validation and example-value endpoints

## Gotchas

- Validation happens during conversion in the Fetching step, not in the Error Resolution step itself; that step only reviews stored errors and fixes.
- The source's writer snippet passes `$migrationContext->getRunUuid()`; that method is not in the installed Shopware core (the Migration Assistant is a separate plugin), so it is not verifiable here.

## Code check (6.7.15.1)
- confirmed `EntityDefinition::getEntityName()` — abstract, every definition must declare it — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract protected, returns FieldCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `CreatedAtField` — DAL field class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Field/CreatedAtField.php:10
- confirmed `UpdatedAtField` — DAL field class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Field/UpdatedAtField.php:9
- confirmed `VersionField` — DAL field class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Field/VersionField.php:12
- confirmed `ReferenceVersionField` — DAL field class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ReferenceVersionField.php:11
- confirmed `TranslationsAssociationField` — DAL field class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Field/TranslationsAssociationField.php:10
- confirmed `Required` — DAL field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Required.php:8
- unverified `AnyJsonField` — not part of Shopware core; presumably shipped by the Migration Assistant plugin
- unverified `MigrationErrorResolutionService` — SwagMigrationAssistant plugin, outside the installed core/storefront/administration roots
