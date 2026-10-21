---
id: platform/dev/6.7/resources/references/adr/2026-06-29-administration-shared-cache-service.md
title: Use shared Administration cache service entries
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-29-administration-shared-cache-service.html
sourceHash: d81140926a2461d4a483be486e0120e446c4b76a
codeCheckedAgainst: "6.7.15.1"
keywords: ["cacheService", "userConfigService", "cacheKey", "forceReload", "invalidateCaches", "cacheService.query", "repositoryFactory", "user_config", "_info/config-me", "shared-data", "admin cache", "ttl", "custom-field-sets"]
summary: "Administration cacheService: cached user config, repository reads with cacheKey/ttl, prefix invalidation via invalidateCaches, forceReload, 100-entry limit."
lastBuilt: 2026-10-21
---
## What it is

An ADR (2026-06-29, area: administration) deciding that Administration modules share repeated reads of current-user config and stable lookup data (currencies, taxes, active languages, sales channel types, number range ids, custom field sets) through the generic `cacheService`, `userConfigService` and repository read cache options, instead of issuing the same Admin API requests on every navigation.

## When to use

- An Administration component or plugin repeatedly reads the same current-user config or stable lookup data across modules.
- After writing data that is cached under a shared key, to invalidate it.
- Deciding whether a new read should be cached at all.

## Key steps / config

Three entry points:

- Current-user config: `userConfigService.search(null)` caches the full `_info/config-me` payload once per user under `['user-config', currentUserId]`; `search([...keys])` filters that cached response. `upsert({...})` writes and invalidates `['user-config', currentUserId]`.
- Repository reads: pass a cache options object as third argument to `repository.search(...)`, `repository.searchIds(...)` or `repository.get(...)`.
- Other values: `cacheService.query({ key, ttl, fn, forceReload })`.

```javascript
await Shopware.Service('repositoryFactory').create('currency')
    .search(criteria, Shopware.Context.api, {
        cacheKey: ['shared-data', 'currencies', Shopware.Context.api.languageId ?? 'default'],
        ttl: 5 * 60 * 1000,
        // forceReload: true  -> bypass and re-store once
    });

Shopware.Service('cacheService').invalidateCaches({ cacheKey: ['shared-data', 'taxes'] });
```

Shared keys (five-minute TTL): `['shared-data', 'system-currency', systemCurrencyId, languageId]`, `['shared-data', 'currencies', languageId]`, `['shared-data', 'active-languages', languageId]`, `['shared-data', 'taxes', languageId]`, `['shared-data', 'sales-channel-types', languageId]`, `['shared-data', 'number-range-ids', technicalName]`, `['shared-data', 'default-tax-rate-id']`, `['custom-field-sets', entityName, languageId]`. Language-dependent keys include the API language id.

Updates: write through the owning repository or API service first, then call `cacheService.invalidateCaches({ cacheKey: [...] })` with the affected prefix. Invalidation is prefix-based and per namespace (invalidating taxes leaves currencies untouched). Use `forceReload: true` for one immediate fresh read; use `invalidateCaches` when later callers must reload too.

## Essential identifiers

- `cacheService` — `query()`, `invalidateCaches()`, `clear()`
- `userConfigService` — `search()`, `upsert()`
- Repository cache options: `cacheKey`, `ttl`, `forceReload`

## Gotchas

- Not cached: detail pages and listings, cross-user `user_config` access (use the `user_config` repository), `numberRangeService.reserve(...)` results, and arbitrary repository queries without a deliberate `cacheKey`.
- Cached values are shared and must be treated as read-only; clone a collection before adding, removing or reordering entries (as `sw-entity-single-select` does for its reset option). The service does not deep-clone.
- Expired TTL entries are dropped when the next query runs. At most 100 entries are kept; the oldest settled entry is evicted first, pending requests are kept so concurrent callers share one response.
- Add a new cached read only if it is reused across modules or repeated during navigation, its key is deterministic, and it has a clear invalidation or refresh path.

## Code check (6.7.15.1)
- confirmed `CacheService::query()` — options `{ key, fn, ttl, forceReload = false }` — vendor/shopware/administration/Resources/app/administration/src/app/service/cache.service.ts:32
- confirmed `forceReload` — skips pending and fresh entries — vendor/shopware/administration/Resources/app/administration/src/app/service/cache.service.ts:38
- confirmed `CacheService::invalidateCaches()` — deletes entries whose key matches the given prefix — vendor/shopware/administration/Resources/app/administration/src/app/service/cache.service.ts:101
- confirmed `MAX_ENTRIES` — 100-entry limit, oldest settled entry evicted — vendor/shopware/administration/Resources/app/administration/src/app/service/cache.service.ts:134
- confirmed `search()` — userConfigService search caches under `['user-config', currentUserId]` and filters keys — vendor/shopware/administration/Resources/app/administration/src/core/service/api/user-config.api.service.ts:29
- confirmed `upsert()` — invalidates the `user-config` key for the current user after the PATCH — vendor/shopware/administration/Resources/app/administration/src/core/service/api/user-config.api.service.ts:76
- confirmed `cacheKey` — repository cache options type — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:18
- confirmed `getCustomFieldSets` — custom field sets read through cacheService with forceReload — vendor/shopware/administration/Resources/app/administration/src/app/service/custom-field.service.js:166
- unverified `shared-data` — individual shared-data keys and their five-minute TTL not checked per caller
