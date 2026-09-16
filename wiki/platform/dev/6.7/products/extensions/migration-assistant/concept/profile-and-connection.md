---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/profile-and-connection.md
title: Profile and Connection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/profile-and-connection.html
sourceHash: 9a93167210c623d27e51ec31abca88aef1d982a2
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration profile", "migration connection", "Shopware55Profile", "ShopwareProfileInterface", "shopware.migration.profile", "SwagMigrationConnectionDefinition", "swag_migration_connection", "credential_fields", "premapping", "gateway_name", "profile_name", "source_system_fingerprint", "migration assistant"]
summary: "Migration Assistant profiles (tagged services, e.g. Shopware55Profile) and the swag_migration_connection entity holding credentials, premapping, gateway."
lastBuilt: 2026-09-15
---
## What it is

In the Shopware Migration Assistant, a **profile** identifies the type of source system (e.g. Shopware 5.5) and, together with a gateway, decides the processing of a run. A **connection** is the entity a user creates to a concrete source system; it stores credentials, premapping and the profile/gateway combination, and allows repeated migrations from the same source while updating the right data via mapping.

## When to use

When building a custom migration profile for a new source system, extending an existing profile, or working with stored connections (credentials, premapping, fingerprint).

## Key steps / config

1. Register the profile as a tagged service (default profile lives in `shopware55.php`):

```php
$services->set(Shopware55Profile::class)
    ->tag('shopware.migration.profile');
```

2. Implement the profile interface getters. `SwagMigrationAssistant\Profile\Shopware55\Shopware55Profile implements ShopwareProfileInterface` and provides `getName()` (unique name, `shopware55`), `getSourceSystemName()` (`Shopware`), `getVersion()` (`5.5`), `getAuthorName()` and `getIconPath()`.

3. The connection entity is `SwagMigrationConnectionDefinition` (entity `swag_migration_connection`), skeleton:

```php
class SwagMigrationConnectionDefinition extends EntityDefinition
{
    final public const ENTITY_NAME = 'swag_migration_connection';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([ /* id, name, credential_fields, premapping,
            profile_name, gateway_name, source_system_fingerprint, created/updated,
            runs, mappings, settings */ ]);
    }
}
```

Fields per the docs: `id` (primary key, required), `name` (required), `credential_fields` (`JsonField`, `WriteProtected(MigrationContext::SOURCE_CONTEXT)`), `premapping` (`PremappingField`), `profile_name` and `gateway_name` (required), `source_system_fingerprint`, created/updated timestamps, and `OneToManyAssociationField`s `runs` (`SwagMigrationRunDefinition`), `mappings` (`SwagMigrationMappingDefinition`), `settings` (`GeneralSettingDefinition`, via `selected_connection_id`).

## Essential identifiers

- `SwagMigrationAssistant\Profile\Shopware55\Shopware55Profile`, `ShopwareProfileInterface`
- `shopware.migration.profile`
- `SwagMigrationAssistant\Migration\Connection\SwagMigrationConnectionDefinition`, `swag_migration_connection`
- `credential_fields`, `premapping`, `profile_name`, `gateway_name`, `source_system_fingerprint`
- `EntityDefinition::getEntityName()`, `EntityDefinition::defineFields()`

## Gotchas

- `credential_fields` is write-protected with `MigrationContext::SOURCE_CONTEXT`, so plain API writes cannot change it outside that context.
- Every class extending core `EntityDefinition` must implement both `getEntityName()` and `defineFields()`; the docs' snippet elides `getEntityName()`.

## Code check (6.7.13.0)
- confirmed `EntityDefinition::getEntityName()` — abstract, required in subclasses — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:130
- confirmed `EntityDefinition::defineFields()` — abstract protected, returns FieldCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `WriteProtected` — DAL field flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/WriteProtected.php:8
- confirmed `JsonField` — DAL storage-aware field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/JsonField.php:10
- confirmed `OneToManyAssociationField` — DAL association field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToManyAssociationField.php:10
- unverified `shopware.migration.profile` — SwagMigrationAssistant plugin tag, out of scope
- unverified `Shopware55Profile` — plugin code, out of scope
- unverified `ShopwareProfileInterface` — plugin code, out of scope
- unverified `SwagMigrationConnectionDefinition` — plugin code, out of scope
- unverified `PremappingField` — plugin code, out of scope
