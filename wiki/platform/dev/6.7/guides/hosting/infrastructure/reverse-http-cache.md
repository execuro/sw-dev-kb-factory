---
id: platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md
title: Reverse HTTP Cache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html
sourceHash: 74fef21d555cef31fae111ba166076c4ba0132e1
codeCheckedAgainst: "6.7.15.1"
keywords: ["reverse http cache", "varnish", "xkey", "fastly", "shopware.http_cache.reverse_proxy", "SHOPWARE_HTTP_CACHE_ENABLED", "SYMFONY_TRUSTED_PROXIES", "soft purge", "stale_while_revalidate", "cache:clear:http", "cache:clear:all", "max_parallel_invalidations", "cache invalidation"]
summary: Configuring Varnish (xkey) or Fastly as reverse HTTP cache via shopware.http_cache.reverse_proxy, soft purge, trusted proxies and cache-clear commands.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/framework/http_cache.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md"]
---
## What it is

How to put a reverse HTTP cache (Varnish with the `xkey` module, or Fastly) in front of Shopware and configure Shopware to invalidate it. The cache must distinguish requests by multiple cookies and accept web-request invalidations for a single page or `/` for all pages. Background: [HTTP cache concept](platform/dev/6.7/concepts/framework/http_cache.md).

## When to use

- Running Shopware behind Varnish or Fastly in production.
- Debugging why pages are not served from the reverse cache.
- Choosing the right cache-clear command after a deployment.

## Key steps / config

1. Varnish: install the `xkey` module (Varnish 6.0+, not in the default install) or use the `shopware/varnish-shopware` Docker image, which contains the Shopware default VCL for xkey. Replace the `__XXX__` placeholders in the VCL.
2. Enable reverse proxy mode in `config/packages/shopware.yaml`:
   ```yaml
   shopware:
     http_cache:
       reverse_proxy:
         enabled: true
         hosts:
           - 'varnish-host'
         max_parallel_invalidations: 3   # core default 2
   ```
3. Set `SHOPWARE_HTTP_CACHE_ENABLED=1` in `.env`.
4. Trusted proxies: set `SYMFONY_TRUSTED_PROXIES` (e.g. `127.0.0.1,10.0.0.0/8`, or `REMOTE_ADDR` to trust the connecting address), otherwise client IP, HTTPS, port and host are read wrongly.
5. Varnish soft purge: in the VCL replace `xkey.purge(req.http.xkey)` with `xkey.softpurge(req.http.xkey)`.
6. Fastly:
   ```yaml
   shopware:
     http_cache:
       stale_while_revalidate: 300
       stale_if_error: 3600
       reverse_proxy:
         enabled: true
         fastly:
           enabled: true
           api_key: '<personal-token-from-fastly>'
           service_id: '<service-id>'
           soft_purge: '1'
   ```
   Fastly VCL snippets can be deployed with the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md).
7. Debug: `curl -vvv -H 'Host: <sales-channel-domain>' <app-server-ip> 1> /dev/null` against the app server must show `Cache-Control: public, s-maxage=...` and an `Xkey` header; an `Age` header stuck at `0` in Varnish means nothing is cached.

## Essential identifiers

- `shopware.http_cache.reverse_proxy.enabled`, `.hosts`, `.max_parallel_invalidations`
- `shopware.http_cache.reverse_proxy.fastly.enabled`, `.api_key`, `.service_id`, `.soft_purge`
- `shopware.http_cache.stale_while_revalidate`, `shopware.http_cache.stale_if_error`
- `SHOPWARE_HTTP_CACHE_ENABLED`, `SYMFONY_TRUSTED_PROXIES`
- `bin/console cache:clear:http` — clears the reverse proxy cache if enabled, else the `http` cache pool (6.6.10+)
- `bin/console cache:clear:all` — application cache, pools, HTTP cache, kernel cache dirs (6.6.8+)
- `bin/console cache:pool:clear --all` — object cache only
- `bin/console cache:clear` — application cache (no longer clears HTTP cache from 6.7)

## Gotchas

- The reverse proxy shares tags and invalidation with the object cache: invalidating a product invalidates both.
- `ban_method` and `use_varnish_xkey` still appear in older examples (and `ban_method: "BAN"` in the core default `shopware.yaml`) but have no effect in 6.7 and are scheduled for removal in 6.8.0. Varnish-with-Redis BAN invalidation (LUA scripts, no Redis cluster support) is gone; use xkey.
- `TRUSTED_PROXIES` is not read since 6.6; only `SYMFONY_TRUSTED_PROXIES`.

## Version notes

- Config key moved from `storefront.reverse_proxy` (up to 6.5.x) to `shopware.http_cache.reverse_proxy` in 6.6.0.0.
- Fastly support since 6.4.11.0; Fastly soft purge since 6.4.15.0.
- Before 6.7, `cache:clear` also cleared the HTTP cache.

## Code check (6.7.15.1)
- deprecated `ban_method` — no effect, removed in 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1431
- deprecated `use_varnish_xkey` — no effect, removed in 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1423
- confirmed `reverse_proxy.enabled` — boolean node; core default false — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:14
- confirmed `max_parallel_invalidations` — integer, default 2 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1430
- confirmed `fastly.soft_purge` — scalar, default '0' — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1464
- confirmed `fastly.service_id` — scalar, default empty — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1463
- confirmed `stale_while_revalidate` — http_cache scalar, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1342
- confirmed `SHOPWARE_HTTP_CACHE_ENABLED` — maps to shopware.http.cache.enabled — vendor/shopware/core/Framework/DependencyInjection/services.php:189
- confirmed `cache:clear:http` — command clearing only the HTTP cache — vendor/shopware/core/Framework/Adapter/Command/CacheClearHttpCommand.php:14
- confirmed `cache:clear:all` — command clearing all caches/pools — vendor/shopware/core/Framework/Adapter/Command/CacheClearAllCommand.php:14
