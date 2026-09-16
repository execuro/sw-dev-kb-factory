# `dev-59` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-59` · `dev` · `Hosting & ops` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** After upgrading to Shopware 6.7 my Varnish cache is never invalidated — what changed in the reverse proxy configuration?

**Expected answer — every fact an answer must contain:**

1. The Redis/LUA-based BAN integration is gone in 6.7: `RedisReverseProxyGateway` no longer exists, `VarnishReverseProxyGateway` is now the default gateway class (the compiler pass only switches away for Fastly), and every tag invalidation is sent as an HTTP `PURGE` carrying an `xkey` header — `BAN` is used only by `banAll()`. The VCL must therefore handle `PURGE` with `req.http.xkey`, which needs the xkey vmod (Varnish 6.0+, not part of a default Varnish install). `[code: Framework/DependencyInjection/cache.xml:233-238]` `[code: Framework/Adapter/Cache/ReverseProxy/ReverseProxyCompilerPass.php:13-32]` `[code: Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:50-56,81-84,115-123]`
2. Configuration lives under `shopware.http_cache.reverse_proxy` (moved from `storefront.reverse_proxy` in 6.6.0.0) and only `enabled: true` plus `hosts` and `max_parallel_invalidations` still do anything — `use_varnish_xkey`, `ban_method`, `ban_headers` and the whole `purge_all` block are accepted but deprecated no-ops slated for removal in 6.8.0. The shipped default is `enabled: false`; setting it to `true` is what aliases `CacheStore` to `ReverseProxyCache`. `[code: Framework/DependencyInjection/Configuration.php:1378-1412]` `[code: Framework/Resources/config/packages/shopware.yaml:9-16]`
3. Invalidation is delayed by default in 6.7 (`shopware.cache.invalidation.delay_enabled` defaults to `true`): tags are only written to the invalidator storage and the actual PURGE is issued by `CacheInvalidator::invalidateExpired()`, which the `shopware.invalidate_cache` scheduled task runs every 5 minutes — with no scheduled-task worker, Varnish is never purged. An immediate purge can be forced with the `sw-force-cache-invalidate: 1` request header, and `cache:clear` no longer touches the reverse proxy at all (`ReverseProxyCacheClearer` was removed); use `cache:clear:http` or `cache:clear:all`. `[code: Framework/Adapter/Cache/CacheInvalidator.php:62-81,87-106,149-152]` `[code: Framework/Adapter/Cache/InvalidateCacheTask.php:12-21]` `[code: Framework/Adapter/Cache/CacheClearer.php:49-55,165-173]`

**Trap:** The 6.5-era `storefront.reverse_proxy` / Redis-BAN config and the `use_varnish_xkey: true` + `ban_method: "BAN"` block that the docs still show as the primary example are no longer effective in 6.7; combined with default-on delayed invalidation and purge errors that are only logged (`Error while flushing varnish cache`, critical), a reused config produces a cache that silently never invalidates.

