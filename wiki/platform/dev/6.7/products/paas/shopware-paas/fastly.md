---
id: platform/dev/6.7/products/paas/shopware-paas/fastly.md
title: Fastly
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/fastly.html
sourceHash: 5607956a44787b88661f91ef28002849dd7ae190
codeCheckedAgainst: "6.7.13.0"
keywords: ["fastly", "cdn", "http cache", "reverse proxy", "edge cache", "shopware paas", "FASTLY_API_TOKEN", "FASTLY_SERVICE_ID", "composer req fastly", ".platform/routes.yaml", "soft purge", "FastlyReverseProxyGateway"]
summary: "Enable Fastly edge HTTP cache on Shopware PaaS: FASTLY_API_TOKEN/FASTLY_SERVICE_ID, composer req fastly, disable routes.yaml caching, enable soft purges."
lastBuilt: 2026-09-15
---
## What it is

How to enable Fastly as the HTTP cache on Shopware PaaS. Fastly stores cached responses at the edge server nearest the customer, so cached requests never reach the application; response times drop worldwide and the Redis cache holds fewer items because it is no longer used for HTTP cache.

## When to use

When a Shopware PaaS project (Shopware 6.4.11 or newer) should serve its HTTP cache from Fastly instead of the application/Redis.

## Key steps / config

1. Make sure `FASTLY_API_TOKEN` and `FASTLY_SERVICE_ID` are set in the environment; contact support if they are missing.
2. Install the Fastly Composer package: `composer req fastly`.
3. Disable caching in `.platform/routes.yaml`.
4. Push the new config — Fastly gets enabled on deployment.

In the installed core, purging runs through the `Shopware\Core\Framework\Adapter\Cache\ReverseProxy\FastlyReverseProxyGateway` service, configured by the `shopware.http_cache.reverse_proxy.fastly` node:

```yaml
shopware:
    http_cache:
        reverse_proxy:
            fastly:
                enabled: ...
                api_key: ...
                service_id: ...
                soft_purge: ...
```

## Essential identifiers

- `FASTLY_API_TOKEN`, `FASTLY_SERVICE_ID` — required environment variables
- `composer req fastly`
- `.platform/routes.yaml` — caching must be disabled here
- `shopware.http_cache.reverse_proxy.fastly.service_id` / `.api_key` / `.soft_purge` / `.enabled`
- `Shopware\Core\Framework\Adapter\Cache\ReverseProxy\FastlyReverseProxyGateway`

## Gotchas

- Enable Fastly soft purges to limit the impact of large-scale cache invalidations. In core, `shopware.http_cache.reverse_proxy.fastly.soft_purge` defaults to `'0'` (off), so it must be switched on explicitly.
- If `FASTLY_API_TOKEN` or `FASTLY_SERVICE_ID` is missing, do not proceed — request them from support first.

## Version notes

- Fastly on Shopware PaaS is supported from Shopware 6.4.11.

## Code check (6.7.13.0)
- confirmed `FastlyReverseProxyGateway` — service registered in core cache DI — vendor/shopware/core/Framework/DependencyInjection/cache.xml:240
- confirmed `shopware.http_cache.reverse_proxy.fastly.service_id` — injected into the Fastly gateway — vendor/shopware/core/Framework/DependencyInjection/cache.xml:242
- confirmed `shopware.http_cache.reverse_proxy.fastly.api_key` — injected into the Fastly gateway — vendor/shopware/core/Framework/DependencyInjection/cache.xml:243
- confirmed `shopware.http_cache.reverse_proxy.fastly.enabled` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1415
- confirmed `shopware.http_cache.reverse_proxy.fastly.soft_purge` — default '0', soft purge off — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1419
- unverified `FASTLY_API_TOKEN` — read by shopware/deployment-helper, outside the checked roots
- unverified `FASTLY_SERVICE_ID` — read by shopware/deployment-helper, outside the checked roots
- unverified `composer req fastly` — Flex recipe alias, outside vendor scope
- unverified `6.4.11` — minimum version claim, not verifiable against installed 6.7 code
