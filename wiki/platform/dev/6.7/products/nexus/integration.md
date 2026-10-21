---
id: platform/dev/6.7/products/nexus/integration.md
title: Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/integration.html
sourceHash: 68c17b9064bed198a5889f93f6b43e76a7e74aa0
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware nexus", "business central", "microsoft dynamics", "odata filter", "getAll", "getOne", "createOrUpdate", "delete", "action", "customers", "items", "sales orders"]
summary: "Nexus Business Central integration: CRUD on Customers, Items, Sales Orders via getAll/getOne/createOrUpdate/delete/action, plus OData filter syntax."
lastBuilt: 2026-10-21
---
## What it is

With the Nexus Business Central integration, a workflow can run CRUD operations on supported Microsoft Dynamics Business Central entities through the Business Central API.

## When to use

Use it when you build a Nexus workflow that reads, creates, updates or deletes customers, items or sales orders in Business Central, or that needs to filter Business Central records.

## Key steps / config

Supported entities: Customers, Items, Sales Orders.

All of them support these operations:

- `getAll` – retrieve all records
- `getOne` – retrieve a single record by identifier
- `createOrUpdate` – create a new record or update an existing one
- `delete` – remove a record
- `action` – run a specific action on the entity

Business Central queries use OData filter syntax, for example:

```text
email eq 'john@example.com'
inventory lt 10
status eq 'Open'
externalDocumentNumber eq 'SW-10001'
```

## Essential identifiers

- Operations: `getAll`, `getOne`, `createOrUpdate`, `delete`, `action`
- OData operators in the examples: `eq`, `lt`

## Code check (6.7.15.1)
- unverified `getAll` — Nexus Business Central node operation, external to Shopware code
- unverified `createOrUpdate` — Nexus Business Central node operation, external to Shopware code
- unverified `OData filter` — Business Central API syntax, not part of the Shopware code
