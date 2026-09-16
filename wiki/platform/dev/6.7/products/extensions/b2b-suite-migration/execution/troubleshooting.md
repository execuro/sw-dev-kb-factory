---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/troubleshooting.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/troubleshooting.html
sourceHash: 2f9211e7fb2c0af2e82f895bf363a182b17cc8ce
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b:migrate:rollback", "b2b_components_migration_errors", "b2b_components_migration_map", "--force", "--batch-size", "employee_management", "rollback", "revert migration", "b2b suite migration", "b2b commercial", "migration errors", "troubleshooting"]
summary: "Troubleshoot the B2B Suite to B2B Commercial migration: error tables, Has new records status, and b2b:migrate:rollback with component, --force, --batch-size."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md"]
---
## What it is

Troubleshooting steps for the B2B Suite to B2B Commercial migration: where errors are logged, what the `Has new records` status means, and how to roll back migrated data with `b2b:migrate:rollback`.

## When to use

When the migration progress shows `Complete with error` or `Has new records`, or when you need to revert all or some migrated components.

## Key steps / config

**Check errors**
- If status is `Complete with error`, review the `b2b_components_migration_errors` table; it records the component, entity and specific error message.
- `Has new records` in the progress (watch) output means records were added in B2B Suite while the migration was running.

**Roll back the migration**

The rollback command:
- deletes all migrated records from the B2B Commercial tables;
- resets the migration state, mapping and error tables to their initial state;
- deletes all migration-related messages from the message queue;
- leaves all B2B Suite data intact.

```bash
bin/console b2b:migrate:rollback
bin/console b2b:migrate:rollback component_name_1 component_name_2
bin/console b2b:migrate:rollback quote_management shopping_list
bin/console b2b:migrate:rollback --force
bin/console b2b:migrate:rollback --batch-size=500
```

- Component names must match the technical name defined in the [configurator](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md).
- `--force` / `-f` skips the data-deletion confirmation.
- `--batch-size` sets the maximum batch size for the rollback, as with the migration command.

## Essential identifiers

- `bin/console b2b:migrate:rollback` — arguments: component names; options `--force`/`-f`, `--batch-size`
- `b2b_components_migration_errors` — error log table
- `b2b_components_migration_map` — mapping table linked from error rows
- Statuses: `Complete with error`, `Has new records`, `Error`

## Gotchas

- Rolling back `employee_management` also rolls back all other components, because it is a prerequisite for them.
- Order of components on the rollback command line does not matter; specified components are processed in reverse migration order.
- Migration runs in batches: if some records in a batch fail, every record of that batch is marked `Error` and not migrated. All of them are logged in `b2b_components_migration_errors` and linked to `b2b_components_migration_map`, which lets you identify which records were not migrated and why.

## Code check (6.7.13.0)
- unverified `b2b:migrate:rollback` — Shopware Commercial plugin command, not in vendor/shopware core/storefront/administration
- unverified `b2b_components_migration_errors` — Commercial plugin table, not in installed core migrations
- unverified `b2b_components_migration_map` — Commercial plugin table, out of scope of installed core code
- unverified `employee_management` — Commercial configurator technical name, out of scope
