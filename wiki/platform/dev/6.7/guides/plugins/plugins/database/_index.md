---
id: platform/dev/6.7/guides/plugins/plugins/database/_index.md
title: Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/database/
sourceHash: 4efab2fe0194a18ab4cb58f1c22e6944f4856579
codeCheckedAgainst: "6.7.15.1"
keywords: ["database", "migrations", "MigrationStep", "database:create-migration", "dal:migration:create", "custom fields", "media custom field", "CustomFieldTypes::MEDIA", "schema change", "entity definition", "plugin database"]
summary: Overview of plugin database work in Shopware 6.7 - migrations for schema changes, migrations generated from entity definitions, and custom fields.
lastBuilt: 2026-10-21
---
## What it is

This is the section overview for how plugins extend or interact with the Shopware database. Plugins do this through migrations, entities and custom fields. The section covers three topics:

- creating and managing database migrations
- generating migrations from entity definitions
- working with custom fields, e.g. custom fields of type media

## When to use

- **Migrations:** for schema changes and structural updates.
- **Custom fields:** to extend existing entities without modifying the core schema.

## Key steps / config

- A plugin migration extends `Shopware\Core\Framework\Migration\MigrationStep` and must declare `getCreationTimestamp(): int` and `update(Connection $connection): void`.
- `bin/console database:create-migration` creates a new migration file.
- `bin/console dal:migration:create` creates migrations for an entity schema, i.e. from entity definitions.
- Media custom fields use the custom field type `media` (`CustomFieldTypes::MEDIA`).

The child pages "Database migrations" and "Custom fields of type media" document each topic in detail.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `database:create-migration`
- `dal:migration:create`
- `Shopware\Core\System\CustomField\CustomFieldTypes::MEDIA`

## Code check (6.7.15.1)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, required in every migration — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, takes a DBAL Connection — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `database:create-migration` — console command, creates a new migration file — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:19
- confirmed `dal:migration:create` — console command, creates migration for entity schema — vendor/shopware/core/Framework/DataAbstractionLayer/Command/CreateMigrationCommand.php:26
- confirmed `CustomFieldTypes::MEDIA` — custom field type value media — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:22
