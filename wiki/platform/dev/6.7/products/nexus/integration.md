---
id: platform/dev/6.7/products/nexus/integration.md
title: Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/integration.html
sourceHash: 68c17b9064bed198a5889f93f6b43e76a7e74aa0
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware nexus", "business central", "microsoft dynamics", "erp integration", "getAll", "getOne", "createOrUpdate", "delete", "action", "odata filter", "sales orders", "crud"]
summary: "Nexus Business Central integration: CRUD on customers, items, sales orders via getAll/getOne/createOrUpdate/delete/action and OData filters."
lastBuilt: 2026-09-15
---
## What it is

The Shopware Nexus Business Central integration lets workflows perform CRUD operations on supported entities through the Business Central API.

## When to use

When a Nexus workflow must read or write Microsoft Dynamics Business Central customers, items or sales orders, or query them with filters.

## Key steps / config

Supported entities: Customers, Items, Sales Orders. All entities support these operations:

- `getAll` – retrieve all records
- `getOne` – retrieve a single record by identifier
- `createOrUpdate` – create a new record or update an existing one
- `delete` – remove a record
- `action` – execute a specific action on the entity

Queries accept OData filter syntax, e.g.:

```text
email eq 'john@example.com'
inventory lt 10
status eq 'Open'
externalDocumentNumber eq 'SW-10001'
```

## Essential identifiers

- Operations `getAll`, `getOne`, `createOrUpdate`, `delete`, `action`
- OData operators `eq`, `lt`

## Code check (6.7.13.0)
- unverified `createOrUpdate` — Nexus Business Central node runs in the external managed service; not in vendor/shopware code
- unverified `getAll` — external Nexus operation, out of scope of the installed Shopware code
