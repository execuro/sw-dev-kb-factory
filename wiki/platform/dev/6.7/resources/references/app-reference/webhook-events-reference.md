---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/app-reference/webhook-events-reference.md
sourceHash: ec341b090dbce2b79ebcd63a413ddd4f60f19d35
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/webhook-events-reference.html
title: Webhook Events Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["webhook events", "app webhooks", "checkout.order.placed", "customer.recovery.request", "user.recovery.request", "mail.before.send", "mail.after.create.message", "state_enter.order.state.open", "product.written", "app.installed", "webhook permissions", "webhook payload"]
summary: App-reference table of webhook event names with required ACL permission and payload keys (recovery, mail, state, entity and app events).
lastBuilt: 2026-10-21
---
## What it is

The app-reference table of webhook event names an app can subscribe to, with the permission each requires and the payload keys delivered. It overlaps with the script-reference webhook table but lists some extra business events (password recovery, mail lifecycle) and extra payload keys.

## When to use

When choosing the event name for a webhook in an app manifest, deciding which `<entity>:read` permissions to request, or parsing a webhook payload (e.g. reading `confirmUrl`, `resetUrl` or `contextToken`).

## Key steps / config

1. Choose the event name; request the listed permission, or the app does not receive the event.
2. Parse the payload according to the keys below.

**Customer / account events** (`customer:read` unless noted):
- `checkout.customer.before.login` — no permission, `{"email":"string"}`
- `checkout.customer.login` — `{"entity":"customer","contextToken":"string"}`
- `checkout.customer.double_opt_in_guest_order`, `checkout.customer.double_opt_in_registration` — `{"entity":"customer","confirmUrl":"string"}`
- `checkout.customer.logout`, `checkout.customer.register`, `checkout.customer.guest_register`, `checkout.customer.deleted` — `{"entity":"customer"}`
- `customer.recovery.request` — `customer_recovery:read` `customer:read`, `{"entity":"customer","resetUrl":"string","shopName":"string"}`
- `customer.group.registration.accepted` / `.declined` — `customer:read` `customer_group:read`
- `user.recovery.request` — `user_recovery:read`, `{"entity":"user_recovery","resetUrl":"string"}`

**Order**: `checkout.order.placed` (`order:read`), `checkout.order.payment_method.changed` (`order:read` `order_transaction:read`, entity `order_transaction`).

**Mail and forms** (no permission): `mail.before.send` (`data`, `templateData`), `mail.after.create.message` (`data`, `message`), `mail.sent` (`subject`, `contents`, `recipients`), `contact_form.send` (`contactFormData`), `product_export.log` (`name`). `review_form.send` needs `product:read`.

**Newsletter** (`newsletter_recipient:read`): `newsletter.confirm`, `newsletter.unsubscribe`, `newsletter.register` (adds `url`).

**State machine**: `state_enter.<machine>.state.<state>` / `state_leave.<machine>.state.<state>` for `order`, `order_delivery`, `order_transaction`, `order_transaction_capture`, `order_transaction_capture_refund`; all `order:read`, payload `{"entity":"order"}`.

**Entity events**: `<entity>.written` / `<entity>.deleted` for `product`, `product_price`, `category`, `sales_channel`, `sales_channel_domain`, `customer`, `customer_address`, `order`, `order_address`, `document`, `media`; permission `<entity>:read`:

```json
{"entity":"order","operation":"update insert","primaryKey":"array string","payload":"array"}
```

**App lifecycle** (no permission, no documented payload): `app.activated`, `app.deactivated`, `app.deleted`, `app.installed`, `app.updated`, `shopware.updated`.

## Essential identifiers

- `checkout.order.placed`, `checkout.customer.login`, `checkout.customer.register`
- `customer.recovery.request`, `user.recovery.request`
- `mail.before.send`, `mail.after.create.message`, `mail.sent`
- `state_enter.*` / `state_leave.*`
- `<entity>.written` / `<entity>.deleted`
- `app.installed`, `app.updated`, `shopware.updated`

## Gotchas

- The table lists `checkout.customer.changed-payment-method` (`customer:read`). In 6.7.15.1 only the constant `CustomerEvents::CUSTOMER_CHANGED_PAYMENT_METHOD_EVENT` remains; no event class uses it, and a 6.7 migration deletes the flows bound to it. Do not rely on receiving this webhook.
- Many descriptions are `**EMPTY**` in the source; the event name is the only documentation.
- This table omits events found in the script-reference variant (e.g. `app.system_heartbeat`, `app.config.changed`, `document.generation.completed`, consent events) — check that page for the complete 6.7 list.

## Code check (6.7.15.1)
- corrected `checkout.customer.changed-payment-method` — docs: listed as a deliverable webhook; only the constant remains, no dispatching event class — vendor/shopware/core/Checkout/Customer/CustomerEvents.php:34
- confirmed `Migration1720603803RemoveDefaultPaymentMethodFlows` — deletes flows with `event_name` `checkout.customer.changed-payment-method` — vendor/shopware/core/Migration/V6_7/Migration1720603803RemoveDefaultPaymentMethodFlows.php:13
- confirmed `checkout.customer.before.login` — `CustomerBeforeLoginEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Customer/Event/CustomerBeforeLoginEvent.php:26
- confirmed `customer.recovery.request` — `CustomerAccountRecoverRequestEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Customer/Event/CustomerAccountRecoverRequestEvent.php:31
- confirmed `user.recovery.request` — `UserRecoveryRequestEvent::EVENT_NAME` — vendor/shopware/core/System/User/Recovery/UserRecoveryRequestEvent.php:26
- confirmed `checkout.customer.login` — `CustomerEvents::CUSTOMER_LOGIN_EVENT` — vendor/shopware/core/Checkout/Customer/CustomerEvents.php:38
- confirmed `shopware.updated` — `UpdatePostFinishEvent::EVENT_NAME` — vendor/shopware/core/Framework/Update/Event/UpdatePostFinishEvent.php:14
- confirmed `Hookable::HOOKABLE_EVENTS` — app lifecycle events `app.installed` etc. are hookable — vendor/shopware/core/Framework/Webhook/Hookable.php:21
- confirmed `HookableEventCollector::getEntityWrittenEventNamesWithPrivileges()` — `<entity>.written`/`.deleted` require `<entity>:read` — vendor/shopware/core/Framework/Webhook/Hookable/HookableEventCollector.php:72
