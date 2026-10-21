---
id: platform/dev/6.7/resources/references/adr/2022-03-25-cache-stampede-protection.md
title: Cache stampede protection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-cache-stampede-protection.html
sourceHash: 316da6df6ae716f17ef144353fcfece6f6e70c99
codeCheckedAgainst: "6.7.15.1"
keywords: ["cache stampede", "\\Symfony\\Contracts\\Cache\\CacheInterface", "CacheInterface", "CachedRuleLoader", "AbstractRuleLoader", "cart_rules", "CACHE_KEY", "TagAwareAdapterInterface", "cache get callback", "dog-pile effect", "cache expiry load", "adr"]
summary: "ADR: cache stampede protection via Symfony CacheInterface::get() with a callback; CachedRuleLoader example, hit/miss logging removed."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-25, area: core) on cache stampede protection: a mechanism that stops many concurrent requests from all recomputing the same cache entry once it has expired or been invalidated. Without it, if several users open a category listing that is no longer cached at the same time, all of them hit the database and the server can collapse under the load. Shopware integrated this protection into its caching services by using `\Symfony\Contracts\Cache\CacheInterface` (Symfony's built-in stampede protection, see the Symfony blog post "New in Symfony 4.2: cache stampede protection"), mainly in cached Store API routes.

## When to use

- You write or decorate a Shopware service that caches computed data and want the same stampede-safe pattern.
- You wonder why `CachedRuleLoader` logs no cache hits or misses.

## Key steps / config

Replace manual `getItem()` / `isHit()` / `set()` / `save()` handling on a `Symfony\Component\Cache\Adapter\TagAwareAdapterInterface` with a single `CacheInterface::get()` call that receives a callback computing the value on a miss. Symfony handles locking and recomputation, which also makes the code much shorter.

Installed 6.7.15.1 form of `Shopware\Core\Checkout\Cart\CachedRuleLoader` (abridged); it extends `AbstractRuleLoader` and therefore declares both `getDecorated()` and `load()`:

```php
use Symfony\Contracts\Cache\CacheInterface;

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

The "before" version of the ADR additionally injected a `Psr\Log\LoggerInterface`, logged `cache-hit: cart_rules` / `cache-miss: cart_rules`, and caught `\Throwable` when reading the item.

## Essential identifiers

- `\Symfony\Contracts\Cache\CacheInterface` (`get(key, callback)`)
- `Shopware\Core\Checkout\Cart\CachedRuleLoader`, `CachedRuleLoader::CACHE_KEY` = `'cart_rules'`
- `Shopware\Core\Checkout\Cart\AbstractRuleLoader` (`getDecorated()`, `load(Context $context): RuleCollection`)
- `Symfony\Component\Cache\Adapter\TagAwareAdapterInterface` (previous approach)

## Gotchas

- Because the service no longer knows whether `get()` was a hit or a miss, the cache-hit/miss logging was removed.
- `CachedRuleLoader` is marked `@final` in its docblock (6.7.15.1): depend on and decorate `AbstractRuleLoader` instead of extending the cached class.

## Version notes

- In 6.7.15.1 `CachedRuleLoader` uses constructor property promotion with `readonly` properties and `CACHE_KEY` is `final public const`. No `Cached*Route.php` Store API route classes ship in the installed core, so the "cached store api routes" the ADR mentions are not present in this version.

## Code check (6.7.15.1)
- confirmed `CachedRuleLoader` — extends AbstractRuleLoader, docblock @final — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:14
- confirmed `CachedRuleLoader::CACHE_KEY` — value 'cart_rules' — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:16
- confirmed `CacheInterface` — injected Symfony contracts cache — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:23
- confirmed `CachedRuleLoader::load()` — single cache get with callback to decorated loader — vendor/shopware/core/Checkout/Cart/CachedRuleLoader.php:34
- confirmed `AbstractRuleLoader::getDecorated()` — abstract member subclasses must declare — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:12
- confirmed `AbstractRuleLoader::load()` — abstract, returns RuleCollection — vendor/shopware/core/Checkout/Cart/AbstractRuleLoader.php:14
- unverified `\Symfony\Contracts\Cache\CacheInterface::get()` — stampede protection lives in vendor/symfony, out of scope
