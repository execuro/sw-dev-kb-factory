---
id: platform/dev/6.7/products/paas/shopware-paas/fastly.md
title: Fastly
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/fastly.html
sourceHash: 5607956a44787b88661f91ef28002849dd7ae190
codeCheckedAgainst: "6.7.15.1"
keywords: ["fastly", "FASTLY_API_TOKEN", "FASTLY_SERVICE_ID", "composer req fastly", ".platform/routes.yaml", "FastlyReverseProxyGateway", "soft purge", "http cache", "cdn", "edge cache", "reverse proxy", "shopware paas", "cache invalidation"]
summary: Enabling Fastly edge HTTP caching on Shopware PaaS - FASTLY_API_TOKEN/FASTLY_SERVICE_ID, composer req fastly, routes.yaml cache off, soft purges.
lastBuilt: 2026-10-21
---
## What it is

On Shopware PaaS, Fastly stores Shopware's HTTP cache on the edge server nearest to the customer. Cached responses never reach the application, which saves resources and lowers response times worldwide; the Redis cache is no longer used for these responses and holds fewer cache items.

## When to use

When a Shopware PaaS project (Shopware 6.4.11 or newer) should serve its HTTP cache from Fastly's edge instead of from the application and Redis.

## Key steps / config

1. Ensure the environment variables `FASTLY_API_TOKEN` and `FASTLY_SERVICE_ID` are set in the PaaS environment; if they are missing, contact support.
2. Install the Fastly Composer package: `composer req fastly`.
3. Disable caching in `.platform/routes.yaml`.
4. Push the new configuration; Fastly is enabled on deployment.
5. Enable soft purges in the Fastly configuration to mitigate the impact of large-scale cache invalidations (see the reverse HTTP cache guide at https://developer.shopware.com/docs/guides/hosting/infrastructure/reverse-http-cache.html#fastly-soft-purge).

In the installed core, Fastly invalidation is handled by `Shopware\Core\Framework\Adapter\Cache\ReverseProxy\FastlyReverseProxyGateway`, wired from the bundle config node `shopware.http_cache.reverse_proxy.fastly`:

```yaml
shopware:
  http_cache:
    reverse_proxy:
      fastly:
        enabled: ...
        api_key: ...
        service_id: ...
        soft_purge: ...   # default '0'
        tag_prefix: ...
        instance_tag: ...
```

The source does not show how the Composer package from step 2 maps the PaaS environment variables onto this config.

## Essential identifiers

- `FASTLY_API_TOKEN`, `FASTLY_SERVICE_ID` (environment)
- `composer req fastly`
- `.platform/routes.yaml`
- `FastlyReverseProxyGateway`
- `shopware.http_cache.reverse_proxy.fastly.soft_purge`

## Gotchas

- Soft purges are not on by default: the core config node `soft_purge` defaults to `'0'`, so they must be enabled explicitly, as the source recommends for large-scale invalidations.
- Missing `FASTLY_API_TOKEN`/`FASTLY_SERVICE_ID` are provisioned by Shopware support, not by the project.

## Version notes

- The source states Fastly is supported from Shopware 6.4.11.

## Code check (6.7.15.1)
- confirmed `FastlyReverseProxyGateway` — core reverse proxy gateway for Fastly, extends AbstractReverseProxyGateway — vendor/shopware/core/Framework/Adapter/Cache/ReverseProxy/FastlyReverseProxyGateway.php:19
- confirmed `shopware.http_cache.reverse_proxy.fastly.service_id` — passed to the gateway — vendor/shopware/core/Framework/DependencyInjection/cache.php:331
- confirmed `shopware.http_cache.reverse_proxy.fastly.api_key` — passed to the gateway — vendor/shopware/core/Framework/DependencyInjection/cache.php:332
- confirmed `shopware.http_cache.reverse_proxy.fastly.soft_purge` — passed to the gateway — vendor/shopware/core/Framework/DependencyInjection/cache.php:333
- confirmed `fastly.soft_purge` — config node defaults to '0' (soft purge off) — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1464
- confirmed `fastly.enabled` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1460
- unverified `FASTLY_API_TOKEN` — env var set by PaaS / Composer recipe, not read in core
- unverified `FASTLY_SERVICE_ID` — env var set by PaaS / Composer recipe, not read in core
- unverified `composer req fastly` — Composer recipe alias, outside the core packages
