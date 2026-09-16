---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/profile-and-connection.md
title: Profile and Connection
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/profile-and-connection.html
sourceHash: 4b4fbd5972f28d2fc53e99d352fd3e9fec9fb7b6
keywords: ["Profile", "ProfileInterface", "ShopwareProfileInterface", "Shopware55Profile", "shopware.migration.profile", "SwagMigrationConnectionDefinition", "connection entity", "getName", "credential_fields", "swag_migration_connection"]
summary: "A Profile identifies a source system type (e.g. Shopware55Profile); a Connection entity stores its credentials, premapping, profile and gateway choice."
lastBuilt: "2026-09-15"
---
## What it is

Describes the two base building blocks of a migration: the `Profile`, which identifies a source system type, and the `Connection`, the entity that stores a specific connection's credentials, profile/gateway choice, and premapping decisions.

## When to use

Needed when supporting a new source system type (new profile) or when inspecting/extending what data a connection entity stores.

## Key steps / config

A profile implements `ShopwareProfileInterface`/`ProfileInterface` with getters like `getName()` (unique profile name). The shipped default is `Shopware55Profile`, registered via:

```xml
<service id="SwagMigrationAssistant\Profile\Shopware55\Shopware55Profile">
    <tag name="shopware.migration.profile"/>
</service>
```

`Shopware55Profile` defines constants `PROFILE_NAME = 'shopware55'`, `SOURCE_SYSTEM_NAME = 'Shopware'`, `SOURCE_SYSTEM_VERSION = '5.5'`, `AUTHOR_NAME`, `ICON_PATH`, exposed via `getName()`, `getSourceSystemName()`, `getVersion()`, `getAuthorName()`, `getIconPath()`.

The connection entity (`SwagMigrationConnectionDefinition extends EntityDefinition`) defines fields including:

```
id (PrimaryKey, Required)
name (Required)
credential_fields -> credentialFields (JsonField, WriteProtected)
premapping (JsonField)
profile_name -> profileName (Required)
gateway_name -> gatewayName (Required)
createdAt / updatedAt
runs (OneToMany -> SwagMigrationRunDefinition)
mappings (OneToMany -> SwagMigrationMappingDefinition)
settings (OneToMany -> GeneralSettingDefinition)
```

The profile is used together with the gateway to determine the right processing during a migration run.

## Essential identifiers

`ProfileInterface`, `ShopwareProfileInterface`, `Shopware55Profile`, `shopware.migration.profile` tag, `SwagMigrationConnectionDefinition`, `credential_fields`, `profile_name`, `gateway_name`.
