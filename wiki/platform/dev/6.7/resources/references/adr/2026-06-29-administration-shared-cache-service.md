---
id: platform/dev/6.7/resources/references/adr/2026-06-29-administration-shared-cache-service.md
title: Use shared Administration cache service entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-29-administration-shared-cache-service.html
sourceHash: d81140926a2461d4a483be486e0120e446c4b76a
codeCheckedAgainst: "6.7.13.0"
keywords: ["cacheService", "userConfigService", "_info/config-me", "repositoryFactory", "cacheKey", "invalidateCaches", "forceReload", "shared-data", "user_config", "admin cache", "administration caching", "adr"]
summary: "ADR: Administration caches user config, lookup data and custom field sets via cacheService and repository cacheKey; not in installed 6.7.13.0 admin code."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2026-06-29) for the Administration: repeated current-user config and stable lookup reads (currencies, taxes, active languages, sales channel types, number range ids, default tax rate, custom field sets) are shared through a generic `cacheService`, a caching `userConfigService`, and repository read cache options. The installed Administration (core 6.7.13.0) does not contain this cache layer yet; see Code check.

## When to use

When Administration modules or plugins repeatedly read current-user config or stable lookup data and you need to know whether a cached read path exists in the installed version, and how the ADR intends callers to use and invalidate it.

## Key steps / config

What installed 6.7.13.0 provides:

1. Current-user config: `Shopware.Service('userConfigService')` is a gateway to `_info/config-me`. `search(keys)` sends a GET (`null` loads all config of the logged-in user); `upsert(data)` sends a PATCH. Neither caches.
   ```javascript
   const response = await Shopware.Service('userConfigService').search(['my-plugin.config-key']);
   const value = response?.data?.['my-plugin.config-key'];
   await Shopware.Service('userConfigService').upsert({ 'my-plugin.config-key': value });
   ```
2. Entity reads: `repository.search(criteria, context)`, `repository.searchIds(criteria, context)` and `repository.get(id, context, criteria)` take no cache-options argument; each call hits the Admin API.
3. Cross-user `user_config` access uses the `user_config` repository directly; generated values such as `numberRangeService.reserve(...)` are never cached.

ADR rules for adding a cached read: it is reused across modules or repeated during navigation, the key is deterministic, and the data has a clear invalidation or refresh path.

## Essential identifiers

- `userConfigService`, endpoint `_info/config-me`
- `UserConfigService::search()`, `UserConfigService::upsert()`
- `repositoryFactory`, `Repository::search()`, `Repository::searchIds()`, `Repository::get()`

## Gotchas

- The ADR API is missing in 6.7.13.0: no `invalidateCaches`, no `forceReload`, no `cacheService.query(...)`, and repository methods ignore a third `{ cacheKey, ttl }` argument. Code written against the ADR skips caching or fails.
- ADR design: `userConfigService.search(null)` caches the full payload under `['user-config', currentUserId]`; `upsert(...)` invalidates it. Shared keys have a five-minute TTL, e.g. `['shared-data', 'currencies', languageId]`, `['shared-data', 'taxes', languageId]`, `['shared-data', 'number-range-ids', technicalName]`, `['shared-data', 'default-tax-rate-id']`, `['custom-field-sets', entityName, languageId]`.
- ADR invalidation is prefix-based, e.g. `cacheService.invalidateCaches({ cacheKey: ['shared-data', 'taxes'] })` after a successful write; `forceReload: true` bypasses one read and re-stores it.
- ADR ownership: cached values are shared and read-only; clone before mutating (as `sw-entity-single-select` does). At most 100 entries, oldest settled entry evicted; pending requests are retained for concurrent callers.

## Version notes

The ADR cache service is not part of core 6.7.13.0. The unrelated `cacheApiService` (cache clear/indexing API) exists separately.

## Code check (6.7.13.0)
- confirmed `userConfigService` — service name set in constructor, endpoint `_info/config-me` — vendor/shopware/administration/Resources/app/administration/src/core/service/api/user-config.api.service.ts:13
- corrected `UserConfigService::search()` — docs: caches full payload per user; code issues an uncached GET each call — vendor/shopware/administration/Resources/app/administration/src/core/service/api/user-config.api.service.ts:20
- corrected `UserConfigService::upsert()` — docs: invalidates the user-config cache; code only sends PATCH — vendor/shopware/administration/Resources/app/administration/src/core/service/api/user-config.api.service.ts:40
- corrected `Repository::search()` — docs: accepts third options arg with cacheKey/ttl; signature is (criteria, context) — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:124
- corrected `Repository::searchIds()` — docs: cache options; signature is (criteria, context) — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:107
- corrected `Repository::get()` — docs: cache options; signature is (id, context, criteria) — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:142
- absent `invalidateCaches` — not found in any installed Shopware package
- absent `forceReload` — not found in any installed Shopware package
- absent `shared-data` — no cache key namespace of this name in installed code
- unverified `cacheService` — no service registered under this name in admin src; only local variables aliasing cacheApiService
