---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
title: Listening to Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/listening-to-events.html
sourceHash: 68c6b199dceaa58b2323e89ea694d52d5cb6afd7
codeCheckedAgainst: "6.7.15.1"
keywords: ["EventSubscriberInterface", "getSubscribedEvents", "kernel.event_subscriber", "services.php", "ProductEvents::PRODUCT_LOADED_EVENT", "ProductEvents::PRODUCT_WRITTEN_EVENT", "EntityLoadedEvent", "EntityWrittenEvent", "Defaults::LIVE_VERSION", "event subscriber", "event listener", "react to events"]
summary: Create a Symfony EventSubscriberInterface subscriber in a plugin and register it in services.php with the kernel.event_subscriber tag.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
---
## What it is

How to react to events Shopware already dispatches (e.g. after an entity was loaded or written) with a Symfony event subscriber in a plugin. Requires a plugin from the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## When to use

Observation and enrichment of existing events. Not a replacement for service decoration when control flow must change; for a single event, an event listener can be simpler.

## Key steps / config

1. Create a class in `<plugin root>/src/Subscriber/` implementing `Symfony\Component\EventDispatcher\EventSubscriberInterface`; `getSubscribedEvents()` maps event name to method:

```php
class MySubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [ProductEvents::PRODUCT_LOADED_EVENT => 'onProductsLoaded'];
    }

    public function onProductsLoaded(EntityLoadedEvent $event) { /* $event->getEntities() */ }
}
```

   `ProductEvents::PRODUCT_LOADED_EVENT` is `product.loaded` (`Shopware\Core\Content\Product\ProductEvents`, event class `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent`).

2. Versioned entities (orders, products) dispatch events per version; react to the live version only:

```php
public function onProductWritten(EntityWrittenEvent $event)
{
    if ($event->getContext()->getVersionId() !== Defaults::LIVE_VERSION) {
        return;
    }
}
```

   (subscribed via `ProductEvents::PRODUCT_WRITTEN_EVENT`).

3. Register it in `<plugin root>/src/Resources/config/services.php` with the `kernel.event_subscriber` tag:

```php
$services->set(MySubscriber::class)
    ->tag('kernel.event_subscriber');
```

## Essential identifiers

- `EventSubscriberInterface`, `getSubscribedEvents()`
- `kernel.event_subscriber`, `src/Resources/config/services.php`
- `ProductEvents::PRODUCT_LOADED_EVENT`, `ProductEvents::PRODUCT_WRITTEN_EVENT`
- `EntityLoadedEvent`, `EntityWrittenEvent`, `Defaults::LIVE_VERSION`

## Gotchas

- The subscriber class alone does nothing: if it is missing from `services.php` or lacks the `kernel.event_subscriber` tag, it is never called and there may be no obvious error.

## Code check (6.7.15.1)
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `ProductEvents::PRODUCT_WRITTEN_EVENT` — value `product.written` — vendor/shopware/core/Content/Product/ProductEvents.php:31
- confirmed `EntityLoadedEvent::getEntities()` — returns loaded entities — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:42
- confirmed `EntityWrittenEvent` — DAL written event class — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:19
- confirmed `Defaults::LIVE_VERSION` — live version id constant — vendor/shopware/core/Defaults.php:20
- confirmed `Context::getVersionId()` — present — vendor/shopware/core/Framework/Context.php:137
- confirmed `kernel.event_subscriber` — tag used by core subscriber registrations — vendor/shopware/core/Framework/DependencyInjection/acl.php:32
- unverified `EventSubscriberInterface` — Symfony component, out of scope
