---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md
relatedPages:
  - platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md
sourceHash: 7701665f545f1ebac7142ce9dc907d0ae9e740b5
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/execution/running-migration.html
title: Running Migration
version: "6.7"
versions:
  - "6.7"
keywords: ["b2b:migrate:commercial", "b2b:migrate:progress", "--batch-size", "--watch", "employee_management", "quote_management", "shopping_list", "b2b_components_migration_errors", "configurator priority", "migration status", "b2b suite migration", "b2b commercial"]
summary: "Run the B2B Suite to Commercial migration with b2b:migrate:commercial (components, --batch-size) and track it via b2b:migrate:progress --watch."
lastBuilt: 2026-10-21
---
## What it is

How to start and monitor the B2B Suite to B2B Commercial migration with two console commands: `b2b:migrate:commercial` (start) and `b2b:migrate:progress` (status). Running both at the same time in separate terminals is recommended.

## When to use

When prerequisites are met and the configuration is validated, and you want to migrate all or selected components and watch the result.

## Key steps / config

**Start the migration** (all components and entities defined in the configuration):

```bash
bin/console b2b:migrate:commercial
bin/console b2b:migrate:commercial quote_management shopping_list
bin/console b2b:migrate:commercial --batch-size=100
```

- Component arguments must match the technical name defined in the configurator (see [technical terms and concepts](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/technical-terms-and-concepts.md)). Useful for testing or migrating only some components.
- `--batch-size` controls how many records are processed per batch, to manage memory and performance; adjust to your system and data size.
- The command dispatches work to the message queue; when it returns, migration may still be running in the background.

**Check status**:

```bash
bin/console b2b:migrate:progress
bin/console b2b:migrate:progress --watch
```

`--watch` refreshes the output every 5 seconds. The table shows the columns **Total** (records in the source table), **Valid** (records meeting migration criteria), **Newly** (records added after migration start), **Migrated**, **Pending** and **Error**, plus a **Status** column with one of: `Complete`, `Pending`, `In progress`, `Complete with error` (check `b2b_components_migration_errors`), `Has new records` (new records detected in B2B Suite).

## Essential identifiers

- `b2b:migrate:commercial` (arguments: component names; option `--batch-size`)
- `b2b:migrate:progress` (option `--watch`)
- `employee_management`, `quote_management`, `shopping_list`
- `b2b_components_migration_errors`

## Gotchas

- `employee_management` is a prerequisite for all other B2B components and is always migrated first. The order of components on the command line does not matter: migration order follows configurator priority from the service definition, highest priority first.
- Budget Management: the budget's Organization Unit is empty after migration (expected); assign budgets to organization units manually in B2B Commercial. Budget Management requires Commercial 7.6.0 or above.

## Code check (6.7.15.1)
- unverified `b2b:migrate:commercial` — command provided by the Shopware Commercial plugin, out of scope of the checked core/storefront/administration code
- unverified `b2b:migrate:progress` — Commercial plugin command, out of scope
- unverified `--batch-size` — option of a Commercial plugin command, out of scope
- unverified `employee_management` — Commercial plugin component name and its priority, out of scope
- unverified `b2b_components_migration_errors` — table created by the Commercial plugin, out of scope
