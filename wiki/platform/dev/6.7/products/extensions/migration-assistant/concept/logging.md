---
id: platform/dev/6.7/products/extensions/migration-assistant/concept/logging.md
title: Logging
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/migration-assistant/concept/logging.html
sourceHash: 084d075b178f04c95c35c90ae1c7a917cc328667
codeCheckedAgainst: "6.7.13.0"
keywords: ["logging", "MigrationLogEntry", "MigrationLogBuilder", "LoggingServiceInterface", "AbstractMigrationLogEntry", "ConvertSourceDataIncompleteLog", "isUserFixable", "getCode", "flush", "migration log", "log code", "migration assistant"]
summary: "Migration Assistant logging: MigrationLogBuilder, LoggingServiceInterface log()/flush() with auto-flush at 50, custom AbstractMigrationLogEntry codes."
lastBuilt: 2026-09-15
---
## What it is

Migration Assistant logging records why data could not be converted or written. It is also the basis for Error Resolution in the Administration. Log entries are `MigrationLogEntry` objects built with `MigrationLogBuilder` and passed to the logging service.

## When to use

When a converter or writer in a migration profile must report incomplete or invalid source data, or when you add a custom log type (optionally user-fixable).

## Key steps / config

1. Log from a converter (docs example: `SwagMigrationAssistant\Profile\Shopware\Converter\CustomerConverter::convert()`):

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

2. `SwagMigrationAssistant\Migration\Logging\LoggingServiceInterface` has two methods:
   - `log(MigrationLogEntry $logEntry): self` adds the entry to a buffer.
   - `flush(): void` writes all buffered entries to the database.

   The service also flushes automatically once the buffer holds `50` entries.
3. Reuse an existing log class from `SwagMigrationAssistant\Migration\Logging\Log` if one fits.
4. For a custom log, extend `AbstractMigrationLogEntry` and define its static metadata:

```php
readonly class ConvertSourceDataIncompleteLog extends AbstractMigrationLogEntry
{
    public static function isUserFixable(): bool { return false; }
    public static function getLevel(): string { return self::LOG_LEVEL_WARNING; }
    public static function getCode(): string { return 'SWAG_MIGRATION_CONVERT_SOURCE_DATA_INCOMPLETE'; }
}
```

5. Name codes after the convention `SWAG_MIGRATION_{Category}{Description}{Outcome}Log`:
   - Category is the migration step, e.g. Fetch, Convert, Write or Media.
   - Description is the context, e.g. SourceData or MimeType.
   - Outcome is the result, e.g. Incomplete, Invalid or Missing.

## Essential identifiers

- `MigrationLogEntry`, `AbstractMigrationLogEntry`, `MigrationLogBuilder::fromMigrationContext()`
- `withEntityName()`, `withFieldSourcePath()`, `withSourceData()`, `build()`
- `LoggingServiceInterface::log()`, `LoggingServiceInterface::flush()`
- `isUserFixable()`, `getLevel()`, `getCode()`, `LOG_LEVEL_WARNING`
- `SwagMigrationAssistant\Migration\Logging\Log\ConvertSourceDataIncompleteLog`

## Gotchas

- `getCode()` must stay stable and generic, because log entries are grouped by it.
- A log with `isUserFixable()` returning `true` only makes a fix possible in Error Resolution. The fix UI itself still has to be implemented separately in the Administration.
- Call `flush()` when you need entries in the database before the 50-entry auto-flush happens.

## Code check (6.7.13.0)
- confirmed `CustomerDefinition::ENTITY_NAME` — core constant `'customer'` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `Context` — core context class used in convert() — vendor/shopware/core/Framework/Context.php:17
- unverified `MigrationLogBuilder` — plugin class, SwagMigrationAssistant not installed in vendor/shopware
- unverified `LoggingServiceInterface` — plugin interface, plugin not installed in vendor/shopware
- unverified `AbstractMigrationLogEntry` — plugin base class, plugin not installed in vendor/shopware
- unverified `ConvertSourceDataIncompleteLog` — plugin class, plugin not installed in vendor/shopware
- unverified `SWAG_MIGRATION_CONVERT_SOURCE_DATA_INCOMPLETE` — plugin log code, plugin not installed in vendor/shopware
- unverified `50` — auto-flush threshold lives in the plugin, not installed in vendor/shopware
