---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/profile-and-connection.md
title: Profile and Connection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/profile-and-connection.html
sourceHash: 9a93167210c623d27e51ec31abca88aef1d982a2
codeCheckedAgainst: "6.7.15.1"
keywords: ["migration profile", "connection", "Shopware55Profile", "ShopwareProfileInterface", "getName", "SwagMigrationConnectionDefinition", "swag_migration_connection", "PremappingField", "credential_fields", "source_system_fingerprint", "profile_name", "gateway_name", "source system"]
summary: Migration Assistant profiles (Shopware55Profile, getName()) and the swag_migration_connection entity holding credentials, premapping, profile and gateway.
lastBuilt: 2026-10-21
---
## What it is

In the Shopware Migration Assistant, a **profile** identifies the type of source system (e.g. Shopware 5.5) and a **connection** is the stored link to one concrete source system. A connection allows multiple migrations from the same source and keeps the mapping so the right data is updated on repeated runs.

## When to use

When creating your own profile for a new source system, extending an existing one, or when you need to know what a connection stores.

## Key steps / config

**Profile.** The default Shopware 5.5 profile is registered in `shopware55.php` as a service `Shopware55Profile::class` carrying the Migration Assistant's profile tag (exact tag string: see Gotchas). A profile implements getters to identify itself; `getName()` returns its unique name. It is used together with the gateway to pick the right processing during a run.

```php
class Shopware55Profile implements ShopwareProfileInterface
{
    final public const PROFILE_NAME = 'shopware55';
    final public const SOURCE_SYSTEM_NAME = 'Shopware';
    final public const SOURCE_SYSTEM_VERSION = '5.5';
    // also AUTHOR_NAME, ICON_PATH
    public function getName(): string { return self::PROFILE_NAME; }
    // getSourceSystemName(), getVersion(), getAuthorName(), getIconPath()
}
```

**Connection.** The connection entity holds credentials for API or database access, the premapping, and the profile/gateway combination. It is a DAL definition, so it must implement both abstract members of `EntityDefinition`:

```php
class SwagMigrationConnectionDefinition extends EntityDefinition
{
    final public const ENTITY_NAME = 'swag_migration_connection';
    public function getEntityName(): string { return self::ENTITY_NAME; }
    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([ /* fields listed below */ ]);
    }
}
```

Fields: `id` (`IdField`, `PrimaryKey`, `Required`), `name` (required), `credential_fields`/`credentialFields` (`JsonField`, `WriteProtected(MigrationContext::SOURCE_CONTEXT)`), `premapping` (`PremappingField`), `profile_name` and `gateway_name` (required), `source_system_fingerprint`, created/updated timestamps, and `OneToManyAssociationField`s `runs`, `mappings` (via `connection_id`) and `settings` (via `selected_connection_id`).

## Essential identifiers

- `SwagMigrationAssistant\Profile\Shopware55\Shopware55Profile`, `ShopwareProfileInterface`
- `SwagMigrationAssistant\Migration\Connection\SwagMigrationConnectionDefinition`
- `swag_migration_connection`, `PremappingField`
- `SwagMigrationRunDefinition`, `SwagMigrationMappingDefinition`, `GeneralSettingDefinition`

## Gotchas

- The source registers profiles with `->tag('shopware.migration.profile')`. This tag belongs to the separate SwagMigrationAssistant plugin and appears nowhere in Shopware core; check it against the installed plugin.
- The source listing of `SwagMigrationConnectionDefinition` elides `getEntityName()`; core `EntityDefinition` declares it abstract, so any definition class must implement it.

## Code check (6.7.15.1)
- confirmed `EntityDefinition::getEntityName()` — abstract, must be implemented by every definition — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:143
- confirmed `EntityDefinition::defineFields()` — abstract protected, returns FieldCollection — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:476
- confirmed `IdField` — core DAL field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/IdField.php:12
- confirmed `JsonField` — core DAL field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/JsonField.php:13
- confirmed `WriteProtected` — core DAL flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/WriteProtected.php:8
- confirmed `OneToManyAssociationField` — core DAL association field — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToManyAssociationField.php:13
- absent `shopware.migration.profile` — not in the installed core code index; plugin-defined tag
- unverified `Shopware55Profile` — SwagMigrationAssistant plugin class, out of scope
- unverified `PremappingField` — plugin field class, out of scope
- unverified `SwagMigrationConnectionDefinition` — plugin definition, out of scope
