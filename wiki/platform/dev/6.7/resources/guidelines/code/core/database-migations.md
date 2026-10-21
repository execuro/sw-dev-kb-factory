---
id: platform/dev/6.7/resources/guidelines/code/core/database-migations.md
title: Database Migations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/database-migations.html
sourceHash: 68782b3b7dbab359203d889914e4e9c3fcc130ed
codeCheckedAgainst: "6.7.15.1"
keywords: ["database migration", "MigrationStep", "update", "updateDestructive", "database:create-migration", "database:migrate-destructive", "version-selection-mode", "expand and contract", "blue-green", "ImportTranslationsTrait", "dropColumnIfExists", "KernelLifecycleManager", "migration test", "idempotent migration"]
summary: Shopware core rules for DB migrations - update vs updateDestructive, expand/contract BC, destructive version-selection modes, the 9 rules and migration tests.
lastBuilt: 2026-10-21
---
## What it is

The core guideline (mirrored from `coding-guidelines/core/database-migations.md`) for changing the Shopware database structure. Migrations are grouped by major version namespace so destructive changes can be executed safely on customer systems; changes in minor or patch releases must be non-destructive.

## When to use

When you create or review a core migration, plan a schema change that must stay backward compatible and blue-green safe, or write a migration test.

## Key steps / config

1. Create a migration with `bin/console database:create-migration`; it is placed in the current major namespace (e.g. migrations that must not run before `v6.5.0.0` live in `Core\Migration\V6_5`).
2. Extend `Shopware\Core\Framework\Migration\MigrationStep`. The installed base class requires `getCreationTimestamp(): int` and `update(Connection $connection): void` (non-destructive, BC changes); `updateDestructive(Connection $connection): void` is optional with an empty default and holds non-reversible changes such as dropping tables or columns.
3. Keep minor/patch changes BC and blue-green compatible using **expand and contract**: expand (add a new column instead of renaming), migrate (copy data to it), contract (drop the old column, only in `updateDestructive`).

```php
class Migration1595422169AddProductSorting extends MigrationStep
{
    public function getCreationTimestamp(): int { /* ... */ }
    public function update(Connection $connection): void { /* ... */ }
    public function updateDestructive(Connection $connection): void { /* ... */ }
}
```

**Destructive modes** — option `--version-selection-mode` of `bin/console database:migrate-destructive`, default `safe`:

| Mode | Executes destructive migrations up to and including |
|---|---|
| `all` | the current major |
| `blue-green` | the previous major |
| `safe` | two majors before the current major |

**Execution order**: `V6_3`, then `V6_4`, then `V6_5` namespaces and so on, then core legacy migrations. Run one major with `bin/console database:migrate --all core.V6_7`.

**Important rules**

1. Never change an executed or released migration; write a new one. Unreleased ones may still change. Exception: a migration that was created incorrectly and causes errors.
2. Migrations must be runnable more than once: use `IF [NOT] EXISTS`, `MigrationStep::dropTableIfExists`, `MigrationStep::dropColumnIfExists`, and `columnExists` (available on `AddColumnTrait` via `ColumnExistsTrait`). `ALTER TABLE` has no `IF EXISTS`; query the columns manually.
3. Do not trust any identifier; query it first.
4. Do not trust customer data or structures; write defensive, exact queries.
5. Never overwrite customized data; check `updated_at IS NULL`, e.g. ``UPDATE `product` SET name = 'foobar' WHERE updated_at IS NULL;``.
6. A migration must never take longer than 10 seconds locally; test with large data sets.
7. There is no default language; use `ImportTranslationsTrait` with `Translations` and `importTranslation('product_sorting_translation', $translations, $connection)`.
8. Write a test per migration in `tests/Migration/V6_*`, without `IntegrationTestBehaviour`/`KernelTestBehaviour` or a booted kernel; get the connection via `KernelLifecycleManager::getConnection()`. Run `update()` twice to verify idempotence where feasible; prefer `MultiInsertQueryQueue` for multiple fixture rows (optional). No test needed for an empty `updateDestructive()`.
9. Do not prefix tables with `swag_`; use descriptive, singular, snake case names (e.g. `customer_data` or `customer`, not `swag_order_history`).

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep` — `getCreationTimestamp()`, `update()`, `updateDestructive()`, `dropTableIfExists()`, `dropColumnIfExists()`
- `Shopware\Core\Framework\Migration\AddColumnTrait`, `ColumnExistsTrait`
- `Shopware\Core\Migration\Traits\ImportTranslationsTrait`, `Translations`
- `bin/console database:create-migration`, `database:migrate --all`, `database:migrate-destructive --version-selection-mode`
- `KernelLifecycleManager::getConnection()`, `MultiInsertQueryQueue`, `MigrationTestTrait`

## Gotchas

- DDL commands cause an implicit commit and end the transaction, so `MigrationTestTrait` (which wraps a test in a transaction) does not help for them. Run DDL outside transactions, undo it manually after the test, and manage start/rollback yourself.
- All migrations have already run when migration tests run, so never expect a specific DB state. Create it explicitly: rename the table to a temporary name, recreate it in the needed state, run the test, drop it and rename the original back.
- Data updated by a migration always needs a test.

## Code check (6.7.15.1)
- confirmed `MigrationStep::update()` — abstract, non-destructive changes — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `MigrationStep::updateDestructive()` — concrete with empty body, optional to override — vendor/shopware/core/Framework/Migration/MigrationStep.php:38
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be implemented (not mentioned by the docs) — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::dropTableIfExists()` — protected helper — vendor/shopware/core/Framework/Migration/MigrationStep.php:114
- confirmed `MigrationStep::dropColumnIfExists()` — protected helper returning bool — vendor/shopware/core/Framework/Migration/MigrationStep.php:123
- corrected `ColumnExistsTrait::columnExists()` — docs: `AddColumnTrait::columnExists`; it is declared in ColumnExistsTrait, which AddColumnTrait uses — vendor/shopware/core/Framework/Migration/ColumnExistsTrait.php:16
- confirmed `database:create-migration` — command name — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:19
- corrected `version-selection-mode` — docs: no command named; it is an option of `database:migrate-destructive`, default `MigrationCollectionLoader::VERSION_SELECTION_SAFE` — vendor/shopware/core/Framework/Migration/Command/MigrationDestructiveCommand.php:26
- confirmed `ImportTranslationsTrait::importTranslation()` — protected, takes table, `Translations`, connection — vendor/shopware/core/Migration/Traits/ImportTranslationsTrait.php:13
- confirmed `KernelLifecycleManager::getConnection()` — static connection getter for tests — vendor/shopware/core/Framework/Test/TestCaseBase/KernelLifecycleManager.php:201
