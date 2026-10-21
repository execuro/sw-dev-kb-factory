---
id: platform/dev/6.7/resources/references/adr/2022-01-06-custom-app-api-endpoints.md
title: Allow apps to define custom api endpoints
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-01-06-custom-app-api-endpoints.html
sourceHash: 4ea979fce870a49594da7d77ce8fdd40f96587b6
codeCheckedAgainst: "6.7.15.1"
keywords: ["app scripts", "custom api endpoint", "/api/script/{hook}", "/store-api/script/{hook}", "/storefront/script/{hook}", "services.response", "hook.setResponse", "stopPropagation", "cache-invalidation", "ResponseCacheConfiguration", "StorefrontScriptResponseFactoryFacade", "app system"]
summary: "ADR: apps expose custom Admin API, Store API and Storefront endpoints via script hooks under /…/script/{hook}, with a response service and cache control."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-01-06, area: core) that lets apps define their own Admin API, Store API and Storefront endpoints as App Scripts (Twig scripts in the app's `Resources/scripts` folder), executed when a generic script route is called.

## When to use

An app needs an endpoint that loads or writes data, returns JSON, redirects, renders a Storefront page, or controls caching — without an external app server and without `manifest.xml` configuration.

## Key steps / config

**Routes and hook names** — the `{hook}` segment becomes the hook name, prefixed per area:

| Route | Route name | Hook name |
|---|---|---|
| `/api/script/{hook}` | `api.script_endpoint` | `api-{hook}` |
| `/store-api/script/{hook}` | `store-api.script_endpoint` | `store-api-{hook}` |
| `/storefront/script/{hook}` | `frontend.script_endpoint` | `storefront-{hook}` |

API scripts get `request.request.all` and the (sales channel) context; Storefront scripts also get `request.query.all` and a `GenericPage` as `page`. Several scripts can run per hook; `hook.stopPropagation()` stops the rest. Use your vendor prefix in hook names.

**Responses** — built with the `response` service and assigned to the hook (none set → empty 204, per the ADR):

```twig
{% set response = services.response.json({'data': data}, statusCode) %}
{% set response = services.response.redirect('routeName', params, statusCode) %}
{% do hook.setResponse(response) %}
```

`json()` defaults to 200, `redirect()` to 302. In Storefront hooks, rendering a template goes through `Shopware\Storefront\Framework\Script\Api\StorefrontScriptResponseFactoryFacade` (`services.response.render('@myApp/storefront/pages/my-custom-page.html.twig', { 'page': hook.page })`); it throws outside a `SalesChannelContext`.

**Caching** — `/storefront` and `/store-api` script routes are cached by default (opt-out); cache config on `/api` responses is ignored:

```twig
{% do response.cache.invalidationState('logged-in', 'cart-filled') %}
{% do response.cache.maxAge(7200) %}
{% do response.cache.disable() %}
{% do response.cache.tag('my-manufacturer-tag-' ~ manufacturerId) %}
```

**Invalidation** — the `cache-invalidation` hook runs on `EntityWrittenContainerEvent`:

```twig
{% set ids = hook.event.getIds('manufacturer').only('update').with('name', 'url') %}
{% do services.cache.invalidate(tags) %}
```

`only()` takes `insert`, `update`, `delete`; `with()` matches if any listed property changed.

## Essential identifiers

- `hook.setResponse()`, `hook.stopPropagation()`, `services.response`
- `response.cache`, `cache-invalidation`, `hook.event.getIds()`, `services.cache.invalidate()`

## Gotchas

- The ADR's `hook.context.ensureLogin()` helper (throwing `CustomerNotLoggedInException`) is not present in 6.7 code.
- The chained `hook.event.get(...)` form does not exist (use `getIds()`); `'upated'` in the ADR is a typo for `update`.
- No SEO URLs for script routes; the ADR defers that to future lifecycle scripts.

## Version notes

- Core `ScriptResponseFactoryFacade::render()` is deprecated for v6.8.0: render only from Storefront hooks via `StorefrontScriptResponseFactoryFacade`.

## Code check (6.7.15.1)
- confirmed `/api/script/{hook}` — route api.script_endpoint — vendor/shopware/core/Framework/Script/Api/ScriptApiRoute.php:34
- confirmed `/store-api/script/{hook}` — route store-api.script_endpoint — vendor/shopware/core/Framework/Script/Api/ScriptStoreApiRoute.php:36
- confirmed `/storefront/script/{hook}` — route frontend.script_endpoint — vendor/shopware/storefront/Controller/ScriptController.php:34
- confirmed `StoppableHook::stopPropagation()` — interface for stoppable hooks — vendor/shopware/core/Framework/Script/Execution/Awareness/StoppableHook.php:13
- confirmed `ScriptResponseFactoryFacade::redirect()` — default code HTTP_FOUND (302) — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:70
- deprecated `ScriptResponseFactoryFacade::render()` — tag:v6.8.0, use StorefrontScriptResponseFactoryFacade — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:86
- confirmed `StorefrontScriptResponseFactoryFacade::render()` — Storefront-hook render — vendor/shopware/storefront/Framework/Script/Api/StorefrontScriptResponseFactoryFacade.php:44
- confirmed `cache-invalidation` — CacheInvalidationHook::HOOK_NAME — vendor/shopware/core/Framework/Adapter/Cache/Script/CacheInvalidationHook.php:23
- corrected `WrittenEventScriptFacade::getIds()` — docs: also chained hook.event.get() — vendor/shopware/core/Framework/Adapter/Cache/Script/Facade/WrittenEventScriptFacade.php:22
- absent `ensureLogin` — no such helper on SalesChannelContext or any facade
