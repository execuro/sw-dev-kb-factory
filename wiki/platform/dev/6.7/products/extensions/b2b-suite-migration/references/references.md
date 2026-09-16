---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/references/references.md
title: References
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/references/references.html
sourceHash: 2718e2c8e0784dcb31cc05812b71e1fe8b4851df
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b:migrate:commercial", "b2b:migrate:validate", "b2b:migrate:progress", "b2b:migrate:rollback", "SHOPWARE_B2B_MIGRATION_BATCH_SIZE", "--batch-size", "chunk size", "batch size", "b2b suite migration", "b2b commercial", "console commands", "message queue worker"]
summary: "Command reference for B2B Suite to B2B Commercial migration (commercial, validate, progress, rollback) and batch size via SHOPWARE_B2B_MIGRATION_BATCH_SIZE."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/development/validation-and-run.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/execution/troubleshooting.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md"]
---
## What it is

Quick reference for the console commands used in the B2B Suite to B2B Commercial migration, and for configuring the batch size (`Chunk_size`) used for message queue processing.

## When to use

When executing or customizing the migration and you need the exact command names, their options, or how to change how many records are processed per batch.

## Key steps / config

**Console commands**

| Command | Purpose / options | Details |
|---|---|---|
| `bin/console b2b:migrate:commercial` | Starts the migration. `--batch-size`; arguments `component_name_1 component_name_2` | [Running the Migration](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md) |
| `bin/console b2b:migrate:validate` | Validates migration configuration (XML and configurator classes) | [Configuration Validation](platform/dev/6.7/products/extensions/b2b-suite-migration/development/validation-and-run.md) |
| `bin/console b2b:migrate:progress` | Shows current migration status. `--watch` for real-time updates | [Running the Migration](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md) |
| `bin/console b2b:migrate:rollback` | Reverts migration, clears migrated target data, keeps source data. `-f`/`--force` skips confirmation; `--batch-size`; component arguments | [Troubleshooting](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/troubleshooting.md) |

Make sure the message queue worker is running before executing migration commands — see [Prerequisites](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md).

**Batch size (chunk size)**

Determines how many records one migration operation processes. Default: `100`. Change it by:
- setting `SHOPWARE_B2B_MIGRATION_BATCH_SIZE` in the `.env` file:
  ```
  SHOPWARE_B2B_MIGRATION_BATCH_SIZE=100
  ```
- passing `--batch-size` to the command.

## Essential identifiers

- `b2b:migrate:commercial`, `b2b:migrate:validate`, `b2b:migrate:progress`, `b2b:migrate:rollback`
- `SHOPWARE_B2B_MIGRATION_BATCH_SIZE` (env var, default 100)
- `--batch-size`, `--watch`, `-f` / `--force`

## Gotchas

- Smaller batches (e.g. 50): less memory and database/queue load, suited to limited resources or debugging, but longer total migration time.
- Larger batches (e.g. 500): faster for large datasets, but more memory/CPU use and risk of timeouts in constrained environments.
- Test a changed batch size in staging first; untested changes can cause performance issues or timeouts. Validate the configuration after modifications.
- The source table describes `--batch-size` on `b2b:migrate:commercial` as "batch size for deletion" (apparently copied from the rollback row); the Running Migration page describes it as records processed per batch.

## Code check (6.7.13.0)
- unverified `b2b:migrate:commercial` — Shopware Commercial plugin command, not in vendor/shopware core/storefront/administration
- unverified `b2b:migrate:validate` — Commercial plugin command, not in the installed vendor roots
- unverified `b2b:migrate:progress` — Commercial plugin command, not in the installed vendor roots
- unverified `b2b:migrate:rollback` — Commercial plugin command, not in the installed vendor roots
- unverified `SHOPWARE_B2B_MIGRATION_BATCH_SIZE` — env var read by the Commercial plugin; default 100 not verifiable against installed core
