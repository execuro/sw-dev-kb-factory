---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/add-custom-event.md
title: Add Custom Event
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/add-custom-event.html
sourceHash: aa6ded210c37e1a3c35adf8738809699635c3ec6
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom event", "ShopwareEvent", "ShopwareSalesChannelEvent", "SalesChannelAware", "GenericEvent", "NestedEvent", "FlowEventAware", "EventDispatcherInterface", "event_dispatcher", "dispatch", "fire event", "getSalesChannelContext"]
summary: Create a plugin event class implementing ShopwareSalesChannelEvent and dispatch it via Symfony's EventDispatcherInterface (event_dispatcher service).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md"]
---
## What it is

How to define your own event class in a plugin, choosing the right Shopware event interface, and how to fire it through Symfony's event dispatcher so other code can subscribe to it.

## When to use

Your plugin performs an action that other plugins or your own subscribers should be able to react to. For consuming events see [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Key steps / config

**Event interfaces and classes** (all in `Shopware\Core\Framework\Event`):

- `ShopwareEvent` - basic event; requires `getContext(): Context`.
- `ShopwareSalesChannelEvent` - extends `ShopwareEvent`; additionally requires `getSalesChannelContext(): SalesChannelContext`.
- `SalesChannelAware` - requires `getSalesChannelId(): string`.
- `GenericEvent` - requires `getName(): string`; use it to give the event a specific name like DAL events (`product.written`). Otherwise listeners reference the event class.
- `NestedEvent` - abstract class for events containing other events (e.g. `EntityDeletedEvent` extends `EntityWrittenEvent`).
- `FlowEventAware` - extends `ShopwareEvent`; the interface core business events such as `CustomerLoginEvent` implement to be available in Flow Builder (requires `getName()` and static `getAvailableData()`).

1. **Create the event class**, e.g. `<plugin root>/src/Core/Content/Example/Event/ExampleEvent.php`, implementing `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`:

```php
class ExampleEvent implements ShopwareSalesChannelEvent
{
    public function __construct(protected ExampleEntity $exampleEntity, protected SalesChannelContext $salesChannelContext) {}
    public function getExample(): ExampleEntity { return $this->exampleEntity; }
    public function getContext(): Context { return $this->salesChannelContext->getContext(); }
    public function getSalesChannelContext(): SalesChannelContext { return $this->salesChannelContext; }
}
```

2. **Fire the event** from a service (e.g. `ExampleEventService`) that receives `Symfony\Contracts\EventDispatcher\EventDispatcherInterface` (service id `event_dispatcher`):

```php
$this->eventDispatcher->dispatch(new ExampleEvent($exampleEntity, $context));
```

Without a second argument to `dispatch`, listeners subscribe using the event class name (`ExampleEvent::class`).

## Essential identifiers

- `Shopware\Core\Framework\Event\ShopwareSalesChannelEvent`
- `Shopware\Core\Framework\Event\ShopwareEvent`
- `Shopware\Core\System\SalesChannel\SalesChannelContext`
- `Symfony\Contracts\EventDispatcher\EventDispatcherInterface`, service `event_dispatcher`

## Gotchas

- The docs list `BusinessEventInterface` ("extends ShopwareEvent, used for dynamic assignment, always named"). It does not exist in the installed 6.7 code; core business events (e.g. `CustomerLoginEvent`) implement `FlowEventAware` instead.
- A class implementing `ShopwareSalesChannelEvent` must declare both `getContext()` and `getSalesChannelContext()`.

## Code check (6.7.13.0)
- confirmed `ShopwareSalesChannelEvent::getSalesChannelContext()` — required interface method — vendor/shopware/core/Framework/Event/ShopwareSalesChannelEvent.php:11
- confirmed `ShopwareEvent::getContext()` — required interface method — vendor/shopware/core/Framework/Event/ShopwareEvent.php:11
- confirmed `SalesChannelAware::getSalesChannelId()` — interface method — vendor/shopware/core/Framework/Event/SalesChannelAware.php:11
- confirmed `GenericEvent::getName()` — interface method — vendor/shopware/core/Framework/Event/GenericEvent.php:10
- confirmed `NestedEvent` — abstract class implementing ShopwareEvent — vendor/shopware/core/Framework/Event/NestedEvent.php:11
- confirmed `EntityDeletedEvent` — extends EntityWrittenEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeletedEvent.php:15
- absent `BusinessEventInterface` — not found anywhere in the installed shopware code index
- confirmed `CustomerLoginEvent` — implements FlowEventAware, not a business-event interface — vendor/shopware/core/Checkout/Customer/Event/CustomerLoginEvent.php:26
- confirmed `FlowEventAware::getAvailableData()` — declared alongside getName() — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
- unverified `EventDispatcherInterface` — vendor/symfony, out of scope
