---
id: platform/dev/6.6/guides/hosting/performance/custom-cache-invalidation.md
title: Custom cache invalidation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/custom-cache-invalidation.html
sourceHash: 3dd03dec93fb9a9762dcc29caa8f5af6d4319bf6
keywords: ["cache invalidation", "CacheInvalidationSubscriber", "CacheInvalidator", "compiler pass", "RemoveEventListener", "kernel.event_listener", "cache tags", "HTTP cache", "cache pool", "ProductIndexerEvent", "ProductNoLongerAvailableEvent", "custom cache"]
summary: Explains how Shopware's multi-layer cache tag invalidation works and how to customize or disable it via compiler passes.
lastBuilt: "2026-09-15"
---
## What it is

This page documents Shopware's cache invalidation system: a multi-layer cache where individual layers build on each other and pass their tags up to the layer above for later invalidation. For example, an HTTP cache entry for a product detail page is built with all cache tags loaded or set while rendering the page.

## When to use

Consult this page when the default cache invalidation behavior is too aggressive for a project (for example, any write to a product invalidates that product's cache tags even when the changed data is not used on the rendered pages) and you need to disable or fine-tune which events trigger invalidation.

## Key steps / config

Cache tags are determined by the Shopware core when data is written via the API, and invalidated through the configured cache pool. Almost all invalidations happen in `Shopware\Core\Framework\Adapter\Cache\CacheInvalidationSubscriber`, an event listener that listens for various system events, determines the corresponding cache tags, and sends them via `Shopware\Core\Framework\Adapter\Cache\CacheInvalidator` to the cache pool for invalidation.

All events the subscriber listens on are configured through its service definition, so they can be manipulated with compiler passes. The service definition (`src/Core/Framework/DependencyInjection/cache.xml`) tags listener methods like this:

```xml
<service id="Shopware\Core\Framework\Adapter\Cache\CacheInvalidationSubscriber">
    <tag name="kernel.event_listener" event="Shopware\Core\Content\Category\Event\CategoryIndexerEvent" method="invalidateCategoryRouteByCategoryIds" priority="2000" />
</service>
```

To disable all cache invalidation in a project, remove the `kernel.event_listener` tag from the service definition via a compiler pass implementing `CompilerPassInterface`, then call `$container->getDefinition(CacheInvalidationSubscriber::class)->clearTag('kernel.event_listener')` and implement your own invalidation.

To remove only specific listeners, use `Shopware\Core\Framework\DependencyInjection\CompilerPass\RemoveEventListener::remove()`, passing the container, `CacheInvalidationSubscriber::class`, and an array of `[EventClass::class, 'method']` pairs to remove, for example `[ProductIndexerEvent::class, 'invalidateListings']` and `[ProductNoLongerAvailableEvent::class, 'invalidateListings']`.

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Cache\CacheInvalidationSubscriber`
- `Shopware\Core\Framework\Adapter\Cache\CacheInvalidator`
- `Shopware\Core\Framework\DependencyInjection\CompilerPass\RemoveEventListener`
- `kernel.event_listener` tag
- `src/Core/Framework/DependencyInjection/cache.xml`

## Gotchas

The default subscriber follows a highly precise invalidation concept: any data written to a product invalidates cache tags for that specific product, even if the data is not used on the corresponding pages. Because Shopware is a standard product with project-specific variations, this precise behavior cannot be generalized, which is why it is designed to be adjustable via compiler passes rather than hard-coded.
