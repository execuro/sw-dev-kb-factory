---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/architecture/events.md
sourceHash: f79260a76c5dd3bc71d0a92f595fbb630a232c26
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/events.html
title: Event Extension Architecture
version: "6.7"
versions:
  - "6.7"
keywords: ["ShopwareEvent", "ShopwareSalesChannelEvent", "SalesChannelAware", "getContext", "getSalesChannelContext", "getSalesChannelId", "event subscriber", "custom event", "decoration", "data enrichment", "sales channel event"]
summary: Mandatory rules for plugin events - enrichment not control flow, decorate to replace logic, implement ShopwareEvent; sales channel events add two interfaces.
lastBuilt: 2026-10-21
---
## What it is

The architectural contract for using and defining events in Shopware plugins. Events are extension points for loading additional data or reacting to system changes; they are meant for observation and enrichment, not for altering core control flow.

## When to use

When deciding between an event subscriber and service decoration, and when defining a custom event class in a plugin.

## Key steps / config

Design principles: events expose extension points without breaking encapsulation; they should not mutate core program flow; replacing business logic uses decoration, not events; events stay predictable and side-effect aware.

1. Use events to add data, not to override behaviour. To change how logic executes, decorate the service instead.
2. In subscribers, avoid heavy computation and database queries; keep them idempotent and deterministic.
3. Every custom event implements `\Shopware\Core\Framework\Event\ShopwareEvent` (requires `getContext(): Context`).
4. Sales channel events additionally implement:
   - `\Shopware\Core\Framework\Event\ShopwareSalesChannelEvent` (extends `ShopwareEvent`, requires `getSalesChannelContext(): SalesChannelContext`)
   - `\Shopware\Core\Framework\Event\SalesChannelAware` (requires `getSalesChannelId(): string`)

```php
class MyEvent implements ShopwareSalesChannelEvent, SalesChannelAware
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

- Events are for enrichment and extension; using a subscriber to change control flow violates the contract — use decoration.
- `ShopwareSalesChannelEvent` already extends `ShopwareEvent`, so implementing it also covers the base requirement.

## Code check (6.7.15.1)
- confirmed `ShopwareEvent` — interface in `Shopware\Core\Framework\Event` — vendor/shopware/core/Framework/Event/ShopwareEvent.php:9
- confirmed `ShopwareEvent::getContext()` — only required member — vendor/shopware/core/Framework/Event/ShopwareEvent.php:11
- confirmed `ShopwareSalesChannelEvent` — interface extending ShopwareEvent — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:9
- confirmed `ShopwareSalesChannelEvent::getSalesChannelContext()` — required member — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:11
- confirmed `SalesChannelAware` — interface in `Shopware\Core\Framework\Event` — vendor/shopware/core/Framework/Event/SalesChannelAware.php:9
- confirmed `SalesChannelAware::getSalesChannelId()` — required member — vendor/shopware/core/Framework/Event/SalesChannelAware.php:11
