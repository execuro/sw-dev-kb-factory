---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/concepts/01-entities-and-workflow.md
sourceHash: 5ad454faaf2c12d297c4c10e7b571265f7568220
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/concepts/01-entities-and-workflow.html
title: Entities and workflow
version: "6.7"
versions: ["6.7"]
keywords: ["approval rule", "pending order", "order approval workflow", "effective role", "reviewer", "business partner", "b2b employee", "order needs approval", "order declined", "order approved", "rule priority"]
summary: B2B Order Approval entities (approval rule, pending order), the approve/decline workflow and who may request, view and approve pending orders.
lastBuilt: 2026-10-21
---
## What it is

The data model and workflow of the B2B Order Approval component: the approval rule and pending order entities, the events raised along the approval flow, and which employees may request, view and approve or decline pending orders.

## When to use

When you need to know how an employee's order turns into a pending order, which events fire at each step, or which role or permission an employee needs to act on pending orders.

## Key steps / config

**Approval rule** — a set of conditions an order must meet to require approval. Conditions can be based on the order's total value, the order's currency, or orders placed by employees with a specific role. Each rule has:
- a reviewer role: only employees with that role may approve orders matching the rule;
- an "Effective role": employees with that role must request approval for orders matching the rule;
- a priority that sets the order in which rules are evaluated.

**Pending order** — an order placed by an employee that needs approval. It holds the order data, the employee who placed it and the approval rule that matched.

**Workflow** (shown as a flowchart in the source):

```
Employee places an order -> Approval rule applies?
  No  -> Event: Order Placed
  Yes -> Event: Order needs approval -> Order approved?
           No  -> Event: Order declined
           Yes -> Event: Order Approved & Event: Order placed
```

**Who can do what**

| Action | Allowed for |
|---|---|
| Request approval | employees with the rule's "Effective role" |
| View pending orders | "Can view all pending orders" permission (all); the requesting employee (own); business partners (all of their employees') |
| Approve/decline | "Can approve/decline all pending orders" (all); "Can approve/decline pending orders" (those assigned to them); business partners (all of their employees') |

## Gotchas

- An approved order raises both an "Order Approved" event and the regular "Order placed" event. An order that needs approval does not raise "Order placed" until it is approved.

## Code check (6.7.15.1)
- confirmed `CheckoutOrderPlacedEvent::EVENT_NAME` — core `checkout.order.placed` event; the source names only "Order placed", not a class — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
- unverified `approval rule` — Shopware Commercial B2B entity, not in the core/storefront/administration packages
- unverified `pending order` — Shopware Commercial B2B entity, not in the core/storefront/administration packages
