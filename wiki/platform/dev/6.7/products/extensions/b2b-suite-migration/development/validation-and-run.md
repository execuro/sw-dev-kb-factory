---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/validation-and-run.md
title: Validation and Run
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/validation-and-run.html
sourceHash: fdffb1a8e8d80430bbf98c617c83fa2bd0857dcf
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b:migrate:validate", "b2b:migrate:progress", "b2b:migrate:commercial", "b2b:migrate:rollback", "b2b_components_migration_errors", "b2b suite migration", "b2b commercial", "validate migration config", "rollback", "migration progress", "queue worker"]
summary: "B2B Suite migration CLI: b2b:migrate:validate, progress --watch, commercial (queue worker required), rollback; errors table listed."
lastBuilt: 2026-09-15
---
## What it is

The command sequence for validating a B2B Suite to B2B Commercial migration configuration and then running, monitoring and rolling back the migration.

## When to use

After the migration XML (components, entities, field mappings, handlers) is configured and you are ready to check it and execute the migration.

## Key steps / config

1. Validate the configuration:
   `bin/console b2b:migrate:validate`
   Checks that the XML is well-formed and matches a valid schema, and that referenced fields and tables exist in the database (throws an exception otherwise). Gives hints to fix failures.
2. Monitor progress, in a separate terminal:
   `bin/console b2b:migrate:progress --watch`
3. Start the migration, with the message queue worker running:
   `bin/console b2b:migrate:commercial`
4. Review logs and errors in the `b2b_components_migration_errors` table.
5. Roll back if needed:
   `bin/console b2b:migrate:rollback`

## Essential identifiers

- `bin/console b2b:migrate:validate`
- `bin/console b2b:migrate:progress --watch`
- `bin/console b2b:migrate:commercial`
- `bin/console b2b:migrate:rollback`
- `b2b_components_migration_errors`

## Gotchas

- The migration is processed through the message queue; without a running queue worker `b2b:migrate:commercial` will not make progress.
- Validation also checks database tables/columns, so run it against the database that will be migrated.

## Code check (6.7.13.0)
- unverified `b2b:migrate:validate` — command ships with the Shopware Commercial extension, not under the installed vendor/shopware packages
- unverified `b2b:migrate:progress` — Commercial extension command, out of scope
- unverified `b2b:migrate:commercial` — Commercial extension command, out of scope
- unverified `b2b:migrate:rollback` — Commercial extension command, out of scope
- unverified `b2b_components_migration_errors` — table created by the Commercial extension, out of scope
