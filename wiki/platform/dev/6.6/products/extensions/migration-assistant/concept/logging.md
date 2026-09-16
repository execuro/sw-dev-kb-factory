---
id: platform/dev/6.6/products/extensions/migration-assistant/concept/logging.md
title: Logging
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/migration-assistant/concept/logging.html
sourceHash: 0b01cb351fd71e2f328fb6398217f816a6c84c31
keywords: ["LogEntry", "LogEntryInterface", "LoggingService", "LoggingServiceInterface", "addLogEntry", "saveLogging", "BaseRunLogEntry", "EmptyNecessaryFieldRunLog", "getCode", "getTitleSnippet", "getDescriptionSnippet", "CustomerConverter"]
summary: "Migration Assistant logs converter errors via LogEntry classes and LoggingService::addLogEntry/saveLogging, with English text plus snippets."
lastBuilt: "2026-09-15"
---
## What it is

Explains how the Migration Assistant logs errors (typically missing required fields detected by `Converter` classes, and uncaught exceptions) using `LogEntry` objects grouped by type.

## When to use

Needed when a `Converter` detects invalid or missing data and must inform the user, or when creating a custom log entry type.

## Key steps / config

Get `LoggingService` from the service container and call `addLogEntry(LogEntryInterface $logEntry): void`; persist with `saveLogging(Context $context): void`:

```php
interface LoggingServiceInterface
{
    public function addLogEntry(LogEntryInterface $logEntry): void;
    public function saveLogging(Context $context): void;
}
```

Existing log classes live under `SwagMigrationAssistant\Migration\Logging\Log` (e.g. `EmptyNecessaryFieldRunLog` used by `CustomerConverter`). To create a custom log entry, implement `LogEntryInterface` directly, or extend `BaseRunLogEntry` if the log happens during a running migration. A custom log entry must implement:

- `getCode()` — a stable code without variable details (grouping breaks otherwise), e.g. `SWAG_MIGRATION_EMPTY_NECESSARY_FIELD_%s`.
- `getLevel()` — e.g. `self::LOG_LEVEL_WARNING`.
- `getTitle()` / `getDescription()` — English text used in the log file.
- `getParameters()` — values reused by both the English description and snippets.
- `getTitleSnippet()` / `getDescriptionSnippet()` — snippet keys used in the Administration, matching content of `getTitle()`/`getDescription()`.

## Essential identifiers

`LogEntryInterface`, `LoggingServiceInterface`, `LoggingService`, `BaseRunLogEntry`, `EmptyNecessaryFieldRunLog`, `addLogEntry()`, `saveLogging()`, `getCode()`, `getTitleSnippet()`, `getDescriptionSnippet()`.

## Gotchas

`getCode()` must never include variable details (like the failing value) or log grouping breaks; title/description snippets in the Administration must be created with the same content as the English `getTitle()`/`getDescription()` text.
