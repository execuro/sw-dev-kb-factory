---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/app-reference/script-reference/webhook-events-reference.md
sourceHash: 7cbb99fb4b6723ae17c55d8008fd7ebf980a1b1f
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/webhook-events-reference.html
title: Webhook Event Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["webhook events", "app webhooks", "checkout.order.placed", "state_enter.order.state.open", "product.written", "app.system_heartbeat", "app.config.changed", "consent.backend_data.accepted", "document.generation.completed", "media.uploaded", "event permissions", "webhook payload", "Hookable"]
summary: Table of webhook event names an app can subscribe to in 6.7, with the ACL permission each needs and its payload shape.
lastBuilt: 2026-10-21
---
## What it is

A lookup table of every event name a Shopware app can register a webhook for, the permission (ACL privilege) the app must hold to receive it, and the shape of the payload delivered. It covers business events, order state-machine transitions, entity write/delete events and app-system lifecycle events.

## When to use

When declaring webhooks in an app manifest and you need the exact event name, the `<entity>:read` permission to request, or the keys the payload carries.

## Key steps / config

1. Pick the event name from the groups below.
2. Request the listed permission in the app's permissions, otherwise the event is not delivered to the app.
3. Expect the payload shape shown for the group.

**Business events** (payload usually `{"entity":"<name>"}`):
- Customer: `checkout.customer.before.login` (no permission, payload `{"email":"string"}`), `checkout.customer.login`, `checkout.customer.logout`, `checkout.customer.register`, `checkout.customer.guest_register`, `checkout.customer.deleted`, `checkout.customer.double_opt_in_guest_order`, `checkout.customer.double_opt_in_registration` — all `customer:read`. `customer.password.changed` adds `shopName`.
- Order: `checkout.order.placed` (`order:read`); `checkout.order.payment_method.changed` (`order:read` `order_transaction:read`, entity `order_transaction`).
- Customer group: `customer.group.registration.accepted` / `.declined` (`customer:read` `customer_group:read`).
- Forms and mail, no permission: `contact_form.send` (`contactFormData`), `revocation_request.sent` (`revocationRequestFormData`), `mail.sent` (`subject`, `recipients`), `product_export.log` (`name`). `review_form.send` needs `product:read` (`reviewFormData`, `entity`).
- Newsletter: `newsletter.confirm`, `newsletter.register`, `newsletter.unsubscribe` (`newsletter_recipient:read`).
- Documents, no permission: `document.generation.completed` (`documentId`, `documentType`, `documentNumber`, `orderId`, `orderVersionId`) and `document.generation.deleted` (`documentId`, `documentNumber`, `deletedAt`, `orderId`, `orderVersionId`).

**State machine events** — `state_enter.<machine>.state.<state>` and `state_leave.<machine>.state.<state>` for machines `order`, `order_delivery`, `order_transaction`, `order_transaction_capture`, `order_transaction_capture_refund`. All need `order:read` and carry `{"entity":"order"}`. Examples: `state_enter.order_transaction.state.paid`, `state_leave.order_delivery.state.shipped`.

**Entity events** — `<entity>.written` and `<entity>.deleted` for `sales_channel`, `sales_channel_domain`, `category`, `media`, `product`, `product_price`, `customer`, `customer_address`, `order`, `order_address`, `document`; permission `<entity>:read`:

```json
{"entity":"product","operation":"update insert","primaryKey":"array string","payload":"array"}
```

(`operation` is `deleted` for `.deleted`.)

**App-system events** (no documented payload): `media.uploaded` (`media:read`), `app.activated`, `app.deactivated`, `app.deleted`, `app.installed`, `app.updated`, `app.permissions.updated`, `shopware.updated`, `app.config.changed` (`system_config:read`), `app.system_heartbeat` (recurring "system is up" signal), `consent.backend_data.accepted` / `.revoked` (`consent:backend_data:read`), `consent.product_analytics.accepted` / `.revoked` (`consent:product_analytics:read`).

## Essential identifiers

- `checkout.order.placed`, `checkout.customer.login`, `checkout.customer.before.login`
- `state_enter.*` / `state_leave.*` order state events
- `<entity>.written` / `<entity>.deleted`
- `app.system_heartbeat`, `app.config.changed`, `app.permissions.updated`, `shopware.updated`
- `consent.backend_data.accepted`, `consent.product_analytics.revoked`
- `document.generation.completed`, `document.generation.deleted`, `revocation_request.sent`

## Gotchas

- Many rows have no description in the source (`__EMPTY__`); the event name is the only documentation.
- `checkout.customer.before.login` and the app/document events need no permission; all entity-related events need the matching `:read` privilege.

## Code check (6.7.15.1)
- confirmed `checkout.customer.before.login` — `CustomerBeforeLoginEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Customer/Event/CustomerBeforeLoginEvent.php:26
- confirmed `document.generation.completed` — `DocumentGeneratedEvent::EVENT_NAME` — vendor/shopware/core/Checkout/DocumentV2/Event/DocumentGeneratedEvent.php:19
- confirmed `document.generation.deleted` — `DocumentDeletedEvent::EVENT_NAME` — vendor/shopware/core/Checkout/DocumentV2/Event/DocumentDeletedEvent.php:25
- confirmed `revocation_request.sent` — `RevocationRequestEvent::EVENT_NAME` — vendor/shopware/core/Content/RevocationRequest/Event/RevocationRequestEvent.php:24
- confirmed `customer.password.changed` — `CustomerPasswordChangedEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Customer/Event/CustomerPasswordChangedEvent.php:29
- confirmed `Hookable::HOOKABLE_EVENTS` — app-system events incl. `media.uploaded`, `app.system_heartbeat`, `app.config.changed` — vendor/shopware/core/Framework/Webhook/Hookable.php:21
- confirmed `Hookable::HOOKABLE_EVENTS_PRIVILEGES` — `media:read` for `media.uploaded`, `system_config:read` for `app.config.changed` — vendor/shopware/core/Framework/Webhook/Hookable.php:47
- confirmed `app.permissions.updated` — `AppPermissionsUpdated::NAME` — vendor/shopware/core/Framework/App/Event/AppPermissionsUpdated.php:16
- confirmed `consent.backend_data.accepted` — built as `consent.%s.accepted` / `consent.%s.revoked` — vendor/shopware/core/System/Consent/Event/ConsentHookableEventDescriber.php:47
- confirmed `HookableEventCollector::getEntityWrittenEventNamesWithPrivileges()` — emits `<entity>.written`/`.deleted` with `<entity>:read` — vendor/shopware/core/Framework/Webhook/Hookable/HookableEventCollector.php:72
