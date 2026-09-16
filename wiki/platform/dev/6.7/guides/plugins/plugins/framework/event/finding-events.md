---
id: platform/dev/6.7/guides/plugins/plugins/framework/event/finding-events.md
title: Finding Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/finding-events.html
sourceHash: 356d3958208a715de6ca60922a68f035bc9003f4
codeCheckedAgainst: "6.7.13.0"
keywords: ["find events", "ProductEvents", "EntityWrittenEvent", "ProductListingCriteriaEvent", "GenericPageLoadedEvent", "StorefrontRenderEvent", "FlowEventAware", "event_dispatcher", "{route}.request", "$emitter.publish", "$emit", "symfony profiler", "route events", "criteria events", "StorableFlow"]
summary: Where to find Shopware events - DAL entity events, dispatched PHP events, page/criteria/route/flow events, Storefront $emitter and Admin $emit events.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md"]
---
## What it is

A reference of the event types in Shopware 6 (DAL, general PHP, page loaded, criteria, route, business/flow, Storefront JS, Administration) and how to locate a suitable event to subscribe to from a plugin.

## When to use

You want to extend behaviour via a [subscriber](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md) but do not know which event is fired at the point you care about.

## Key steps / config

**DAL events** - auto-generated per entity, pattern `entity_name.event`: `product.written`, `product.deleted`, `custom_entity.written`. Some core entities have constants classes such as `ProductEvents` (`ProductEvents::PRODUCT_LOADED_EVENT` = `product.loaded`). Written listeners receive an `EntityWrittenEvent`.

```php
public static function getSubscribedEvents(): array
{
    return [
        ProductEvents::PRODUCT_LOADED_EVENT => 'onProductsLoaded',
        'custom_entity.written' => 'onCustomEntityWritten',
    ];
}
```

**General PHP events** - look for `$this->eventDispatcher->dispatch($event, $name)`. The second argument is optional; without it the event class name (`SomeEvent::class`) is the event name. Search terms in the core source: `extends NestedEvent`, `extends Event`, `implements ShopwareEvent`, `->dispatch`. Services able to fire events receive `event_dispatcher` in their [service definition](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) or an `EventDispatcherInterface` constructor argument.

**Page loaded events** - [Storefront pages](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md) dispatch a `*PageLoadedEvent`, e.g. `GenericPageLoader` dispatches `GenericPageLoadedEvent`. Search `PageLoadedEvent`.

**Criteria events** - dispatched before entities are loaded with a `Criteria`, e.g. `ResolveCriteriaProductListingRoute::load()` (route `store-api.product.listing`) dispatches `ProductListingCriteriaEvent`, letting you add/remove filters and associations. Search `CriteriaEvent`.

**Route events** - replace `{route}` with the Symfony route name:

| Event name | Scope | Event type |
|---|---|---|
| `{route}.request` | Global | `Symfony\Component\HttpKernel\Event\RequestEvent` |
| `{route}.response` | Global | `Symfony\Component\HttpKernel\Event\ResponseEvent` |
| `{route}.render` | Storefront | `Shopware\Storefront\Event\StorefrontRenderEvent` |
| `{route}.encode` | Store-API | `Symfony\Component\HttpKernel\Event\ResponseEvent` |
| `{route}.controller` | Global | `Symfony\Component\HttpKernel\Event\ControllerEvent` |

Example: `'store-api.product.listing.request' => 'onListingRequest'`.

**Business / flow events** - fired on business actions, often with a "before" variant: `CustomerBeforeLoginEvent`, `CustomerLoginEvent`. In the installed code they implement `FlowEventAware`; mail-sending ones also implement `MailAware`. Search `implements ... FlowEventAware` or `MailAware`.

**Symfony profiler** - the "Events" tab lists all events fired in the current request with their names.

**Storefront JS** - plugins publish via `this.$emitter.publish('someEvent', additionalData)`; subscribe with `this.$emitter.subscribe('someEvent', cb)`. Search `$emitter.publish` in `vendor/shopware/storefront/Resources/app/storefront/src` (see [Reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md)).

**Administration** - mostly Vue events, e.g. `this.$emit('some-event', additionalData)`; search `$emit` in the Administration `src` directory, or use the Vue.js devtools browser extension.

**Flow Builder** - event data for flows is stored in `StorableFlow`.

## Essential identifiers

- `ProductEvents`, `EntityWrittenEvent`, `NestedEvent`, `ShopwareEvent`
- `GenericPageLoadedEvent`, `ProductListingCriteriaEvent`, `StorefrontRenderEvent`
- `FlowEventAware`, `MailAware`, `StorableFlow`
- `event_dispatcher`, `{route}.request|response|render|encode|controller`
- `$emitter.publish`, `$emit`

## Gotchas

- The docs recommend searching for `@Event` to find event constant classes; the installed `ProductEvents` carries no such annotation - search for `Events.php` class names instead.
- The docs name `BusinessEventInterface` and `MailActionInterface` as search terms; neither exists in installed 6.7 code. Use `FlowEventAware` and `MailAware`.
- Criteria events are hand-written, not generated, so one may not exist for a given entity.
- The docs state `getAvailableData` "can no longer be used" for flow data (use `StorableFlow`); the method is still declared on `FlowEventAware`, so implementing classes must still provide it.
- Paths like `platform/src` or `vendor/shopware/shopware/src` from the docs refer to monorepo layouts; in a production install core code lives in `vendor/shopware/core` and `vendor/shopware/storefront`.

## Version notes

- `{route}.encode` and `{route}.controller` were introduced in 6.6.11.0.

## Code check (6.7.13.0)
- absent `BusinessEventInterface` — not found anywhere in the installed shopware code index
- absent `MailActionInterface` — not found anywhere in the installed shopware code index
- corrected `ProductEvents` — docs: find via `@Event` annotation; class has none — vendor/shopware/core/Content/Product/ProductEvents.php:15
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `EntityWrittenEvent` — extends NestedEvent implements GenericEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:18
- confirmed `ProductListingCriteriaEvent` — dispatched in ResolveCriteriaProductListingRoute::load() — vendor/shopware/core/Content/Product/SalesChannel/Listing/ResolveCriteriaProductListingRoute.php:42
- confirmed `.request` — `{route}.request`/`.response`/`.controller` dispatched by RouteEventSubscriber — vendor/shopware/core/Framework/Routing/RouteEventSubscriber.php:40
- confirmed `.encode` — `{route}.encode` dispatched by StoreApiResponseListener — vendor/shopware/core/System/SalesChannel/Api/StoreApiResponseListener.php:87
- confirmed `CustomerLoginEvent` — implements MailAware and FlowEventAware — vendor/shopware/core/Checkout/Customer/Event/CustomerLoginEvent.php:26
- confirmed `FlowEventAware::getAvailableData()` — still declared in the interface — vendor/shopware/core/Framework/Event/FlowEventAware.php:11
