---
id: platform/func/migration-en/shopware6-Migrationsprocess.md
title: Shopware6 Migrationsprocess
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://docs.shopware.com/en/migration-en/shopware6-Migrationsprocess"
sourceHash: "dc939d7c9e7a85da1b8a0e715a9fe16097f45b388be116d74486babeec090495"
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.14"
  swMin: "6.6.0.0"
  swMax: "6.6.10.14"
keywords: ["Migration assistant", "integration", "Access ID", "Security key", "migration connection", "checksum", "data reading", "error resolution", "swag_migration_data", "indexing", "History", "bulk migration steps", "Shopware 6 to Shopware 6"]
summary: "Step-by-step process for migrating one Shopware 6 shop to another: integration, connection, data check, and the six migration steps."
lastBuilt: "2026-09-15"
---
## What it is

Describes the full process of migrating data from one Shopware 6 shop (source) to another Shopware 6 shop (target), using the Migration assistant extension.

## When to use

When migrating between two Shopware 6 instances, which is only supported when source and target run the identical Shopware version.

## Key steps / config

1. Complete data migration **before** configuring themes, payment methods or shopping experiences on the target — migration may need to be reset, which would discard that work.
2. Install the **Migration assistant** extension in both source and target shops (description refers to extension version **16.0.0**).
3. In the source shop, create an **Integration** under `Settings > System > Integrations`: `Name`, `Administrator` (grants full resource access), auto-generated `Access ID` and `Security key` (needed by the target to authenticate).
4. In the target shop, under `Settings > Extensions > Migration assistant`, click **Create initial connection**; set `Name`, `Profile` (e.g. Shopware 6.6 for a SW6 source), and `Gateway` (only `API` is available for the Shopware 6 profile).
5. Review the connection in the **migration overview**: shop system, profile, interface, last connection check and last migration; edit via the connection button or reset checksums via the context menu to force a full re-migration.
6. **Data selection**: tick the shop/extension data to migrate; **Data check** validates whether source data maps to the target (unmapped data, e.g. a default payment type, must be assigned manually before continuing).
7. Click **Start Migration**, which runs six steps: **Data reading** (assigns each record a checksum so unchanged data is skipped on later runs), **Error resolution** (a pause where inconsistent records can be fixed in the admin instead of failing the whole run), **Writing** (creates customer groups, categories, languages, currencies and sales channels if missing), **Downloading** (fetches media into the target's media management), **Cleanup** (deletes temporary records from `swag_migration_data`), and **Indexing** (re-triggers Shopware's indexers).
8. The **Logbook**/**History** shows errors, warnings and info per migration run, with a downloadable log.

## Essential identifiers

- Menu paths: `Settings > System > Integrations`, `Settings > Extensions > Migration assistant`
- Database table: `swag_migration_data`
- Migration steps: Data reading, Error resolution, Writing, Downloading, Cleanup, Indexing
- Connection fields: `Access ID`, `Security key`, `Profile`, `Gateway`

## Gotchas

- Source and target must run the exact same Shopware version for a Shopware 6 to Shopware 6 migration.
- Resetting checksums re-migrates and overwrites all data in the target system.
