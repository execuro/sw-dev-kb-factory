---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md
title: Finding Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/finding-events.html
sourceHash: 356d3958208a715de6ca60922a68f035bc9003f4
codeCheckedAgainst: "6.7.15.1"
keywords: ["ProductEvents", "EntityWrittenEvent", "GenericPageLoadedEvent", "ProductListingCriteriaEvent", "StorefrontRenderEvent", "FlowEventAware", "StorableFlow", "$emitter.publish", "$emit", "route events", "dal events", "criteria events", "symfony profiler", "find events"]
summary: "Where to find Shopware events: DAL entity events, dispatched PHP events, page-loaded/criteria/route/flow events, Storefront $emitter and Admin $emit."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md
---
## What it is

A map of the event types in Shopware 6 (PHP, Storefront JS, Administration) and the search terms/tools to discover them, so a plugin can subscribe to the right one.

## When to use

You need a hook for a core action and do not yet know which event is dispatched for it.

## Key steps / config

**DAL events** — fired whenever an entity is read, written, created or deleted; names follow `entity_name.event`, e.g. `product.written`, `product.deleted`, `custom_entity.written`. Some entities have constant classes such as `ProductEvents` (find them by searching for `@Event`). Subscribe with a constant or the raw string:

```php
return [
    ProductEvents::PRODUCT_LOADED_EVENT => 'onProductsLoaded',
    'custom_entity.written' => 'onCustomEntityWritten',
];
```

A `written` listener receives an `EntityWrittenEvent`.

**Manually dispatched PHP events** — `$this->eventDispatcher->dispatch($event, $event->getName())`. The second argument (event name) is optional; without it, the class name is the name (`SomeEvent::class => 'method'`). Search the Shopware source for:

- `extends NestedEvent`, `extends Event`, `implements ShopwareEvent` — the event classes
- `->dispatch` — the dispatch sites
- `event_dispatcher` in service definitions / `EventDispatcherInterface` in constructors — services that can fire events (see [Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md))

**Page loaded events** — Storefront page loaders dispatch a `*PageLoadedEvent`, e.g. `GenericPageLoader` dispatches `GenericPageLoadedEvent`. Search `PageLoadedEvent`.

**Criteria events** — dispatched before entities are loaded with a `Criteria`, so you can add/remove filters and associations; e.g. `ProductListingCriteriaEvent` on the `store-api.product.listing` route. Search `CriteriaEvent`.

**Route events** — fine-grained aliases per Symfony route name:

| Event name | Scope | Event type |
|---|---|---|
| `{route}.request` | Global | `Symfony\Component\HttpKernel\Event\RequestEvent` |
| `{route}.response` | Global | `Symfony\Component\HttpKernel\Event\ResponseEvent` |
| `{route}.render` | Storefront | `Shopware\Storefront\Event\StorefrontRenderEvent` (before Twig rendering) |
| `{route}.encode` | Store-API | `Symfony\Component\HttpKernel\Event\ResponseEvent` (before JSON encoding) |
| `{route}.controller` | Global | `Symfony\Component\HttpKernel\Event\ControllerEvent` |

Example: `'store-api.product.listing.request' => 'onListingRequest'`, `'store-api.product.listing.encode' => 'onListingEncode'`.

**Business / flow events** — fired around business actions, often with a "before" variant: `CustomerBeforeLoginEvent`, `CustomerLoginEvent`. Find them by searching `implements FlowEventAware` and read each event class for its data.

**Symfony profiler** — the "Events" tab lists all events fired in the current request, with names.

**Storefront JS** — plugins publish via `this.$emitter.publish('someEvent', additionalData)`; subscribe with `this.$emitter.subscribe('someEvent', (additionalData) => {})`. Search `$emitter.publish` in `src/Storefront/Resources/app/storefront/src`. See [Reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md).

**Administration** — mostly Vue events, e.g. `this.$emit('some-event', additionalData)`; search `$emit` in `src/Administration/Resources/app/administration/src`; Vue.js devtools help.

**Flow Builder** — event data is stored in `StorableFlow`.

## Essential identifiers

- `ProductEvents::PRODUCT_LOADED_EVENT`, `EntityWrittenEvent`, `NestedEvent`, `ShopwareEvent`
- `GenericPageLoadedEvent`, `ProductListingCriteriaEvent`, `StorefrontRenderEvent`
- `{route}.request` / `.response` / `.render` / `.encode` / `.controller`
- `CustomerBeforeLoginEvent`, `CustomerLoginEvent`, `FlowEventAware`, `StorableFlow`
- `$emitter.publish`, `$emitter.subscribe`, `$emit`

## Gotchas

- Criteria events are hand-written, not generated — not every entity has one.
- The source says to find business events via `implements BusinessEventInterface` or `implements MailActionInterface`; neither interface exists in 6.7. Flow-capable events implement `FlowEventAware` (mail-sending ones also `MailAware`).
- The source says `getAvailableData` "can no longer be used"; in 6.7 it is still a required static member of `FlowEventAware`, while flow actions read data from `StorableFlow`.

## Version notes

- `{route}.encode` and `{route}.controller` were introduced in 6.6.11.0.

## Code check (6.7.15.1)
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `EntityWrittenEvent` — extends NestedEvent, implements GenericEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:19
- confirmed `GenericPageLoadedEvent` — dispatched by GenericPageLoader — vendor/shopware/storefront/Page/GenericPageLoader.php:38
- confirmed `ProductListingCriteriaEvent` — dispatched in ResolveCriteriaProductListingRoute — vendor/shopware/core/Content/Product/SalesChannel/Listing/ResolveCriteriaProductListingRoute.php:42
- confirmed `.render` — StorefrontRenderEvent dispatched as route name plus `.render` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteEventSubscriber.php:32
- confirmed `.encode` — ResponseEvent dispatched as route name plus `.encode` — vendor/shopware/core/System/SalesChannel/Api/StoreApiResponseListener.php:93
- confirmed `.controller` — dispatched by RouteEventSubscriber — vendor/shopware/core/Framework/Routing/RouteEventSubscriber.php:64
- absent `BusinessEventInterface` — no definition or usage in the installed code
- absent `MailActionInterface` — no definition or usage in the installed code
- corrected `FlowEventAware::getAvailableData()` — docs: can no longer be used; still a required interface member — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
