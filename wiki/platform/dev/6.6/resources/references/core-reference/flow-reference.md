---
id: platform/dev/6.6/resources/references/core-reference/flow-reference.md
title: Flow Reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/flow-reference.html
sourceHash: 7dc82985bf26b274306e16db03d1a390bb399907
keywords: ["flow reference", "flow builder", "checkout.order.placed", "checkout.customer.login", "newsletter.register", "state_enter", "state_leave", "employee.invite.sent", "collect.permission-events", "EmployeeAware", "flow events", "flow actions", "B2B events"]
summary: "Reference table of Flow Builder trigger events, their descriptions, and the actions available for each (Shopware 6.4.6.0+)."
lastBuilt: 2026-09-15
---
## What it is

Reference table of events that can trigger a Flow Builder flow, what each event fires on, and which flow actions (add/remove tag, send mail, generate document, set order status) are available for it. Also lists B2B trigger interfaces and B2B-specific events.

## When to use

Use this page to look up the exact event name for a Flow Builder trigger, or to check which actions an event supports.

## Key steps / config

Example checkout/customer/order events and their available actions:

- `checkout.customer.login` — Add/remove tag
- `checkout.customer.deleted` — Add/remove tag, send mail
- `checkout.order.placed` — Add/remove tag, send mail, generate document, set order status
- `checkout.customer.register`, `checkout.customer.guest_register` — Add/remove tag, send mail
- `newsletter.confirm`, `newsletter.register`, `newsletter.unsubscribe` — Send mail
- `contact_form.send` — Send mail
- `state_enter.order_transaction.state.paid`, `state_leave.order.state.completed` (and the full `state_enter`/`state_leave` family for `order`, `order_transaction`, `order_delivery` states) — Add/remove tag, send mail, generate document, set order status

B2B trigger interface: `EmployeeAware` provides `employeeId`.

B2B events (Employee Management component): `collect.permission-events`, `employee.invite.sent`, `employee.invite.accepted`, `employee.recovery.request`, `employee.status.changed`, `employee.role.changed`, `employee.order.placed`.

## Essential identifiers

`checkout.order.placed`, `checkout.customer.login`, `checkout.customer.register`, `newsletter.register`, `contact_form.send`, `EmployeeAware`, `employee.invite.sent`, `employee.status.changed`, `state_enter.order.state.completed`, `state_leave.order_transaction.state.paid`

## Version notes

This functionality is available starting with Shopware 6.4.6.0. `newsletter.update` is deprecated as of 6.5.0.
