---
id: platform/dev/6.7/resources/references/app-reference/webhook-events-reference.md
title: Webhook Events Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/webhook-events-reference.html
sourceHash: ec341b090dbce2b79ebcd63a413ddd4f60f19d35
codeCheckedAgainst: "6.7.13.0"
keywords: ["webhook events", "app webhooks", "checkout.order.placed", "checkout.customer.login", "state_enter", "state_leave", "product.written", "order.deleted", "app.installed", "shopware.updated", "mail.sent", "contact_form.send", "acl permissions", "event payload", "docs:app-system-events"]
summary: "Webhook event names for apps: business events, state_enter/state_leave transitions, entity .written/.deleted, app lifecycle, and required ACL permissions."
lastBuilt: 2026-09-15
---
## What it is

A generated table of every event name an app can subscribe to as a webhook in Shopware 6.7, with the permissions needed and the shape of the payload. In core, the list is produced by the `docs:app-system-events` console command.

## When to use

When adding a webhook to an app and you need the exact event name, the read permissions (`<entity>:read`) the app must request, or the payload keys you will receive.

## Key steps / config

1. Pick the event name from the groups below.
2. Request the listed permissions for the app.
3. Parse the payload keys listed for the event.

### Business events (permissions → payload)

- `checkout.customer.before.login` — none — `{"email":"string"}`
- `checkout.customer.login` — `customer:read` — `{"entity":"customer","contextToken":"string"}`
- `checkout.customer.logout`, `checkout.customer.register`, `checkout.customer.deleted`, `checkout.customer.guest_register`, `checkout.customer.changed-payment-method` — `customer:read` — `{"entity":"customer"}`
- `checkout.customer.double_opt_in_registration`, `checkout.customer.double_opt_in_guest_order` — `customer:read` — `entity`, `confirmUrl`
- `checkout.order.placed` — `order:read` — `{"entity":"order"}`
- `checkout.order.payment_method.changed` — `order:read` `order_transaction:read` — `{"entity":"order_transaction"}`
- `customer.group.registration.accepted` / `customer.group.registration.declined` — `customer:read` `customer_group:read` — `{"entity":"customer_group"}`
- `customer.recovery.request` — `customer_recovery:read` `customer:read` — `entity`, `resetUrl`, `shopName`
- `user.recovery.request` — `user_recovery:read` — `entity`, `resetUrl`
- `contact_form.send` (no permissions; `contactFormData`), `review_form.send` (`product:read`; `reviewFormData`, `entity`)
- `mail.before.send` (`data`, `templateData`), `mail.after.create.message` (`data`, `message`), `mail.sent` (`subject`, `contents`, `recipients`) — no permissions
- `newsletter.register` (adds `url`), `newsletter.confirm`, `newsletter.unsubscribe` — `newsletter_recipient:read`
- `product_export.log` — no permissions — `{"name":"string"}`

### State machine transitions

`state_enter.<machine>.state.<state>` and `state_leave.<machine>.state.<state>` for machines `order`, `order_delivery`, `order_transaction`, `order_transaction_capture`, `order_transaction_capture_refund` (e.g. `state_enter.order_transaction.state.paid`, `state_leave.order_delivery.state.shipped`). All require `order:read`; payload `{"entity":"order"}`.

### Entity write events

`<entity>.written` and `<entity>.deleted` for `product`, `product_price`, `category`, `sales_channel`, `sales_channel_domain`, `customer`, `customer_address`, `order`, `order_address`, `document`, `media`. Permission `<entity>:read`. Payload skeleton:

```json
{"entity":"product","operation":"update insert","primaryKey":"array string","payload":"array"}
```

`operation` is `deleted` for `.deleted` events.

### App lifecycle and system

`app.activated`, `app.deactivated`, `app.deleted`, `app.installed`, `app.updated`, `shopware.updated` — no permissions, no payload listed.

## Essential identifiers

- `checkout.order.placed`, `checkout.customer.login`, `checkout.customer.before.login`
- `state_enter.`, `state_leave.` prefixes
- `<entity>.written`, `<entity>.deleted`
- `app.installed`, `app.updated`, `app.activated`, `app.deactivated`, `app.deleted`, `shopware.updated`
- `shopware.entity.hookable` (service tag that makes an entity emit `.written`/`.deleted` webhooks)
- `docs:app-system-events`

## Gotchas

- Many descriptions in the source are **EMPTY**; the event names and permissions are still listed.
- The entity write-event list is not hard-coded: core builds it from services tagged `shopware.entity.hookable` (autoconfigured for `Shopware\Core\Framework\Webhook\Hookable\HookableEntityInterface`), so the installed set can grow beyond the eleven entities listed.
- `customer.recovery.request` needs both `customer_recovery:read` and `customer:read`.

## Code check (6.7.13.0)
- confirmed `checkout.customer.before.login` — CustomerBeforeLoginEvent::EVENT_NAME — vendor/shopware/core/Checkout/Customer/Event/CustomerBeforeLoginEvent.php:23
- confirmed `checkout.order.placed` — CheckoutOrderPlacedEvent::EVENT_NAME — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:29
- confirmed `mail.sent` — MailSentEvent::EVENT_NAME — vendor/shopware/core/Content/MailTemplate/Service/Event/MailSentEvent.php:20
- confirmed `user.recovery.request` — UserRecoveryRequestEvent::EVENT_NAME — vendor/shopware/core/System/User/Recovery/UserRecoveryRequestEvent.php:24
- confirmed `state_enter` — transition-side prefix constant — vendor/shopware/core/System/StateMachine/Event/StateMachineStateChangeEvent.php:16
- confirmed `state_leave` — transition-side prefix constant — vendor/shopware/core/System/StateMachine/Event/StateMachineStateChangeEvent.php:17
- confirmed `HookableEventCollector::getEntityWrittenEventNamesWithPrivileges()` — builds `<entity>.written`/`.deleted` with `<entity>:read` — vendor/shopware/core/Framework/Webhook/Hookable/HookableEventCollector.php:72
- confirmed `shopware.entity.hookable` — tag autoconfigured for HookableEntityInterface — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:62
- confirmed `app.activated` — AppActivatedEvent::NAME — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `shopware.updated` — UpdatePostFinishEvent::EVENT_NAME — vendor/shopware/core/Framework/Update/Event/UpdatePostFinishEvent.php:14
