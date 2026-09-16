---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/audit-log.md
title: Audit Log
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/audit-log.html
sourceHash: be40b887ccd721993a7a3c42c1dc212576c26b5a
codeCheckedAgainst: "6.7.13.0"
keywords: ["audit log", "b2b suite", "AuditLogEntity", "AuditLogValueDiffEntity", "AuditLogIndexEntity", "AuditLogSearchStruct", "createAuditLog", "fetchList", "b2b_audit_log", "b2b_audit_log_index", "b2b_audit_log_author", "change history", "activity log"]
summary: "B2B Suite audit log component: b2b_audit_log tables, AuditLogEntity/AuditLogIndexEntity and auditLogService createAuditLog/fetchList usage."
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite ships a general audit log component that any B2B component can use. It stores different log types together with author information (salutation, title, first name, last name, email) and keeps a one-to-many association index so a log entry can be shown on every affected entity (e.g. an order position change shown in the main order view).

## When to use

When a B2B Suite component or a B2B plugin must record who changed what (e.g. changing the quantity of an order position) and list those entries later for a referenced record.

## Key steps / config

Database structure (flat, three tables):

```
b2b_audit_log        id, log_value, log_type, event_date, author_hash
b2b_audit_log_author hash, salutation, title, firstname, lastname, email
b2b_audit_log_index  id, audit_log_id, reference_table, reference_id
```

- `b2b_audit_log` stores the log type and a serialized *AuditLogValueEntity* (`log_value`); many logs point to one author via `author_hash`.
- `b2b_audit_log_index` links a log to affected entities (`reference_table` + `reference_id`); many index rows per log.

Create a log entry:

```php
$auditLogValue = new AuditLogValueDiffEntity();
$auditLogValue->newValue = 'newValue';
$auditLogValue->oldValue = 'oldValue';

$auditLog = new AuditLogEntity();
$auditLog->logValue = $auditLogValue->toDatabaseString();
$auditLog->logType = 'changeOrderPosition';

$orderReferenceIndex = new AuditLogIndexEntity();
$orderReferenceIndex->referenceId = 10;
$orderReferenceIndex->referenceTable = OrderContextRepository::TABLE_NAME;

$this->auditLogService->createAuditLog($auditLog, $identity, [$orderReferenceIndex]);
```

Fetch all logs for a reference:

```php
$auditLogSearchStruct = new AuditLogSearchStruct();
$auditLogs = $this->auditLogService->fetchList(OrderContextRepository::TABLE_NAME, 10, $auditLogSearchStruct);
```

The `$identity` passed to `createAuditLog` supplies the author data.

## Essential identifiers

- `AuditLogEntity` (`logValue`, `logType`)
- `AuditLogValueDiffEntity` (`newValue`, `oldValue`, `toDatabaseString()`)
- `AuditLogIndexEntity` (`referenceId`, `referenceTable`)
- `AuditLogSearchStruct`
- `auditLogService->createAuditLog()`, `auditLogService->fetchList()`
- Tables `b2b_audit_log`, `b2b_audit_log_author`, `b2b_audit_log_index`

## Gotchas

- The B2B Suite is a separate commercial extension; none of these classes or tables exist in the installed Shopware core, storefront or administration packages, so they could not be checked against code.

## Code check (6.7.13.0)
- unverified `AuditLogEntity` — B2B Suite class, not part of vendor/shopware core/storefront/administration
- unverified `AuditLogValueDiffEntity` — B2B Suite class, out of scope of the installed packages
- unverified `AuditLogIndexEntity` — B2B Suite class, out of scope of the installed packages
- unverified `AuditLogSearchStruct` — B2B Suite class, out of scope of the installed packages
- unverified `createAuditLog` — B2B Suite audit log service method, out of scope
- unverified `OrderContextRepository::TABLE_NAME` — B2B Suite repository constant, out of scope
- unverified `b2b_audit_log` — B2B Suite table, no migration in the installed packages
