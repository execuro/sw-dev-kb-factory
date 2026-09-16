---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.html
sourceHash: 4eb088dd5042289de1d28115367b2b3353051ade
codeCheckedAgainst: "6.7.13.0"
keywords: ["swag_b2b_business_partner", "swag_b2b_employee", "swag_b2b_role", "customer", "business partner", "employee", "role", "permissions", "b2b employee management", "database schema", "b2b components", "company account"]
summary: B2B Employee Management data model - business partner, employee and role entities, their tables (swag_b2b_*) and relations to the customer table.
lastBuilt: 2026-09-15
---
## What it is

The data model of the B2B Components Employee Management extension (Shopware Commercial): three entities - business partner, employee, role - stored in `swag_b2b_*` tables and linked to the core `customer` table.

## When to use

When querying, extending or migrating B2B employee data, or when you need to know how employees, roles and the company (business partner) customer relate to each other.

## Key steps / config

Entities:

- **Business Partner** - extends the storefront customer with additional B2B company data; pools employees, roles and global settings.
- **Employee** - a separate login in the context of the same business partner. Employees act on behalf of the linked business partner (e.g. place orders) and can be assigned a role.
- **Role** - a set of permissions assignable to an employee; permissions allow or restrict actions such as ordering or managing roles and employees.

Schema (columns as given in the source):

```
swag_b2b_business_partner: id PK, customer_id FK, default_role_id FK, custom_fields json
swag_b2b_employee: id PK, business_partner_customer_id FK, role_id FK, active bool,
                   first_name, last_name, email, password, recovery_time datetime, recovery_hash
swag_b2b_role: id PK, business_partner_customer_id FK, name, permissions json
```

Relations:

- `swag_b2b_business_partner` zero-or-one to exactly one `customer` ("is company administrator").
- `swag_b2b_employee` many to one `customer` ("uses data for orders from").
- `swag_b2b_employee` many to zero-or-one `swag_b2b_role` ("has role").
- `swag_b2b_role` many to one `customer` ("belongs to").

## Essential identifiers

- `swag_b2b_business_partner`
- `swag_b2b_employee`
- `swag_b2b_role`
- `customer` (core table the B2B entities reference)
- Columns: `business_partner_customer_id`, `default_role_id`, `role_id`, `permissions`, `recovery_hash`

## Gotchas

- Employees do not own a separate customer record: they reference the business partner's `customer` via `business_partner_customer_id` and order with that customer's data.
- An employee has at most one role (`role_id` is nullable per the relation cardinality); the business partner's `default_role_id` points to the default role.

## Code check (6.7.13.0)
- confirmed `customer` — core customer entity/table name referenced by all B2B tables — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- unverified `swag_b2b_business_partner` — defined in Shopware Commercial B2B, not in the installed vendor/shopware core/storefront/administration roots
- unverified `swag_b2b_employee` — Shopware Commercial B2B table, out of scope of the installed roots
- unverified `swag_b2b_role` — Shopware Commercial B2B table, out of scope of the installed roots
