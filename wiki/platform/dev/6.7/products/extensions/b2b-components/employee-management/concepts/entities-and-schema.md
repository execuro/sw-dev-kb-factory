---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.html
sourceHash: 4eb088dd5042289de1d28115367b2b3353051ade
codeCheckedAgainst: "6.7.15.1"
keywords: ["swag_b2b_business_partner", "swag_b2b_employee", "swag_b2b_role", "business partner", "employee", "role", "permissions", "entities", "database schema", "er diagram", "customer", "employee management"]
summary: B2B Employee Management entities and tables - swag_b2b_business_partner, swag_b2b_employee, swag_b2b_role and their relations to customer.
lastBuilt: 2026-10-21
---
## What it is

The data model of the B2B Employee Management component (Commercial plugin): three entities (business partner, employee, role) and their database tables and relations to the core `customer` table.

## When to use

When querying, migrating or extending B2B employee data, writing reports over employees/roles, or tracing how an employee's order links back to the company customer.

## Key steps / config

Entities:

- **Business Partner** (`swag_b2b_business_partner`): extends the storefront customer with B2B company data; pools employees, roles and global settings. Columns: `id` PK, `customer_id` FK, `default_role_id` FK, `custom_fields` (json).
- **Employee** (`swag_b2b_employee`): a separate login inside the same business partner; acts on its behalf (e.g. placing orders) and can have a role. Columns: `id` PK, `business_partner_customer_id` FK, `role_id` FK, `active`, `first_name`, `last_name`, `email`, `password`, `recovery_time`, `recovery_hash`.
- **Role** (`swag_b2b_role`): a set of permissions assigned to employees. Columns: `id` PK, `business_partner_customer_id` FK, `name`, `permissions` (json).

Relations (from the source ER diagram):

```text
swag_b2b_business_partner |o--|| customer        : "is company administrator"
swag_b2b_employee         }o--|| customer        : "uses data for orders from"
swag_b2b_employee         }o--o| swag_b2b_role   : "has role"
swag_b2b_role             }o--|| customer        : "belongs to"
```

## Essential identifiers

- `swag_b2b_business_partner`
- `swag_b2b_employee`
- `swag_b2b_role`
- `customer` (core table referenced via `customer_id` / `business_partner_customer_id`)

## Gotchas

- Employees and roles reference the company via `business_partner_customer_id`, which points at `customer`, not at the `swag_b2b_business_partner` id.
- An employee's role is optional (`}o--o|`); a business partner may have at most one row per customer.
- Role permissions are stored as a json column, not as a relation table.

## Code check (6.7.15.1)
- confirmed `customer` — core entity/table name referenced by all three B2B tables — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- unverified `swag_b2b_business_partner` — Commercial plugin table, not in installed code
- unverified `swag_b2b_employee` — Commercial plugin table, not in installed code
- unverified `swag_b2b_role` — Commercial plugin table, not in installed code
