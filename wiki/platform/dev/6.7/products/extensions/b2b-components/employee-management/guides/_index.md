---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/_index.md
title: Guides
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/
sourceHash: 0b4260a4784e1ce7f9982057da90632f5843651e
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b permissions", "employee management", "employee.read", "employee.edit", "employee.create", "employee.delete", "order.read.all", "permission groups", "permission dependencies", "base permissions", "b2b roles", "b2b components"]
summary: B2B Employee Management permission model - groups, dependencies and the base permissions employee.read/edit/create/delete and order.read.all.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the B2B Employee Management guides (roles, own permissions via app or plugin). It explains the B2B permission model: permissions restrict access to information or functionality within the B2B Components, e.g. a B2B supervisor can restrict which employee may manage the company's employee accounts.

## When to use

When you need to know which permissions exist in B2B Employee Management, how they are grouped, and which permissions a role must also carry because of dependencies.

## Key steps / config

- **Groups**: permissions are divided into groups of logically related permissions.
- **Dependencies**: a permission can depend on another permission without which it cannot be used. A role with `employee.edit` must also have `employee.read`.
- **Base permissions** shipped with the Employee Management component (more are to be added with future B2B Components):

| Group | Permission | Dependencies |
|---|---|---|
| employee | `employee.read` | |
| employee | `employee.edit` | `employee.read` |
| employee | `employee.create` | `employee.read`, `employee.edit` |
| employee | `employee.delete` | `employee.read`, `employee.edit` |
| order | `order.read.all` | |

## Essential identifiers

- `employee.read`, `employee.edit`, `employee.create`, `employee.delete`
- `order.read.all`
- Groups `employee`, `order`

## Gotchas

- Granting `employee.create` or `employee.delete` without `employee.read` and `employee.edit` leaves the permission unusable, because of the dependency rule.

## Code check (6.7.15.1)
- unverified `employee.read` — B2B permissions belong to the Shopware Commercial B2B extension, not present in core/storefront/administration; out of scope
- unverified `employee.edit` — defined by the Commercial B2B extension; out of scope
- unverified `employee.create` — defined by the Commercial B2B extension; out of scope
- unverified `employee.delete` — defined by the Commercial B2B extension; out of scope
- unverified `order.read.all` — defined by the Commercial B2B extension; out of scope
