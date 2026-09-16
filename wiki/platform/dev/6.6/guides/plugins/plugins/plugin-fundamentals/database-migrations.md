---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/database-migrations.md
title: Database migrations
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 75f1a82280c21986e03e0bb45ec5e70def98a2a0
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/database-migrations.html
keywords: ["database migrations", "MigrationStep", "database:create-migration", "database:migrate", "database:migrate-destructive", "getCreationTimestamp", "update", "updateDestructive", "getMigrationNamespace", "MigrationCollection", "dal:create:schema", "setAutoMigrate", "InstallContext"]
summary: "Plugin database schema changes are PHP MigrationStep classes with update()/updateDestructive(), created via database:create-migration."
lastBuilt: "2026-09-15"
---
## What it is

A guide on Shopware's migration system: PHP classes managing incremental, reversible database schema changes for a plugin.

## When to use

Use this when a plugin needs to create or modify database tables/columns as part of installation or update.

## Key steps / config

1. Migration files live by default in `<plugin root>/src/Migration/`, named `Migration<timestamp><Description>.php`; override `getMigrationNamespace()` in the plugin base class to use a different namespace/directory.
2. Generate one with `./bin/console database:create-migration -p SwagBasicExample --name ExampleDescription`.
3. Each migration extends `Shopware\Core\Framework\Migration\MigrationStep` and implements three methods:

```php
class Migration1611740369ExampleDescription extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1611740369; }
    public function update(Connection $connection): void { /* reversible changes */ }
    public function updateDestructive(Connection $connection): void { /* destructive changes, e.g. dropping columns/tables */ }
}
```

4. Run migrations manually with `./bin/console database:migrate SwagBasicExample --all` (non-destructive) or `database:migrate-destructive` (destructive); both accept an optional identifier argument (defaults to core migrations).
5. Generate the SQL schema for custom entities with `./bin/console dal:create:schema` (outputs into `/schema`; the plugin must be active).
6. For fine-grained control, call `$updateContext->setAutoMigrate(false)` in a plugin's `update(UpdateContext $updateContext)` method, then use `$updateContext->getMigrationCollection()` with `migrateDestructiveInPlace($timestamp)`/`migrateInPlace($timestamp)`.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `getCreationTimestamp()`, `update(Connection $connection)`, `updateDestructive(Connection $connection)`
- `getMigrationNamespace()`
- `database:create-migration`, `database:migrate`, `database:migrate-destructive`, `dal:create:schema`
- `UpdateContext::setAutoMigrate()`, `getMigrationCollection()`, `migrateInPlace()`, `migrateDestructiveInPlace()`

## Gotchas

Do not add revert logic inside a migration's own class — reverting changes is instead handled explicitly in the plugin lifecycle's `uninstall` method. Never change a migration that has already been executed, since every migration runs only once. If auto-migration is disabled and the Shopware migration system isn't used, an empty `NullObject` migration collection is provided in the context.
