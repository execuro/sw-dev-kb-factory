---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/troubleshooting.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/troubleshooting.html
sourceHash: 2f9211e7fb2c0af2e82f895bf363a182b17cc8ce
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b:migrate:rollback", "b2b_components_migration_errors", "b2b_components_migration_map", "employee_management", "--force", "--batch-size", "rollback migration", "b2b suite migration", "b2b commercial", "migration errors", "Complete with error", "Has new records"]
summary: Troubleshooting the B2B Suite to B2B Commercial migration - error tables, b2b:migrate:rollback with components, --force and --batch-size.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md"]
---
## What it is

Troubleshooting steps for the B2B Suite to B2B Commercial data migration: where migration errors are logged, what the progress statuses mean, and how to roll a migration back fully or per component with `bin/console b2b:migrate:rollback`.

## When to use

- The migration status shows `Complete with error`.
- The watch progress command output shows `Has new records`.
- You need to revert migrated data from B2B Commercial, either completely or for selected components.

## Key steps / config

**Inspect errors**

- Status `Complete with error`: review the `b2b_components_migration_errors` table. It holds detailed error logs including the component, the entity and the specific error message.
- `Has new records` in the watch progress output: new records were added to the B2B Suite while the migration was running.
- Migration runs in batch mode. If one record in a batch fails, all records of that batch are marked `Error` and are not migrated. They are all logged in `b2b_components_migration_errors` and linked to the `b2b_components_migration_map` table, which tells you which records were not migrated and why.

**Rollback**

```bash
bin/console b2b:migrate:rollback
bin/console b2b:migrate:rollback component_name_1 component_name_2
bin/console b2b:migrate:rollback quote_management shopping_list
bin/console b2b:migrate:rollback --force
bin/console b2b:migrate:rollback --batch-size=500
```

The rollback command:

- deletes all migrated records from the B2B Commercial tables;
- resets the migration state, mapping and error tables to their initial state;
- deletes all migration-related messages from the message queue;
- leaves all B2B Suite data intact.

Options and arguments:

- Component names as arguments roll back only those components. Names must match the technical name defined in the configurator (see [technical terms and concepts](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md)).
- `--force` / `-f` skips the confirmation prompt for data deletion.
- `--batch-size` sets the maximum batch size for the rollback, as for the migration command, to manage memory usage and performance.

## Essential identifiers

- `bin/console b2b:migrate:rollback` (`--force`, `-f`, `--batch-size`)
- `b2b_components_migration_errors`
- `b2b_components_migration_map`
- `employee_management`, `shopping_list`, `quote_management` (component technical names)
- Statuses: `Complete with error`, `Has new records`, `Error`

## Gotchas

- `employee_management` is a prerequisite for all other B2B components; naming it in the rollback command rolls back all other components as well.
- The order of components in the rollback command does not matter: they are processed in the reverse order of their migration sequence.
- A single failing record causes its whole batch to be marked `Error`, so the otherwise valid records in that batch are not migrated either.

## Code check (6.7.15.1)
- unverified `b2b:migrate:rollback` — defined in the Shopware Commercial plugin, not in vendor/shopware/core, storefront or administration; out of scope
- unverified `b2b_components_migration_errors` — Commercial plugin table, not found in the three installed package roots
- unverified `b2b_components_migration_map` — Commercial plugin table, not found in the three installed package roots
- unverified `employee_management` — Commercial B2B component name, out of scope of the checked roots
