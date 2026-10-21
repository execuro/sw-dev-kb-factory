---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/audit-log.md
title: Audit Log
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/audit-log.html
sourceHash: be40b887ccd721993a7a3c42c1dc212576c26b5a
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "audit log", "change history", "b2b_audit_log", "b2b_audit_log_index", "b2b_audit_log_author", "AuditLogEntity", "AuditLogValueDiffEntity", "AuditLogIndexEntity", "AuditLogSearchStruct", "createAuditLog", "fetchList"]
summary: B2B Suite audit log - tables b2b_audit_log, _index, _author; create entries via auditLogService->createAuditLog() and list them via fetchList().
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite ships a general audit log that any B2B component can use. It stores different log types plus author information (first name, last name, email) and provides a one-to-many association index linking log entries to affected entities. The source offers a downloadable example plugin (`B2bAcl.zip`).

## When to use

When a B2B component should record changes (e.g. changing an order position quantity) and show that history on related entities, such as the main order view.

## Key steps / config

Database structure (flat):

- `b2b_audit_log` — `id`, `log_value` (serialized *AuditLogValueEntity*), `log_type`, `event_date`, `author_hash`
- `b2b_audit_log_author` — `hash`, `salutation`, `title`, `firstname`, `lastname`, `email` (n:1 from `b2b_audit_log` via the author hash)
- `b2b_audit_log_index` — `id`, `audit_log_id`, `reference_table`, `reference_id` (n:1 to `b2b_audit_log`; associates a log with affected entities)

Create an audit log entry:

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

Fetch audit logs for a referenced entity:

```php
$auditLogSearchStruct = new AuditLogSearchStruct();
$auditLogs = $this->auditLogService->fetchList(OrderContextRepository::TABLE_NAME, 10, $auditLogSearchStruct);
```

## Essential identifiers

- Tables: `b2b_audit_log`, `b2b_audit_log_author`, `b2b_audit_log_index`
- `AuditLogEntity` (`logValue`, `logType`), `AuditLogValueDiffEntity` (`newValue`, `oldValue`, `toDatabaseString()`), `AuditLogIndexEntity` (`referenceId`, `referenceTable`), `AuditLogSearchStruct`
- Audit log service: `createAuditLog($auditLog, $identity, $indexes)`, `fetchList($referenceTable, $referenceId, $searchStruct)`
- `OrderContextRepository::TABLE_NAME` as reference table

## Gotchas

- `log_value` holds a serialized value entity; convert with `toDatabaseString()` before assigning to `logValue`.
- Author data is not stored per log row but in `b2b_audit_log_author`, referenced by `author_hash`; `createAuditLog()` takes the acting `$identity`.

## Code check (6.7.15.1)
- unverified `AuditLogEntity` — B2B Suite plugin class, not in vendor/shopware core, storefront or administration
- unverified `AuditLogValueDiffEntity` — B2B Suite plugin class, out of the checked vendor roots
- unverified `AuditLogIndexEntity` — B2B Suite plugin class, out of the checked vendor roots
- unverified `AuditLogSearchStruct` — B2B Suite plugin class, out of the checked vendor roots
- unverified `b2b_audit_log` — B2B Suite table, no migration in the checked vendor roots
- unverified `OrderContextRepository::TABLE_NAME` — B2B Suite constant, out of the checked vendor roots
