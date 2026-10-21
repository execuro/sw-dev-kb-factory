---
id: platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md
title: Caching
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/caching/
sourceHash: 62e27575614a00f08b4859e71c2fa4f40ffa6372
codeCheckedAgainst: "6.7.15.1"
keywords: ["HttpCacheCookieEvent", "HttpCacheKeyEvent", "CacheHashRequiredExtension", "ResolveCacheRelevantRuleIdsExtension", "CacheTagCollector", "CacheInvalidator", "CacheInvalidationSubscriber", "RemoveEventListener", "shopware.http_cache.cookies", "cache:clear:delayed", "sw-force-cache-invalidate", "cache hash", "cache tags", "cache invalidation", "http cache"]
summary: "Shopware HTTP and object cache hooks: cache hash/key events, cache tags, CacheInvalidator, delayed invalidation, cache:clear commands."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/http_cache.md", "platform/dev/6.7/guides/hosting/performance/caches.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md"]
---
## What it is

How a plugin adjusts Shopware's multi-layer cache: the outer HTTP-Cache (cache hash cookie, cache key, tags, invalidation) and the internal Symfony-based object caches, which only support invalidation by tag. Concept: [HTTP-Cache](platform/dev/6.7/concepts/framework/http_cache.md); configuration: [caches hosting guide](platform/dev/6.7/guides/hosting/performance/caches.md).

## When to use

- Responses vary by state the default cache hash ignores (campaign parameters, customer group, custom rule areas).
- A plugin renders its own data into cached pages and must tag and invalidate them.
- Core invalidation fires too often for a project.

## Key steps / config

**1. When a hash is computed.** Default: only outside the "default state" (no logged-in customer, default currency, empty cart). Subscribe to `CacheHashRequiredExtension::NAME . '.post'` and set `$extension->result = true` (e.g. if `$extension->request->query->has('campaignId')`).

**2. Hash parts.** Defaults: `rule-ids`, `version-id`, `currency-id`, `tax-state`, `logged-in` (plus `language-id` on Store API requests). Subscribe to `HttpCacheCookieEvent::class`; `$event->add('customer-group', ...)`, or `$event->isCacheable = false` to bypass the cache (e.g. filled cart). `$event->context` is the `SalesChannelContext`. The hash travels as a cookie, so reverse proxies can use it. Cookie-based parts without code:

```yaml
shopware:
    http_cache:
        cookies:
            - 'my-custom-cookie'
```

**3. Cache-relevant rule areas.** Subscribe to `ResolveCacheRelevantRuleIdsExtension::NAME . '.pre'` and append to `$extension->ruleAreas` (default `[RuleAreas::PRODUCT_AREA]`). Declare the area with the DAL flag `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\RuleAreas` on the rule association, e.g. an `EntityExtension` with `getEntityName()` returning `RuleDefinition::ENTITY_NAME` whose `extendFields()` adds a `ManyToManyAssociationField` with `->addFlags(new CascadeDelete(), new RuleAreas(self::MY_CUSTOM_RULE_AREA))` ([DAL guide](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md)).

**4. Cache key (Symfony HTTP-Cache only).** Subscribe to `HttpCacheKeyEvent::class`; `$event->add('myCustomKey', $key)` or `$event->isCacheable = false`. Prefer the hash.

**5. Tags.** Inject `CacheTagCollector`, call `addTag('my-custom-entity-' . $id)`.

**6. Invalidate.** Inject `CacheInvalidator`, call `invalidate(array $tags, bool $force = false)`, e.g. from an `EntityWrittenContainerEvent` subscriber via `$event->getPrimaryKeys(ExampleDefinition::ENTITY_NAME)`. Object caches: `invalidate([CachedSystemConfigLoader::CACHE_TAG])`.

**7. Tweak core invalidation.** `CacheInvalidationSubscriber` listens via `kernel.event_listener` tags. In a `CompilerPassInterface` either `->clearTag('kernel.event_listener')` on its definition, or:

