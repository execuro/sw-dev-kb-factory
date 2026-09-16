---
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/02-order-approval-permissions.md
title: Order approval permissions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/guides/02-order-approval-permissions.html
sourceHash: 2175d83c318a363e322396dd6be59c39bab51170
codeCheckedAgainst: "6.7.13.0"
keywords: ["order approval permissions", "Can create approval rules", "Can update approval rules", "Can delete approval rules", "Can read approval rules", "Can approve/decline all pending orders", "Can approve/decline pending orders", "Can view all pending orders", "b2b employee roles", "pending orders acl"]
summary: "List of B2B Order Approval permissions for employee roles: create/update/delete/read approval rules and view or approve/decline pending orders."
lastBuilt: 2026-09-15
---
## What it is

List of the permissions provided by the B2B Order Approval component, which can be assigned to employee roles.

## When to use

When setting up employee roles that manage approval rules or handle pending orders.

## Key steps / config

Approval rule permissions:

| Permission | Allows the employee to |
|---|---|
| `Can create approval rules` | create approval rules |
| `Can update approval rules` | update approval rules |
| `Can delete approval rules` | delete approval rules |
| `Can read approval rules` | view approval rules |

Pending order permissions:

| Permission | Allows the employee to |
|---|---|
| `Can approve/decline all pending orders` | approve or decline all pending orders |
| `Can approve/decline pending orders` | approve or decline assigned pending orders |
| `Can view all pending orders` | view all pending orders |

## Essential identifiers

- `Can create approval rules`, `Can update approval rules`, `Can delete approval rules`, `Can read approval rules`
- `Can approve/decline all pending orders`, `Can approve/decline pending orders`, `Can view all pending orders`

## Code check (6.7.13.0)
- unverified `Can create approval rules` — Shopware Commercial (B2B) plugin permission label; not in vendor/shopware/{core,storefront,administration}; out of scope
- unverified `Can read approval rules` — Commercial plugin permission, out of scope
- unverified `Can approve/decline all pending orders` — Commercial plugin permission, out of scope
- unverified `Can view all pending orders` — Commercial plugin permission, out of scope