**Official reference URL:** https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Default gateway is Varnish; the pass only switches to Fastly | `Framework/DependencyInjection/cache.xml:233-238`; `Framework/Adapter/Cache/ReverseProxy/ReverseProxyCompilerPass.php:13-32` | `<service id="…AbstractReverseProxyGateway" class="…VarnishReverseProxyGateway">` / `if ($container->getParameter('shopware.http_cache.reverse_proxy.fastly.enabled')) { … }` |
| In 6.6 the default was `RedisReverseProxyGateway`, with Varnish aliased in only when `use_varnish_xkey` was true | `github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/DependencyInjection/cache.xml#L256-L268` | `} elseif ($container->getParameter('shopware.http_cache.reverse_proxy.use_varnish_xkey')) { … }` |
| Tag invalidation is `PURGE` + `xkey` header; responses are tagged via the `xkey` response header; `BAN` only in `banAll()` | `Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:50-56,81-84,115-123` | `$list[] = new Request('PURGE', $host, ['xkey' => implode(' ', $part)]);` |
| `use_varnish_xkey`, `ban_method`, `ban_headers`, `purge_all` are deprecated no-ops | `Framework/DependencyInjection/Configuration.php:1378-1412` | `->setDeprecated('shopware/core', '6.8.0', 'The "%node%" option has no effect anymore and therefore will be removed in 6.8.0.')` |
| Shipped default `reverse_proxy.enabled: false`; enabling aliases `CacheStore` to `ReverseProxyCache` | `Framework/Resources/config/packages/shopware.yaml:9-16`; `ReverseProxyCompilerPass.php:15-27` | `$container->setAlias(CacheStore::class, ReverseProxyCache::class);` |
| Delayed invalidation on by default; tags stored instead of purged | `Framework/DependencyInjection/Configuration.php:739-743`; `Framework/Adapter/Cache/CacheInvalidator.php:62-81` | `->booleanNode('delay_enabled')->defaultTrue()` / `if (!$shouldPurge) { $this->cache->store($tags); return; }` |
| `shopware.invalidate_cache` scheduled task, default 5-minute interval, drains the queue | `Framework/Adapter/Cache/InvalidateCacheTask.php:12-21`; `InvalidateCacheTaskHandler.php:26-32` | `// Run every five minutes` / `$this->cacheInvalidator->invalidateExpired();` |
| `invalidateExpired()` flushes the gateway immediately | `Framework/Adapter/Cache/CacheInvalidator.php:87-106` | `$this->reverseProxyGateway?->flush();` |
| `sw-force-cache-invalidate: 1` forces an immediate purge | `PlatformRequest.php:32`; `CacheInvalidator.php:149-152` | `HEADER_FORCE_CACHE_INVALIDATE = 'sw-force-cache-invalidate'` |
| `cache:clear:http` bans all; `cache:clear:all` bans all when the reverse proxy is enabled | `Framework/Adapter/Command/CacheClearHttpCommand.php:14,26-35`; `Framework/Adapter/Cache/CacheClearer.php:49-55,165-173` | `$this->reverseProxyCache?->banAll();` |
| Purge failures are swallowed and only logged | `Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:68-72` | `$this->logger->critical('Error while flushing varnish cache', …)` |
| Tags are batched at 50 per PURGE request | `Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:23,89-98` | `private const MAX_TAG_INVALIDATION = 50;` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `RedisReverseProxyGateway` still exists in 6.7 | absent | The 6.7 `ReverseProxy/` directory holds only Abstract/Fastly/Varnish gateways, `ReverseProxyCache`, the compiler pass and the exception; 6.6.10.0 additionally had `RedisReverseProxyGateway.php` |
| `ReverseProxyCacheClearer` still hooks the reverse proxy into `cache:clear` | absent | `grep -rn ReverseProxyCacheClearer vendor/shopware/core` → 0 hits; in 6.6 it carried `<tag name="kernel.cache_clearer"/>` and `@deprecated tag:v6.7.0 - Remove` |
| `use_varnish_xkey: true` is still required/effective for xkey invalidation | absent | Node exists only as a deprecated no-op; the 6.7 compiler pass never reads it; grep finds it only in `Configuration.php` |
| `soft_purge` applies to the Varnish gateway | absent | `shopware.http_cache.soft_purge` is consumed by `CacheInvalidator`; `reverse_proxy.fastly.soft_purge` is a Fastly constructor argument; the Varnish gateway takes no soft-purge argument |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None — the dist tree strips tests; no `VarnishReverseProxyGatewayTest` was available._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Storefront changes never appearing with Varnish; maintainer answers it is expected 6.7 behaviour — wait for `shopware.invalidate_cache` or use "Refresh Cache" | 6.7.8.0 | closed | github.com/shopware/shopware/issues/15388 |
| UPGRADE-6.7.md has a dedicated "delayed cache invalidation" section; the old `shopware.cache.invalidation.delay` option was removed | 6.7.0.0 | merged | UPGRADE-6.7.md#delayed-cache-invalidation |
| Hosting vendor: Redis-as-a-dependency for Varnish dropped in 6.7 in favour of xkey | 6.6 → 6.7 | open | help.creoline.com |
| Earlier confusion caused by the cache rework and invalidation delay | 6.7 | open | github.com/shopware/shopware/issues/11420 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Default of `delay_enabled` in 6.7? | code lane | `defaultTrue()` — delayed invalidation is on by default |
| Does `invalidateExpired()` flush the reverse proxy, and on which path? | code lane | Yes — `$this->reverseProxyGateway?->flush()`, reached from the scheduled task or from a forced/undelayed invalidation |
| Interval of `shopware.invalidate_cache`? | code lane | `MINUTELY * 5` — 300 s default |
| Is a Redis-based BAN gateway still present? | code lane | No — only Abstract/Fastly/Varnish gateways remain |
| Which keys does the 6.7 `reverse_proxy` node accept, and under which namespace? | code lane | `shopware.http_cache.reverse_proxy`; `enabled`, `hosts`, `max_parallel_invalidations` effective, `use_varnish_xkey`/`ban_method`/`ban_headers`/`purge_all` deprecated no-ops |
| Which verb/header does the gateway send? | code lane | `PURGE` with an `xkey` request header; responses tagged via the `xkey` response header |
| Does delayed invalidation require Redis? | code lane (dev-58 findings) | No — the invalidation delay storage defaults to `mysql` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Redis/LUA BAN deprecated from 6.6.x, removed in v6.7.0 | "From version v6.6.x onwards, this method is deprecated and will be removed in v6.7.0." | `guides/hosting/infrastructure/reverse-http-cache.md` | yes — `RedisReverseProxyGateway` is absent in 6.7 |
| Config key moved from `storefront.reverse_proxy` to `shopware.http_cache.reverse_proxy` in 6.6.0.0 | "The configuration key changed from `storefront.reverse_proxy` … to `shopware.http_cache.reverse_proxy` starting with Shopware 6.6.0.0." | same | yes for the 6.7 namespace (the 6.6.0.0 move itself was not re-checked) |
| XKey config is `enabled` + `use_varnish_xkey: true` + `hosts` | `use_varnish_xkey: true` | same | **no** — `use_varnish_xkey` is a deprecated no-op in 6.7 |
| XKey is a separate Varnish module, Varnish 6.0+, not in a default install | "It is a module not included in the default Varnish installation. It is available for Varnish 6.0 or higher." | same | not code-checkable (external component) — admitted as context in fact 1 |
| `SHOPWARE_HTTP_CACHE_ENABLED=1` is additionally required | "Also set `SHOPWARE_HTTP_CACHE_ENABLED=1` in your `.env` file." | same | not examined by the code lane — excluded from the facts |
| `TRUSTED_PROXIES` no longer honoured since 6.6; use `SYMFONY_TRUSTED_PROXIES` | "Since Shopware 6.6, the `TRUSTED_PROXIES` environment variable is no longer taken into account out of the box." | same | not examined by the code lane — excluded from the facts |
| Reverse proxy cache shares the invalidation mechanism and tags with the object cache | "The Reverse Proxy Cache shares the same invalidation mechanism as the Object Cache and has the same tags." | same | consistent — both go through `CacheInvalidator` |
| `cache:clear` no longer clears the HTTP cache from 6.7; `cache:clear:http` since 6.6.10 | "`bin/console cache:clear:http` - Clears the reverse proxy cache if enabled" | same | yes — `ReverseProxyCacheClearer` removed, `CacheClearHttpCommand` calls `clearHttpCache()` |
| Delayed invalidation defers deletions to a scheduled task running every 5 minutes | "By default, the scheduled task will run every 5 minutes … for the entry with the name `shopware.invalidate_cache`." | `guides/hosting/performance/performance-tweaks.md` | yes |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| The primary "Configure Shopware" example on the 6.7 docs branch is still the Redis/BAN block with `ban_method: "BAN"`, shown under the deprecation warning | `ban_method` is a deprecated no-op; only `PURGE`+`xkey` is sent for tag invalidation | `Framework/DependencyInjection/Configuration.php:1378-1412`; `VarnishReverseProxyGateway.php:50-56` |
| `use_varnish_xkey: true` must be set to get xkey-based invalidation | The option has no effect; Varnish/xkey is the unconditional default gateway | `Framework/DependencyInjection/cache.xml:233-238`; `Configuration.php:1378-1381` |
| "This setup is compatible with Shopware version 6.4 and higher" on the same page that says the method is removed in 6.7.0 | Removed — the Redis gateway class is not in the 6.7 tree | `Framework/Adapter/Cache/ReverseProxy/` (dir listing) |
| A warning box still asserts "`bin/console cache:clear` will also clear the HTTP cache" | `ReverseProxyCacheClearer` is gone; `cache:clear` does not touch the reverse proxy | grep over `vendor/shopware/core` (0 hits) |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The Varnish + Redis (LUA-based BAN) integration is deprecated from 6.6.x and removed in 6.7.0 — the `XKey` Varnish module (Varnish 6.0+, not part of a default install) is required for surrogate-key purging. | rewritten | Confirmed and sharpened: code shows `RedisReverseProxyGateway` is absent, Varnish is now the unconditional default gateway, and tag invalidation is `PURGE` + `xkey` (BAN only for `banAll()`), which is the concrete VCL contract an answer must state. |
| Configuration lives in `config/packages/storefront.yaml` under `shopware.http_cache.reverse_proxy` (`enabled`, `hosts`, `ban_method: "BAN"`, `use_varnish_xkey: true`, `max_parallel_invalidations`) plus `SHOPWARE_HTTP_CACHE_ENABLED=1` in `.env`; the key moved from `storefront.reverse_proxy` in 6.6.0.0. | rewritten | Code disproves the key list: `use_varnish_xkey`, `ban_method`, `ban_headers` and `purge_all` are deprecated no-ops in 6.7 (removal 6.8.0), so naming them as required configuration is wrong. `SHOPWARE_HTTP_CACHE_ENABLED=1` was dropped — the code lane did not examine it, and the code-confirmed switch is `reverse_proxy.enabled: true`. |
| Since 6.6 `TRUSTED_PROXIES` is no longer read automatically — set `SYMFONY_TRUSTED_PROXIES` (e.g. `SYMFONY_TRUSTED_PROXIES=127.0.0.1,10.0.0.0/8` or `REMOTE_ADDR`), otherwise Symfony sees the proxy's IP as the client IP. | removed | Unconfirmed doc claim — the code lane did not examine trusted-proxy handling — and by its own wording it affects client-IP resolution, not cache invalidation, so it does not decide whether an answer to this query is usable. Replaced by the load-bearing fact the old set missed: delayed invalidation is on by default and the `shopware.invalidate_cache` scheduled task (5 min) is what actually issues the PURGE, so a shop without a scheduled-task worker never invalidates Varnish. |
