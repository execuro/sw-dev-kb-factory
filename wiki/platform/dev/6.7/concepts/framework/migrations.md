---
id: platform/dev/6.7/concepts/framework/migrations.md
title: Migrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/migrations.html
sourceHash: 3f318330a2982f2c6ec359145520aa15b16e3f6e
codeCheckedAgainst: "6.7.15.1"
keywords: ["migrations", "database migration", "schema changes", "MigrationStep", "update()", "updateDestructive()", "getCreationTimestamp()", "database:create-migration", "Migration directory", "plugin install", "plugin update", "uninstall"]
summary: "Shopware migrations: MigrationStep classes in a plugin's Migration directory, update() run once on install/update, no rollback, database:create-migration."
lastBuilt: 2026-10-20
---
## What it is

Migrations are PHP classes holding database schema (and data) changesets, as known from Symfony and other frameworks. Shopware runs each new migration once when a plugin is installed or updated.

## When to use

- A plugin needs its own tables or columns, or must change data on install/update.

## Key steps / config

1. Place migrations in the `Migration` directory under the plugin's source root — the bundle's migration namespace is `<PluginNamespace>\Migration` (`Bundle::getMigrationNamespace()`).
2. Generate a correctly named file with `bin/console database:create-migration` (options include `--plugin`/`-p` and `--name` for a descriptive filename suffix); filenames follow a fixed pattern.
3. Extend `Shopware\Core\Framework\Migration\MigrationStep` and implement both abstract methods:

```php
class Migration1700000000ExampleTable extends MigrationStep
{
    public function getCreationTimestamp(): int { /* ... */ }

    public function update(Connection $connection): void
    {
        // schema and data changes
    }
}
```

4. Clean up plugin data in the plugin lifecycle `uninstall` method when appropriate — there is no automatic rollback.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `MigrationStep::update()`, `MigrationStep::getCreationTimestamp()`
- `database:create-migration`

## Gotchas

- `updateDestructive()` exists (optional, empty by default) for delayed destructive core changes across major versions; plugin install and update never execute it, so it is not useful for plugins.
- See the Database migration guide for the full plugin workflow.

## Code check (6.7.15.1)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, required — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, required — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::updateDestructive()` — concrete optional method — vendor/shopware/core/Framework/Migration/MigrationStep.php:38
- confirmed `Bundle::getMigrationNamespace()` — namespace plus `\Migration` — vendor/shopware/core/Framework/Bundle.php:46
- confirmed `database:create-migration` — console command name — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:19
