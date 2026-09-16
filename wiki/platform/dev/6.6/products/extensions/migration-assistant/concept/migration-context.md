---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/migration-context.md
title: Migration Context
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/migration-context.html
sourceHash: 7723cd0872d4659deb6c1b3054c1e3eef017c7c9
keywords: ["MigrationContext", "MigrationContextInterface", "getProfile", "getConnection", "getRunUuid", "getDataSet", "getOffset", "getLimit", "getGateway", "SwagMigrationConnectionEntity"]
summary: "MigrationContext is the central data structure holding connection, profile, gateway, run id, current DataSet, and offset/limit for a migration call."
lastBuilt: "2026-09-15"
---
## What it is

`MigrationContext` is the central data structure of the Migration Assistant: it carries all the information a `Reader`, `Converter`, or `Writer` needs to process one batch of a migration run.

## When to use

Referenced whenever implementing or calling a `Reader`, `Converter`, `Writer`, or `Gateway`, since these components receive a `MigrationContextInterface` instance as their main argument.

## Key steps / config

`MigrationContext extends Struct implements MigrationContextInterface` and holds:

1. The current connection, with credentials (`getConnection(): ?SwagMigrationConnectionEntity`).
2. The current `Profile` and `Gateway` instances (`getProfile(): ProfileInterface`, `getGateway(): GatewayInterface`, `setGateway()`).
3. The identifier of the current run (`getRunUuid(): string`).
4. Information on the current processing `DataSet` (`getDataSet(): ?DataSet`, `setDataSet()`).
5. Offset and limit of the current call (`getOffset(): int`, `getLimit(): int`).

## Essential identifiers

`MigrationContext`, `MigrationContextInterface`, `getProfile()`, `getConnection()`, `getRunUuid()`, `getDataSet()`, `setDataSet()`, `getOffset()`, `getLimit()`, `getGateway()`, `setGateway()`.
