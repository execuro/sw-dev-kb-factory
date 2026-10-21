---
id: platform/dev/6.7/products/paas/shopware/cdn/reverse-proxy.md
title: HTTP Reverse Proxy Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/reverse-proxy.html
sourceHash: ba24b4fb380d06b866932cf997b6d6920a701970
codeCheckedAgainst: "6.7.15.1"
keywords: ["reverse proxy", "fastly", "http cache", "HTTP_CACHE_CONTROL_STALE_WHILE_REVALIDATE", "HTTP_CACHE_CONTROL_STALE_IF_ERROR", "stale-while-revalidate", "stale-if-error", "Cache-Control", "app.environment_variables", "soft purge", "paas native", "shopware.http_cache.stale_while_revalidate"]
summary: PaaS Native Fastly reverse proxy defaults - override HTTP_CACHE_CONTROL_STALE_WHILE_REVALIDATE (300 s) and HTTP_CACHE_CONTROL_STALE_IF_ERROR (3600 s).
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md"]
---
## What it is

Shopware PaaS Native runs Shopware with Fastly as HTTP reverse proxy, enabled automatically. This page lists the two environment variables that tune the stale-serving directives of the `Cache-Control` header Shopware sends to Fastly.

## When to use

When you want Fastly to serve stale pages for a longer or shorter time after expiry/soft purge, or while Shopware is erroring (deployments, outages).

## Key steps / config

Add the variables to `app.environment_variables` in `application.yaml` with `scope: RUN` (see [environment variables](platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md)), then redeploy.

- `HTTP_CACHE_CONTROL_STALE_WHILE_REVALIDATE` - sets the `stale-while-revalidate` directive. After a cached page expires or is soft-purged (e.g. after a product update), Fastly keeps serving the stale page for this duration while fetching a fresh one in the background. Default `300` seconds.
- `HTTP_CACHE_CONTROL_STALE_IF_ERROR` - sets the `stale-if-error` directive. If Shopware is unreachable or returns an error (e.g. `5xx` during a deployment), Fastly serves the stale cached page for this duration instead of an error page. Default `3600` seconds.

In core these feed `shopware.http_cache.stale_while_revalidate` and `shopware.http_cache.stale_if_error`; `CacheResponseSubscriber` adds each directive only when the value is non-null.

## Essential identifiers

- `HTTP_CACHE_CONTROL_STALE_WHILE_REVALIDATE`, `HTTP_CACHE_CONTROL_STALE_IF_ERROR`
- `app.environment_variables`, `scope: RUN`
- `shopware.http_cache.stale_while_revalidate`, `shopware.http_cache.stale_if_error`

## Gotchas

- The `300`/`3600` defaults are PaaS defaults; core itself defaults both keys to null, which omits the directives.

## Code check (6.7.15.1)
- confirmed `shopware.http_cache.stale_while_revalidate` — core default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1342
- confirmed `shopware.http_cache.stale_if_error` — core default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1343
- confirmed `stale-while-revalidate` — added to Cache-Control only when configured — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:224
- confirmed `stale-if-error` — added to Cache-Control only when configured — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:220
- unverified `HTTP_CACHE_CONTROL_STALE_WHILE_REVALIDATE` — env var mapping is not in core config, set by the PaaS/project config
- unverified `HTTP_CACHE_CONTROL_STALE_IF_ERROR` — env var mapping is not in core config, set by the PaaS/project config
