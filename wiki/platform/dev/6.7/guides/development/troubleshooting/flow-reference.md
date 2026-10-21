---
id: platform/dev/6.7/guides/development/troubleshooting/flow-reference.md
title: Flow Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/flow-reference.html
sourceHash: e0c6e35b08845212e7371cd0b47ec7adae415def
codeCheckedAgainst: "6.7.15.1"
keywords: ["flow builder", "flow triggers", "flow events", "checkout.order.placed", "checkout.customer.login", "state_enter", "state_leave", "mail.sent", "user.recovery.request", "StateMachineStateChangeEvent", "order state", "EmployeeAware", "b2b"]
summary: List of Flow Builder trigger event names (customer, order, mail, newsletter, state_enter/state_leave state machine events, B2B employee events).
lastBuilt: 2026-10-21
---
## What it is

Reference list of the event names that can trigger a Flow Builder flow (available since Shopware 6.4.6.0), plus the B2B Employee Management triggers.

## When to use

When you configure or create a flow and need the exact technical event name, or need to know which event fires for an order, delivery or payment status change.

## Key steps / config

Business events (name: when it fires):

- Customer: `checkout.customer.before.login` and `checkout.customer.login` (login), `checkout.customer.logout`, `checkout.customer.register`, `checkout.customer.guest_register`, `checkout.customer.deleted`, `checkout.customer.double_opt_in_registration`, `checkout.customer.double_opt_in_guest_order`, `customer.recovery.request` (password recovery), `customer.group.registration.accepted`, `customer.group.registration.declined`
- Order: `checkout.order.placed`, `checkout.order.payment_method.changed`
- Forms: `contact_form.send`, `review_form.send`
- Mail: `mail.after.create.message` (message created), `mail.before.send`, `mail.sent`
- Newsletter: `newsletter.register`, `newsletter.confirm`, `newsletter.unsubscribe`
- Other: `product_export.log`, `user.recovery.request` (admin user password recovery)

State machine events follow the pattern `<state_enter|state_leave>.<state machine>.<state>`:

| State machine | States |
|---|---|
| `order.state` | `open`, `in_progress`, `completed`, `cancelled` |
| `order_delivery.state` | `open`, `shipped`, `shipped_partially`, `returned`, `returned_partially`, `cancelled` |
| `order_transaction.state` | `open`, `authorized`, `paid`, `paid_partially`, `refunded`, `refunded_partially`, `reminded`, `unconfirmed`, `in_progress`, `failed`, `cancelled`, `chargeback` |
| `order_transaction_capture.state` | `pending`, `completed`, `failed` |
| `order_transaction_capture_refund.state` | `open`, `in_progress`, `completed`, `failed`, `cancelled` |

Example: `state_enter.order_transaction.state.paid` fires when a payment enters "Paid"; `state_leave.order.state.open` when an order leaves "Open".

B2B (Employee Management component): trigger interface `EmployeeAware` provides `employeeId`; events `collect.permission-events`, `employee.invite.sent`, `employee.invite.accepted`, `employee.recovery.request`, `employee.status.changed`, `employee.role.changed`, `employee.order.placed`.

## Essential identifiers

- `checkout.order.placed`, `checkout.customer.register`, `checkout.customer.login`
- `state_enter.order_transaction.state.paid`, `state_leave.order_delivery.state.shipped` (pattern for all state events)
- `mail.before.send`, `mail.sent`, `user.recovery.request`, `customer.recovery.request`
- `EmployeeAware`, `employee.order.placed`

## Gotchas

- The source describes both `checkout.customer.before.login` and `checkout.customer.login` as "as soon as a customer logs in"; in code the first is `CustomerBeforeLoginEvent` (flow label "Customer has requested login"), the second `CustomerLoginEvent`.
- In code, `mail.after.create.message` is the `EVENT_NAME` of `MailBeforeSentEvent` and `mail.before.send` that of `MailBeforeValidateEvent` — the class names do not match the event names.
- State event names are built at runtime by `StateMachineStateChangeEvent::getStateEventName()`, so the full `state_enter.…` strings are not constants in core classes.
- B2B triggers come from the B2B Components (Employee Management), not from core.

## Code check (6.7.15.1)
- confirmed `CheckoutOrderPlacedEvent::EVENT_NAME` — `checkout.order.placed` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
- confirmed `CustomerBeforeLoginEvent::EVENT_NAME` — `checkout.customer.before.login` — vendor/shopware/core/Checkout/Customer/Event/CustomerBeforeLoginEvent.php:26
- confirmed `CustomerLoginEvent::EVENT_NAME` — `checkout.customer.login` — vendor/shopware/core/Checkout/Customer/Event/CustomerLoginEvent.php:31
- confirmed `OrderPaymentMethodChangedEvent::EVENT_NAME` — `checkout.order.payment_method.changed` — vendor/shopware/core/Checkout/Order/Event/OrderPaymentMethodChangedEvent.php:31
- confirmed `MailBeforeSentEvent::EVENT_NAME` — `mail.after.create.message` — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeSentEvent.php:25
- confirmed `MailBeforeValidateEvent::EVENT_NAME` — `mail.before.send` — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:26
- confirmed `ProductExportLoggingEvent::NAME` — `product_export.log` — vendor/shopware/core/Content/ProductExport/Event/ProductExportLoggingEvent.php:22
- confirmed `StateMachineStateChangeEvent::STATE_MACHINE_TRANSITION_SIDE_ENTER` — `state_enter` prefix, `state_leave` on line 17 — vendor/shopware/core/System/StateMachine/Event/StateMachineStateChangeEvent.php:16
- confirmed `StateMachineStateChangeEvent::getStateEventName()` — side . machine . state — vendor/shopware/core/System/StateMachine/Event/StateMachineStateChangeEvent.php:44
- unverified `EmployeeAware` — B2B Components, not in the shopware/core, storefront or administration packages
