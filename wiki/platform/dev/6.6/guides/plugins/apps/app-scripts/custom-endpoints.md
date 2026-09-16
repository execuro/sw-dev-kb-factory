---
id: platform/dev/6.6/guides/plugins/apps/app-scripts/custom-endpoints.md
title: Custom endpoints
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-scripts/custom-endpoints.html
sourceHash: 28a52cbc47e115f9a43cb70ea42c3c77cede4e3c
keywords: ["App scripts", "custom endpoints", "response hook", "hook.setHeader", "hook.getHeader", "api-", "store-api-", "storefront-", "hook.stopPropagation", "cache.tag", "cache.maxAge", "cache-invalidation", "hook.event.getIds", "Data Abstraction Layer", "route scopes"]
summary: "Explains App scripts custom endpoints for api/store-api/storefront scopes, response header manipulation, and cache config/invalidation hooks."
lastBuilt: "2026-09-15"
---
## What it is

App scripts can implement custom HTTP endpoints and manipulate response headers, letting an app trigger Twig-based logic over the `api`, `store-api`, and `storefront` API scopes without an external backend.

## When to use

Use this when an app needs to expose its own HTTP endpoint (e.g. a REST-style resource) or needs to adjust response headers, such as security headers, for specific requests.

## Key steps / config

- Manipulating headers: since v6.6.10.4, the `response` script hook can read and set HTTP headers on any response:

```twig
// Resources/scripts/response/response.twig
{% do hook.setHeader('X-Frame-Options', 'SAMEORIGIN') %}
```

You can branch on `hook.getHeader(...)`, `hook.routeName`, and `hook.isInRouteScope('store-api')`. Route scopes are `storefront`, `store-api`, `api`, and `administration`.
- Custom endpoints: place scripts in a folder prefixed with the API scope (`api-`, `store-api-`, or `storefront-`); the remaining folder name becomes the hook name used in the URL, e.g. `Resources/scripts/api-test-script` is reached via `/api/script/test-script` (slashes in the route become dashes). Prefix hook names with your vendor/app name to avoid collisions, e.g. `/api/script/swagMyApp/test-script`.
- Admin API endpoints (`api-{hook-name}`) are called via `/api/script/{hook-name}`, `POST` only; responses are not cached.
- Store API endpoints (`store-api-{hook-name}`) are called via `/store-api/script/{hook-name}`, `POST`/`GET`; implement logic in the `response` block, and for caching implement a `cache_key` block.
- Storefront endpoints (`storefront-{hook-name}`) are called via `/storefront/script/{hook-name}`, `POST`/`GET`; GET responses are cached by default when the HTTP-Cache is enabled.
- By default a `204 No Content` is returned. Build a custom response with `services.response.json({...})` or `services.response.render(...)`, then `hook.setResponse(response)`. Scripts execute in alphabetical order; call `hook.stopPropagation()` to stop later scripts from overriding the response.
- Cache config on the response object: `response.cache.tag('my-custom-tag')`, `response.cache.disable()`, `response.cache.maxAge(120)`, `response.cache.invalidationState('logged-in')`.
- Cache invalidation scripts live under `Resources/scripts/cache-invalidation`; use `hook.event.getIds('product')`, filter with `.only('insert')` / `.with('description', 'parentId')` (chainable), then invalidate matching tags with `services.cache.invalidate(tags)`.

## Essential identifiers

- `response` script hook (`hook.setHeader`, `hook.getHeader`, `hook.routeName`, `hook.isInRouteScope`)
- folder prefixes `api-`, `store-api-`, `storefront-`, `cache-invalidation`
- `services.response.json`, `services.response.render`, `hook.setResponse`, `hook.stopPropagation`
- `response.cache.tag`, `response.cache.disable`, `response.cache.maxAge`, `response.cache.invalidationState`
- `hook.event.getIds`, `services.cache.invalidate`

## Gotchas

- The `response` hook for header manipulation is only available from v6.6.10.4 onward.
- `store-api` endpoint caching requires the script to implement its own `cache_key` block; `storefront` GET responses are only cached automatically when the HTTP-Cache is enabled.
- Later scripts executed for the same hook (alphabetical order) may override an earlier script's response.

## Version notes

The `response` script hook for manipulating HTTP headers was added in v6.6.10.4 and is not available in earlier versions.
