---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/store-api/add-caching-for-store-api-route.md
sourceHash: dac38e70acbb6f3c38cd732a72ce70b38a5238f5
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/store-api/add-caching-for-store-api-route.html
title: Add caching for Store API route
version: "6.6"
versions:
  - "6.6"
keywords: ["store api caching", "CachedExampleRoute", "TagAwareAdapterInterface", "EntityCacheKeyGenerator", "AbstractCacheTracer", "CacheCompressor", "CacheStateSubscriber", "CacheInvalidator", "EntityWrittenContainerEvent", "cache invalidation subscriber", "cache-object"]
summary: "How to add a decorator-based cache layer and an invalidation subscriber for a custom Store API route."
lastBuilt: "2026-09-15"
---
## What it is
This guide shows how to add a cache layer to a custom Store API route by decorating it with a cached route class, plus a subscriber that invalidates the cache when relevant entities change.

## When to use
After creating a Store API route (see the "Add Store API route" guide) that would benefit from caching its response.

## Key steps / config
1. Create an abstract-decorator class (e.g. `CachedExampleRoute`) extending the route's abstract base (`AbstractExampleRoute`), injecting: `TagAwareAdapterInterface` (cache pool, `cache.object`), `EntityCacheKeyGenerator`, `AbstractCacheTracer`, and a logger.
2. In `load()`: skip caching when the context has a disqualifying state (e.g. `CacheStateSubscriber::STATE_LOGGED_IN`); otherwise fetch by a generated key, return `CacheCompressor::uncompress($item)` on a hit, else call the decorated route inside `$this->tracer->trace($name, ...)`, compress with `CacheCompressor::compress()`, tag the item with the traced tags plus `self::buildName()`, and save it.
3. Generate the cache key from a stable route name (`buildName()`), a criteria hash (`EntityCacheKeyGenerator::getCriteriaHash()`), and a context hash (`getSalesChannelContextHash()`), hashed together (e.g. `md5(Json::encode($parts))`).
4. Register the decorator in `services.xml` using `decorates`/`decoration-priority`:
```xml
<service id="Swag\BasicExample\...\CachedExampleRoute" decorates="Swag\BasicExample\...\ExampleRoute" decoration-priority="-1000">
    <argument type="service" id="Swag\BasicExample\...\CachedExampleRoute.inner"/>
    <argument type="service" id="cache.object"/>
    <argument type="service" id="Shopware\Core\Framework\DataAbstractionLayer\Cache\EntityCacheKeyGenerator"/>
    <argument type="service" id="Shopware\Core\Framework\Adapter\Cache\CacheTracer"/>
    <argument type="service" id="logger" />
</service>
```
5. Add a subscriber (e.g. `CacheInvalidationSubscriber`) on `EntityWrittenContainerEvent::class` that checks `$event->getPrimaryKeys(ExampleDefinition::ENTITY_NAME)` and, if not empty, calls `CacheInvalidator::invalidate([CachedExampleRoute::buildName()])`.

## Essential identifiers
- `Shopware\Core\Framework\Adapter\Cache\CacheStateSubscriber` (`STATE_LOGGED_IN`)
- `Symfony\Component\Cache\Adapter\TagAwareAdapterInterface`
- `Shopware\Core\Framework\DataAbstractionLayer\Cache\EntityCacheKeyGenerator`
- `Shopware\Core\Framework\Adapter\Cache\AbstractCacheTracer`, `CacheCompressor`
- `Shopware\Core\Framework\Adapter\Cache\CacheInvalidator`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenContainerEvent`
- Service id `cache.object`

## Gotchas
- Cache invalidation is harder to get right than caching itself; there is no precise, general guidance on when to invalidate what — it depends on what was cached (e.g. product routes are invalidated both on write and on stock-out via business events like `ProductNoLongerAvailableEvent`).
- Uncompressing a cache item can throw; the guide's example catches `\Throwable`, logs it, and continues to overwrite the invalid cache item.
