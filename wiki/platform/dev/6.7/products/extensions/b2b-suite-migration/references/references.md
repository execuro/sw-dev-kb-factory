---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/references/references.md
title: References
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/references/references.html
sourceHash: 2718e2c8e0784dcb31cc05812b71e1fe8b4851df
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b:migrate:commercial", "b2b:migrate:validate", "b2b:migrate:progress", "b2b:migrate:rollback", "SHOPWARE_B2B_MIGRATION_BATCH_SIZE", "--batch-size", "Chunk_size", "batch size", "chunk size", "b2b suite migration", "migration commands", "b2b commercial"]
summary: B2B Suite to B2B Commercial migration CLI reference (b2b:migrate:*) and batch size via SHOPWARE_B2B_MIGRATION_BATCH_SIZE or --batch-size (default 100).
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/development/validation-and-run.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/execution/troubleshooting.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md"]
---
## What it is

A quick reference for the B2B Suite to B2B Commercial migration: all console commands used during the migration and how to configure the batch size (`Chunk_size`) used for message queue processing.

## When to use

When executing or customising the migration and you need the exact command name, its options, or the way to change how many records are processed per batch.

## Key steps / config

**Console commands**

| Command | Purpose |
|---|---|
| `bin/console b2b:migrate:commercial` | Starts the migration from B2B Suite to B2B Commercial. `--batch-size` sets the batch size; arguments `component_name_1 component_name_2` select components. See [Running the Migration](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md). |
| `bin/console b2b:migrate:validate` | Validates the migration configuration (XML and configurator classes). See [Configuration Validation](platform/dev/6.7/products/extensions/b2b-suite-migration/development/validation-and-run.md). |
| `bin/console b2b:migrate:progress` | Shows the current migration status; `--watch` gives real-time updates. |
| `bin/console b2b:migrate:rollback` | Reverts the migration, clearing migrated target data while preserving source data. `-f`/`--force` skips confirmation, `--batch-size` sets the deletion batch size, component name arguments limit the rollback. See [Troubleshooting](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/troubleshooting.md). |

The message queue worker must be running before executing migration commands, see [Prerequisites](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md).

**Batch size**

The batch size determines how many records are processed in a single migration operation. Default: `100`. Change it by:

- setting the `SHOPWARE_B2B_MIGRATION_BATCH_SIZE` environment variable in `.env`, or
- passing `--batch-size` to the migration command.

```bash
SHOPWARE_B2B_MIGRATION_BATCH_SIZE=100
```

Trade-offs:

- Smaller (e.g. 50): less memory use and lower database/queue load, suited to constrained environments or debugging, but longer total migration time.
- Larger (e.g. 500): faster for large datasets, but higher memory and CPU usage and a risk of timeouts in constrained environments.

## Essential identifiers

- `bin/console b2b:migrate:commercial`
- `bin/console b2b:migrate:validate`
- `bin/console b2b:migrate:progress` (`--watch`)
- `bin/console b2b:migrate:rollback` (`-f`, `--force`, `--batch-size`)
- `SHOPWARE_B2B_MIGRATION_BATCH_SIZE`
- `--batch-size`

## Gotchas

- Changing the batch size without testing can cause performance issues or timeouts; test a new value on staging and validate the configuration after changes.
- Migration commands rely on a running message queue worker.

## Code check (6.7.15.1)
- unverified `b2b:migrate:commercial` — defined in the Shopware Commercial plugin, outside vendor/shopware/core, storefront and administration
- unverified `b2b:migrate:validate` — Commercial plugin command, not found in the three installed package roots
- unverified `b2b:migrate:progress` — Commercial plugin command, not found in the three installed package roots
- unverified `b2b:migrate:rollback` — Commercial plugin command, not found in the three installed package roots
- unverified `SHOPWARE_B2B_MIGRATION_BATCH_SIZE` — Commercial plugin env var, default 100 per docs not checkable in scope
