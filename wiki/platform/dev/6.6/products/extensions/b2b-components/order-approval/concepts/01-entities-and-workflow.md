---
id: platform/dev/6.6/products/extensions/b2b-components/order-approval/concepts/01-entities-and-workflow.md
title: Entities and workflow
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/order-approval/concepts/01-entities-and-workflow.html
sourceHash: 250fce621afc0b1152282cd088437564affc72c5
keywords: ["Approval Rule", "Pending Order", "Effective role", "Order Placed event", "Order needs approval event", "Order declined event", "Order Approved event", "approval workflow", "reviewer role", "can approve pending orders"]
summary: "Describes the Approval Rule and Pending Order entities and the order-placed/approval/decline event workflow for Order Approval."
lastBuilt: "2026-09-15"
---
## What it is

This page describes the Approval Rule and Pending Order entities and the workflow events that drive B2B order approval.

## Key steps / config

- **Approval Rule**: conditions (order total, currency, employee role) that trigger approval; assigned a reviewer role and/or a requiring role; has a priority determining evaluation order.
- **Pending Order**: an order placed by an employee that requires approval; holds the order data, the placing employee, and the matched approval rule.

Workflow:

```
Employee places an order -> Approval rule applies?
  No  -> Event: Order Placed
  Yes -> Event: Order needs approval -> Order approved?
           No  -> Event: Order declined
           Yes -> Event: Order Approved & Event: Order placed
```

## Essential identifiers

- `Approval Rule`, `Pending Order` (entities)
- Events: `Order Placed`, `Order needs approval`, `Order declined`, `Order Approved`

## Gotchas

- Only employees holding the role designated as the rule's "Effective role" can request approval.
- Viewing/approving pending orders is gated by the "Can view all pending orders" and "Can approve/decline all pending orders" (or the assigned-only variants) permissions; Business Partners can view/approve/decline all pending orders of their employees.
