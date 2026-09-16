---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/listening-to-events.md
title: Listening to events
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: f97e196fd5f795ac273b3b69be2f52fe4b81a0b4
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/listening-to-events.html
keywords: ["event subscriber", "EventSubscriberInterface", "getSubscribedEvents", "kernel.event_subscriber", "ProductEvents", "product.loaded", "EntityLoadedEvent", "EntityWrittenEvent", "Defaults::LIVE_VERSION", "services.xml", "event dispatcher"]
summary: "Create an event subscriber implementing EventSubscriberInterface and register it with the kernel.event_subscriber tag."
lastBuilt: "2026-09-15"
---
## What it is

A guide on listening to Shopware/Symfony events from a plugin via an event subscriber class.

## When to use

Use this whenever a plugin needs to react to core events, such as entity loaded/written events, e.g. `product.loaded`.

## Key steps / config

1. Create a class implementing `EventSubscriberInterface` with a static `getSubscribedEvents()` mapping event constants to handler methods:

```php
class MySubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            ProductEvents::PRODUCT_LOADED_EVENT => 'onProductsLoaded'
        ];
    }

    public function onProductsLoaded(EntityLoadedEvent $event)
    {
        // $event->getEntities()
    }
}
```

2. For versioned entities (e.g. orders, products), check the context's version to react only to the live version:

```php
public function onProductWritten(EntityWrittenEvent $event)
{
    if ($event->getContext()->getVersionId() !== Defaults::LIVE_VERSION) {
        return;
    }
}
```

3. Register the subscriber in `services.xml` with the `kernel.event_subscriber` tag:

```xml
<services>
    <service id="Swag\BasicExample\Subscriber\MySubscriber">
        <tag name="kernel.event_subscriber"/>
    </service>
</services>
```

## Essential identifiers

- `EventSubscriberInterface`, `getSubscribedEvents()`
- `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT`, `PRODUCT_WRITTEN_EVENT`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent`, `EntityWrittenEvent`
- `Shopware\Core\Defaults::LIVE_VERSION`
- Tag `kernel.event_subscriber`

## Gotchas

Some entities (orders, products) are versioned, meaning some events dispatch multiple times for different versions of the same entity; check `$event->getContext()->getVersionId() !== Defaults::LIVE_VERSION` to skip non-live versions.
