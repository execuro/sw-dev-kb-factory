---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/_index.md
title: Guides
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/guides/
sourceHash: 163fe74bf7aefab37fc8022be7735e78b1f23a49
keywords: ["B2B permissions", "employee.read", "employee.edit", "employee.create", "employee.delete", "order.read.all", "permission groups", "permission dependencies", "employee management guides", "role creation", "B2B supervisor", "creating own permissions"]
summary: "Section index for Employee Management guides: roles, permission groups/dependencies, and base permissions."
lastBuilt: "2026-09-15"
---
## What it is

This is the section index for the Employee Management guides, covering the idea of roles and how to create custom permissions via an app or a plugin for the B2B Employee Management component.

## Key steps / config

- **B2B permissions** restrict access to information or functionality within the B2B Components; for example a B2B supervisor can restrict which employee is allowed to manage the company's employee accounts.
- **Groups**: permissions are divided into individual groups that have a logical relationship to one another.
- **Dependencies**: a permission can depend on another permission without which it cannot be used — e.g. `employee.edit` depends on `employee.read`.
- **Shopware base permissions** already included in the B2B Employee Management component:
  - `employee` group: `employee.read`; `employee.edit` (depends on `employee.read`); `employee.create` (depends on `employee.read`, `employee.edit`); `employee.delete` (depends on `employee.read`, `employee.edit`).
  - `order` group: `order.read.all`.

More base permissions will be added as further B2B Components are released.

## Essential identifiers

- `employee.read`, `employee.edit`, `employee.create`, `employee.delete` — the base employee-group permissions and their dependency chain.
- `order.read.all` — the base order-group permission.
