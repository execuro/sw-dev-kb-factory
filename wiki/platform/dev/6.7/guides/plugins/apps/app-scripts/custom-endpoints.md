---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md
title: Custom Endpoints
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/custom-endpoints.html
sourceHash: 699def9fd9d930b8c98cc8653aa46fcdeb88cc6e
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom endpoints", "app scripts", "/api/script/", "/store-api/script/", "/storefront/script/", "services.response", "hook.setResponse", "cache_key", "sharedMaxAge", "cache-invalidation", "response hook", "setHeader", "http headers", "script caching"]
summary: App-script endpoints under /api/script, /store-api/script, /storefront/script - folder naming, responses, caching, cache invalidation, response header hook.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.md
  - platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md
  - platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md
  - platform/dev/6.7/concepts/framework/http_cache.md
---
## What it is

App scripts can serve HTTP endpoints in three scopes — Admin API (`api`), Store API (`store-api`) and Storefront (`storefront`). A request to the scope's script route executes all scripts in the matching `Resources/scripts/<scope>-<hook-name>/` folder. The page also covers response caching, cache invalidation scripts, and the `response` hook for manipulating HTTP headers.

## When to use

When an app must run logic in response to an HTTP request or expose data via the API, with read/write access to the [Data Abstraction Layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md).

## Key steps / config

**Folder → route mapping.** The folder prefix is the scope (`api-`, `store-api-`, `storefront-`), the rest is the hook name. Further slashes in the URL become dashes: `Resources/scripts/api-test-script` answers both `/api/script/test-script` and `/api/script/test/script`. Put your vendor/app name after the prefix, e.g. `/api/script/swagMyApp/test-script`.

| Scope | Folder | Route | Methods |
|---|---|---|---|
| Admin API | `api-{hook-name}` | `/api/script/{hook-name}` | `POST`, `GET` |
| Store API | `store-api-{hook-name}` | `/store-api/script/{hook-name}` | `POST`, `GET` |
| Storefront | `storefront-{hook-name}` | `/storefront/script/{hook-name}` | `POST`, `GET` |

**Responses.** Without a response, a `204 No Content` is returned. Otherwise build one with the `response` service and set it:

```twig
{% set response = services.response.json({ 'foo': 'bar' }) %}
{% do hook.setResponse(response) %}
```

Multiple scripts in one folder run in alphabetical order; later ones may override the response. `{% do hook.stopPropagation() %}` stops further scripts.

**Store API** is an interface hook: logic goes in `{% block response %}`. GET caching requires a `{% block cache_key %}` that sets a unique key per request permutation:

```twig
{% block cache_key %}
    {% set cachePayload = hook.query|merge({'script': 'custom-endpoint'}) %}
    {% do hook.setCacheKey(cachePayload|md5) %}
{% endblock %}
```

**Storefront** endpoints are callable by browser or AJAX and can also render templates or redirect:
- `services.response.render('@MyApp/storefront/page/custom-page/index.html.twig', { 'page': hook.page })`
- `services.response.redirect('frontend.detail.page', { 'productId': productId })`, reading `hook.query['product-id']`

GET caching is on by default (if the HTTP cache is enabled). SEO paths for these pages: [SEO URLs for App Routes](platform/dev/6.7/guides/plugins/apps/storefront/seo-urls.md).

**Cache config** on the response object: `response.cache.tag('my-custom-tag')`, `response.cache.disable()`, `response.cache.sharedMaxAge(120)` (`s-maxage`), `response.cache.clientMaxAge(…)` (`max-age`).

**Cache invalidation** — scripts in `Resources/scripts/cache-invalidation/`:

```twig
{% set ids = hook.event.getIds('product').only('insert').with('description', 'parentId') %}
{% if ids.empty %}{% return %}{% endif %}
{% do services.cache.invalidate(tags) %}
```

Build `tags` from the ids, e.g. `'my-product-' ~ id`.

**Response hook** — `Resources/scripts/response/response.twig` runs for responses and can adjust headers: `hook.setHeader('X-Frame-Options', 'SAMEORIGIN')`, `hook.getHeader(...)`, `hook.routeName`, `hook.isInRouteScope('store-api')`. Scopes: `storefront`, `store-api`, `api`, `administration`.

## Essential identifiers

- Routes `api.script_endpoint`, `store-api.script_endpoint`, `frontend.script_endpoint`
- `services.response.json()` / `render()` / `redirect()`, `hook.setResponse()`, `hook.stopPropagation()`
- `hook.setCacheKey()`, `hook.query`
- `response.cache.tag()` / `disable()` / `sharedMaxAge()` / `clientMaxAge()`
- Hooks `cache-invalidation`, `response`; `hook.event.getIds()`, `only()`, `with()`, `services.cache.invalidate()`

## Gotchas

- Admin API responses are not cached.
- Store API: no `cache_key` block → no caching for that endpoint.
- `cache.maxAge()` is deprecated (removed in v6.8.0.0); it maps to `sharedMaxAge()`.
- Cache states via `cache.invalidationState('logged-in')` are documented as deprecated for v6.8.0.0 and not working with the `CACHE_REWORK` feature flag (default off, experimental).
- The source says the Admin API endpoint only allows `POST`; the installed route also accepts `GET`.

## Version notes

- `response` hook: added in v6.6.10.4.
- `sharedMaxAge()` available since v6.7.6.0; `clientMaxAge()` takes effect with `CACHE_REWORK`.

## Code check (6.7.15.1)
- corrected `api.script_endpoint` — docs: POST only; route allows POST and GET — vendor/shopware/core/Framework/Script/Api/ScriptApiRoute.php:34
- confirmed `store-api.script_endpoint` — GET and POST, / mapped to - — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:36
- confirmed `StorefrontHook::HOOK_NAME` — storefront-{hook} — vendor/shopware/storefront/Framework/Script/Api/StorefrontHook.php:34
- confirmed `ScriptResponseAwareTrait::getScriptResponse()` — defaults to 204 No Content — vendor/shopware/core/Framework/Script/Execution/Awareness/ScriptResponseAwareTrait.php:26
- deprecated `ResponseCacheConfiguration::maxAge()` — removed in v6.8.0, use sharedMaxAge/clientMaxAge — vendor/shopware/core/Framework/Script/Api/ResponseCacheConfiguration.php:46
- confirmed `ResponseCacheConfiguration::sharedMaxAge()` — s_maxage for shared caches — vendor/shopware/core/Framework/Script/Api/ResponseCacheConfiguration.php:74
- confirmed `ResponseCacheConfiguration::invalidationState()` — present, no deprecation annotation in code — vendor/shopware/core/Framework/Script/Api/ResponseCacheConfiguration.php:86
- confirmed `CACHE_REWORK` — feature flag, default false, read by ScriptStoreApiRoute — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:107
- confirmed `ResponseHook::isInRouteScope()` — response hook header API (getHeader/setHeader) — vendor/shopware/core/Framework/Script/Api/ResponseHook.php:47
- confirmed `WrittenEventIdCollection::only()` — cache-invalidation id filter (with() at line 46) — vendor/shopware/core/Framework/Adapter/Cache/Script/Facade/WrittenEventIdCollection.php:30
