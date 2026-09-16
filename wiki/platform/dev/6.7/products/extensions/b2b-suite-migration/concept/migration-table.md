---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/concept/migration-table.md
title: Migration Table
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/concept/migration-table.html
sourceHash: 207096516ead0607f11432301e8a76db0f3f30d1
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b_components_migration_state", "b2b_components_migration_map", "b2b_components_migration_errors", "b2b suite migration", "b2b commercial", "migration tables", "migration state", "record mapping", "migration errors", "database tables"]
summary: The three database tables B2B Suite to B2B Commercial migration uses to track state, map records and log errors per entity.
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite to B2B Commercial migration creates three database tables to manage and track the data migration:

1. `b2b_components_migration_state` — tracks the status of the migration process for each entity.
2. `b2b_components_migration_map` — maps records between B2B Suite and B2B Commercial, giving traceability of which source record became which target record.
3. `b2b_components_migration_errors` — logs errors encountered during migration for troubleshooting.

## When to use

When monitoring, verifying or debugging a migration from B2B Suite to B2B Commercial: check the state table for per-entity progress, the map table to trace a migrated record back to its source, and the errors table when records failed to migrate.

## Essential identifiers

- `b2b_components_migration_state`
- `b2b_components_migration_map`
- `b2b_components_migration_errors`

## Code check (6.7.13.0)
- unverified `b2b_components_migration_state` — created by the SwagCommercial B2B Suite migration, not part of vendor/shopware core/storefront/administration
- unverified `b2b_components_migration_map` — SwagCommercial table, outside the checked vendor roots
- unverified `b2b_components_migration_errors` — SwagCommercial table, outside the checked vendor roots
- confirmed `SwagCommercial` — core only lists the commercial plugin as a known translation plugin; its code is not installed in vendor/shopware — vendor/shopware/core/System/Resources/translation.yaml:8
