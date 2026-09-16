---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.md
title: "Entities & Schema"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.html
sourceHash: 4eb088dd5042289de1d28115367b2b3353051ade
keywords: ["Business Partner", "Employee", "Role", "swag_b2b_business_partner", "swag_b2b_employee", "swag_b2b_role", "entity schema", "Employee Management", "database schema"]
summary: "Describes the Business Partner, Employee and Role entities and the swag_b2b_* database schema for Employee Management."
lastBuilt: "2026-09-15"
---
## What it is

This page describes the three core entities of Employee Management — Business Partner, Employee, and Role — and their underlying database schema.

## Key steps / config

- **Business Partner**: extends the basic storefront customer with additional B2B company data; pools employees, roles and global settings.
- **Employee**: a separate login within the context of a business partner, acting on its behalf (e.g. order placement); can be assigned specific roles.
- **Role**: a set of permissions assignable to an employee, restricting or allowing actions like ordering or managing roles/employees.

Schema:

```
swag_b2b_business_partner { id PK, customer_id FK, default_role_id FK, custom_fields }
swag_b2b_employee { id PK, business_partner_customer_id FK, role_id FK, active, first_name, last_name, email, password, recovery_time, recovery_hash }
swag_b2b_role { id PK, business_partner_customer_id FK, name, permissions }
```

## Essential identifiers

- `swag_b2b_business_partner`, `swag_b2b_employee`, `swag_b2b_role` (database tables)
