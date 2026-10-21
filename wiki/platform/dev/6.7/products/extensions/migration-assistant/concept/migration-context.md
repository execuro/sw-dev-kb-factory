---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/migration-context.md
title: Migration Context
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/migration-context.html
sourceHash: e20ae83c5c6905e62f8bc1eca83686bab47f00bf
codeCheckedAgainst: "6.7.15.1"
keywords: ["migration context", "MigrationContext", "MigrationContextInterface", "SwagMigrationConnectionEntity", "ProfileInterface", "GatewayInterface", "DataSet", "SOURCE_CONTEXT", "run uuid", "offset", "limit", "migration assistant"]
summary: Migration Assistant MigrationContext struct - holds connection, profile, gateway, DataSet, run id, offset and limit for the current migration call.
lastBuilt: 2026-10-21
---
## What it is

The migration context is the central data structure of the Shopware Migration Assistant. `SwagMigrationAssistant\Migration\MigrationContext` (extends `Struct`, implements `MigrationContextInterface`) carries everything a profile, gateway, reader or converter needs for the current call.

## When to use

Whenever code in a migration profile, gateway, reader, converter or media processor needs to know which connection, profile, gateway, data set, run, or batch window it is working on.

## Key steps / config

The context holds:

1. The current migration connection (`SwagMigrationConnectionEntity`), which holds the credentials
2. The current profile (`ProfileInterface`) and gateway (`GatewayInterface`) instances
3. The identifier of the current run (constructor argument `runUuid`, readonly, default `''`)
4. The data set currently processed (`DataSet`)
5. Offset and limit of the current call

Constructor shape (profile, gateway and data set are optional):

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

Accessors shown in the source that are not flagged: `getProfile()` / `setProfile()`, `getConnection()`, `getOffset()` / `setOffset()`, `getLimit()` / `setLimit()`. `getProfile()` throws a `MigrationException` when no profile is set.

## Essential identifiers

- `SwagMigrationAssistant\Migration\MigrationContext`, `MigrationContextInterface`
- `MigrationContext::SOURCE_CONTEXT` = `MIGRATION_CONNECTION_CHECK_FOR_RUNNING_MIGRATION`
- `SwagMigrationConnectionEntity`, `ProfileInterface`, `GatewayInterface`, `DataSet`

## Gotchas

- The source also lists `getGateway()`, `setGateway()`, `setConnection()`, `getRunUuid()`, `getDataSet()` and `setDataSet()`, and says the profile and gateway getters throw `MigrationException::migrationContextPropertyMissing()` when the value is `null`. None of these identifiers is present in the installed Shopware code index (the Migration Assistant is a separate plugin), so they could not be verified.
- The run identifier is readonly; there is no setter for it in the source.

## Code check (6.7.15.1)
- absent `migrationContextPropertyMissing` — not found in the installed code index
- absent `getGateway` — not found in the installed code index
- absent `setGateway` — not found in the installed code index
- absent `setConnection` — not found in the installed code index
- absent `getRunUuid` — not found in the installed code index
- absent `getDataSet` — not found in the installed code index
- absent `setDataSet` — not found in the installed code index
- confirmed `Struct` — core base struct the context extends — vendor/shopware/core/Framework/Struct/Struct.php:8
- unverified `MigrationContextInterface` — SwagMigrationAssistant plugin, outside installed core roots
- unverified `SwagMigrationConnectionEntity` — SwagMigrationAssistant plugin, out of scope
