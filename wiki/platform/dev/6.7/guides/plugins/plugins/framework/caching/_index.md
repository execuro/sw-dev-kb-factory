---
id: platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md
title: Caching
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/caching/
sourceHash: 62e27575614a00f08b4859e71c2fa4f40ffa6372
codeCheckedAgainst: "6.7.13.0"
keywords: ["http cache", "cache hash", "HttpCacheCookieEvent", "HttpCacheKeyEvent", "CacheHashRequiredExtension", "ResolveCacheRelevantRuleIdsExtension", "CacheTagCollector", "CacheInvalidator", "CacheInvalidationSubscriber", "RemoveEventListener", "shopware.http_cache.cookies", "cache:clear:all", "delayed invalidation", "cache tags", "object cache"]
summary: "Plugin control of Shopware caches: cache hash/key events, cache tags, CacheInvalidator (delayed or forced), invalidation tweaks, cache clear commands."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md", "platform/dev/6.7/guides/hosting/performance/caches.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-complex-data-to-existing-entities.md"]
---
## What it is

How a plugin adjusts Shopware's multi-layer cache: the outer HTTP cache (cache hash, cache key, tags, invalidation) and the internal Symfony-based object caches (invalidation only). Routes are added to the HTTP cache per [custom controller caching](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md); layer configuration is in [caches](platform/dev/6.7/guides/hosting/performance/caches.md).

## When to use

Responses must vary by extra state (campaign parameter, customer group, cookie), custom data needs its own cache tags, or default invalidation is too aggressive for a project.

## Key steps / config

### Cache hash (context cookie)

- `Shopware\Core\Framework\Adapter\Cache\Http\Extension\CacheHashRequiredExtension` decides whether a hash is needed: subscribe to `CacheHashRequiredExtension::NAME . '.post'` and set `$extension->result = true` (e.g. if `$extension->request->query->has('campaignId')`).
- `Shopware\Core\Framework\Adapter\Cache\Event\HttpCacheCookieEvent`: default parts `rule-ids`, `version-id`, `currency-id`, `tax-state`, `logged-in` (plus `language-id` on Store API requests). Add parts with `$event->add('customer-group', ...)`; `$event->isCacheable = false` bypasses caching.
- Cookie-based parts without code:

```yaml
shopware:
    http_cache:
        cookies:
            - 'my-custom-cookie'
```

- Rule areas: `Shopware\Core\Framework\Adapter\Cache\Http\Extension\ResolveCacheRelevantRuleIdsExtension` starts with `[RuleAreas::PRODUCT_AREA]`; subscribe to `ResolveCacheRelevantRuleIdsExtension::NAME . '.pre'` and append to `$extension->ruleAreas`. Declare the area via DAL flag `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\RuleAreas`:

```php
class RuleExtension extends EntityExtension
{
    public const MY_CUSTOM_RULE_AREA = 'custom';
    public function getEntityName(): string { return RuleDefinition::ENTITY_NAME; }
    public function extendFields(FieldCollection $collection): void
    {
        $collection->add((new ManyToManyAssociationField(/* ... */))
            ->addFlags(new CascadeDelete(), new RuleAreas(self::MY_CUSTOM_RULE_AREA)));
    }
}
```

### Cache key (Symfony HTTP cache only)

`Shopware\Core\Framework\Adapter\Cache\Event\HttpCacheKeyEvent`: `$event->add('myCustomKey', $key)` or `$event->isCacheable = false`. Prefer the cache hash (reverse proxies use it too).

### Tags and invalidation

- Tag: `CacheTagCollector::addTag('my-custom-entity-' . $id)`.
- Invalidate: `CacheInvalidator::invalidate(array $tags, bool $force = false)`, e.g. in an `EntityWrittenContainerEvent` subscriber via `$event->getPrimaryKeys(...)`. Same for object caches, e.g. `CachedSystemConfigLoader::CACHE_TAG`.
- Default invalidation: `Shopware\Core\Framework\Adapter\Cache\CacheInvalidationSubscriber`, wired with `kernel.event_listener` tags (priority 2000+). In a compiler pass, `->clearTag('kernel.event_listener')` on its definition, or remove selected listeners:

