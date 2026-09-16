---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/_index.md
title: Guides
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/
sourceHash: 0b4260a4784e1ce7f9982057da90632f5843651e
codeCheckedAgainst: "6.7.13.0"
keywords: ["employee.read", "employee.edit", "employee.create", "employee.delete", "order.read.all", "b2b permissions", "permission groups", "permission dependencies", "base permissions", "b2b employee management", "roles", "acl"]
summary: B2B Employee Management permissions - groups, dependencies and the base permissions employee.read/edit/create/delete and order.read.all.
lastBuilt: 2026-09-15
---
## What it is

Overview of the B2B Employee Management guides and of the B2B permission model: permissions restrict access to information or functionality within the B2B Components, are organised in groups, and can depend on other permissions.

## When to use

When assigning permissions to B2B roles, or when adding your own permissions via an app or plugin and you need to know the built-in permission names and their dependencies.

## Key steps / config

- **Groups** - permissions are divided into groups of logically related permissions.
- **Dependencies** - a permission can require another permission; a role granted the dependent permission must also have its dependency. Example: `employee.edit` depends on `employee.read`.

Base permissions shipped with the Employee Management component:

| Group | Permission | Dependencies |
|---|---|---|
| employee | `employee.read` | - |
| employee | `employee.edit` | `employee.read` |
| employee | `employee.create` | `employee.read`, `employee.edit` |
| employee | `employee.delete` | `employee.read`, `employee.edit` |
| order | `order.read.all` | - |

## Essential identifiers

- `employee.read`, `employee.edit`, `employee.create`, `employee.delete`
- `order.read.all`

## Gotchas

- Example use: a B2B supervisor restricts which employees may manage the company's employee accounts.
- The source notes more base permissions are added with future B2B Components; this list covers Employee Management only.

## Code check (6.7.13.0)
- unverified `employee.read` — B2B permission defined in Shopware Commercial, not in the installed vendor/shopware roots
- unverified `employee.edit` — Shopware Commercial B2B permission, out of scope
- unverified `employee.create` — Shopware Commercial B2B permission, out of scope
- unverified `employee.delete` — Shopware Commercial B2B permission, out of scope
- unverified `order.read.all` — Shopware Commercial B2B permission, out of scope
