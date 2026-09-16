---
id: platform/dev/6.7/resources/references/app-reference/script-reference/trigger-events-reference.md
title: Trigger Events Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/trigger-events-reference.html
sourceHash: 3538e5f5c325c5589e40cbdfce258dca2fa5e3ae
codeCheckedAgainst: "6.7.13.0"
keywords: ["trigger events", "flow builder triggers", "business events", "checkout.order.placed", "checkout.customer.login", "state_enter", "state_leave", "order_transaction.state", "order_delivery.state", "mail.before.send", "revocation_request.sent", "user.recovery.request", "flow triggers"]
summary: "Flow trigger event names: customer, order, mail, newsletter, form events and state_enter/state_leave transitions for order, delivery, payment states."
lastBuilt: 2026-09-15
---
## What it is

A flat list of the business/trigger event names Shopware exposes (usable as Flow Builder triggers and app event subscriptions), each with a one-line description.

## When to use

Look up the exact event name string when configuring a flow trigger, subscribing an app to an event, or reacting to an order/delivery/payment state transition.

## Key steps / config

### Customer and checkout

- `checkout.customer.before.login`, `checkout.customer.login`, `checkout.customer.logout`
- `checkout.customer.register`, `checkout.customer.guest_register`, `checkout.customer.deleted`
- `checkout.customer.double_opt_in_registration`, `checkout.customer.double_opt_in_guest_order`
- `checkout.order.placed`, `checkout.order.payment_method.changed`
- `customer.group.registration.accepted`, `customer.group.registration.declined`
- `customer.password.changed`, `customer.recovery.request`
- `user.recovery.request` — admin user password recovery request

### Forms, mail, newsletter, misc

- `contact_form.send`, `review_form.send`, `revocation_request.sent` (`Shopware\Core\Content\RevocationRequest\Event\RevocationRequestEvent`)
- `mail.after.create.message` (mail content created), `mail.before.send`, `mail.sent`
- `newsletter.register`, `newsletter.confirm`, `newsletter.unsubscribe`
- `product_export.log` — product export executed

### State transitions

Pattern: `state_enter.<state_machine>.state.<state>` when an entity enters a state, `state_leave.<state_machine>.state.<state>` when it leaves. The same state sets exist for both prefixes:

| State machine | States |
|---|---|
| `order` | `open`, `in_progress`, `completed`, `cancelled` |
| `order_delivery` | `open`, `shipped`, `shipped_partially`, `returned`, `returned_partially`, `cancelled` |
| `order_transaction` | `open`, `unconfirmed`, `authorized`, `in_progress`, `paid`, `paid_partially`, `refunded`, `refunded_partially`, `reminded`, `chargeback`, `failed`, `cancelled` |
| `order_transaction_capture` | `pending`, `completed`, `failed` |
| `order_transaction_capture_refund` | `open`, `in_progress`, `completed`, `failed`, `cancelled` |

Example: `state_enter.order_transaction.state.paid`, `state_leave.order_delivery.state.shipped_partially`.

## Essential identifiers

- `checkout.order.placed`
- `checkout.customer.login`, `checkout.customer.register`
- `state_enter.order.state.completed`, `state_enter.order_transaction.state.paid`
- `mail.before.send`, `mail.sent`
- `revocation_request.sent`

## Gotchas

- `mail.after.create.message` is the name of the mail event fired when the message content is created; `mail.before.send` is a separate event.
- State values use underscores and a suffix order of `<action>_partially` (`paid_partially`, `shipped_partially`), not `partially_paid`.

## Code check (6.7.13.0)
- confirmed `checkout.order.placed` — `CheckoutOrderPlacedEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:29
- confirmed `checkout.customer.before.login` — `CustomerBeforeLoginEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Customer/Event/CustomerBeforeLoginEvent.php:23
- confirmed `checkout.order.payment_method.changed` — `OrderPaymentMethodChangedEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Order/Event/OrderPaymentMethodChangedEvent.php:26
- confirmed `revocation_request.sent` — `RevocationRequestEvent::EVENT_NAME` — vendor/shopware/core/Content/RevocationRequest/Event/RevocationRequestEvent.php:21
- confirmed `mail.after.create.message` — `MailBeforeSentEvent::EVENT_NAME` — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeSentEvent.php:23
- confirmed `mail.before.send` — `MailBeforeValidateEvent::EVENT_NAME` — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:20
- confirmed `product_export.log` — `ProductExportLoggingEvent::NAME` — vendor/shopware/core/Content/ProductExport/Event/ProductExportLoggingEvent.php:22
- confirmed `user.recovery.request` — `UserRecoveryRequestEvent::EVENT_NAME` — vendor/shopware/core/System/User/Recovery/UserRecoveryRequestEvent.php:24
- confirmed `state_enter.order_transaction.state.authorized` — listed in the app event description template — vendor/shopware/core/DevOps/Resources/templates/app-system-event-description-permissions.php:103
- confirmed `paid_partially` — `OrderTransactionStates::STATE_PARTIALLY_PAID` — vendor/shopware/core/Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:13
