---
id: platform/dev/6.7/resources/references/adr/2022-01-06-custom-app-api-endpoints.md
title: Allow apps to define custom api endpoints
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-01-06-custom-app-api-endpoints.html
sourceHash: 4ea979fce870a49594da7d77ce8fdd40f96587b6
codeCheckedAgainst: "6.7.13.0"
keywords: ["/api/script/{hook}", "/store-api/script/{hook}", "/storefront/script/{hook}", "app scripts", "custom endpoint", "hook.setResponse", "services.response", "ResponseCacheConfiguration", "cache-invalidation", "stopPropagation", "StoreApiHook", "StorefrontHook", "adr"]
summary: "ADR: apps serve custom Admin API, Store API and Storefront endpoints from scripts via /script/{hook} routes, with response and cache helpers."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record that lets apps expose their own endpoints backed by app scripts (Twig), instead of only the automatic entity API. Three generic routes execute a script hook whose name is derived from the URL; the script loads or writes data and sets a response.

## When to use

- An app needs a custom Admin API, Store API or Storefront endpoint with its own logic.
- A script must return JSON, redirect, or render a Storefront page.
- An app must control HTTP caching of its script responses or invalidate cache tags when entities are written.

## Key steps / config

1. Place scripts in the app's `Resources/scripts` folder; no `manifest.xml` configuration is needed.
2. Routes and resulting hook names (a `/` in `{hook}` becomes `-`):
   - `/api/script/{hook}` → hook `api-{hook}` (route `api.script_endpoint`)
   - `/store-api/script/{hook}` → hook `store-api-{hook}` (route `store-api.script_endpoint`)
   - `/storefront/script/{hook}` → hook `storefront-{hook}` (route `frontend.script_endpoint`)
   Prefix the hook name with your vendor prefix to avoid collisions with other apps.
3. Store API hooks are split into two functions in the installed code: `cache_key` (runs for cacheable requests and provides the cache key) and `response` (produces the response).
4. Build and assign a response:

```twig
{% set response = services.response.json({'data': data}, statusCode) %}
{% set response = services.response.redirect('routeName', params, statusCode) %}
{% do response.cache.maxAge(7200) %}
{% do response.cache.invalidationState('logged-in', 'cart-filled') %}
{% do response.cache.tag('my-manufacturer-tag-' ~ manufacturerId) %}
{% do response.cache.disable() %}
{% do hook.setResponse(response) %}
```

   `json()` defaults to status 200, `redirect()` to 302. If no response is set, a 204 response is returned. In Storefront hooks the `response` service is `Shopware\Storefront\Framework\Script\Api\StorefrontScriptResponseFactoryFacade`, which can render a Twig template with the hook's `page` (see Gotchas).
5. Multiple scripts may run on one hook; `hook.stopPropagation()` prevents further scripts from executing.
6. Cache invalidation: the `cache-invalidation` hook wraps `EntityWrittenContainerEvent`:

```twig
{% set ids = hook.event.getIds('manufacturer').only('update').with('name', 'url') %}
{% if ids.empty %}{% return %}{% endif %}
{% do services.cache.invalidate(tags) %}
```

## Essential identifiers

- `/api/script/{hook}`, `/store-api/script/{hook}`, `/storefront/script/{hook}`
- `hook.setResponse()`, `hook.stopPropagation()`
- `services.response.json()`, `services.response.redirect()`
- `StorefrontScriptResponseFactoryFacade`
- `response.cache.invalidationState()`, `maxAge()`, `disable()`, `tag()`
- `cache-invalidation` hook, `hook.event.getIds()`, `only()`, `with()`, `services.cache.invalidate()`
- Script data: `request.request.all`, `request.query.all` (Storefront), `context`, `page` (`GenericPage`, Storefront)

## Gotchas

- The ADR's `hook.context.ensureLogin()` helper (throwing `CustomerNotLoggedInException`) does not exist in the installed code.
- The ADR shows `with(['name', 'url'])` and a chained `hook.event.get(...)`; the installed facade only has `getIds()`, and `with()`/`only()` take variadic strings. Valid `only()` operations are `insert`, `update`, `delete` (the ADR's `upated` is a typo).
- Rendering: `services.response.render('@myApp/storefront/pages/my-custom-page.html.twig', { 'page': hook.page })` is supported through the Storefront facade in Storefront hooks. `render()` on the core `response` service is deprecated for 6.8 and throws outside a `SalesChannelContext` or without the Storefront bundle.
- Store API responses are only served from cache when the request method is cacheable, the `cache_key` function yields a key, and the response's cache config is enabled. Cache configuration on `/api` responses is ignored.
- SEO URLs for script routes are not supported.

## Code check (6.7.13.0)
- confirmed `/api/script/{hook}` — route api.script_endpoint, GET/POST — vendor/shopware/core/Framework/Script/Api/ScriptApiRoute.php:35
- confirmed `/store-api/script/{hook}` — route store-api.script_endpoint — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:36
- confirmed `/storefront/script/{hook}` — route frontend.script_endpoint — vendor/shopware/storefront/Controller/ScriptController.php:34
- corrected `StoreApiHook::FUNCTIONS` — docs: one store-api-{hook} script with opt-out caching; code: cache_key and response functions, cached only with a key — vendor/shopware/core/Framework/Script/Api/StoreApiHook.php:29
- confirmed `StoppableHookTrait::stopPropagation()` — stops further script execution — vendor/shopware/core/Framework/Script/Execution/Awareness/StoppableHookTrait.php:15
- confirmed `ScriptResponseAwareTrait::setResponse()` — default response is HTTP 204 — vendor/shopware/core/Framework/Script/Execution/Awareness/ScriptResponseAwareTrait.php:32
- deprecated `ScriptResponseFactoryFacade::render()` — deprecated tag:v6.8.0 on the core response service — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:84
- absent `ensureLogin()` — no such helper in the installed code
- corrected `WrittenEventIdCollection::with()` — docs: with(['name', 'url']) array; code: variadic string arguments — vendor/shopware/core/Framework/Adapter/Cache/Script/Facade/WrittenEventIdCollection.php:44
- confirmed `CacheInvalidationHook::HOOK_NAME` — value 'cache-invalidation' — vendor/shopware/core/Framework/Adapter/Cache/Script/CacheInvalidationHook.php:23
