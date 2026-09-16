---
id: platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
title: Database Migrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html
sourceHash: 908109a346ea45384184376a3fc7abe9203f2bd4
codeCheckedAgainst: "6.7.13.0"
keywords: ["MigrationStep", "database:create-migration", "dal:migration:create", "database:migrate", "getCreationTimestamp", "updateDestructive", "MigrationCollection", "setAutoMigrate", "migrateInPlace", "getMigrationNamespace", "plugin migration", "schema change", "sql migration"]
summary: "Plugin database migrations in 6.7: MigrationStep classes in src/Migration, create/generate/run commands, auto-migrate control, custom namespace."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md"]
---
## What it is

Migrations are PHP classes that apply incremental database schema and data changes for a plugin. Shopware looks for them in the `Migration` directory relative to the plugin base class (`<plugin root>/src/Migration`). Names follow `Migration<timestamp><Description>`, e.g. `Migration1546422281ExampleDescription.php`.

## When to use

A plugin (see [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) needs its own tables or columns, or data changes that must run on install/update.

## Key steps / config

1. Generate a skeleton from the Shopware root:
   `bin/console database:create-migration -p SwagBasicExample --name ExampleDescription`
   (`-p` = plugin name, `--name` = suffix after the timestamp).
2. Implement both abstract methods of `Shopware\Core\Framework\Migration\MigrationStep`:

```php
class Migration1611740369ExampleDescription extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1611740369; }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('CREATE TABLE IF NOT EXISTS ...');
    }
}
```

   Keep the generated timestamp; put all schema and data changes in `update()`.
3. Or generate a full migration (CREATE/ALTER TABLE) from entity definitions; `entities` is a positional argument:
   `bin/console dal:migration:create --bundle=SwagBasicExample your_entity,your_other_entity`
   One file per entity; the plugin must be active. Without `--bundle` the migration goes into core.
4. Install and update run `migrateInPlace()` on the plugin's `MigrationCollection` (on update only new migrations). Run manually with
   `bin/console database:migrate SwagBasicExample --all`
   (the `identifier` argument defaults to `core`).
5. Manual control in the plugin base class lifecycle method:

```php
public function update(UpdateContext $updateContext): void
{
    $updateContext->setAutoMigrate(false);
    $updateContext->getMigrationCollection()->migrateInPlace(1576143014);
}
```

6. Optional: override `getMigrationNamespace(): string` in the plugin base class (default `<namespace>\Migration`); the directory name follows the namespace.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `database:create-migration`, `dal:migration:create`, `database:migrate`
- `getMigrationCollection()`, `setAutoMigrate()`, `migrateInPlace()`, `getMigrationNamespace()`

## Gotchas

- No rollback; clean up in the lifecycle `uninstall` method ([Plugin Lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md)).
- `updateDestructive()` is optional; plugin install/update never run it, and `database:migrate-destructive` is not run for plugins in practice.
- Never change an already executed migration; each runs once.
- Create new migrations after installing the plugin so its migration directory is registered.

## Code check (6.7.13.0)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::updateDestructive()` — non-abstract, empty default — vendor/shopware/core/Framework/Migration/MigrationStep.php:38
- confirmed `database:create-migration` — console command name — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:18
- confirmed `plugin` — `database:create-migration` option with shortcut `p` — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:40
- corrected `entities` — docs: `--entities=` option; it is a required argument — vendor/shopware/core/Framework/DataAbstractionLayer/Command/CreateMigrationCommand.php:50
- confirmed `bundle` — `dal:migration:create` option — vendor/shopware/core/Framework/DataAbstractionLayer/Command/CreateMigrationCommand.php:52
- confirmed `identifier` — `database:migrate` argument, default core, plus `--all` — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:56
- confirmed `InstallContext::setAutoMigrate()` — toggles automatic execution — vendor/shopware/core/Framework/Plugin/Context/InstallContext.php:54
- confirmed `migrateInPlace` — lifecycle calls it unless auto-migrate is off; no destructive run — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:645
