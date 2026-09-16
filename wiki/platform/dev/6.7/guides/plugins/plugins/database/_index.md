---
id: platform/dev/6.7/guides/plugins/plugins/database/_index.md
title: Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/database/
sourceHash: 4efab2fe0194a18ab4cb58f1c22e6944f4856579
codeCheckedAgainst: "6.7.13.0"
keywords: ["database", "migrations", "MigrationStep", "database:create-migration", "dal:migration:create", "database:migrate", "custom fields", "media custom field", "entity definition", "schema changes", "plugin database"]
summary: "Overview of plugin database work in Shopware 6.7: migrations for schema changes, migrations generated from entities, and custom fields (incl. media)."
lastBuilt: 2026-09-15
---
## What it is

Section index for plugin database topics. Plugins extend or interact with the Shopware database through three mechanisms: database migrations, entity definitions (from which migrations can be generated), and custom fields.

The section covers:

- creating and managing database migrations,
- generating migrations from entity definitions,
- working with custom fields, for example custom fields of type media.

## When to use

- A plugin needs its own tables, columns or other structural/schema updates: use migrations.
- A plugin only needs to store extra data on an existing entity: use custom fields, which extend existing entities without modifying the core schema.
- A plugin template needs to resolve a media ID stored in a custom field: see the media custom fields page in this section.

## Key steps / config

1. Schema changes go into a migration class extending `Shopware\Core\Framework\Migration\MigrationStep`; it must implement `getCreationTimestamp(): int` and `update(Connection $connection): void`.
2. Create a migration skeleton with `bin/console database:create-migration`, or generate SQL from entity definitions with `bin/console dal:migration:create`.
3. Run pending migrations with `bin/console database:migrate`.
4. For data on existing entities, add a custom field instead of a migration; the media type is the custom field type `media`.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `database:create-migration`, `dal:migration:create`, `database:migrate`
- `Shopware\Core\System\CustomField\CustomFieldTypes::MEDIA`

## Code check (6.7.13.0)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be implemented — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, must be implemented — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `database:create-migration` — console command name — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:18
- confirmed `dal:migration:create` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/CreateMigrationCommand.php:25
- confirmed `database:migrate` — console command name — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:21
- confirmed `CustomFieldTypes::MEDIA` — value `media` — vendor/shopware/core/System/CustomField/CustomFieldTypes.php:22
