---
id: platform/dev/6.6/products/extensions/subscriptions/guides/events.md
title: Events
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/subscriptions/guides/events.html
sourceHash: e619175d0b89eb123024ad0270777e75c83ea80b
keywords: ["subscription events", "subscription.", "EventSubscriberInterface", "CheckoutOrderPlacedCriteriaEvent", "getSubscribedEvents", "cart events", "checkout events", "event listener", "subscription checkout"]
summary: "Subscription checkout events mirror normal checkout events but are prefixed with subscription. when subscribed to."
lastBuilt: "2026-09-15"
---
## What it is

Explains that most events triggered during subscription checkout are identical to normal checkout events but prefixed with `subscription.`, and shows how to subscribe to the prefixed variant.

## Key steps / config

Implement `EventSubscriberInterface` and return the prefixed event name from `getSubscribedEvents()`:

```php
class MyEventSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return ['subscription.' . CheckoutOrderPlacedCriteriaEvent::class => 'onOrderPlacedCriteria'];
    }

    public function onOrderPlacedCriteria(CheckoutOrderPlacedCriteriaEvent $event): void
    {
        // Your event handler logic
    }
}
```

For normal (non-subscription) checkout, the same class is used without the `subscription.` prefix.

## Essential identifiers

Events available in subscription checkout (subject to change): `AfterLineItemAddedEvent`, `AfterLineItemRemovedEvent`, `AfterLineItemQuantityChangedEvent`, `BeforeLineItemAddedEvent`, `BeforeLineItemRemovedEvent`, `BeforeLineItemQuantityChangedEvent`, `BeforeCartMergeEvent`, `CartCreatedEvent`, `CartConvertedEvent`, `CartDeletedEvent`, `CartLoadedEvent`, `CartMergedEvent`, `CartSavedEvent`, `CartVerifyPersistEvent`, `CheckoutCartPageLoadedEvent`, `CheckoutConfirmPageLoadedEvent`, `CheckoutOrderPlacedCriteriaEvent`, `CheckoutOrderPlacedEvent`, `CheckoutRegisterPageLoadedEvent`, `LineItemRemovedEvent`, `SalesChannelContextCreatedEvent`, `SalesChannelContextResolvedEvent`, `SalesChannelContextRestoredEvent`, `SalesChannelContextRestorerOrderCriteriaEvent`, `OffcanvasCartPageLoadedEvent`.

## Gotchas

The listed subscription events are explicitly documented as "subject to change".
