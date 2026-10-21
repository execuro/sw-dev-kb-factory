---
id: platform/dev/6.7/resources/guidelines/code/core/http-cache-and-assets.md
title: HTTP cache and assets
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/http-cache-and-assets.html
sourceHash: 09978c7b3e04c426eb0c79c041b80d13a43494b1
codeCheckedAgainst: "6.7.15.1"
keywords: ["http cache", "CacheStore", "HttpCacheKeyGenerator", "ReverseProxyCache", "UnusedThemeDirectoryDeleter", "DeleteThemeFilesTask", "CacheInvalidator::invalidate()", "CacheTagCollector::addTag()", "CACHE_REWORK", "cache tags", "cache invalidation", "theme asset cleanup", "grace period"]
summary: "Core guideline: keep assets referenced by cached pages alive, delete them async after a grace period, invalidate tags, change caching via policies."
lastBuilt: 2026-10-21
---
## What it is

A core coding guideline (mirrored from the Shopware repository's `coding-guidelines/core/http-cache-and-assets.md`) about files and cache entries that cached responses depend on. Principle: a cached page is a promise that every URL in it still works.

## When to use

When writing core or extension code that deletes or replaces theme files, media or thumbnails, writes data that changes cached output, adds new cached output, changes cache headers, or builds cache keys and tags.

## Key steps / config

1. **Treat referenced assets as in use.** Storefront HTML is cached by the HTTP cache (`CacheStore`, keyed by `HttpCacheKeyGenerator`), by reverse proxies (`ReverseProxyCache` with the Varnish and Fastly gateways), by CDNs and by browsers. That HTML keeps pointing at theme CSS/JS under `theme/<hash>/`, media files and thumbnails. Every file a cached response can reference counts as in use, even when the database no longer points at it — core cannot know how long a CDN or browser keeps a page. Example: `ThemeCompiler` writes each compilation into a new seeded directory (`SeedingThemePathBuilder::generateNewPath()`), so the old directory stays reachable.
2. **Start grace periods at the reference change**, not at file creation/modification time. `UnusedThemeDirectoryDeleter` writes a `.retired` marker once a directory is unused and untouched for 24 hours, and deletes it 24 hours after the marker.
3. **Keep cleanup asynchronous.** Delete referenced assets only from a scheduled task or message handler (`DeleteThemeFilesTask`, `DeleteThemeFilesTaskHandler`) — never from a command, request or compile step, which runs right after the reference change.
4. **Invalidate what you change.** Every write that changes cached output invalidates that output's tags via `CacheInvalidator::invalidate()`; every new cached output registers its tags via `CacheTagCollector::addTag()`. With delayed invalidation, `InvalidateCacheTaskHandler` purges stored tags later (expected). In-memory caches/registries in long-running workers are reset on configuration or app changes (`SystemConfigChangedEvent`, app activate, deactivate, uninstall, delete).
5. **Change caching through its policy.** Cache policies plus the operator's configuration decide cache headers (see the ADR "improved HTTP cache layer", section "configurable caching policies"). Do not add listeners that switch caching off or rewrite cache headers for groups of requests, and do not disable caching for logged-in customers as a fix. Keep personal data off cacheable responses.
6. **Cache keys contain every input, tags stay few.** A key must include every input that changes the value (a new `Criteria` property, app state, the scope); a missing input serves one caller's result to another. One tag per entity of a subtree, or one more `Vary` variant, splits the cache until it barely hits.

## Essential identifiers

- `CacheStore`, `HttpCacheKeyGenerator`, `ReverseProxyCache`
- `ThemeCompiler`, `SeedingThemePathBuilder::generateNewPath()`
- `UnusedThemeDirectoryDeleter`, `.retired` marker
- `DeleteThemeFilesTask`, `DeleteThemeFilesTaskHandler`
- `CacheInvalidator::invalidate()`, `CacheTagCollector::addTag()`, `InvalidateCacheTaskHandler`
- `SystemConfigChangedEvent`, `CacheInvalidationSubscriber`

## Gotchas

- Measuring the grace window from folder modification time once deleted folders minutes after a recompile; cached pages loaded 404s.
- Calling the directory deleter from `theme:compile` and `theme:change` made the extension store lose its CSS and JS in production.
- `CacheInvalidationSubscriber` once missed the category route tag on slot config changes (shoppers saw the old page); a layout preset cache was not invalidated on app deactivation.
- Past key/tag bugs: a criteria hash omitting excluded fields; a registry key omitting database-backed app state (stale data in workers); one listing-cache tag per subtree category.

## Version notes

With `CACHE_REWORK` (default from 6.8) pages for logged-in customers and filled carts are cached too. In 6.7.15.1 the flag is toggleable and defaults to `false`.

## Code check (6.7.15.1)
- confirmed `CacheStore` — HTTP cache store implementing StoreInterface — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheStore.php:28
- confirmed `HttpCacheKeyGenerator` — HTTP cache key generator class — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:21
- confirmed `ReverseProxyCache` — reverse proxy store — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/ReverseProxyCache.php:21
- confirmed `SeedingThemePathBuilder::generateNewPath()` — seeded theme path builder — vendor/shopware/storefront/Theme/SeedingThemePathBuilder.php:38
- confirmed `UnusedThemeDirectoryDeleter` — `.retired` marker, `GRACE_PERIOD_HOURS = 24` — vendor/shopware/storefront/Theme/UnusedThemeDirectoryDeleter.php:25
- confirmed `DeleteThemeFilesTaskHandler` — scheduled handler calling the directory deleter — vendor/shopware/storefront/Theme/ScheduledTask/DeleteThemeFilesTaskHandler.php:19
- confirmed `CacheInvalidator::invalidate()` — takes array of tags plus `$force` — vendor/shopware/core/Framework/Adapter/Cache/CacheInvalidator.php:54
- confirmed `CacheTagCollector::addTag()` — variadic string tags for current request — vendor/shopware/core/Framework/Adapter/Cache/CacheTagCollector.php:60
- confirmed `InvalidateCacheTaskHandler` — scheduled task handler for delayed invalidation — vendor/shopware/core/Framework/Adapter/Cache/InvalidateCacheTaskHandler.php:16
- confirmed `CACHE_REWORK` — feature flag read via Feature::isActive, default false in 6.7 — vendor/shopware/core/Framework/Adapter/Cache/CacheInvalidationSubscriber.php:384
