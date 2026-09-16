---
id: platform/dev/6.6/products/extensions/migration-assistant/concept.md
title: Concept
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept.html
sourceHash: 75253c5b4fe88778a23e0c630e4404e7af7e21d4
keywords: ["Migration Assistant", "SwagMigrationAssistant", "profile", "connection", "DataSelection", "DataSet", "MigrationContext", "premapping", "gateway", "Reader", "Converter", "MappingService", "Writer", "migration run"]
summary: "Migration Assistant concepts: profile/connection, DataSet/DataSelection, context, premapping, gateway/reader, converter, writer, media processing."
lastBuilt: "2026-09-15"
---
## What it is

This page introduces the core concepts of the Shopware Migration Assistant plugin (`SwagMigrationAssistant`) that developers need before extending it: profiles/connections, data structures, and the extension points.

## When to use

Read this before extending the Migration Assistant plugin — for example to migrate plugin data from a source system, connect a new source system, or customize how data is converted.

## Key steps / config

- **Profile and connections**: users create a connection to a source system using a profile (e.g. the Shopware 5.5 profile) indicating the source system type; a connection allows repeated migrations and updates from the same source.
- **DataSelection and dataSet**: `DataSet` represents an entity (e.g. a database table); `DataSelection` is an ordered group of `DataSets`.
- **Migration context**: a data structure holding all data needed for the migration.
- **Premapping**: maps source-system values (e.g. salutations) to Shopware 6 equivalents, stored in the mapping table.
- **Gateway and reader**: the gateway defines how Shopware 6 talks to the source system; `Reader` objects read the data. The `shopware55` profile ships an `api` gateway (http/s) and a `local` gateway (direct database access, requiring both systems on the same server). Using `ShopwareApiGateway` requires the Shopware Migration Connector plugin on the Shopware 5 side.
- **Converter, mapping and deltas**: `Reader` output is passed to `Converter` objects that reshape it for Shopware 6; the `MappingService` records old-to-new identifier mappings and a checksum per entry to skip unchanged data on repeat runs. Converted data is discarded after migration; mappings persist.
- **Logging**: converter errors are logged so users can see what data is missing.
- **Writer**: `Writer` objects receive converted data and write it into Shopware 6; error handling is built in.
- **Media processing**: media files are downloaded from the source system as the final migration step; the `local` gateway copies/renames files directly on the filesystem instead.

The migration procedure: the user (1) selects/creates a connection with profile and gateway, (2) selects `DataSelections`, (3) resolves premapping, (4) fetches data per `DataSet` via `Reader`/`Converter`, (5) writes data per `DataSet` via `Writer`, (6) processes media (downloads/copies files listed in `swag_migration_media_file`), (7) finishes and cleans up. Each run is a `Run`/`MigrationRun`, saved with a detailed history.

## Essential identifiers

`DataSet`, `DataSelection`, `MigrationContext`, `Reader`, `Converter`, `MappingService`, `Writer`, `swag_migration_media_file`, `Run`/`MigrationRun`, `shopware55` profile, `api` gateway, `local` gateway, `ShopwareApiGateway`.

## Gotchas

The `local` gateway requires the source and target systems to be on the same server. All fetched data is deleted after a migration run finishes or aborts, but identifier mappings stay persistent for future runs.
