---
id: platform/dev/6.6/resources/references/adr/2022-01-06-custom-app-api-endpoints.md
title: Allow apps to define custom api endpoints
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-01-06-custom-app-api-endpoints.html
sourceHash: 4ea979fce870a49594da7d77ce8fdd40f96587b6
keywords: ["custom api endpoints", "api/script", "store-api/script", "storefront/script", "hook.stopPropagation", "hook.setResponse", "services.response.json", "services.response.redirect", "services.response.render", "cache-invalidation hook", "CustomerNotLoggedInException", "app scripts"]
summary: ADR adding /api/script/{hook}, /store-api/script/{hook} and /storefront/script/{hook} endpoints so apps can run custom scripted logic with no manifest config.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record adding new API/Store-API/Storefront endpoints that dispatch to app scripts, letting apps implement custom logic outside the automatic entity API without manifest XML configuration.

## When to use
Relevant when an app needs a custom read/write endpoint or a custom storefront route that isn't covered by the automatic entity API.

## Key steps / config
New endpoints, `{hook}` prefixed by the route's url prefix:
- `/api/script/{hook}`
- `/store-api/script/{hook}`
- `/storefront/script/{hook}`

Multiple scripts may run per hook; call `hook.stopPropagation()` to stop further scripts on API hooks. The storefront hook script must assign a response to be returned:

```twig
{% do hook.setResponse(response) %}
```

Response factories:

```twig
{% set response = services.response.json({'data': data}, statusCode) %}
{% set response = services.response.redirect('routeName', params, statusCode) %}
{% set response = services.response.render('@myApp/storefront/pages/my-custom-page.html.twig', { 'page': hook.page }) %}
```

Login check helper:

```twig
{% do hook.context.ensureLogin() %}
```

Response caching controls:

```twig
{% do response.cache.invalidationState('logged-in', 'cart-filled') %}
{% do response.cache.maxAge(7200) %}
{% do response.cache.disable() %}
{% do response.cache.tag('my-manufacturer-tag-' ~ manufacturerId, 'another-tag') %}
```

Individual cache invalidation uses a new `cache-invalidation` hook point on `EntityWrittenContainerEvent`, wrapped so scripts specify the entity and filter matched ids:

```twig
{% set ids = hook.event.get('manufacturer').only('upated').with(['name', 'url']) %}
{% do services.cache.invalidate(tags) %}
```

## Essential identifiers
- `/api/script/{hook}`, `/store-api/script/{hook}`, `/storefront/script/{hook}`
- `hook.stopPropagation()`, `hook.setResponse()`
- `services.response.json()` / `.redirect()` / `.render()`
- `CustomerNotLoggedInException`
- `cache-invalidation` hook point

## Gotchas
- If no response is set on a storefront/api script hook, an empty 204 response is sent by default.
- `services.response.render()` throws when called outside a `SalesChannelContext` (e.g. from an `/api` endpoint) or when the storefront bundle isn't installed.
- `/storefront` and `/store-api` routes are cached by default (opt-out); `/api` routes do not support caching, and cache configuration on their responses is ignored.
- No manifest XML configuration is needed or preferred for app scripts/custom endpoints — everything lives in the app's `Resources/scripts` folder.
- SEO URLs and static custom routes were explicitly not added in this iteration; a separate ADR is planned for lifecycle scripts to handle such setup needs instead.

## Version notes
This ADR explicitly defers SEO URL support and custom static routes to a future, separate ADR covering lifecycle scripts.