```php
RemoveEventListener::remove($container, CacheInvalidationSubscriber::class, [
    [InvalidateProductCache::class, 'invalidateProduct'],
    [EntityWrittenContainerEvent::class, 'invalidateCmsPageIds'],
]);
```

### Delayed / forced invalidation, clearing

- Delayed by default; task `shopware.invalidate_cache` runs every 5 minutes. Manual: `cache:clear:delayed`, `CacheInvalidator::invalidateExpired()`, or `DELETE /api/_action/cache-delayed`; inspect with `cache:watch:delayed`.
- Immediate: `invalidate($tags, true)`, or header `sw-force-cache-invalidate: 1` on an API write.
- `cache:clear:all` = HTTP + object caches + old kernel cache dirs; `cache:clear` = object caches only; `cache:clear:http` = HTTP cache only.

## Essential identifiers

- `CacheHashRequiredExtension`, `ResolveCacheRelevantRuleIdsExtension`, `HttpCacheCookieEvent`, `HttpCacheKeyEvent`, `RuleAreas`
- `CacheTagCollector`, `CacheInvalidator`, `CacheInvalidationSubscriber`, `Shopware\Core\Framework\DependencyInjection\CompilerPass\RemoveEventListener`
- `shopware.http_cache.cookies`, `shopware.invalidate_cache`, `sw-force-cache-invalidate`

## Gotchas

- Default state (no hash) = no customer, default currency, empty cart, and no configured cache-relevant cookie set.
- Each extra part multiplies permutations and lowers hit rate. `HttpCacheKeyEvent` runs on every request (no DB queries); behind an external reverse proxy the key may be built there.
- Caches never invalidating usually means scheduled tasks are not running.
- `cache:clear` only clears the current kernel configuration's directory; CLI and web may differ. Use `cache:clear:all`.
- The docs' example removes `invalidateListings` listeners; that method does not exist in 6.7.13 — use methods from the actual `cache.xml` tags.

## Version notes

- Filtering `rule-ids` by rule area is v6.8.0.0 behaviour; in 6.7 it applies only with feature flag `v6.8.0.0`, `PERFORMANCE_TWEAKS` or `CACHE_REWORK`, otherwise all context rule IDs are used.
- The subscriber is wired in `cache.xml`, not `cache.php`, in 6.7.13.

## Code check (6.7.13.0)
- corrected `CacheInvalidationSubscriber` — docs: service defined in cache.php — vendor/shopware/core/Framework/DependencyInjection/cache.xml:117
- absent `invalidateListings` — docs' RemoveEventListener example method; not found anywhere in the code index
- corrected `HttpCacheCookieEvent::LANGUAGE_ID` — docs: five default hash parts; Store API requests also add language-id — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:110
- confirmed `getRuleIdsByAreas` — rule-area filtering only behind v6.8.0.0/PERFORMANCE_TWEAKS/CACHE_REWORK flags — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:91
- confirmed `RuleAreas::PRODUCT_AREA` — default cache-relevant area — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheRelevantRulesResolver.php:31
- confirmed `CacheHashRequiredExtension::NAME` — value cache-hash.required — vendor/shopware/core/Framework/Adapter/Cache/Http/Extension/CacheHashRequiredExtension.php:19
- confirmed `shopware.http_cache.cookies` — scalar list config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1368
- confirmed `CacheInvalidator::invalidate()` — second parameter force defaults to false — vendor/shopware/core/Framework/Adapter/Cache/CacheInvalidator.php:54
- confirmed `shopware.invalidate_cache` — scheduled task, default interval 5 minutes — vendor/shopware/core/Framework/Adapter/Cache/InvalidateCacheTask.php:14
- confirmed `RemoveEventListener::remove()` — removes event::method listener pairs from a service — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/RemoveEventListener.php:14
