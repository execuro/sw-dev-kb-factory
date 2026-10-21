---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/02-order-approval-permissions.md
sourceHash: 2175d83c318a363e322396dd6be59c39bab51170
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/guides/02-order-approval-permissions.html
title: Order approval permissions
version: "6.7"
versions: ["6.7"]
keywords: ["Can create approval rules", "Can update approval rules", "Can delete approval rules", "Can read approval rules", "Can approve/decline all pending orders", "Can approve/decline pending orders", "Can view all pending orders", "order approval permissions", "employee roles", "b2b acl", "pending orders"]
summary: List of B2B Order Approval employee permissions for approval rules (create/update/delete/read) and pending orders (view, approve/decline).
lastBuilt: 2026-10-21
---
## What it is

The list of permissions the B2B Order Approval component provides. You assign them to employee roles to control who manages approval rules and who handles pending orders.

## When to use

When you set up employee roles for order approval and need the exact permission names.

## Key steps / config

**Approval rule permissions**

| Permission | Allows the employee to |
|---|---|
| `Can create approval rules` | create approval rules |
| `Can update approval rules` | update approval rules |
| `Can delete approval rules` | delete approval rules |
| `Can read approval rules` | view approval rules |

**Pending order permissions**

| Permission | Allows the employee to |
|---|---|
| `Can approve/decline all pending orders` | approve or decline all pending orders |
| `Can approve/decline pending orders` | approve or decline the pending orders assigned to them |
| `Can view all pending orders` | view all pending orders |

## Gotchas

- `Can approve/decline pending orders` covers only the pending orders assigned to the employee. Use `Can approve/decline all pending orders` to cover every pending order.

## Code check (6.7.15.1)
- unverified `Can create approval rules` — Shopware Commercial B2B permission, not in the core/storefront/administration packages
- unverified `Can approve/decline all pending orders` — Shopware Commercial B2B permission, not in the core/storefront/administration packages
- unverified `Can view all pending orders` — Shopware Commercial B2B permission, not in the core/storefront/administration packages
