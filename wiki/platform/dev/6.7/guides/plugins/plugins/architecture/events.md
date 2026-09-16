---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/architecture/events.md
sourceHash: f79260a76c5dd3bc71d0a92f595fbb630a232c26
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/events.html
title: Event Extension Architecture
version: "6.7"
versions:
  - "6.7"
keywords: ["ShopwareEvent", "ShopwareSalesChannelEvent", "SalesChannelAware", "getContext", "getSalesChannelContext", "getSalesChannelId", "event subscriber", "extension point", "decoration vs events", "event architecture", "sales channel event", "enrichment"]
summary: "Architecture rules for Shopware events: enrich data, do not alter control flow; events implement ShopwareEvent, sales channel events add SalesChannelAware."
lastBuilt: 2026-09-15
---
## What it is

Architecture guideline for events in Shopware 6.7: events are extension points for loading additional data or reacting to system changes. They exist for observation and enrichment, not for changing core control flow, and the page lists the interfaces an event class must implement.

## When to use

- Designing a new event that core code or your own extension dispatches.
- Deciding whether an extension should subscribe to an event or decorate a service.
- Reviewing subscribers for side effects or heavy work.

## Key steps / config

Design principles:

1. Events expose extension points without breaking encapsulation.
2. Events must not mutate core program flow; replacing business logic uses decoration, not events.
3. Events stay predictable and side-effect aware.

Subscriber guidelines:

- Use events to add data, not to override behavior.
- Avoid heavy computation or database queries inside subscribers.
- Keep subscribers idempotent and deterministic.
- Prefer decoration when logic execution has to change.

Technical requirements (interfaces and the methods they oblige, per installed code):

- Every event implements `\Shopware\Core\Framework\Event\ShopwareEvent` — declares `getContext(): Context`.
- Sales channel events implement `\Shopware\Core\Framework\Event\ShopwareSalesChannelEvent` (extends `ShopwareEvent`, adds `getSalesChannelContext(): SalesChannelContext`) and `\Shopware\Core\Framework\Event\SalesChannelAware` (adds `getSalesChannelId(): string`).

```php
class MyEvent extends Event implements ShopwareSalesChannelEvent, SalesChannelAware
{
    public function getContext(): Context { /* ... */ }
    public function getSalesChannelContext(): SalesChannelContext { /* ... */ }
    public function getSalesChannelId(): string { /* ... */ }
}
```

## Essential identifiers

- `\Shopware\Core\Framework\Event\ShopwareEvent`
- `\Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`
- `\Shopware\Core\Framework\Event\SalesChannelAware`

## Gotchas

- `ShopwareSalesChannelEvent` already extends `ShopwareEvent`, so implementing it satisfies the base requirement; `SalesChannelAware` is a separate interface and must be listed explicitly (core `CustomerLoginEvent` lists both).
- An event that tries to change what core code does next is a design smell here — use service decoration instead.

## Code check (6.7.13.0)
- confirmed `ShopwareEvent` — interface in Shopware\Core\Framework\Event — vendor/shopware/core/Framework/Event/ShopwareEvent.php:9
- confirmed `ShopwareEvent::getContext()` — only member of the interface — vendor/shopware/core/Framework/Event/ShopwareEvent.php:11
- confirmed `ShopwareSalesChannelEvent` — interface extending ShopwareEvent — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:9
- confirmed `ShopwareSalesChannelEvent::getSalesChannelContext()` — required member — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:11
- confirmed `SalesChannelAware` — interface in Shopware\Core\Framework\Event — vendor/shopware/core/Framework/Event/SalesChannelAware.php:9
- confirmed `SalesChannelAware::getSalesChannelId()` — required member — vendor/shopware/core/Framework/Event/SalesChannelAware.php:11
- confirmed `CustomerLoginEvent` — core event implementing SalesChannelAware and ShopwareSalesChannelEvent — vendor/shopware/core/Checkout/Customer/Event/CustomerLoginEvent.php:26
