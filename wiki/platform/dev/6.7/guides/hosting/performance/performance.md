---
id: platform/dev/6.7/guides/hosting/performance/performance.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/performance.html
sourceHash: 8d58c439185ff76688e0b9c0296c5d421fe3a78b
codeCheckedAgainst: "6.7.13.0"
keywords: ["performance troubleshooting", "dynamic product groups", "cache invalidation", "delayed cache invalidation", "memory usage", "APP_ENV", "EntityRepository", "indexing-behavior", "sync api", "session deadlock", "shopware.cache.disable_stampede_protection", "stampede protection"]
summary: "Fixes for slow dynamic product groups, frequent cache invalidation, high memory usage and file-session deadlocks via disable_stampede_protection."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/performance/performance-tweaks.md", "platform/dev/6.7/guides/hosting/performance/session.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md"]
---
## What it is

A troubleshooting list of common Shopware 6 performance problems — slow dynamic product groups, over-frequent cache invalidation, high memory usage, and session deadlocks with file-based sessions — with the recommended remedy for each.

## When to use

When a shop shows slow product-stream loading, poor cache hit rates, steadily rising memory in API/CLI processes, or random request timeouts under concurrent load on hosting with file-based PHP sessions.

## Key steps / config

**Dynamic product groups are slow**
- A `contains` filter (especially on a custom field) produces SQL that cannot be optimized.
- Use OpenSearch for searching instead of the database, or
- for custom fields, create individual bool custom fields per value and filter on those, or
- for regular fields, add a [custom field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md) you manage manually, or use tags.

**Cache is invalidated too often**
- Find the background process causing it: cron jobs clearing the cache, or an ERP syncing products frequently (invalidates every page referencing those products).
- Use delayed cache invalidation instead of immediate clearing; it is the default from 6.7.0.0 (`shopware.cache.invalidation.delay_enabled: true`). See [performance tweaks](platform/dev/6.7/guides/hosting/performance/performance-tweaks.md).

**High memory usage** (e.g. with `EntityRepository` or bulk APIs)
1. Set `APP_ENV=prod` in `.env`; with `dev`, Shopware keeps many objects for debugging.
2. If it persists, check use of the sync API and set the `indexing-behavior` header to suit bulk syncs.
3. Check logging configuration (logging section of the performance tweaks page).
4. Profile with a tool such as blackfire.io.

**Session deadlocks with file-based sessions**
- Cause: one process holds the session file lock and waits for the cache lock, another holds the cache (stampede-protection) lock and waits for the session lock.
- Symptoms: random timeouts under load, PHP processes stuck waiting, only under concurrent requests.
- Preferred fix: [Redis for sessions](platform/dev/6.7/guides/hosting/performance/session.md).
- Without Redis (available since 6.7.7.0):

```yaml
shopware:
  cache:
    disable_stampede_protection: true
```

## Essential identifiers

- `shopware.cache.disable_stampede_protection` (default `false`)
- `shopware.cache.invalidation.delay_enabled`
- `APP_ENV`
- `EntityRepository`
- `indexing-behavior` (sync API header)

## Gotchas

- `disable_stampede_protection` only acts when PHP `session.save_handler` is `files`; with other handlers it is a no-op. In code, it clears Symfony's `LockRegistry` files.
- Disabling stampede protection can raise backend load when several requests regenerate the same expired cache entry at once; the source considers this acceptable versus deadlocks for most shops.

## Version notes

- Delayed cache invalidation became the default in 6.7.0.0; older versions must enable it explicitly.
- `shopware.cache.disable_stampede_protection` exists since 6.7.7.0.

## Code check (6.7.13.0)
- confirmed `shopware.cache.disable_stampede_protection` — boolean node, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:733
- confirmed `cache.disable_stampede_protection` — shipped default false — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:627
- confirmed `StampedeProtectionConfigurator::apply()` — no-op unless enabled and session handler is files — vendor/shopware/core/Framework/Adapter/Cache/StampedeProtectionConfigurator.php:38
- confirmed `StampedeProtectionConfigurator::isFileBasedSession()` — checks session.save_handler === 'files' — vendor/shopware/core/Framework/Adapter/Cache/StampedeProtectionConfigurator.php:55
- confirmed `cache.invalidation.delay_enabled` — default true — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:631
- confirmed `EntityRepository` — DAL repository class exists — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:36
- confirmed `PlatformRequest::HEADER_INDEXING_BEHAVIOR` — header name 'indexing-behavior' — vendor/shopware/core/PlatformRequest.php:29
- unverified `APP_ENV` — project .env setting, outside the checked vendor roots
