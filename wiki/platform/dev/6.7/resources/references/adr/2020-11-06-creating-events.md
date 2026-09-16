---
id: platform/dev/6.7/resources/references/adr/2020-11-06-creating-events.md
title: Creating events in Shopware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-11-06-creating-events.html
sourceHash: 6d5a062c3df4c17ebaf12d697dc9eb96b3a12114
codeCheckedAgainst: "6.7.13.0"
keywords: ["ShopwareEvent", "ShopwareSalesChannelEvent", "Shopware\\Core\\Framework\\Context", "Shopware\\Core\\System\\SalesChannel\\SalesChannelContext", "getContext", "getSalesChannelContext", "custom event", "event interface", "adr", "sales channel context", "event dispatcher"]
summary: "ADR: every new Shopware event implements ShopwareEvent (carries Context); events with a SalesChannelContext implement ShopwareSalesChannelEvent instead."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-11-06) that standardises what data a Shopware event must carry: the request's `Context` always, and the `SalesChannelContext` whenever the event is dispatched in a sales channel scope.

## When to use

When you define a new event class in core or in a plugin/app extension and need to decide which interface it implements and which context objects it exposes to subscribers.

## Key steps / config

1. Always hold the `Shopware\Core\Framework\Context` as a property of the event.
2. Implement `Shopware\Core\Framework\Event\ShopwareEvent`, which in the installed code requires one method: `getContext(): Context`.
3. If a `Shopware\Core\System\SalesChannel\SalesChannelContext` is available where the event is thrown, also hold it as a property and implement `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent` instead. That interface extends `ShopwareEvent`, so the class must declare both `getContext(): Context` and `getSalesChannelContext(): SalesChannelContext`.

```php
class MyEvent implements ShopwareSalesChannelEvent
{
    public function getContext(): Context { /* ... */ }
    public function getSalesChannelContext(): SalesChannelContext { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Framework\Event\ShopwareEvent`
- `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`
- `Shopware\Core\Framework\Context`
- `Shopware\Core\System\SalesChannel\SalesChannelContext`

## Gotchas

- Before this decision, the data an event carried depended on the domain that threw it; older events may not follow the rule.
- Implement `ShopwareSalesChannelEvent` "instead of" `ShopwareEvent` — because it extends `ShopwareEvent`, implementing only the sales channel interface still satisfies the base contract.

## Code check (6.7.13.0)
- confirmed `ShopwareEvent` — interface exists in core — vendor/shopware/core/Framework/Event/ShopwareEvent.php:9
- confirmed `ShopwareEvent::getContext()` — sole required method, returns Context — vendor/shopware/core/Framework/Event/ShopwareEvent.php:11
- confirmed `ShopwareSalesChannelEvent` — interface extends ShopwareEvent — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:9
- confirmed `ShopwareSalesChannelEvent::getSalesChannelContext()` — required method, returns SalesChannelContext — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:11
- confirmed `Context` — class in Shopware\Core\Framework — vendor/shopware/core/Framework/Context.php:17
- confirmed `SalesChannelContext` — class in Shopware\Core\System\SalesChannel — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:28
