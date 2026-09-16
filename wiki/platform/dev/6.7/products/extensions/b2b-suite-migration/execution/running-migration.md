---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md
title: Running Migration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html
sourceHash: 7701665f545f1ebac7142ce9dc907d0ae9e740b5
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b:migrate:commercial", "b2b:migrate:progress", "--batch-size", "--watch", "b2b_components_migration_errors", "employee_management", "b2b suite migration", "b2b commercial", "migration status", "message queue", "budget management", "run migration"]
summary: "Run and monitor the B2B Suite to B2B Commercial migration with b2b:migrate:commercial and b2b:migrate:progress, incl. component and batch-size options."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md"]
---
## What it is

How to execute and monitor the data migration from B2B Suite to B2B Commercial using two console commands: `b2b:migrate:commercial` (start) and `b2b:migrate:progress` (status).

## When to use

When you are ready to transfer B2B Suite data into B2B Commercial, want to migrate only selected components, tune batch size, or watch the migration's progress.

## Key steps / config

Run both commands at the same time in separate terminal windows rather than one after the other.

1. Start the full migration (all components and entities defined in the configuration):
   ```bash
   bin/console b2b:migrate:commercial
   ```
2. Migrate only specific components — names must match the technical name defined in the configurator (see [configurator](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md)):
   ```bash
   bin/console b2b:migrate:commercial component_name_1 component_name_2
   bin/console b2b:migrate:commercial quote_management shopping_list
   ```
3. Control records per batch with `--batch-size`:
   ```bash
   bin/console b2b:migrate:commercial --batch-size=100
   ```
4. Monitor in a second terminal; `--watch` refreshes the output every 5 seconds:
   ```bash
   bin/console b2b:migrate:progress
   bin/console b2b:migrate:progress --watch
   ```

Progress table columns: **Total** (records in source table), **Valid** (meet migration criteria), **Newly** (added after migration start), **Migrated**, **Pending**, **Error**.

**Status** values: `Complete`, `Pending` (waiting to start), `In progress`, `Complete with error` (check `b2b_components_migration_errors`), `Has new records` (new records detected in B2B Suite).

## Essential identifiers

- `bin/console b2b:migrate:commercial` — arguments: component names; option `--batch-size`
- `bin/console b2b:migrate:progress` — option `--watch`
- `b2b_components_migration_errors` — error table
- Component names: `employee_management`, `quote_management`, `shopping_list`

## Gotchas

- `employee_management` is a prerequisite for all other B2B components and is always migrated first. The order of components on the command line does not affect sequence; it is determined by configurator priority in the service definition file (highest priority runs first).
- The command dispatches work to the message queue, so the migration may still be running after the command returns — use `b2b:migrate:progress` to see real state.
- Adjust `--batch-size` to system capabilities and data volume.
- Budget Management: the budget's Organization Unit is empty after migration (expected); assign each budget to organization units manually in B2B Commercial afterwards.

## Version notes

- Budget Management migration requires Commercial 7.6.0 or above.

## Code check (6.7.13.0)
- unverified `b2b:migrate:commercial` — console command lives in the Shopware Commercial plugin, not in vendor/shopware core/storefront/administration
- unverified `b2b:migrate:progress` — Commercial plugin command, not found in the three installed vendor roots
- unverified `b2b_components_migration_errors` — Commercial plugin table, not present in the installed core migrations
- unverified `employee_management` — Commercial configurator technical name, out of scope of installed core code
