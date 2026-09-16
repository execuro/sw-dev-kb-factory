---
id: platform/dev/6.6/concepts/commerce/checkout-concept/orders.md
title: Orders
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/commerce/checkout-concept/orders.html
sourceHash: 24850df3a3e9c58233a38e348b1db1fffebc1882
keywords: ["orders", "Order entity", "order state machine", "transaction state machine", "delivery state machine", "workflow optimized", "denormalization", "order recalculation", "state machine transitions"]
summary: An Order is created from a cart, is denormalized and workflow-optimized, and progresses through order, transaction, and delivery state machines.
lastBuilt: "2026-09-15"
---
## What it is

An `Order` is created from a cart instance; the whole cart structure is stored in the database. Contrary to the cart, which is calculation-optimized and highly flexible, the order is workflow-optimized.

## Key steps / config

Design goals:

- **Denormalization** — the order does not depend on the catalog or products; line item data and calculated prices are persisted in the database. Orders only recalculate when explicitly triggered via the API.
- **Workflow dependent** — order state changes follow a defined, predictable, configurable path; other state transitions are blocked.

During order placement, at least three distinct state machines start:

- **Order state machine** — states include Open, In Progress, Done, Cancelled, with transitions like `process`, `cancel`, `complete`, `reopen`.
- **Order transaction state machine** — states include Open, Paid, Paid partially, Cancelled, Reminded, Refunded, Refunded partially, In Progress, Failed, Authorized, Chargeback, Unconfirmed, with transitions such as `pay`, `pay_partially`, `refund`, `refund_partially`, `authorize`, `chargeback`, `process_unconfirmed`.
- **Order delivery state machine** — states include Open, Cancelled, Shipped, Shipped partially, Returned, Returned partially, with transitions `ship`, `ship_partially`, `retour`, `retour_partially`, `cancel`, `reopen`.

## Essential identifiers

- `Order`
- order state machine
- order transaction state machine
- order delivery state machine

## Gotchas

The state machines shown are the default setup; they can actually be modified through the API.
