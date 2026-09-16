---
id: "platform/dev/6.6/resources/references/adr/2022-03-25-cache-stampede-protection.md"
title: "Cache stampede protection"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-cache-stampede-protection.html"
sourceHash: "316da6df6ae716f17ef144353fcfece6f6e70c99"
keywords: ["CacheInterface", "cache stampede protection", "CachedRuleLoader", "TagAwareAdapterInterface", "Symfony\\Contracts\\Cache\\CacheInterface", "cache->get", "cached store api routes", "cache hit miss", "core cache"]
summary: "ADR: services adopt Symfony's CacheInterface for stampede protection so concurrent cache misses don't all hit the database at once."
lastBuilt: "2026-09-15"
---
## What it is

This ADR documents Shopware's adoption of Symfony's cache stampede protection, so that when a cache entry expires or is invalidated under load, concurrent requests do not all fall through to the database simultaneously and overwhelm it.

## When to use

Relevant when implementing or reviewing a cached service, especially a cached store API route, and deciding how to guard cache-miss recomputation against concurrent callers.

## Key steps / config

- All services now integrate cache stampede protection via Symfony's `\Symfony\Contracts\Cache\CacheInterface`, mainly used in the cached store API routes.
- The pattern replaces manual get/isHit/set logic against a `TagAwareAdapterInterface` with a single call to `CacheInterface::get()`, passing a callback that computes the value on a miss; Symfony's cache layer handles concurrent-miss coordination internally.
- Illustrative shape of the change, using `CachedRuleLoader` (`Shopware\Core\Checkout\Cart`) as the example:
```php
class CachedRuleLoader extends AbstractRuleLoader
{
    public const CACHE_KEY = 'cart_rules';
    public function __construct(AbstractRuleLoader $decorated, CacheInterface $cache) { /* ... */ }
    public function load(Context $context): RuleCollection
    {
        return $this->cache->get(self::CACHE_KEY, function () use ($context): RuleCollection {
            return $this->decorated->load($context);
        });
    }
}
```
- The previous implementation depended on a `LoggerInterface` to log cache hits/misses; since the service no longer knows whether a call was a hit or a miss under the new `CacheInterface`-based approach, that logging was removed.

## Essential identifiers

- `\Symfony\Contracts\Cache\CacheInterface`
- `CachedRuleLoader` (`Shopware\Core\Checkout\Cart`)
- `CacheInterface::get()`

## Gotchas

Because `CacheInterface::get()` no longer exposes whether the call was a cache hit or miss to the calling service, code that previously logged hit/miss status — as `CachedRuleLoader` did via `LoggerInterface` — loses that visibility after migrating to this pattern.
