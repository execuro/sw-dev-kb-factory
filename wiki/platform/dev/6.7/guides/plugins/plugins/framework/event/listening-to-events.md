---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
title: Listening to Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/listening-to-events.html
sourceHash: 68c6b199dceaa58b2323e89ea694d52d5cb6afd7
codeCheckedAgainst: "6.7.13.0"
keywords: ["event subscriber", "EventSubscriberInterface", "getSubscribedEvents", "kernel.event_subscriber", "services.php", "ProductEvents::PRODUCT_LOADED_EVENT", "ProductEvents::PRODUCT_WRITTEN_EVENT", "product.loaded", "EntityLoadedEvent", "EntityWrittenEvent", "Defaults::LIVE_VERSION", "event listener", "versioned entities"]
summary: Plugin event subscriber - EventSubscriberInterface class tagged kernel.event_subscriber in services.php; skip non-live versions via Defaults::LIVE_VERSION.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to react to events Shopware already dispatches (e.g. after an entity was loaded or written) from a plugin, using a Symfony event subscriber registered in the plugin's DI container.

## When to use

- Your plugin must observe or enrich something after Shopware dispatched an event (entity loaded/written, etc.).
- Not for changing existing control flow — decorate a service (or use an extension point) for that. For a single event, a plain event listener can be simpler.
- Prerequisite: an existing plugin (see `platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md`).

## Key steps / config

1. Create a class implementing `Symfony\Component\EventDispatcher\EventSubscriberInterface` in `<plugin root>/src/Subscriber/`. `getSubscribedEvents()` returns `<event name> => <method>`:

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

   `ProductEvents::PRODUCT_LOADED_EVENT` is the string `product.loaded`; `ProductEvents::PRODUCT_WRITTEN_EVENT` is `product.written` (handler receives `EntityWrittenEvent`).

2. Versioned entities (orders, products) dispatch some events once per version. React only to the live version:

```php
if ($event->getContext()->getVersionId() !== Defaults::LIVE_VERSION) {
    return;
}
```

3. Register the subscriber in `<plugin root>/src/Resources/config/services.php` with the `kernel.event_subscriber` tag:

```php
return static function (ContainerConfigurator $configurator): void {
    $services = $configurator->services();
    $services->set(MySubscriber::class)
        ->tag('kernel.event_subscriber');
};
```

   The bundle loader picks up any `Resources/config/services.*` file (PHP, XML or YAML).

## Essential identifiers

- `Symfony\Component\EventDispatcher\EventSubscriberInterface`, `getSubscribedEvents()`
- `kernel.event_subscriber` (DI tag)
- `Shopware\Core\Content\Product\ProductEvents` — `PRODUCT_LOADED_EVENT`, `PRODUCT_WRITTEN_EVENT`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent`, `EntityWrittenEvent`
- `Shopware\Core\Defaults::LIVE_VERSION`
- `src/Resources/config/services.php`

## Gotchas

- Creating the subscriber class alone does nothing: if it is not registered and tagged `kernel.event_subscriber` in `services.php`, Shopware never calls it and there may be no obvious error.
- Versioned entities fire events for draft versions too — check `getVersionId()` against `Defaults::LIVE_VERSION`.

## Code check (6.7.13.0)
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `ProductEvents::PRODUCT_WRITTEN_EVENT` — value `product.written` — vendor/shopware/core/Content/Product/ProductEvents.php:31
- confirmed `Defaults::LIVE_VERSION` — live version id constant — vendor/shopware/core/Defaults.php:20
- confirmed `EntityLoadedEvent` — DAL event class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:19
- confirmed `EntityLoadedEvent::getEntities()` — accessor exists — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:42
- confirmed `EntityWrittenEvent` — DAL event class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:18
- confirmed `Context::getVersionId()` — returns version id string — vendor/shopware/core/Framework/Context.php:136
- confirmed `services.php` — bundles load every `Resources/config/services.*` file — vendor/shopware/core/Framework/Bundle.php:1
- confirmed `kernel.event_subscriber` — tag used by Shopware's own subscriber scaffolding — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/Generator/EventSubscriberGenerator.php:26
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
