---
id: platform/dev/6.7/resources/references/app-reference/script-reference/webhook-events-reference.md
title: Webhook Event Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/webhook-events-reference.html
sourceHash: 1b253d0971859e73f019185d8e949e60d1f9dbc0
codeCheckedAgainst: "6.7.13.0"
keywords: ["webhooks", "app webhook events", "permissions", "payload", "checkout.order.placed", "product.written", "entity written deleted events", "app.installed", "app.system_heartbeat", "app.config.changed", "consent.backend_data.accepted", "media.uploaded", "shopware.updated", "state_enter"]
summary: "App webhook event names with required ACL permissions and payload shapes: business events, state transitions, entity written/deleted, app lifecycle, consent."
lastBuilt: 2026-09-15
---
## What it is

The list of events an app can subscribe to via webhooks, with the ACL permission the app needs to receive each one and the shape of the payload delivered.

## When to use

Use when registering webhooks in an app manifest: to pick the exact event name, know which `<entity>:read` permission the app must request, and what keys the payload contains.

## Key steps / config

### Business events

| Event | Permissions | Payload keys |
|---|---|---|
| `checkout.customer.before.login` | - | `email` |
| `checkout.customer.deleted` | - | `customer` |
| `checkout.customer.login` | `customer:read` | `entity`, `contextToken` |
| `checkout.customer.logout`, `checkout.customer.register`, `checkout.customer.guest_register` | `customer:read` | `entity` |
| `checkout.customer.double_opt_in_registration`, `checkout.customer.double_opt_in_guest_order` | `customer:read` | `entity`, `confirmUrl` |
| `checkout.order.placed` | `order:read` | `entity` (`order`) |
| `checkout.order.payment_method.changed` | `order:read` `order_transaction:read` | `entity` (`order_transaction`) |
| `customer.group.registration.accepted` / `.declined` | `customer:read` `customer_group:read` | `entity` |
| `customer.password.changed` | `customer:read` | `entity`, `shopName` |
| `customer.recovery.request` | `customer_recovery:read` `customer:read` | `entity`, `resetUrl`, `shopName` |
| `user.recovery.request` | `user_recovery:read` | `entity`, `resetUrl` |
| `contact_form.send` | - | `contactFormData` |
| `review_form.send` | `product:read` | `reviewFormData`, `entity` |
| `revocation_request.sent` | - | `revocationRequestFormData` |
| `mail.after.create.message` | - | `data`, `message` |
| `mail.before.send` | - | `data`, `templateData` |
| `mail.sent` | - | `subject`, `contents`, `recipients` |
| `newsletter.confirm`, `newsletter.unsubscribe` | `newsletter_recipient:read` | `entity` |
| `newsletter.register` | `newsletter_recipient:read` | `entity`, `url` |
| `product_export.log` | - | `name` |

### State transitions

`state_enter.<machine>.state.<state>` and `state_leave.<machine>.state.<state>` for `order`, `order_delivery`, `order_transaction`, `order_transaction_capture`, `order_transaction_capture_refund` (e.g. `state_enter.order_transaction.state.paid`). All require `order:read`; payload `{"entity":"order"}`.

### Entity written/deleted events

`<entity>.written` and `<entity>.deleted` for `sales_channel`, `sales_channel_domain`, `category`, `media`, `product`, `product_price`, `customer`, `customer_address`, `document`, `order`, `order_address`. Permission: `<entity>:read`. Payload:

```json
{"entity": "product", "operation": "update insert", "primaryKey": "array string", "payload": "array"}
```

(`operation` is `deleted` for `.deleted` events.)

### System, app lifecycle and consent (no payload listed)

- `media.uploaded` (`media:read`), `shopware.updated`
- `app.activated`, `app.deactivated`, `app.deleted`, `app.installed`, `app.updated`
- `app.permissions.updated` — lists currently accepted permissions after grant/revoke
- `app.config.changed` (`system_config:read`)
- `app.system_heartbeat` — recurring task signalling the system is up
- `consent.backend_data.accepted` / `.revoked` (`consent:backend_data:read`), `consent.product_analytics.accepted` / `.revoked` (`consent:product_analytics:read`)

## Essential identifiers

- `checkout.order.placed`, `checkout.customer.login`
- `product.written`, `order.written`, `customer.deleted`
- `app.installed`, `app.permissions.updated`, `app.config.changed`, `app.system_heartbeat`
- `consent.backend_data.accepted`, `consent.product_analytics.revoked`

## Gotchas

- An app without the listed read permission does not receive the event.
- Consent events are generated per registered consent definition: pattern `consent.<name>.accepted|revoked` with privilege `consent:<name>:read`.

## Version notes

- The docs also list `document.generation.completed` (document generated/uploaded; payload `documentId`, `documentType`, `documentNumber`, `orderId`, `orderVersionId`) and `document.generation.deleted`; neither event name exists in the installed 6.7.13.0.

## Code check (6.7.13.0)
- absent `document.generation.completed` — not found in the installed code; newer than 6.7.13.0
- absent `document.generation.deleted` — not found in the installed code; newer than 6.7.13.0
- confirmed `app.config.changed` — `SystemConfigChangedHook::EVENT_NAME` — vendor/shopware/core/System/SystemConfig/Event/SystemConfigChangedHook.php:16
- confirmed `app.system_heartbeat` — `SystemHeartbeatEvent::NAME` — vendor/shopware/core/Framework/App/Event/SystemHeartbeatEvent.php:16
- confirmed `app.permissions.updated` — `AppPermissionsUpdated::NAME` — vendor/shopware/core/Framework/App/Event/AppPermissionsUpdated.php:16
- confirmed `media.uploaded` — `MediaUploadedEvent::EVENT_NAME` — vendor/shopware/core/Content/Media/Event/MediaUploadedEvent.php:20
- confirmed `shopware.updated` — `UpdatePostFinishEvent::EVENT_NAME` — vendor/shopware/core/Framework/Update/Event/UpdatePostFinishEvent.php:14
- confirmed `consent.%s.accepted` — per-consent event with `consent:<name>:read` privilege — vendor/shopware/core/System/Consent/Event/ConsentHookableEventDescriber.php:47
- confirmed `revocation_request.sent` — `RevocationRequestEvent::EVENT_NAME` — vendor/shopware/core/Content/RevocationRequest/Event/RevocationRequestEvent.php:21
- confirmed `checkout.order.placed` — `CheckoutOrderPlacedEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:29
