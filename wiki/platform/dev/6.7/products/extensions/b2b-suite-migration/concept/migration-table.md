---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/concept/migration-table.md
title: Migration Table
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/concept/migration-table.html
sourceHash: 207096516ead0607f11432301e8a76db0f3f30d1
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b_components_migration_state", "b2b_components_migration_map", "b2b_components_migration_errors", "migration tables", "migration status", "record mapping", "migration errors", "b2b suite migration", "b2b components", "debugging migration"]
summary: The three B2B Suite migration tables - b2b_components_migration_state, _map and _errors - for status tracking, record mapping and error logging.
lastBuilt: 2026-10-21
---
## What it is

The three database tables the B2B Suite Migration extension introduces to manage and track migrating data from B2B Suite to B2B Commercial (B2B Components).

## When to use

When monitoring a running migration, verifying which B2B Suite records became which B2B Components records, or debugging failed records.

## Key steps / config

| Table | Purpose |
|---|---|
| `b2b_components_migration_state` | Status of the migration process per entity |
| `b2b_components_migration_map` | Maps B2B Suite records to B2B Commercial records (traceability) |
| `b2b_components_migration_errors` | Errors encountered during migration, for troubleshooting |

Use the state table for monitoring, the map table for verification, and the errors table for debugging.

## Essential identifiers

- `b2b_components_migration_state`
- `b2b_components_migration_map`
- `b2b_components_migration_errors`

## Code check (6.7.15.1)
- unverified `b2b_components_migration_state` — created by the B2B Suite Migration Commercial extension, not present in the core/storefront/administration roots
- unverified `b2b_components_migration_map` — created by the B2B Suite Migration extension, out of scope
- unverified `b2b_components_migration_errors` — created by the B2B Suite Migration extension, out of scope
