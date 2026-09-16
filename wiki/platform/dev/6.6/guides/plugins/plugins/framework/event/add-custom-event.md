---
id: platform/dev/6.6/guides/plugins/plugins/framework/event/add-custom-event.md
title: Add custom event
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/event/add-custom-event.html
sourceHash: 5967475079a49b779a7a47b9fb707e1ac2695ba9
keywords: ["custom event", "ShopwareEvent", "ShopwareSalesChannelEvent", "SalesChannelAware", "GenericEvent", "NestedEvent", "BusinessEventInterface", "event_dispatcher", "EventDispatcherInterface", "dispatch method"]
summary: "How to create a custom Shopware event class implementing ShopwareSalesChannelEvent and fire it via the event_dispatcher service."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to define a custom event class and dispatch it in Shopware, plus lists the standard event interfaces/classes available.

## When to use
Use when a plugin needs to fire its own event for other code (plugins or core) to subscribe to.

## Key steps / config
1. Choose an interface/class base:
   - `ShopwareEvent` — basic event providing `Context`.
   - `ShopwareSalesChannelEvent` — extends `ShopwareEvent`, additionally provides `SalesChannelContext`.
   - `SalesChannelAware` — provides `SalesChannelId`.
   - `GenericEvent` — used for string-named events like database events (e.g. `product.written`).
   - `NestedEvent` — used for events wrapping other events (e.g. `EntityDeletedEvent extends EntityWrittenEvent`).
   - `BusinessEventInterface` — extends `ShopwareEvent`, for dynamically-assigned, always-named events.
2. Create the event class, e.g. implementing `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`:
```php
class ExampleEvent implements ShopwareSalesChannelEvent
{
    public function __construct(ExampleEntity $exampleEntity, SalesChannelContext $context) { ... }
    public function getExample(): ExampleEntity { ... }
    public function getContext(): Context { return $this->salesChannelContext->getContext(); }
    public function getSalesChannelContext(): SalesChannelContext { return $this->salesChannelContext; }
}
```
3. Fire it via the `event_dispatcher` service (`Symfony\Contracts\EventDispatcher\EventDispatcherInterface`):
```php
$this->eventDispatcher->dispatch(new ExampleEvent($exampleEntity, $context));
```

## Essential identifiers
- `ShopwareEvent`, `ShopwareSalesChannelEvent`, `SalesChannelAware`, `GenericEvent`, `NestedEvent`, `BusinessEventInterface`
- `event_dispatcher`, `EventDispatcherInterface::dispatch()`
