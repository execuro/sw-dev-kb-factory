---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/guidelines/code/core/database-migations.md
sourceHash: 37dd172a7d2009afac57f9f7126bd6c01909aa4b
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html
title: Database Migations
version: "6.7"
versions:
  - "6.7"
keywords: ["database migrations", "MigrationStep", "update", "updateDestructive", "database:create-migration", "database:migrate", "database:migrate-destructive", "version-selection-mode", "blue-green", "ImportTranslationsTrait", "ColumnExistsTrait", "KernelLifecycleManager", "expand and contract", "idempotent migration", "schema change"]
summary: Core rules for Shopware migrations - update vs updateDestructive, version-selection-mode all/blue-green/safe, idempotency, translations, migration tests.
lastBuilt: 2026-09-15
---
## What it is

Shopware core coding guideline for database migrations: major-version namespaces, the split between non-destructive `update()` and destructive `updateDestructive()`, how destructive migrations are selected per mode, and nine rules every core migration must follow.

## When to use

When creating or reviewing a core migration (also useful for plugin migrations): backward-compatible schema changes, dropping columns/tables, default data with translations, or migration tests.

## Key steps / config

1. Create it with `bin/console database:create-migration`; it lands in the current major namespace, e.g. `Shopware\Core\Migration\V6_7` (migrations that must not run before `v6.5.0.0` live in `Core\Migration\V6_5`).
2. Extend `\Shopware\Core\Framework\Migration\MigrationStep`. Installed code makes `getCreationTimestamp(): int` and `update(Connection $connection): void` abstract; `updateDestructive(Connection $connection): void` has an empty default and is overridden only for destructive changes.

```php
class Migration<timestamp><Name> extends MigrationStep
{
    public function getCreationTimestamp(): int { /* ... */ }
    public function update(Connection $connection): void { /* non-destructive */ }
    public function updateDestructive(Connection $connection): void { /* drops */ }
}
```

3. Keep minor/patch changes backward compatible and blue-green safe via expand and contract: **expand** (add a new column instead of renaming), **migrate** (copy data), **contract** (drop the old column — only in `updateDestructive`).

**Destructive mode** — option `--version-selection-mode` on `database:migrate-destructive`, values `all`, `blue-green`, `safe`; default `safe`:

| Mode | Destructive migrations executed up to |
|---|---|
| `all` | current major |
| `blue-green` | previous major (two back while on a `.0` minor) |
| `safe` | two majors before the current major |

**Execution order:** `core.V6_3`, `core.V6_4`, … up to the selected major, then the legacy `core` source. Run one major with `bin/console database:migrate --all core.V6_7`.

**Rules**

1. Never change an executed/released migration; write a new one (exception: a broken migration causing errors).
2. Migrations must be re-runnable: use `IF [NOT] EXISTS` and the helpers `MigrationStep::dropTableIfExists`, `MigrationStep::dropColumnIfExists`, `ColumnExistsTrait::columnExists` (available in `MigrationStep` via `AddColumnTrait`). `ALTER TABLE` has no `IF EXISTS` — query the columns manually.
3. Do not trust identifiers — query them first.
4. Do not trust customer data; query the actual situation defensively.
5. Never overwrite customized data: ``UPDATE `product` SET name = 'foobar' WHERE updated_at IS NULL;``
6. A migration must finish in under 10 seconds locally; test with large data sets.
7. No default language: use `Shopware\Core\Migration\Traits\ImportTranslationsTrait` — `importTranslation('product_sorting_translation', $translations, $connection)` with a `Translations` object holding de-DE and en-GB rows.
8. One test per migration in `tests/Migration/V6_*` (none for an empty `updateDestructive()`). No `IntegrationTestBehaviour`/`KernelTestBehaviour`, no booted kernel; get the connection via `KernelLifecycleManager::getConnection()`. Run `update()` twice to prove idempotence where feasible; `MultiInsertQueryQueue` is recommended for fixture rows.
9. Name tables descriptively in singular snake case (`customer`, `customer_data`), without the historic `swag_` prefix.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `bin/console database:create-migration`, `bin/console database:migrate`, `database:migrate-destructive`, `--version-selection-mode`
- `Shopware\Core\Framework\Migration\ColumnExistsTrait`, `Shopware\Core\Framework\Migration\AddColumnTrait`
- `Shopware\Core\Migration\Traits\ImportTranslationsTrait`
- `KernelLifecycleManager::getConnection()`, `MultiInsertQueryQueue`

## Gotchas

- DDL statements trigger implicit commits, so transactions cannot roll them back. `MigrationTestTrait` wraps a test in a transaction and suits data changes only; for DDL, undo changes manually and control transactions yourself.
- Migration tests run after all migrations have executed. If a test needs a specific schema state: rename the table, recreate it in the needed state, run the test, drop it and rename the original back.
- The guideline cites `AddColumnTrait::columnExists`; the method is declared in `ColumnExistsTrait`, which `AddColumnTrait` uses.

## Code check (6.7.13.0)
- confirmed `MigrationStep::update()` — abstract, required — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::updateDestructive()` — optional, empty default body — vendor/shopware/core/Framework/Migration/MigrationStep.php:38
- confirmed `MigrationStep::dropTableIfExists()` — protected helper — vendor/shopware/core/Framework/Migration/MigrationStep.php:104
- confirmed `MigrationStep::dropColumnIfExists()` — protected helper returning bool — vendor/shopware/core/Framework/Migration/MigrationStep.php:113
- corrected `ColumnExistsTrait::columnExists()` — docs: AddColumnTrait::columnExists; declared in ColumnExistsTrait — vendor/shopware/core/Framework/Migration/ColumnExistsTrait.php:17
- confirmed `database:create-migration` — command name — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:18
- confirmed `version-selection-mode` — defaults to VERSION_SELECTION_SAFE on the destructive command — vendor/shopware/core/Framework/Migration/Command/MigrationDestructiveCommand.php:26
- corrected `VERSION_SELECTION_BLUE_GREEN` — docs: previous major only; code steps back one more on a .0 minor — vendor/shopware/core/Framework/Migration/MigrationCollectionLoader.php:122
- confirmed `ImportTranslationsTrait::importTranslation()` — protected, takes table, Translations, Connection — vendor/shopware/core/Migration/Traits/ImportTranslationsTrait.php:13
- unverified `MigrationTestTrait` — test-suite trait not shipped in the installed packages
