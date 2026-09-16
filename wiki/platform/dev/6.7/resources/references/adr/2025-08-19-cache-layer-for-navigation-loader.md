---
id: platform/dev/6.7/resources/references/adr/2025-08-19-cache-layer-for-navigation-loader.md
title: Cache layer for navigation loader
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-08-19-cache-layer-for-navigation-loader.html
sourceHash: 9902e0f00f73ebf15867b72f9546ac63b23c14f9
codeCheckedAgainst: "6.7.13.0"
keywords: ["navigation loader", "NavigationLoader", "CategoryLevelLoaderCacheKeyEvent", "CachedDefaultCategoryLevelLoader", "CacheValueCompressor", "CacheCompressor", "category tree cache", "main navigation", "cache key", "cache invalidation", "esi", "storefront performance", "adr"]
summary: "ADR: main-navigation category tree per sales channel/language/depth is cached as compressed serialized PHP objects; plugins adjust the key via an event."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-08-19) introducing a cache layer for the storefront navigation loader. The category tree of each sales channel's main navigation, loaded up to the depth configured in the sales channel, is stored as PHP-serialized, compressed objects so both the DB query and entity hydration are skipped. Twig rendering cost of nested categories is out of scope.

## When to use

- Diagnosing storefront header / listing page performance with many top-level categories.
- Writing a plugin that dynamically changes which categories are loaded or shown and therefore must vary (or disable) the navigation cache.
- Deciding between this cache and ESI for header/footer: ESI caches rendered HTML but needs an ESI-capable reverse proxy and uncompressed responses, and does not help the sidebar navigation CMS element on listing pages. The two are complementary.

## Key steps / config

How the installed code implements the decision:

1. `Shopware\Core\Content\Category\Service\CachedDefaultCategoryLevelLoader` decorates `Shopware\Core\Content\Category\Service\DefaultCategoryLevelLoader` (service definition in `category.xml`, using the `cache.object` pool).
2. Only calls whose `rootId` equals the sales channel's navigation category id are cached; other roots go straight to the inner loader. Categories below the configured depth (e.g. the active category) are loaded per request and merged.
3. Cache key parts: `rootId`, `depth`, `salesChannelId`, `languageId`; hashed after dispatching `CategoryLevelLoaderCacheKeyEvent`.
4. Values are compressed with `CacheValueCompressor::compress()` and tagged `category_level_loader`.
5. The tag is invalidated immediately on category written and category deleted events, so behaviour matches the uncached state even with HTTP cache disabled.

Plugin subscriber sketch for the event:

```php
public function onKey(CategoryLevelLoaderCacheKeyEvent $event): void
{
    $event->addPart('myFlag', $value);   // vary the key
    // or: $event->disableCaching();     // bypass cache for this request
}
```

## Essential identifiers

- `Shopware\Core\Content\Category\Event\CategoryLevelLoaderCacheKeyEvent` — `getParts()`, `setParts()`, `addPart()`, `removePart()`, `disableCaching()`, `shouldCache()`; readonly `rootId`, `depth`, `context`, `criteria`
- `Shopware\Core\Content\Category\Service\CachedDefaultCategoryLevelLoader`
- `Shopware\Core\Content\Category\Service\NavigationLoader`
- `Shopware\Core\Framework\Adapter\Cache\CacheValueCompressor`

## Gotchas

- Serialized PHP objects are cached; the ADR relies on cache clearing after a platform update when object structure changes.
- The ADR names `CacheCompressor`; the installed loader calls `CacheValueCompressor` directly (`CacheCompressor` is a CacheItem wrapper around it).
- Compression reduces entry size but adds CPU time on read and write.
- A plugin that alters visible categories without touching the key parts will serve stale/shared trees.

## Code check (6.7.13.0)
- confirmed `CategoryLevelLoaderCacheKeyEvent` — event class with parts and caching toggle — vendor/shopware/core/Content/Category/Event/CategoryLevelLoaderCacheKeyEvent.php:13
- confirmed `CategoryLevelLoaderCacheKeyEvent::disableCaching()` — lets listeners skip the cache — vendor/shopware/core/Content/Category/Event/CategoryLevelLoaderCacheKeyEvent.php:65
- confirmed `CachedDefaultCategoryLevelLoader` — the cache layer implementation — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:22
- confirmed `CachedDefaultCategoryLevelLoader::invalidateCache()` — bound to category written/deleted events — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:39
- confirmed `category_level_loader` — cache tag used for invalidation — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:24
- confirmed `salesChannelId` — cache key parts are rootId, depth, salesChannelId, languageId — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:105
- corrected `CacheValueCompressor::compress()` — docs: uses `CacheCompressor` — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:87
- confirmed `CacheCompressor` — exists as CacheItem wrapper, not used by the loader — vendor/shopware/core/Framework/Adapter/Cache/CacheCompressor.php:12
- confirmed `NavigationLoader` — storefront navigation loader service — vendor/shopware/core/Content/Category/Service/NavigationLoader.php:20
- confirmed `cache.object` — cache pool injected into the decorator — vendor/shopware/core/Content/DependencyInjection/category.xml:43
