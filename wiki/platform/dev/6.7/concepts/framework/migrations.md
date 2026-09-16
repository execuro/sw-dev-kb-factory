---
id: platform/dev/6.7/concepts/framework/migrations.md
title: Migrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/migrations.html
sourceHash: 3f318330a2982f2c6ec359145520aa15b16e3f6e
codeCheckedAgainst: "6.7.13.0"
keywords: ["migration", "MigrationStep", "update()", "updateDestructive()", "getCreationTimestamp()", "database:create-migration", "database migration", "schema change", "plugin migration", "Migration directory", "uninstall", "rollback"]
summary: Plugin migrations are MigrationStep classes in the plugin's Migration directory; update() runs once per new migration, no rollback, no destructive step.
lastBuilt: 2026-09-15
---
## What it is

Migrations are PHP classes containing database schema (and data) changesets. In Shopware they extend `Shopware\Core\Framework\Migration\MigrationStep`; plugins ship them in a `Migration` directory under the plugin's source code root.

## When to use

When a plugin needs to create or alter tables/columns or seed data on install or update.

## Key steps / config

1. Place migrations in the `Migration` directory under the plugin's source code root (the bundle's migration namespace is `<PluginNamespace>\Migration`).
2. Generate a correctly named file with the console command `bin/console database:create-migration` (option `--plugin <PluginName>`, optional `--name <Suffix>`). The generated file is named `Migration<timestamp><Name>.php`.
3. Implement the two abstract members of `MigrationStep`:

```php
class Migration1700000000MyTable extends MigrationStep
{
    public function getCreationTimestamp(): int { /* ... */ }

    public function update(Connection $connection): void { /* ... */ }
}
```

4. Put schema and data changes in `update()`. On plugin install and update (and activation), Shopware runs `update()` once for every migration not yet executed.
5. Remove plugin data yourself in the plugin lifecycle `uninstall()` method when appropriate — there is no automatic rollback.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `MigrationStep::update(Connection $connection): void`
- `MigrationStep::getCreationTimestamp(): int`
- `database:create-migration`
- `Plugin::uninstall(UninstallContext $uninstallContext)`

## Gotchas

- No automatic rollback of migrations exists; cleanup belongs in `uninstall`.
- `updateDestructive()` is an optional core hook for delayed destructive changes across major versions. Plugin install/update never execute it (the plugin lifecycle only calls `migrateInPlace()`, i.e. non-destructive steps), so it is not useful for plugin development.
- Migrations only run automatically when the lifecycle context has auto-migrate enabled.

## Code check (6.7.13.0)
- confirmed `MigrationStep` — abstract base class in `Shopware\Core\Framework\Migration` — vendor/shopware/core/Framework/Migration/MigrationStep.php:17
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be implemented (docs source omits it) — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, non-destructive changes — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::updateDestructive()` — optional, empty default body — vendor/shopware/core/Framework/Migration/MigrationStep.php:38
- confirmed `database:create-migration` — generator command — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:18
- confirmed `Migration` — file name pattern `Migration<timestamp><name>.php` — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:153
- confirmed `getMigrationNamespace()` — plugin namespace + `\Migration` — vendor/shopware/core/Framework/Bundle.php:45
- confirmed `migrateInPlace()` — install/update/activate run only non-destructive steps, when auto-migrate is set — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:645
- confirmed `Plugin::uninstall()` — lifecycle hook for data removal — vendor/shopware/core/Framework/Plugin.php:63
