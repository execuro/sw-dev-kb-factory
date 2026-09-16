---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/migration-context.md
title: Migration Context
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/migration-context.html
sourceHash: e20ae83c5c6905e62f8bc1eca83686bab47f00bf
codeCheckedAgainst: "6.7.13.0"
keywords: ["MigrationContext", "MigrationContextInterface", "SwagMigrationAssistant", "migration assistant", "SwagMigrationConnectionEntity", "ProfileInterface", "GatewayInterface", "DataSet", "SOURCE_CONTEXT", "run uuid", "offset and limit", "migration run"]
summary: "MigrationContext in SwagMigrationAssistant: struct carrying connection, profile, gateway, DataSet, run UUID, offset and limit for a migration call."
lastBuilt: 2026-09-15
---
## What it is

`SwagMigrationAssistant\Migration\MigrationContext` is the central data structure of the Shopware Migration Assistant plugin. It extends `Struct`, implements `MigrationContextInterface`, and is passed through a migration call carrying:

1. The current migration connection (`SwagMigrationConnectionEntity`), which holds the credentials.
2. The current profile (`ProfileInterface`) and gateway (`GatewayInterface`) instances.
3. The identifier (UUID) of the current run.
4. Information on what is currently processed (a `DataSet`).
5. Offset and limit of the current call.

## When to use

When writing or debugging Migration Assistant readers, converters, gateways or writers that receive the context and need to know which connection, profile, gateway, data set, run and page (offset/limit) is being processed.

## Key steps / config

Constructor shape as given by the docs (only the connection is mandatory):

```php
class MigrationContext extends Struct implements MigrationContextInterface
{
    final public const SOURCE_CONTEXT = 'MIGRATION_CONNECTION_CHECK_FOR_RUNNING_MIGRATION';

    public function __construct(
        private SwagMigrationConnectionEntity $connection,
        private ?ProfileInterface $profile = null,
        private ?GatewayInterface $gateway = null,
        private ?DataSet $dataSet = null,
        private readonly string $runUuid = '',
        private int $offset = 0,
        private int $limit = 0
    ) {}
}
```

- `getProfile()` throws a `MigrationException` when no profile is set; `setProfile()` assigns one.
- `getConnection()` returns the connection entity.
- `getOffset()`/`setOffset()` and `getLimit()`/`setLimit()` control paging of the current call.
- `SOURCE_CONTEXT` (`MIGRATION_CONNECTION_CHECK_FOR_RUNNING_MIGRATION`) is the write-protection source used on connection fields.

## Essential identifiers

- `SwagMigrationAssistant\Migration\MigrationContext`
- `MigrationContextInterface`
- `MigrationContext::SOURCE_CONTEXT`
- `SwagMigrationConnectionEntity`, `ProfileInterface`, `DataSet`
- `getProfile()`, `setProfile()`, `getConnection()`, `getOffset()`, `setOffset()`, `getLimit()`, `setLimit()`

## Gotchas

- The docs list further accessors (`getGateway`, `setGateway`, `setConnection`, `getRunUuid`, `getDataSet`, `setDataSet`) and the exception factory `migrationContextPropertyMissing`. The Migration Assistant plugin is not part of the installed Shopware core/storefront/administration code, so none of them could be verified here; check the plugin source before relying on them.
- Gateway and profile are nullable in the constructor; per the docs, their getters throw when the property has not been set.
- The run UUID is `readonly` in the constructor shown, so it cannot be changed after construction.

## Code check (6.7.13.0)
- absent `migrationContextPropertyMissing` — plugin-side exception factory, not in the installed code index
- absent `getGateway` — SwagMigrationAssistant not installed; not in the installed code index
- absent `setGateway` — SwagMigrationAssistant not installed; not in the installed code index
- absent `setConnection` — SwagMigrationAssistant not installed; not in the installed code index
- absent `getRunUuid` — SwagMigrationAssistant not installed; not in the installed code index
- absent `getDataSet` — SwagMigrationAssistant not installed; not in the installed code index
- absent `setDataSet` — SwagMigrationAssistant not installed; not in the installed code index
- confirmed `Struct` — base class exists as abstract core struct — vendor/shopware/core/Framework/Struct/Struct.php:8
- unverified `MigrationContext::SOURCE_CONTEXT` — SwagMigrationAssistant plugin code, out of scope
- unverified `MigrationContextInterface` — SwagMigrationAssistant plugin code, out of scope
