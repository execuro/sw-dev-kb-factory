---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md
title: Custom Endpoints
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/custom-endpoints.html
sourceHash: 47e5283a262307f34706c406b3bba16dbde3adf8
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom endpoint", "app scripts", "/api/script/{hook}", "/store-api/script/{hook}", "/storefront/script/{hook}", "hook.setResponse", "services.response", "cache_key", "response hook", "sharedMaxAge", "cache-invalidation", "services.cache.invalidate", "http headers", "stopPropagation"]
summary: "App script custom endpoints for api/store-api/storefront scopes, response service, response header hook, cache config and cache-invalidation scripts."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md"]
---
## What it is

App scripts can back custom HTTP endpoints in the `api`, `store-api` and `storefront` scopes: a request to the script endpoint runs every script stored under the matching hook folder. The page also covers the global `response` hook for editing HTTP headers, response cache configuration, and `cache-invalidation` scripts.

## When to use

- An app must run custom logic on an HTTP request or expose specific data via Admin API, Store API or Storefront.
- An app needs to adjust response headers (e.g. security headers such as `X-Frame-Options`).
- A cached Store API / Storefront script response must be tagged and invalidated when data changes.

## Key steps / config

1. Put scripts in `Resources/scripts/<scope-prefix><hook-name>/`. The folder prefix selects the scope; the rest is the hook name used in the URL. All further `/` in the route are replaced by `-`, so `Resources/scripts/api-test-script` runs on `/api/script/test-script` and `/api/script/test/script`. Include your app name in the hook name (e.g. `/api/script/swagMyApp/test-script`) to avoid collisions.

| Scope | Folder | Endpoint | Methods |
|---|---|---|---|
| Admin API | `api-{hook-name}` | `/api/script/{hook-name}` | `POST`, `GET` (route definition) |
| Store API | `store-api-{hook-name}` | `/store-api/script/{hook-name}` | `GET`, `POST` |
| Storefront | `storefront-{hook-name}` | `/storefront/script/{hook-name}` | `GET`, `POST` |

2. Scripts get the JSON payload (plus query parameters for GET) and DAL read/write services. Without a custom response, `204 No Content` is returned. Set one via the `response` service:

```twig
{% set response = services.response.json({ 'foo': 'bar' }) %}
{% do hook.setResponse(response) %}
```

Multiple scripts in one folder run in alphabetical order; later ones can override the response. `{% do hook.stopPropagation() %}` stops further scripts.

3. Store API hook is an interface hook: implement logic in `{% block response %}`. To cache `GET` responses, implement a `cache_key` block that calls `hook.setCacheKey(...)`, e.g. md5 of `hook.query` merged with the script name.
4. Storefront hook: also `services.response.render('@MyApp/storefront/page/custom-page/index.html.twig', { 'page': hook.page })` or `services.response.redirect('frontend.detail.page', { 'productId': productId })`; data can be attached with `hook.page.addExtension(...)`. Caching is on by default for `GET` (when HTTP cache is enabled).
5. Headers on every response: script in `Resources/scripts/response/response.twig` using `hook.setHeader(name, value)`, `hook.getHeader(name)`, `hook.routeName`, `hook.isInRouteScope('store-api')`. Route scopes: `storefront`, `store-api`, `api`, `administration`.
6. Cache config on the response object: `response.cache.tag('my-custom-tag')`, `response.cache.disable()`, `response.cache.sharedMaxAge(120)` (`s-maxage`), `response.cache.clientMaxAge(...)` (`max-age`).
7. Invalidation script `Resources/scripts/cache-invalidation/<name>.twig`:

```twig
{% set ids = hook.event.getIds('product') %}
{% set ids = ids.only('insert').with('description', 'parentId') %}
{% if ids.empty %}{% return %}{% endif %}
{% do services.cache.invalidate(tags) %}
```

## Essential identifiers

- Routes `api.script_endpoint`, `store-api.script_endpoint`, `frontend.script_endpoint`
- Hook names `api-{hook}`, `store-api-{hook}`, `storefront-{hook}`, `response`, `cache-invalidation`
- Store API script blocks `response`, `cache_key`
- `services.response.json()` / `.render()` / `.redirect()`, `hook.setResponse()`, `hook.stopPropagation()`, `hook.setCacheKey()`
- `hook.setHeader()`, `hook.getHeader()`, `hook.isInRouteScope()`, `hook.routeName`
- `response.cache.tag()`, `.disable()`, `.sharedMaxAge()`, `.clientMaxAge()`
- `hook.event.getIds()`, `ids.only()`, `ids.with()`, `services.cache.invalidate()`

## Gotchas

- The docs state the Admin API endpoint only allows `POST`; the installed route accepts `POST` and `GET`. Admin API script responses are never cached. Access requires the app's own integration or `app.all` / `app.<appName>` permission.
- Store API caching needs your own `cache_key` implementation; without it responses are not cached.
- `response.cache.maxAge()` is deprecated (removal in v6.8.0.0) — use `sharedMaxAge()`. `clientMaxAge()` is described as effective with the `CACHE_REWORK` feature flag.
- `response.cache.invalidationState('logged-in')` (cache states) is deprecated for v6.8.0.0 and ignored when `CACHE_REWORK` (or `PERFORMANCE_TWEAKS`/v6.8.0.0) is active.
- Extension and hook names must be unique — prefix them with your vendor/app name.

## Version notes

- `sharedMaxAge()` available since v6.7.6.0 per docs.
- The `response` header hook: docs say added in v6.6.10.4; the class docblock says `@since 6.6.10.0`.

## Code check (6.7.13.0)
- corrected `api.script_endpoint` — docs: POST only; route declares methods POST and GET — vendor/shopware/core/Framework/Script/Api/ScriptApiRoute.php:35
- confirmed `store-api.script_endpoint` — `/store-api/script/{hook}` with GET and POST — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:36
- confirmed `frontend.script_endpoint` — `/storefront/script/{hook}` with GET and POST — vendor/shopware/storefront/Controller/ScriptController.php:34
- confirmed `StoreApiCacheKeyHook::FUNCTION_NAME` — script block name `cache_key` — vendor/shopware/core/Framework/Script/Api/StoreApiCacheKeyHook.php:27
- confirmed `StoreApiResponseHook::FUNCTION_NAME` — script block name `response` — vendor/shopware/core/Framework/Script/Api/StoreApiResponseHook.php:34
- deprecated `ResponseCacheConfiguration::maxAge()` — @deprecated tag:v6.8.0, delegates to sharedMaxAge — vendor/shopware/core/Framework/Script/Api/ResponseCacheConfiguration.php:48
- confirmed `ResponseCacheConfiguration::sharedMaxAge()` — sets s_maxage directive — vendor/shopware/core/Framework/Script/Api/ResponseCacheConfiguration.php:74
- confirmed `ResponseCacheConfiguration::clientMaxAge()` — sets max_age directive — vendor/shopware/core/Framework/Script/Api/ResponseCacheConfiguration.php:63
- corrected `ResponseHook` — docs: added in v6.6.10.4; class docblock says @since 6.6.10.0 — vendor/shopware/core/Framework/Script/Api/ResponseHook.php:20
- confirmed `CACHE_REWORK` — toggleable feature flag, default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:64
