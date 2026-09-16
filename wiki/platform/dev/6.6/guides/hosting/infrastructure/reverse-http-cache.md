---
id: platform/dev/6.6/guides/hosting/infrastructure/reverse-http-cache.md
title: Reverse HTTP Cache
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/reverse-http-cache.html
sourceHash: a9d550df1e55c6e3361e66326a10774df687d507
keywords: ["reverse http cache", "varnish", "fastly", "shopware.http_cache.reverse_proxy", "SHOPWARE_HTTP_CACHE_ENABLED", "use_varnish_xkey", "soft purge", "TRUSTED_PROXIES", "stale_while_revalidate", "stale_if_error", "cache invalidation", "BAN request"]
summary: "Covers Varnish/Fastly reverse HTTP cache setup via shopware.http_cache.reverse_proxy, soft purge, and cache invalidation."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md"]
---
## What it is
Documents how to configure a reverse HTTP cache (using Varnish or Fastly) in front of Shopware for full-page caching.

## When to use
Use it when setting up an HTTP caching layer that needs to differentiate requests by cookie and support cache purging by path or entirely (`/`).

## Key steps / config
Enable the reverse proxy in `config/packages/storefront.yaml`:

```yaml
shopware:
    http_cache:
        reverse_proxy:
            enabled: true
            ban_method: "BAN"
            hosts: ["<varnish-host>"]
            max_parallel_invalidations: 3
            use_varnish_xkey: true
```

Also set `SHOPWARE_HTTP_CACHE_ENABLED=1` in `.env`. The configuration key changed from `storefront.reverse_proxy` (up to 6.5.x) to `shopware.http_cache.reverse_proxy` starting with Shopware 6.6.0.0. Since Shopware 6.6, `TRUSTED_PROXIES` is no longer read automatically — a Symfony configuration is needed to restore it; see the [Deployment Helper](platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md) guide for automating related deployment steps.

Varnish with Redis + LUA-based BAN requests is deprecated from v6.6.x and removed in v6.7.0; use Varnish with XKey instead, enabled in `config/packages/varnish.yaml` with `cache.tagging.each_config`/`each_snippet`/`each_theme_config: false` and `http_cache.reverse_proxy.use_varnish_xkey: true`.

For Fastly (supported since 6.4.11.0), configure in `config/packages/storefront.yaml`:

```yaml
shopware:
  http_cache:
    reverse_proxy:
        enabled: true
        fastly:
          enabled: true
          api_key: '<personal-token-from-fastly>'
          service_id: '<service-id>'
```

Soft purge (since 6.4.15.0) keeps serving the old cached page while refreshing in the background: set `fastly.soft_purge: '1'`, and optionally `stale_while_revalidate`/`stale_if_error` at the `shopware.http_cache` level.

## Essential identifiers
- `shopware.http_cache.reverse_proxy`
- `SHOPWARE_HTTP_CACHE_ENABLED`
- `use_varnish_xkey`
- `fastly.api_key`, `fastly.service_id`, `fastly.soft_purge`
- `stale_while_revalidate`, `stale_if_error`

## Gotchas
`bin/console cache:clear` also clears the HTTP cache; if that's unwanted, delete the `var/cache` folder manually instead, and use `bin/console cache:pool:clear --all` for the object cache specifically. The Reverse Proxy Cache shares invalidation tags with the Object Cache, so invalidating a product invalidates both.

## Version notes
The reverse-proxy config key moved from `storefront.reverse_proxy` to `shopware.http_cache.reverse_proxy` in Shopware 6.6.0.0. `TRUSTED_PROXIES` auto-detection was removed in Shopware 6.6. The Varnish+Redis/LUA integration is deprecated in 6.6.x and removed in 6.7.0.
