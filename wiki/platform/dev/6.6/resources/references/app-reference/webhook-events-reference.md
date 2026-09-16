---
id: platform/dev/6.6/resources/references/app-reference/webhook-events-reference.md
title: Webhook Events Reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/webhook-events-reference.html
sourceHash: bfe06169efa382f72d7fa7a858799cd545055edd
keywords: ["webhook events", "checkout.order.placed", "checkout.customer.register", "state_enter", "state_leave", "product.written", "product.deleted", "webhook permissions", "webhook payload", "customer.recovery.request", "app webhooks"]
summary: "Table of all Shopware webhook event names, descriptions, required permissions and JSON payload shapes an app can subscribe to."
lastBuilt: 2026-09-15
---
## What it is

This page lists every event an app can register a webhook for, with its description, the permissions needed to receive it, and the shape of the JSON payload delivered.

## Key steps / config

Events fall into several groups: checkout/customer lifecycle (e.g. `checkout.customer.before.login`, `checkout.customer.login`, `checkout.customer.register`, `checkout.customer.logout`, `checkout.order.placed`), order/transaction/delivery state transitions (`state_enter.order.state.*`, `state_leave.order.state.*`, `state_enter.order_transaction.state.*`, `state_enter.order_transaction_capture.state.*`, `state_enter.order_transaction_capture_refund.state.*` and their `state_leave` counterparts), entity write/delete events (`product.written`/`product.deleted`, `product_price.written`/`.deleted`, `category.written`/`.deleted`, `sales_channel.written`/`.deleted`, `sales_channel_domain.written`/`.deleted`, `customer.written`/`.deleted`, `customer_address.written`/`.deleted`, `order.written`/`.deleted`, `order_address.written`/`.deleted`, `document.written`/`.deleted`, `media.written`/`.deleted`), mail/newsletter/contact events (`mail.before.send`, `mail.sent`, `mail.after.create.message`, `newsletter.register`, `newsletter.confirm`, `newsletter.unsubscribe`, `contact_form.send`, `review_form.send`), and app lifecycle events (`app.activated`, `app.deactivated`, `app.deleted`, `app.installed`, `app.updated`, `shopware.updated`).

Example rows:

```
checkout.order.placed        | order:read            | {"entity":"order"}
customer.recovery.request    | customer_recovery:read customer:read | {"entity":"customer","resetUrl":"string","shopName":"string"}
product.written              | product:read           | {"entity":"product","operation":"update insert","primaryKey":"array string","payload":"array"}
contact_form.send            | -                      | {"contactFormData":"object"}
```

Entity write/delete events all follow the payload pattern `{"entity":"<entity>","operation":"update insert"|"deleted","primaryKey":"array string","payload":"array"}`. State-transition events (`state_enter.*`/`state_leave.*`) all require `order:read` and deliver `{"entity":"order"}`.

## Essential identifiers

- `checkout.customer.before.login`, `checkout.customer.login`, `checkout.customer.register`, `checkout.order.placed`
- `state_enter.order.state.*`, `state_leave.order.state.*`, `state_enter.order_transaction.state.*`
- `product.written`, `product.deleted`, `customer.written`, `order.written`, `media.written`
- `customer.recovery.request`, `user.recovery.request`, `newsletter.register`, `contact_form.send`
- `app.activated`, `app.deactivated`, `app.installed`, `app.updated`, `app.deleted`, `shopware.updated`

## Gotchas

- App lifecycle events (`app.activated`, `app.deactivated`, `app.deleted`, `app.installed`, `app.updated`, `shopware.updated`) require no permission (`-`) but the source does not document their payload shape.