```php
RemoveEventListener::remove($container, CacheInvalidationSubscriber::class, [
    [ProductIndexerEvent::class, 'invalidateListings'],
]);
```

**8. Delayed invalidation.** Batched by scheduled task `shopware.invalidate_cache` (default every 5 minutes). Flush with `cache:clear:delayed`, `CacheInvalidator::invalidateExpired()` or `DELETE /api/_action/cache-delayed`; watch with `cache:watch:delayed`. Immediate: `invalidate([...], true)` or header `sw-force-cache-invalidate: 1` on an Admin API request.

**9. Manual clear.** `cache:clear:all` (HTTP + object caches + kernel cache dirs), `cache:clear` (object caches only), `cache:clear:http` (HTTP-Cache only).

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Cache\Http\Extension\CacheHashRequiredExtension`
- `Shopware\Core\Framework\Adapter\Cache\Event\HttpCacheCookieEvent`
- `Shopware\Core\Framework\Adapter\Cache\Http\Extension\ResolveCacheRelevantRuleIdsExtension`
- `Shopware\Core\Framework\Adapter\Cache\Event\HttpCacheKeyEvent`
- `CacheTagCollector`, `CacheInvalidator`, `CacheInvalidationSubscriber`
- `Shopware\Core\Framework\DependencyInjection\CompilerPass\RemoveEventListener`

## Gotchas

- Each extra hash/key part multiplies permutations and lowers hit rate.
- `HttpCacheKeyEvent` runs on every request; no database queries. External reverse proxies may build the key themselves.
- If caches never invalidate, check that scheduled tasks run.
- `cache:clear` clears only the current kernel configuration's cache dir; CLI and web server may differ (e.g. plugin installed via Composer but not activated). Use `cache:clear:all`.

## Version notes

- Docs: rule-area filtering of `rule-ids` starts with v6.8.0.0. In 6.7.15.1 it is applied only when feature `v6.8.0.0`, `PERFORMANCE_TWEAKS` or `CACHE_REWORK` is active; otherwise all matched rule IDs are hashed.

## Code check (6.7.15.1)
- confirmed `CacheHashRequiredExtension::NAME` — value `cache-hash.required` — vendor/shopware/core/Framework/Adapter/Cache/Http/Extension/CacheHashRequiredExtension.php:19
- confirmed `ResolveCacheRelevantRuleIdsExtension::$ruleAreas` — public mutable list of rule areas — vendor/shopware/core/Framework/Adapter/Cache/Http/Extension/ResolveCacheRelevantRuleIdsExtension.php:38
- confirmed `RuleAreas::PRODUCT_AREA` — sole default cache-relevant area — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheRelevantRulesResolver.php:31
- corrected `HttpCacheCookieEvent::LANGUAGE_ID` — docs: five default parts; code adds `language-id` for Store API requests — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:105
- confirmed `HttpCacheKeyEvent::add()` — adds a key part; `$isCacheable` public — vendor/shopware/core/Framework/Adapter/Cache/Event/HttpCacheKeyEvent.php:57
- confirmed `CacheInvalidator::invalidate()` — `array $tags, bool $force = false` — vendor/shopware/core/Framework/Adapter/Cache/CacheInvalidator.php:54
- confirmed `InvalidateCacheTask::getTaskName()` — `shopware.invalidate_cache`, default interval 5 minutes — vendor/shopware/core/Framework/Adapter/Cache/InvalidateCacheTask.php:14
- confirmed `sw-force-cache-invalidate` — `PlatformRequest::HEADER_FORCE_CACHE_INVALIDATE` — vendor/shopware/core/PlatformRequest.php:32
- confirmed `RemoveEventListener::remove()` — static compiler-pass helper — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/RemoveEventListener.php:14
- confirmed `http_cache.cookies` — array config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1413
