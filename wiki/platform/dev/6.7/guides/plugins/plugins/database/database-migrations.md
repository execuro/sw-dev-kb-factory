---
id: platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
title: Database Migrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/database/database-migrations.html
sourceHash: 908109a346ea45384184376a3fc7abe9203f2bd4
codeCheckedAgainst: "6.7.15.1"
keywords: ["MigrationStep", "getCreationTimestamp", "updateDestructive", "database:create-migration", "dal:migration:create", "database:migrate", "MigrationCollection", "migrateInPlace", "setAutoMigrate", "getMigrationNamespace", "plugin migration", "schema change", "database migration"]
summary: "Plugin MigrationStep classes, database:create-migration, dal:migration:create, database:migrate and UpdateContext auto-migrate control"
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md"]
---
## What it is

Migrations are PHP classes extending `Shopware\Core\Framework\Migration\MigrationStep` that apply incremental schema and data changes. Shopware collects a plugin's migrations from its migration namespace and runs them on install/update.

## When to use

Your plugin (see [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) needs its own tables/columns or data changes, or you need to control which migrations run during install/update.

## Key steps / config

1. **Location/name:** default directory `<plugin root>/src/Migration`, namespace `<PluginNamespace>\Migration`. File/class name `Migration<timestamp><Description>`, e.g. `Migration1546422281ExampleDescription.php`.
2. **Generate a skeleton:** `./bin/console database:create-migration -p SwagBasicExample --name ExampleDescription`
3. **Implement** both abstract members; put all schema/data changes in `update()`:

```php
use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

class Migration1611740369ExampleDescription extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1611740369; }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('CREATE TABLE IF NOT EXISTS `swag_basic_example_general_settings` (...)');
    }
}
```

4. **Generate from entity definitions** (plugin must be active): `./bin/console dal:migration:create your_entity,your_other_entity --bundle=SwagBasicExample` — the entity list is a positional argument; one migration with `CREATE TABLE`/`ALTER TABLE` per entity. Without `--bundle` the migration goes into core.
5. **Run:** install runs all `update()` methods; plugin update runs only new ones. Manually: `./bin/console database:migrate SwagBasicExample --all` (identifier defaults to `core`; `--until`/`--limit` also exist).
6. **Manual control** in a plugin lifecycle method:

```php
public function update(UpdateContext $updateContext): void
{
    $updateContext->setAutoMigrate(false);
    $updateContext->getMigrationCollection()->migrateInPlace(1576143014);
}
```

7. **Custom namespace** (rarely needed): override `getMigrationNamespace()` in the plugin base class, e.g. return `'Swag\BasicExample\MyMigrationNamespace'`; the directory must then be `MyMigrationNamespace`.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep` — `getCreationTimestamp()`, `update(Connection $connection)`
- `database:create-migration` (`-p`/`--plugin`, `--name`), `dal:migration:create` (`--bundle`), `database:migrate` (`identifier`, `--all`)
- `InstallContext::setAutoMigrate()`, `InstallContext::getMigrationCollection()` (inherited by `UpdateContext`, `ActivateContext`, ...)
- `MigrationCollection::migrateInPlace()`
- `Bundle::getMigrationNamespace()`

## Gotchas

- No rollback: do not write reverse instructions; database cleanup belongs in the plugin's `uninstall` (see [Plugin Lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md)).
- `updateDestructive()` exists on `MigrationStep` but plugin install/update never runs it, and `database:migrate-destructive` is in practice not run for plugins — put everything in `update()`.
- Never change an already-executed migration; each runs once.
- Create manual-test migrations after installing the plugin so the migration directory is already registered.
- Without the Shopware migration system the context holds an empty (`NullObject`) collection.
- The docs show `--entities=...` for `dal:migration:create`; the installed command has no such option.

## Code check (6.7.15.1)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, takes `Connection` — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::updateDestructive()` — optional, non-abstract — vendor/shopware/core/Framework/Migration/MigrationStep.php:38
- confirmed `database:create-migration` — options `--plugin`/`-p` and `--name` — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:19
- corrected `dal:migration:create` — docs: `--entities=` option; entities is a required positional argument — vendor/shopware/core/Framework/DataAbstractionLayer/Command/CreateMigrationCommand.php:26
- confirmed `database:migrate` — identifier defaults to `core`, `--all` removes timestamp cap — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:22
- confirmed `InstallContext::setAutoMigrate()` — toggles automatic migration on lifecycle — vendor/shopware/core/Framework/Plugin/Context/InstallContext.php:54
- confirmed `InstallContext::getMigrationCollection()` — plugin-scoped collection — vendor/shopware/core/Framework/Plugin/Context/InstallContext.php:44
- confirmed `MigrationCollection::migrateInPlace()` — accepts `?int $until` — vendor/shopware/core/Framework/Migration/MigrationCollection.php:56
- confirmed `Bundle::getMigrationNamespace()` — default `<namespace>\Migration` — vendor/shopware/core/Framework/Bundle.php:46
