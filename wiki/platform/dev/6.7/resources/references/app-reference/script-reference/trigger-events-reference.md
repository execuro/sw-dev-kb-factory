---
id: platform/dev/6.7/resources/references/app-reference/script-reference/trigger-events-reference.md
title: Trigger Events Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/trigger-events-reference.html
sourceHash: 3538e5f5c325c5589e40cbdfce258dca2fa5e3ae
codeCheckedAgainst: "6.7.15.1"
keywords: ["trigger events", "flow builder events", "webhook events", "checkout.order.placed", "checkout.customer.login", "state_enter", "state_leave", "mail.before.send", "mail.sent", "contact_form.send", "revocation_request.sent", "user.recovery.request", "order state", "payment state"]
summary: List of business event names (customer, order, mail, newsletter, state_enter/state_leave transitions) that can trigger flows and app webhooks in 6.7.
lastBuilt: 2026-10-21
---
## What it is

A table of the business event names Shopware dispatches that apps and flows can react to (flow triggers / webhook events), each with a one-line description of when it fires.

## When to use

When choosing the exact event name for a flow trigger or an app webhook subscription, e.g. reacting to an order being placed, a customer registering, or an order/payment/delivery changing state.

## Key steps / config

### Customer and checkout

- `checkout.customer.before.login`, `checkout.customer.login`, `checkout.customer.logout` — customer login/logout
- `checkout.customer.register`, `checkout.customer.guest_register` — new (guest) customer registered
- `checkout.customer.double_opt_in_registration`, `checkout.customer.double_opt_in_guest_order` — double opt-in accepted
- `checkout.customer.deleted` — customer deleted
- `checkout.order.placed` — order placed
- `checkout.order.payment_method.changed` — payment method changed during checkout
- `customer.group.registration.accepted` / `customer.group.registration.declined` — admin accepted/declined a customer group registration
- `customer.password.changed`, `customer.recovery.request` — password changed / recovery requested

### Forms, mail, newsletter, misc

- `contact_form.send`, `review_form.send` (product review submitted), `revocation_request.sent`
- `mail.after.create.message` (mail message created), `mail.before.send`, `mail.sent`
- `newsletter.register`, `newsletter.confirm`, `newsletter.unsubscribe`
- `product_export.log` — product export executed
- `user.recovery.request` — admin user requested a password recovery

### State transitions

Pattern: `state_enter.<state machine>.state.<state>` fires when an entity enters a state, `state_leave.<state machine>.state.<state>` when it leaves it. Both prefixes exist for every state below:

| State machine | States |
|---|---|
| `order` | `open`, `in_progress`, `completed`, `cancelled` |
| `order_delivery` | `open`, `shipped`, `shipped_partially`, `returned`, `returned_partially`, `cancelled` |
| `order_transaction` | `open`, `unconfirmed`, `in_progress`, `authorized`, `paid`, `paid_partially`, `refunded`, `refunded_partially`, `reminded`, `chargeback`, `failed`, `cancelled` |
| `order_transaction_capture` | `pending`, `completed`, `failed` |
| `order_transaction_capture_refund` | `open`, `in_progress`, `completed`, `failed`, `cancelled` |

Example: `state_enter.order_transaction.state.paid`, `state_leave.order_delivery.state.shipped`.

## Essential identifiers

- `checkout.order.placed`, `checkout.customer.register`, `checkout.customer.login`
- `state_enter.order.state.<state>`, `state_enter.order_transaction.state.<state>`, `state_enter.order_delivery.state.<state>`
- `mail.before.send`, `mail.sent`, `contact_form.send`
- `Shopware\Core\Content\RevocationRequest\Event\RevocationRequestEvent` (`revocation_request.sent`)

## Gotchas

- Despite the name, `mail.before.send` is the name of `MailBeforeValidateEvent`, while `mail.after.create.message` belongs to `MailBeforeSentEvent`; pick by name, not by class.
- `checkout.customer.before.login` and `checkout.customer.login` share the same description in the source; the former fires before the login completes.

## Code check (6.7.15.1)
- confirmed `CheckoutOrderPlacedEvent::EVENT_NAME` — `checkout.order.placed` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
- confirmed `CustomerBeforeLoginEvent::EVENT_NAME` — `checkout.customer.before.login` — vendor/shopware/core/Checkout/Customer/Event/CustomerBeforeLoginEvent.php:26
- confirmed `OrderPaymentMethodChangedEvent::EVENT_NAME` — `checkout.order.payment_method.changed` — vendor/shopware/core/Checkout/Order/Event/OrderPaymentMethodChangedEvent.php:31
- confirmed `MailBeforeValidateEvent::EVENT_NAME` — `mail.before.send` — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:26
- confirmed `MailBeforeSentEvent::EVENT_NAME` — `mail.after.create.message` — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeSentEvent.php:25
- confirmed `ContactFormEvent::EVENT_NAME` — `contact_form.send` — vendor/shopware/core/Content/ContactForm/Event/ContactFormEvent.php:21
- confirmed `RevocationRequestEvent::EVENT_NAME` — `revocation_request.sent` — vendor/shopware/core/Content/RevocationRequest/Event/RevocationRequestEvent.php:24
- confirmed `ProductExportLoggingEvent::NAME` — `product_export.log` — vendor/shopware/core/Content/ProductExport/Event/ProductExportLoggingEvent.php:22
- confirmed `UserRecoveryRequestEvent::EVENT_NAME` — `user.recovery.request` — vendor/shopware/core/System/User/Recovery/UserRecoveryRequestEvent.php:26
- confirmed `StateMachineStateChangeEvent::STATE_MACHINE_TRANSITION_SIDE_ENTER` — `state_enter` prefix (leave side `state_leave`) — vendor/shopware/core/System/StateMachine/Event/StateMachineStateChangeEvent.php:16
