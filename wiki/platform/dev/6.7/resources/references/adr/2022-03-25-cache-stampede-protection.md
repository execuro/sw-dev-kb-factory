---
id: platform/dev/6.7/resources/references/adr/2022-03-25-cache-stampede-protection.md
title: Cache stampede protection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-cache-stampede-protection.html
sourceHash: 316da6df6ae716f17ef144353fcfece6f6e70c99
codeCheckedAgainst: "6.7.13.0"
keywords: ["cache stampede", "stampede protection", "Symfony\\Contracts\\Cache\\CacheInterface", "CacheInterface::get", "CachedRuleLoader", "AbstractRuleLoader", "cart_rules", "TagAwareAdapterInterface", "cache miss", "cached store api routes", "performance", "adr"]
summary: "ADR: Shopware cached services use Symfony CacheInterface::get() with a callback for stampede protection instead of getItem/save; example CachedRuleLoader."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-03-25). Cache stampede protection prevents many concurrent requests from all recomputing an expired or invalidated cache entry (e.g. a category listing) and overloading the database. Shopware switched its cached services to `\Symfony\Contracts\Cache\CacheInterface`, whose callback-based `get()` provides this protection; it is mainly used in the cached Store API routes and makes the code shorter.

## When to use

When writing or decorating a caching service (a `Cached*` decorator) in core or a plugin, or when wondering why such services no longer log cache hits/misses.

## Key steps / config

Pattern: inject `Symfony\Contracts\Cache\CacheInterface` and wrap the expensive call in `$cache->get($key, $callback)` instead of `getItem()`/`isHit()`/`set()`/`save()` on a `Symfony\Component\Cache\Adapter\TagAwareAdapterInterface`.

The installed `Shopware\Core\Checkout\Cart\CachedRuleLoader` follows it; a decorator of `AbstractRuleLoader` must declare both `getDecorated()` and `load()`:

```php
class CachedRuleLoader extends AbstractRuleLoader
{
    final public const CACHE_KEY = 'cart_rules';

    public function __construct(private readonly AbstractRuleLoader $decorated, private readonly CacheInterface $cache) {}

    public function getDecorated(): AbstractRuleLoader { return $this->decorated; }

    public function load(Context $context): RuleCollection
    {
        return $this->cache->get(self::CACHE_KEY, fn (): RuleCollection => $this->decorated->load($context));
    }
}
```

The previous version injected a `LoggerInterface` and logged `cache-hit:`/`cache-miss:`; the new one has no logger.

## Essential identifiers

- `Symfony\Contracts\Cache\CacheInterface`
- `Shopware\Core\Checkout\Cart\CachedRuleLoader`, `CachedRuleLoader::CACHE_KEY` (`cart_rules`)
- `Shopware\Core\Checkout\Cart\AbstractRuleLoader` (`getDecorated()`, `load(Context $context): RuleCollection`)

## Gotchas

- Because the service cannot tell a hit from a miss inside `CacheInterface::get()`, hit/miss logging was removed.
- `CachedRuleLoader` is annotated `@final` and its constructor `@internal`: depend on `AbstractRuleLoader`, do not extend `CachedRuleLoader`.

## Code check (6.7.13.0)
- confirmed `CachedRuleLoader` — extends AbstractRuleLoader, annotated @final — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:14
- confirmed `CachedRuleLoader::CACHE_KEY` — value cart_rules (now final const) — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:16
- confirmed `CachedRuleLoader::load()` — uses cache->get() with callback — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:34
- confirmed `Symfony\Contracts\Cache\CacheInterface` — injected into CachedRuleLoader — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:8
- confirmed `AbstractRuleLoader::getDecorated()` — abstract, required — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:12
- confirmed `AbstractRuleLoader::load()` — abstract, required — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:14
- unverified `CacheInterface::get()` stampede behaviour — implemented in vendor/symfony, out of scope
