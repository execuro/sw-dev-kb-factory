---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-suite-migration/development/validation-and-run.md
sourceHash: fdffb1a8e8d80430bbf98c617c83fa2bd0857dcf
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/development/validation-and-run.html
title: Validation and Run
version: "6.7"
versions:
  - "6.7"
keywords: ["b2b:migrate:validate", "b2b:migrate:progress", "b2b:migrate:commercial", "b2b:migrate:rollback", "b2b_components_migration_errors", "--watch", "validate migration config", "rollback migration", "queue worker", "b2b suite migration", "b2b commercial"]
summary: "Console sequence for the B2B Suite to Commercial migration: b2b:migrate:validate, progress --watch, commercial, then review errors or rollback."
lastBuilt: 2026-10-21
---
## What it is

The order of console commands to run after writing a B2B Suite to B2B Commercial migration configuration: validate it, monitor progress, start the migration, review errors, and optionally roll back.

## When to use

After you have configured (or customised) the migration mapping and want to check it and execute the migration.

## Key steps / config

1. Validate the configuration:

   ```bash
   bin/console b2b:migrate:validate
   ```

   Checks that the XML is well-formed and adheres to a valid schema, and that the referenced fields and tables exist in the database; otherwise it throws an exception. On failure it prints hints for resolving the issue. Validating first catches configuration errors before a migration run.

2. In a separate terminal, monitor progress:

   ```bash
   bin/console b2b:migrate:progress --watch
   ```

3. With the message queue worker running, start the migration:

   ```bash
   bin/console b2b:migrate:commercial
   ```

4. Review logs and errors in the table `b2b_components_migration_errors` to confirm the migration succeeded.
5. To roll the migration back:

   ```bash
   bin/console b2b:migrate:rollback
   ```

## Essential identifiers

- `b2b:migrate:validate`
- `b2b:migrate:progress` (with `--watch`)
- `b2b:migrate:commercial`
- `b2b:migrate:rollback`
- `b2b_components_migration_errors`

## Gotchas

- The migration is processed through the message queue; without a running queue worker it does not progress.

## Code check (6.7.15.1)
- unverified `b2b:migrate:validate` — command provided by the Shopware Commercial plugin, out of scope of the checked core/storefront/administration code
- unverified `b2b:migrate:progress` — Commercial plugin command, out of scope
- unverified `b2b:migrate:commercial` — Commercial plugin command, out of scope
- unverified `b2b:migrate:rollback` — Commercial plugin command, out of scope
- unverified `b2b_components_migration_errors` — table created by the Commercial plugin, out of scope
