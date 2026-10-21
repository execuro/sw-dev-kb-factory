---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/add-custom-event.md
title: Add Custom Event
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/add-custom-event.html
sourceHash: aa6ded210c37e1a3c35adf8738809699635c3ec6
codeCheckedAgainst: "6.7.15.1"
keywords: ["ShopwareEvent", "ShopwareSalesChannelEvent", "SalesChannelAware", "GenericEvent", "NestedEvent", "event_dispatcher", "EventDispatcherInterface", "dispatch", "getSalesChannelContext", "custom event", "fire event", "create event"]
summary: Define a custom plugin event class implementing ShopwareSalesChannelEvent and fire it with the event_dispatcher service's dispatch() method.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
---
## What it is

How to create your own event class in a plugin and dispatch it, using Shopware's event interfaces on top of the Symfony event dispatcher.

## When to use

Your plugin code performs an action other code (or other plugins) should be able to react to.

## Key steps / config

Available base types (`Shopware\Core\Framework\Event\...`):

- `ShopwareEvent` — interface, requires `getContext(): Context`.
- `ShopwareSalesChannelEvent` — extends `ShopwareEvent`, adds `getSalesChannelContext(): SalesChannelContext`.
- `SalesChannelAware` — requires `getSalesChannelId(): string`.
- `GenericEvent` — requires `getName(): string`; use it to give the event a string name (like DAL events, e.g. `product.written`); otherwise listeners reference the event class.
- `NestedEvent` — abstract class for events containing other events (e.g. `EntityDeletedEvent` extends `EntityWrittenEvent`).

1. Create the event class implementing `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`:

```php
class ExampleEvent implements ShopwareSalesChannelEvent
{
    public function __construct(ExampleEntity $exampleEntity, SalesChannelContext $context) { /* ... */ }
    public function getExample(): ExampleEntity { /* ... */ }
    public function getContext(): Context { return $this->salesChannelContext->getContext(); }
    public function getSalesChannelContext(): SalesChannelContext { /* ... */ }
}
```

2. Fire it from a service that receives the `event_dispatcher` service (`Symfony\Contracts\EventDispatcher\EventDispatcherInterface`):

```php
$this->eventDispatcher->dispatch(new ExampleEvent($exampleEntity, $context));
```

Without a second `dispatch` argument, listeners subscribe by class name. Next: [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Essential identifiers

- `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`, `ShopwareEvent`, `SalesChannelAware`, `GenericEvent`, `NestedEvent`
- `ShopwareSalesChannelEvent::getSalesChannelContext()`, `ShopwareEvent::getContext()`
- `event_dispatcher`, `EventDispatcherInterface::dispatch()`

## Gotchas

- The source lists `BusinessEventInterface` (for named, dynamically assigned events); it does not exist in 6.7 — Flow Builder events implement `FlowEventAware` instead.

## Code check (6.7.15.1)
- confirmed `ShopwareEvent::getContext()` — required member — vendor/shopware/core/Framework/Event/ShopwareEvent.php:11
- confirmed `ShopwareSalesChannelEvent::getSalesChannelContext()` — required member, interface extends ShopwareEvent — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:11
- confirmed `SalesChannelAware::getSalesChannelId()` — required member — vendor/shopware/core/Framework/Event/SalesChannelAware.php:11
- confirmed `GenericEvent::getName()` — required member — vendor/shopware/core/Framework/Event/GenericEvent.php:10
- confirmed `NestedEvent` — abstract class implementing ShopwareEvent — vendor/shopware/core/Framework/Event/NestedEvent.php:11
- confirmed `EntityDeletedEvent` — extends EntityWrittenEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeletedEvent.php:17
- absent `BusinessEventInterface` — no definition or usage in the installed code
- confirmed `FlowEventAware` — current interface for flow-capable events — vendor/shopware/core/Framework/Event/FlowEventAware.php:9
- confirmed `event_dispatcher` — service id injected by core services — vendor/shopware/core/Content/DependencyInjection/revocation_request_form.php:20
