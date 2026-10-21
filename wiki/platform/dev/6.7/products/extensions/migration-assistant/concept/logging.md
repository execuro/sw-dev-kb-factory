---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/logging.md
title: Logging
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/logging.html
sourceHash: 084d075b178f04c95c35c90ae1c7a917cc328667
codeCheckedAgainst: "6.7.15.1"
keywords: ["logging", "MigrationLogEntry", "MigrationLogBuilder", "LoggingServiceInterface", "AbstractMigrationLogEntry", "ConvertSourceDataIncompleteLog", "isUserFixable", "getCode", "log entry code", "migration log", "error resolution", "migration assistant"]
summary: Migration Assistant logging - MigrationLogBuilder entries, log()/flush() buffering, custom AbstractMigrationLogEntry types and code naming.
lastBuilt: 2026-10-21
---
## What it is

Logging in the Shopware Migration Assistant records why data could not be converted or written during a migration run, and is the basis for Error Resolution in the Administration. Entries are `MigrationLogEntry` objects created through `MigrationLogBuilder`.

## When to use

When a converter or writer in a migration profile must report incomplete or invalid source data, or when defining a new log type (optionally one users can fix).

## Key steps / config

1. Build and log an entry from a converter (example from `SwagMigrationAssistant\Profile\Shopware\Converter\CustomerConverter`, when `_locale` is missing):

```php
$this->loggingService->log(
    MigrationLogBuilder::fromMigrationContext($migrationContext)
        ->withEntityName(CustomerDefinition::ENTITY_NAME)
        ->withFieldSourcePath('_locale')
        ->withSourceData($data)
        ->build(ConvertSourceDataIncompleteLog::class)
);
return new ConvertStruct(null, $data);
```

2. `SwagMigrationAssistant\Migration\Logging\LoggingServiceInterface` provides `log(MigrationLogEntry $logEntry): self` (adds to an in-memory buffer) and `flush(): void` (writes all buffered entries to the database). The service also flushes automatically after `50` buffered entries.
3. Reuse an existing log class from the `SwagMigrationAssistant\Migration\Logging\Log` namespace if one fits.
4. For a custom log type, extend `AbstractMigrationLogEntry` and declare static metadata:

```php
readonly class ConvertSourceDataIncompleteLog extends AbstractMigrationLogEntry
{
    public static function isUserFixable(): bool { return false; }
    public static function getLevel(): string { return self::LOG_LEVEL_WARNING; }
    public static function getCode(): string { return 'SWAG_MIGRATION_CONVERT_SOURCE_DATA_INCOMPLETE'; }
}
```

5. Name codes `SWAG_MIGRATION_{Category}{Description}{Outcome}Log`: Category = migration step (Fetch, Convert, Write, Media, ...), Description = context (SourceData, MimeType, ...), Outcome = result (Incomplete, Invalid, Missing, ...).

## Essential identifiers

- `MigrationLogEntry`, `MigrationLogBuilder` (`fromMigrationContext()`, `withEntityName()`, `withFieldSourcePath()`, `withSourceData()`, `build()`)
- `LoggingServiceInterface::log()`, `LoggingServiceInterface::flush()`
- `AbstractMigrationLogEntry` — `isUserFixable()`, `getLevel()`, `getCode()`, `LOG_LEVEL_WARNING`
- `ConvertSourceDataIncompleteLog` / `SWAG_MIGRATION_CONVERT_SOURCE_DATA_INCOMPLETE`

## Gotchas

- `getCode()` must stay stable and generic; entries are grouped by it.
- `isUserFixable()` returning `true` only enables fix creation during Error Resolution; the actual fix UI must be implemented separately in the Administration.
- Buffered entries are lost unless `flush()` runs (or the 50-entry auto-flush triggers); decide where to flush.

## Code check (6.7.15.1)
- confirmed `CustomerDefinition::ENTITY_NAME` — value `customer` in core — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `Context` — core context class used in convert() signature — vendor/shopware/core/Framework/Context.php:18
- unverified `MigrationLogBuilder` — SwagMigrationAssistant plugin, outside installed core roots
- unverified `LoggingServiceInterface` — SwagMigrationAssistant plugin, out of scope
- unverified `AbstractMigrationLogEntry` — SwagMigrationAssistant plugin, out of scope
- unverified `ConvertSourceDataIncompleteLog` — SwagMigrationAssistant plugin, out of scope
- unverified `50` — auto-flush threshold lives in plugin code, not verifiable here
