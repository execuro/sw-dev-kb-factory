---
id: platform/dev/6.7/resources/references/adr/2020-11-06-creating-events.md
title: Creating events in Shopware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-11-06-creating-events.html
sourceHash: 6d5a062c3df4c17ebaf12d697dc9eb96b3a12114
codeCheckedAgainst: "6.7.15.1"
keywords: ["events", "ShopwareEvent", "ShopwareSalesChannelEvent", "Context", "SalesChannelContext", "getContext", "getSalesChannelContext", "custom event", "event interface", "sales channel context", "adr"]
summary: "ADR: every new Shopware event implements ShopwareEvent (Context); events with a SalesChannelContext implement ShopwareSalesChannelEvent instead."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2020-11-06, area: core) that standardises what data events carry. Events across Shopware were inconsistent and it was undefined what they must contain. The decision: developers must always have access to the context of the current request through the event.

## When to use

When you create a new event class in core code or a plugin and need to decide which interface it implements and which context it exposes.

## Key steps / config

1. Every new event exposes at least `Shopware\Core\Framework\Context` as a property and implements `Shopware\Core\Framework\Event\ShopwareEvent`.
2. If the event is thrown in a sales channel context, it also exposes `Shopware\Core\System\SalesChannel\SalesChannelContext` and implements `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent` instead.

The installed interfaces oblige these members:

```php
interface ShopwareEvent
{
    public function getContext(): Context;
}

interface ShopwareSalesChannelEvent extends ShopwareEvent
{
    public function getSalesChannelContext(): SalesChannelContext;
}
```

So an event implementing `ShopwareSalesChannelEvent` declares both `getContext()` and `getSalesChannelContext()`.

## Essential identifiers

- `Shopware\Core\Framework\Event\ShopwareEvent` — `getContext(): Context`
- `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent` — extends `ShopwareEvent`, adds `getSalesChannelContext(): SalesChannelContext`
- `Shopware\Core\Framework\Context`
- `Shopware\Core\System\SalesChannel\SalesChannelContext`

## Code check (6.7.15.1)
- confirmed `ShopwareEvent` — interface in Framework\Event — vendor/shopware/core/Framework/Event/ShopwareEvent.php:9
- confirmed `ShopwareEvent::getContext()` — required member returning Context — vendor/shopware/core/Framework/Event/ShopwareEvent.php:11
- confirmed `ShopwareSalesChannelEvent` — extends ShopwareEvent — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:9
- confirmed `ShopwareSalesChannelEvent::getSalesChannelContext()` — required member returning SalesChannelContext — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:11
- confirmed `Context` — Shopware\Core\Framework\Context class — vendor/shopware/core/Framework/Context.php:18
- confirmed `SalesChannelContext` — Shopware\Core\System\SalesChannel\SalesChannelContext class — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:28
