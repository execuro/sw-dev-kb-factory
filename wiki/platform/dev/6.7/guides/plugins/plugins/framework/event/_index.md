---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/_index.md
title: Event
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/
sourceHash: 05ba736027112bcb46610f4e805f3ff4ae399659
codeCheckedAgainst: "6.7.13.0"
keywords: ["events", "event system", "event-driven", "ShopwareEvent", "ShopwareSalesChannelEvent", "NestedEvent", "FlowEventAware", "StorefrontRenderEvent", "storefront events", "administration events", "flow builder events", "extend core actions"]
summary: Overview of Shopware's event system - Storefront, Administration and Flow Builder events plugins hook into to run custom logic on core actions.
lastBuilt: 2026-09-15
---
## What it is

Section overview for Shopware's event guides. Shopware triggers events at specific system actions, for example when an order is placed or a product is updated. Plugins intercept these events and execute custom logic at that point, such as sending notifications, modifying data, or integrating with external services, instead of changing core code. The event-driven architecture is the main way to extend and customize platform behaviour for specific business requirements. Event families named by the source include Storefront events, Administration events and Flow Builder events, among others.

## When to use

- You need to react to or extend a core action (order placed, product updated, page rendered) from a plugin.
- You want to send notifications, adjust data, or push data to an external service when such an action happens.
- You are choosing between event types before reading the detailed guides on adding, finding or listening to events.

## Essential identifiers

In the installed core, the backend (PHP) event base types are:

- `Shopware\Core\Framework\Event\ShopwareEvent` - base interface; exposes `getContext()`.
- `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent` - extends `ShopwareEvent`; adds `getSalesChannelContext()`.
- `Shopware\Core\Framework\Event\NestedEvent` - abstract base class (Symfony `Event` implementing `ShopwareEvent`) for events carrying other events.
- `Shopware\Core\Framework\Event\FlowEventAware` - extends `ShopwareEvent`; marks events usable as Flow Builder triggers.
- `Shopware\Storefront\Event\StorefrontRenderEvent` - Storefront event dispatched before Twig rendering.

## Code check (6.7.13.0)
- confirmed `ShopwareEvent` — interface declaring `getContext(): Context` — vendor/shopware/core/Framework/Event/ShopwareEvent.php:9
- confirmed `ShopwareSalesChannelEvent` — interface extending ShopwareEvent, declares getSalesChannelContext — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:9
- confirmed `NestedEvent` — abstract class extends Event implements ShopwareEvent — vendor/shopware/core/Framework/Event/NestedEvent.php:11
- confirmed `FlowEventAware` — interface extending ShopwareEvent — vendor/shopware/core/Framework/Event/FlowEventAware.php:9
- confirmed `StorefrontRenderEvent` — Storefront event class — vendor/shopware/storefront/Event/StorefrontRenderEvent.php:13
