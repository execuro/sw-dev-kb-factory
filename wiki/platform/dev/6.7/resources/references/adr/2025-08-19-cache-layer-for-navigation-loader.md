---
id: platform/dev/6.7/resources/references/adr/2025-08-19-cache-layer-for-navigation-loader.md
title: Cache layer for navigation loader
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-08-19-cache-layer-for-navigation-loader.html
sourceHash: 9902e0f00f73ebf15867b72f9546ac63b23c14f9
codeCheckedAgainst: "6.7.15.1"
keywords: ["navigation loader", "category tree cache", "CachedDefaultCategoryLevelLoader", "DefaultCategoryLevelLoaderInterface", "CategoryLevelLoaderCacheKeyEvent", "CacheValueCompressor", "category_level_loader", "main navigation", "sidebar navigation", "esi", "storefront performance", "cache key"]
summary: "ADR: main-navigation category tree cached per sales channel, language, root and depth; key adjustable via CategoryLevelLoaderCacheKeyEvent."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (area: framework & discovery, 2025-08-19) adding a cache layer to the storefront navigation loader. Performance analyses showed that loading the category tree — DB query time plus hydrating entities into PHP objects — is a bottleneck, especially with many categories in the first tree levels. The loader runs for every header and every listing page that uses the sidebar navigation CMS element, yet the main-navigation data is identical per sales channel up to its configured depth. Twig rendering cost for nested categories is out of scope.

## When to use

- Diagnosing slow storefront headers or listing pages with large category trees.
- Writing a plugin that dynamically changes which categories are loaded or shown, and therefore must vary or disable the navigation cache.
- Deciding between ESI and this cache: ESI needs a reverse proxy that supports it and disabled response compression on the webserver, and it does not help listing pages using the sidebar navigation element. The cache is complementary to ESI.

## Key steps / config

- Only the category tree of the sales channel's main navigation is cached (when the requested root equals the sales channel's `navigationCategoryId`), up to the depth configured in the sales channel. Other roots go straight to the inner loader.
- Categories are stored as PHP-serialized objects (saving query and hydration time), compressed with `CacheValueCompressor` before storage.
- Categories below the configured depth (e.g. the active category is deeper) are loaded per request and merged with the cached default categories.
- Invalidation is immediate on category write/delete (`CategoryEvents::CATEGORY_WRITTEN_EVENT`, `CATEGORY_DELETED_EVENT`) via the cache tag `category_level_loader`, so behaviour matches the uncached loader even with HTTP cache disabled.
- Cache key parts: `rootId`, `depth`, `salesChannelId`, `languageId`. Plugins listen to `CategoryLevelLoaderCacheKeyEvent` to change them:

```php
public function onCacheKey(CategoryLevelLoaderCacheKeyEvent $event): void
{
    $event->addPart('myFlag', $value);   // vary the key
    // $event->disableCaching();         // or bypass the cache
}
```

## Essential identifiers

- `Shopware\Core\Content\Category\Service\CachedDefaultCategoryLevelLoader` (`@internal`, decorates `DefaultCategoryLevelLoaderInterface`)
- `Shopware\Core\Content\Category\Event\CategoryLevelLoaderCacheKeyEvent` (`getParts()`, `setParts()`, `addPart()`, `removePart()`, `disableCaching()`, `shouldCache()`)
- `Shopware\Core\Framework\Adapter\Cache\CacheValueCompressor`
- Cache tag `category_level_loader`

## Gotchas

- Because entries are PHP-serialized objects, a change in object structure means a new platform version — the cache must be cleared on update anyway.
- Compression shrinks entries but adds processing time on read and write.
- A plugin that influences category loading without touching the cache key will be served stale, shared trees.
- The ADR names `CacheCompressor`; the installed loader uses `CacheValueCompressor` (both classes exist).

## Code check (6.7.15.1)
- confirmed `CachedDefaultCategoryLevelLoader` — caching decorator of the level loader — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:22
- confirmed `category_level_loader` — cache tag — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:24
- confirmed `CategoryEvents::CATEGORY_WRITTEN_EVENT` — triggers immediate invalidation — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:39
- confirmed `getNavigationCategoryId` — only main navigation root is cached — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:51
- corrected `CacheValueCompressor::compress()` — docs: CacheCompressor — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:91
- confirmed `salesChannelId` — key parts rootId, depth, salesChannelId, languageId — vendor/shopware/core/Content/Category/Service/CachedDefaultCategoryLevelLoader.php:113
- confirmed `CategoryLevelLoaderCacheKeyEvent` — plugin hook for the cache key — vendor/shopware/core/Content/Category/Event/CategoryLevelLoaderCacheKeyEvent.php:13
- confirmed `CategoryLevelLoaderCacheKeyEvent::addPart()` — adds a key part — vendor/shopware/core/Content/Category/Event/CategoryLevelLoaderCacheKeyEvent.php:55
- confirmed `CategoryLevelLoaderCacheKeyEvent::disableCaching()` — bypasses cache — vendor/shopware/core/Content/Category/Event/CategoryLevelLoaderCacheKeyEvent.php:65
- confirmed `CacheCompressor` — class exists, used elsewhere — vendor/shopware/core/Framework/Script/Execution/ScriptLoader.php:7
