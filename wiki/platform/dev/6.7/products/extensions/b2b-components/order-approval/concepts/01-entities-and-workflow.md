---
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/concepts/01-entities-and-workflow.md
title: Entities and workflow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/concepts/01-entities-and-workflow.html
sourceHash: 5ad454faaf2c12d297c4c10e7b571265f7568220
codeCheckedAgainst: "6.7.13.0"
keywords: ["order approval", "approval rule", "pending order", "effective role", "reviewer role", "b2b employee", "business partner", "approve decline order", "order needs approval event", "approval workflow"]
summary: "Order Approval entities (approval rule, pending order), approval workflow events, and who may request, view, approve or decline pending B2B orders."
lastBuilt: 2026-09-15
---
## What it is

Concept page for the B2B Order Approval component: its two entities (Approval Rule, Pending Order), the approval workflow, and which employees can request, view, approve or decline pending orders.

## When to use

When configuring or extending approval rules for employee orders, or when reasoning about visibility and permissions on pending orders.

## Key steps / config

Entities:

- **Approval Rule** — a set of conditions an order must meet to require approval, e.g. order total value, order currency, or orders placed by employees with a specific role. It can be assigned a reviewer role (only employees with that role may approve matching orders) and an "Effective role" (employees with that role must seek approval for matching orders). It has a priority that sets the order in which rules are evaluated.
- **Pending Order** — an order placed by an employee that requires approval; holds the order data, the employee who placed it, and the matched approval rule.

Workflow:

1. Employee places an order.
2. No approval rule applies: event "Order Placed".
3. A rule applies: event "Order needs approval".
4. Declined: event "Order declined". Approved: events "Order Approved" and "Order placed".

Who can request approval: employees holding the rule's "Effective role".

Who can view pending orders:

- Employees with "Can view all pending orders" — all pending orders.
- Employees who requested approval — their own pending orders.
- Business Partners — all pending orders of their employees.

Who can approve or decline:

- "Can approve/decline all pending orders" — all pending orders.
- "Can approve/decline pending orders" — pending orders assigned to them.
- Business Partners — all pending orders of their employees.

## Essential identifiers

- Approval Rule, Pending Order (entities)
- "Effective role"
- Permissions: `Can view all pending orders`, `Can approve/decline all pending orders`, `Can approve/decline pending orders`

## Code check (6.7.13.0)
- unverified `Approval Rule` — Shopware Commercial (B2B) plugin entity; not in vendor/shopware/{core,storefront,administration}; out of scope
- unverified `Pending Order` — Commercial plugin entity, out of scope
- unverified `Can approve/decline pending orders` — Commercial plugin permission label, out of scope
- unverified `Order needs approval` — Commercial plugin event, no event class named in the source; out of scope
