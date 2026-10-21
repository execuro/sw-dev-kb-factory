---
id: platform/dev/6.7/guides/hosting/performance/performance.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/performance.html
sourceHash: 71b887b22d94a4d52644fe22d1380dfce901c309
codeCheckedAgainst: "6.7.15.1"
keywords: ["performance troubleshooting", "slow dynamic product groups", "contains filter", "cache invalidation", "delay_enabled", "high memory usage", "APP_ENV", "EntityRepository", "sync api", "session deadlock", "disable_stampede_protection", "stampede protection", "file-based sessions"]
summary: "Fixes for common Shopware performance problems: slow contains filters in product streams, frequent cache invalidation, high memory, file-session deadlocks."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.7/guides/hosting/performance/performance-tweaks.md", "platform/dev/6.7/guides/hosting/performance/session.md"]
---
## What it is

A troubleshooting list of common Shopware performance problems, their causes and the recommended fixes or workarounds.

## When to use

When dynamic product groups load slowly, the HTTP cache is ineffective, memory grows constantly in imports or long jobs, or requests hang under concurrency on hosts with file-based sessions.

## Key steps / config

**Dynamic product groups slow** — a `contains` filter (especially on a custom field) produces an SQL query that cannot be optimized.
- Use OpenSearch instead of the database for searching.
- For `contains` on custom fields, create individual bool custom fields per value and filter on those.
- For `contains` on regular fields, add a manually managed [custom field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md), or use tags.

**Cache invalidated too often** — find the background process causing it: cron jobs clearing the cache, or subtler cases such as an ERP syncing products frequently, which invalidates every page referencing those products. Use delayed invalidation; it is the default since 6.7.0.0 (`shopware.cache.invalidation.delay_enabled: true`). See [Redis for delayed cache invalidation](platform/dev/6.7/guides/hosting/performance/performance-tweaks.md).

**High memory usage** (e.g. with `EntityRepository`):
1. Set `APP_ENV=prod` in `.env` — in `dev` Shopware keeps many objects for debugging.
2. For large imports, use the Sync API; its guide also covers adjusting indexing behaviour when syncing many entities.
3. Reduce logging (see the logging section of [performance tweaks](platform/dev/6.7/guides/hosting/performance/performance-tweaks.md)).
4. Profile with a tool such as blackfire.io.

**Session deadlocks with file-based sessions** — symptoms: random request timeouts under load, PHP processes stuck "waiting", issues only with concurrent requests. Cause: an ABBA lock — one process holds the session file lock and waits for the cache lock, another holds the cache (stampede-protection) lock and waits for the session lock.
- Preferred fix: [Redis for sessions](platform/dev/6.7/guides/hosting/performance/session.md).
- Workaround without Redis (6.7.7.0+):
  ```yaml
  shopware:
    cache:
      disable_stampede_protection: true
  ```

## Essential identifiers

- `shopware.cache.disable_stampede_protection` (default `false`)
- `shopware.cache.invalidation.delay_enabled` (default `true`)
- `APP_ENV=prod`
- `EntityRepository`

## Gotchas

- `disable_stampede_protection` only takes effect when file-based sessions are detected (`session.save_handler`); otherwise it is ignored.
- Disabling stampede protection can raise backend load when several requests regenerate the same expired cache entry at once — usually an acceptable trade-off versus deadlocks.

## Version notes

- 6.7.0.0: delayed cache invalidation became the default; in older versions enable it manually.
- 6.7.7.0: `disable_stampede_protection` option added.

## Code check (6.7.15.1)
- confirmed `disable_stampede_protection` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:769
- confirmed `shopware.cache.disable_stampede_protection` — passed to StampedeProtectionConfigurator — vendor/shopware/core/Framework/DependencyInjection/cache.php:81
- confirmed `isFileBasedSession()` — option only applies with file-based session handler — vendor/shopware/core/Framework/Adapter/Cache/StampedeProtectionConfigurator.php:48
- confirmed `delay_enabled` — delayed invalidation default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:777
- confirmed `EntityRepository` — DAL repository class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
