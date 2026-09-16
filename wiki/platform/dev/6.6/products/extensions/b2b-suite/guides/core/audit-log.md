---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/audit-log.md
title: Audit Log
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/audit-log.html"
sourceHash: "be40b887ccd721993a7a3c42c1dc212576c26b5a"
keywords: ["audit log", "b2b suite", "AuditLogValueDiffEntity", "AuditLogEntity", "AuditLogIndexEntity", "auditLogService", "b2b_audit_log", "b2b_audit_log_index", "b2b_audit_log_author", "createAuditLog", "fetchList"]
summary: "The B2B Suite's general audit log component records log entries with author info and links them to affected entities."
lastBuilt: "2026-09-15"
---
## What it is

Describes the B2B Suite's general-purpose audit log component, which any component can use to record change history with author information, plus a one-to-many association index linking log entries to affected entities. The docs note an example plugin ("B2bAcl.zip") showcasing this topic.

## Key steps / config

Database structure is flat, with three tables:

```
b2b_audit_log_index: id, audit_log_id, reference_table, reference_id
b2b_audit_log: id, log_value, log_type, event_date, author_hash
b2b_audit_log_author: hash, salutation, title, firstname, lastname, email
```

`b2b_audit_log` stores a log type and a serialized `AuditLogValueEntity`; `b2b_audit_log_author` stores author info; `b2b_audit_log_index` stores the association data between an audit log and affected entities.

To create an audit log:

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

To fetch audit logs, use `$this->auditLogService->fetchList(OrderContextRepository::TABLE_NAME, 10, $auditLogSearchStruct)` with an `AuditLogSearchStruct`.

## Essential identifiers

- `AuditLogValueDiffEntity`
- `AuditLogEntity`
- `AuditLogIndexEntity`
- `AuditLogSearchStruct`
- `auditLogService::createAuditLog()` / `auditLogService::fetchList()`
- `b2b_audit_log`, `b2b_audit_log_index`, `b2b_audit_log_author`
