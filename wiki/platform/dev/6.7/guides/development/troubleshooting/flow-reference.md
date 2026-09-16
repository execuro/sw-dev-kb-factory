---
id: platform/dev/6.7/guides/development/troubleshooting/flow-reference.md
title: Flow Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/flow-reference.html
sourceHash: e0c6e35b08845212e7371cd0b47ec7adae415def
codeCheckedAgainst: "6.7.13.0"
keywords: ["flow builder", "flow triggers", "checkout.order.placed", "state_enter", "state_leave", "StateMachineStateChangeEvent", "mail.before.send", "mail.sent", "checkout.customer.login", "EmployeeAware", "flow events", "business events", "order state events"]
summary: Flow Builder trigger event names - customer, order, mail, newsletter, state_enter/state_leave per state machine, and B2B employee events.
lastBuilt: 2026-09-15
---
## What it is

Reference list of the event names that can trigger flows in the Flow Builder, including state-machine enter/leave events and B2B Employee Management events.

## When to use

When configuring a flow or writing a flow trigger/subscriber and you need the exact technical event name.

## Key steps / config

Customer and checkout:
- `checkout.customer.before.login`, `checkout.customer.login`, `checkout.customer.logout`
- `checkout.customer.register`, `checkout.customer.guest_register`
- `checkout.customer.double_opt_in_registration`, `checkout.customer.double_opt_in_guest_order`
- `checkout.customer.deleted`, `customer.recovery.request`
- `customer.group.registration.accepted`, `customer.group.registration.declined`
- `checkout.order.placed`, `checkout.order.payment_method.changed`

Other:
- `contact_form.send`, `review_form.send`, `product_export.log`
- `mail.before.send`, `mail.after.create.message`, `mail.sent`
- `newsletter.confirm`, `newsletter.register`, `newsletter.unsubscribe`
- `user.recovery.request` (admin user password recovery)

State events: `<state_enter|state_leave>.<state machine>.<state>`, e.g. `state_enter.order.state.cancelled`. Each state below has an enter and a leave event:
- `order.state`: `cancelled`, `completed`, `in_progress`, `open`
- `order_delivery.state`: `cancelled`, `open`, `returned`, `returned_partially`, `shipped`, `shipped_partially`
- `order_transaction.state`: `authorized`, `cancelled`, `chargeback`, `failed`, `in_progress`, `open`, `paid`, `paid_partially`, `refunded`, `refunded_partially`, `reminded`, `unconfirmed`
- `order_transaction_capture.state`: `completed`, `failed`, `pending`
- `order_transaction_capture_refund.state`: `cancelled`, `completed`, `failed`, `in_progress`, `open`

B2B (Employee Management): trigger interface `EmployeeAware` provides `employeeId`; events `collect.permission-events`, `employee.invite.sent`, `employee.invite.accepted`, `employee.recovery.request`, `employee.status.changed`, `employee.role.changed`, `employee.order.placed`.

## Essential identifiers

- `StateMachineStateChangeEvent::getStateEventName()`
- `CheckoutOrderPlacedEvent`, `CustomerBeforeLoginEvent`, `CustomerAccountRecoverRequestEvent`
- `MailBeforeValidateEvent` (`mail.before.send`), `MailBeforeSentEvent` (`mail.after.create.message`), `MailSentEvent`
- `OrderTransactionCaptureStates`, `OrderTransactionCaptureRefundStates`

## Gotchas

- Mail event names and class names do not match intuitively: `mail.before.send` is `MailBeforeValidateEvent`, `mail.after.create.message` is `MailBeforeSentEvent`.
- `StateMachineStateChangeEvent::getName()` returns `state_machine.<machine>_changed`; the flow name comes from `getStateEventName()` (next state for enter, previous state for leave).
- B2B events and `EmployeeAware` come from the B2B Commercial component, not the installed core/storefront/administration packages.

## Version notes

- Flow triggers are available starting with Shopware 6.4.6.0.

## Code check (6.7.13.0)
- confirmed `checkout.order.placed` — CheckoutOrderPlacedEvent::EVENT_NAME — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:29
- confirmed `checkout.customer.before.login` — CustomerBeforeLoginEvent::EVENT_NAME — vendor/shopware/core/Checkout/Customer/Event/CustomerBeforeLoginEvent.php:23
- confirmed `mail.before.send` — MailBeforeValidateEvent::EVENT_NAME — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:20
- confirmed `mail.after.create.message` — MailBeforeSentEvent::EVENT_NAME — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeSentEvent.php:23
- confirmed `customer.group.registration.accepted` — CustomerGroupRegistrationAccepted::EVENT_NAME — vendor/shopware/core/Checkout/Customer/Event/CustomerGroupRegistrationAccepted.php:24
- confirmed `customer.recovery.request` — CustomerAccountRecoverRequestEvent::EVENT_NAME — vendor/shopware/core/Checkout/Customer/Event/CustomerAccountRecoverRequestEvent.php:29
- confirmed `StateMachineStateChangeEvent::getStateEventName()` — side.machine.state — vendor/shopware/core/System/StateMachine/Event/StateMachineStateChangeEvent.php:44
- confirmed `order_transaction_capture.state` — states pending, completed, failed — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCapture/OrderTransactionCaptureStates.php:10
- confirmed `order_transaction_capture_refund.state` — states open, in_progress, cancelled, failed, completed — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransactionCaptureRefund/OrderTransactionCaptureRefundStates.php:10
- unverified `EmployeeAware` — B2B Commercial component, outside the installed vendor/shopware roots
