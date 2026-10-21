---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/_index.md
title: Event
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/
sourceHash: 05ba736027112bcb46610f4e805f3ff4ae399659
codeCheckedAgainst: "6.7.15.1"
keywords: ["events", "event system", "event-driven", "storefront events", "administration events", "flow builder events", "FlowEventAware", "CheckoutOrderPlacedEvent", "checkout.order.placed", "product.written", "subscriber", "hooks"]
summary: Overview of Shopware events - hook custom plugin logic into core actions such as order placement or product updates via storefront, admin or flow events.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the plugin guides on Shopware events. Events are triggered at specific actions in the platform; a plugin intercepts them and runs its own logic during those actions. This event-driven architecture is the main way to extend and customize Shopware's behavior to specific business requirements without changing core code.

## When to use

When a plugin has to react to a core action - for example order placement or a product update - to perform an additional task such as sending a notification, modifying data, or integrating with an external service.

## Key steps / config

The source names several families of events to hook into, among others:

- Storefront events
- Administration events
- Flow Builder events

Examples of core actions and the events the installed code dispatches for them:

- Order placement: `CheckoutOrderPlacedEvent` (event name `checkout.order.placed`), which also implements `FlowEventAware` and is therefore available as a Flow Builder trigger.
- Product updates: `ProductEvents::PRODUCT_WRITTEN_EVENT` (`product.written`).
- Storefront page rendering: `StorefrontRenderEvent`.

## Essential identifiers

- `FlowEventAware` (marks an event as usable in Flow Builder)
- `CheckoutOrderPlacedEvent` / `checkout.order.placed`
- `ProductEvents::PRODUCT_WRITTEN_EVENT` / `product.written`
- `StorefrontRenderEvent`

## Code check (6.7.15.1)
- confirmed `CheckoutOrderPlacedEvent` — implements `FlowEventAware` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:32
- confirmed `checkout.order.placed` — `CheckoutOrderPlacedEvent::EVENT_NAME` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
- confirmed `PRODUCT_WRITTEN_EVENT` — value `product.written` — vendor/shopware/core/Content/Product/ProductEvents.php:31
- confirmed `FlowEventAware` — interface extending `ShopwareEvent` — vendor/shopware/core/Framework/Event/FlowEventAware.php:9
- confirmed `StorefrontRenderEvent` — Storefront render event — vendor/shopware/storefront/Event/StorefrontRenderEvent.php:13
