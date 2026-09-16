---
id: platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md
title: Reverse HTTP Cache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html
sourceHash: 74fef21d555cef31fae111ba166076c4ba0132e1
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.http_cache.reverse_proxy", "varnish", "xkey", "fastly", "reverse proxy", "http cache", "SYMFONY_TRUSTED_PROXIES", "SHOPWARE_HTTP_CACHE_ENABLED", "cache:clear:http", "cache:clear:all", "soft purge", "VarnishReverseProxyGateway", "cdn cache invalidation"]
summary: Configure Varnish (xkey) or Fastly as reverse HTTP cache via shopware.http_cache.reverse_proxy, trusted proxies, soft purge and cache clear commands.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md"]
---
## What it is

Setup guide for placing a reverse HTTP cache (Varnish with the `xkey` module, or Fastly) in front of Shopware. The cache must be able to vary on multiple cookies and accept web requests that clear a single page or everything (`/`). It shares the invalidation mechanism and cache tags of the object cache, so invalidating a product also invalidates the HTTP cache.

## When to use

Hosting a production shop behind Varnish or Fastly, debugging why pages are not served from the reverse cache, or picking the right cache clear command.

## Key steps / config

1. Set `SHOPWARE_HTTP_CACHE_ENABLED=1` in `.env`.
2. Enable reverse proxy mode (key is `shopware.http_cache.reverse_proxy` since 6.6; before it was `storefront.reverse_proxy`). For Varnish, Shopware 6.7 always purges via xkey (`PURGE` request with an `xkey` header), so only hosts and parallelism are needed:

```yaml
shopware:
  http_cache:
    reverse_proxy:
      enabled: true
      hosts: [ 'varnish-host' ]
      max_parallel_invalidations: 3   # installed default 2
```

3. Install the Varnish `xkey` vmod (Varnish 6.0+, not in the default install) or use the Shopware Varnish Docker image (`github.com/shopware/varnish-shopware`), which ships the default VCL. Replace the `__XXX__` placeholders in the VCL.
4. Trusted proxies: set `SYMFONY_TRUSTED_PROXIES=127.0.0.1,10.0.0.0/8` (or `SYMFONY_TRUSTED_PROXIES=REMOTE_ADDR` to trust the connecting address) so Symfony reads `Forwarded`/`X-Forwarded-*` headers for client IP, scheme, port and host.
5. Soft purge in Varnish: change the VCL `xkey.purge(req.http.xkey)` to `xkey.softpurge(req.http.xkey)`.
6. Fastly (supported since 6.4.11.0):

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

Fastly VCL snippets can be deployed by the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) or manually from `github.com/shopware/recipes` (`shopware/fastly-meta/6.7/config/fastly`).

7. Debugging: the default VCL strips headers except `Age`; `Age: 0` everywhere means no caching. Query the app server directly, e.g. `curl -vvv -H 'Host: <sales-channel-domain>' <app-server-ip> 1> /dev/null`, and expect `Cache-Control: public, s-maxage=...` plus an `Xkey:` header; otherwise reverse proxy mode is not enabled.

Cache clear commands:
- `bin/console cache:clear` — clears and warms the application cache (before 6.7 it also cleared the HTTP cache).
- `bin/console cache:clear:all` — everything incl. pools and HTTP cache (since 6.6.8).
- `bin/console cache:clear:http` — reverse proxy cache if enabled, else the `http` cache pool (since 6.6.10).
- `bin/console cache:pool:clear --all` — object cache only.

## Essential identifiers

- `shopware.http_cache.reverse_proxy.enabled`, `.hosts`, `.max_parallel_invalidations`
- `shopware.http_cache.reverse_proxy.fastly.enabled` / `.api_key` / `.service_id` / `.soft_purge`
- `shopware.http_cache.stale_while_revalidate`, `shopware.http_cache.stale_if_error`
- `SHOPWARE_HTTP_CACHE_ENABLED`, `SYMFONY_TRUSTED_PROXIES`
- `Shopware\Core\Framework\Adapter\Cache\ReverseProxy\VarnishReverseProxyGateway`, `FastlyReverseProxyGateway`
- `cache:clear:http`, `cache:clear:all`, `cache:pool:clear --all`

## Gotchas

- The docs' Varnish example still sets `ban_method: "BAN"` and `use_varnish_xkey: true`; in 6.7.13 both options are deprecated, have no effect, and are removed in 6.8.0. The Redis/BAN (LUA) Varnish integration is gone; use xkey.
- `TRUSTED_PROXIES` is no longer read out of the box since 6.6; use `SYMFONY_TRUSTED_PROXIES`.
- The source contradicts itself on whether `cache:clear` clears the HTTP cache; per its command list it no longer does since 6.7. To clear only the HTTP cache use `cache:clear:http`.
- Missing `Cache-Control: public` from the app is the usual cause of `Age: 0`.

## Version notes

- 6.6.0.0: config key moved from `storefront.reverse_proxy` to `shopware.http_cache.reverse_proxy`; Redis-based Varnish BAN method deprecated (removed in 6.7).
- 6.4.15.0: Fastly `soft_purge` introduced.

## Code check (6.7.13.0)
- deprecated `ban_method` — reverse_proxy option marked deprecated, "has no effect anymore", removed in 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1386
- deprecated `use_varnish_xkey` — deprecated no-op option, default false, removed in 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1378
- confirmed `reverse_proxy` — node under `http_cache` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1375
- confirmed `max_parallel_invalidations` — integer option, default 2 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1385
- confirmed `fastly.soft_purge` — Fastly options enabled/api_key/service_id/soft_purge (default '0') — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1419
- confirmed `stale_while_revalidate` — http_cache scalar, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1306
- confirmed `SHOPWARE_HTTP_CACHE_ENABLED` — drives `shopware.http.cache.enabled` parameter — vendor/shopware/core/Framework/DependencyInjection/services.xml:38
- confirmed `VarnishReverseProxyGateway` — purges with `PURGE` request and `xkey` header — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/VarnishReverseProxyGateway.php:21
- confirmed `cache:clear:http` — command exists — vendor/shopware/core/Framework/Adapter/Command/CacheClearHttpCommand.php:14
- confirmed `cache:clear:all` — command exists — vendor/shopware/core/Framework/Adapter/Command/CacheClearAllCommand.php:14
