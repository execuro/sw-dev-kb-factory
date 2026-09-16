---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/_index.md
title: Concept
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/
sourceHash: ac57f5712d366770dc85034304507d92a5d75bc7
keywords: ["Migration Assistant", "SwagMigrationAssistant", "profile", "connection", "DataSelection", "DataSet", "MigrationContext", "premapping", "gateway", "Reader", "Converter", "MappingService", "Writer", "MigrationRun"]
summary: "Migration Assistant concepts: profile/connection, DataSet/DataSelection, context, premapping, gateway/reader, converter, writer, media processing."
lastBuilt: "2026-09-15"
---
## What it is

This chapter introduces the core concepts of the Shopware Migration Assistant plugin (`SwagMigrationAssistant`): profiles/connections, the data structures used to define what is migrated, and the plugin's extension points.

## When to use

Read this before extending the Migration Assistant — for example when connecting a new source system, migrating additional plugin data, or customizing converter behavior.

## Key steps / config

- **Profile and connections**: a connection to a source system requires a specific profile (e.g. the Shopware 5.5 profile); a connection allows repeated migrations/updates from the same source.
- **DataSelection and dataSet**: each `DataSet` represents an entity (e.g. a database table); each `DataSelection` is an ordered group of `DataSets`.
- **Migration context**: holds all data necessary for the migration run.
- **Premapping**: maps source structures (e.g. salutations) that don't match Shopware 6's structure; automatic for default values, manual for custom ones. Written into the mapping table.
- **Gateway and reader**: the gateway defines communication with the source system; `Reader` objects read the data. The `shopware55` profile provides an `api` gateway (http/s) and a `local` gateway (direct database access — both systems must run on the same server). `ShopwareApiGateway` requires the Shopware Connector plugin installed on Shopware 5.
- **Converter, mapping, and deltas**: `Reader` data is passed to `Converter` objects that reshape it for Shopware 6, using the `MappingService` to record old-to-new identifiers plus a checksum to skip unchanged data on repeat runs. Converted data is removed after migration; the mapping stays persistent.
- **Logging**: conversion errors are logged for the user.
- **Writer**: `Writer` objects receive converted data and write it to Shopware 6; error handling is already implemented.
- **Media processing**: media files are downloaded from the source system as the last migration step; the `local` gateway copies/renames files directly in the local filesystem instead.

Migration procedure: (1) select/create a connection with profile and gateway, (2) select `DataSelections`, (3) resolve premapping, (4) fetch data per `DataSet` (`Reader` then `Converter`), (5) write data per `DataSet` via `Writer`, (6) process media from `swag_migration_media_file`, (7) finish and clean up. Each run is a `Run`/`MigrationRun` saved with a detailed history of errors.

## Essential identifiers

`DataSet`, `DataSelection`, `MigrationContext`, `Reader`, `Converter`, `MappingService`, `Writer`, `swag_migration_media_file`, `Run`/`MigrationRun`, `shopware55` profile, `api` gateway, `local` gateway, `ShopwareApiGateway`.

## Gotchas

The `local` gateway requires source and target systems on the same server. All fetched data is deleted after a run finishes or aborts, but the identifier mapping stays persistent for future migrations.
