---
id: platform/dev/6.7/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.md
title: Custom Endpoint script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.html
sourceHash: d48fc7d3ec971639a953824a0f797b77cf7b2caa
codeCheckedAgainst: "6.7.15.1"
keywords: ["services.cache", "services.writer", "services.response", "CacheInvalidatorFacade", "RepositoryWriterFacade", "ScriptResponseFactoryFacade", "ScriptResponse", "hook.setResponse", "custom endpoint", "cache invalidation", "upsert", "json response", "redirect"]
summary: Script services for app custom endpoints - services.cache invalidate(), services.writer upsert/delete/sync, services.response json/redirect.
lastBuilt: 2026-10-21
---
## What it is

Reference of the app script services used in custom endpoint scripts: `services.cache` (`Shopware\Core\Framework\Adapter\Cache\Script\Facade\CacheInvalidatorFacade`), `services.writer` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryWriterFacade`) and `services.response` (`Shopware\Core\Framework\Script\Api\ScriptResponseFactoryFacade`).

## When to use

When an app script must invalidate cache tags after entity writes, write or delete data inside Shopware, or build the HTTP response of a custom API/store-api/storefront endpoint.

## Key steps / config

### `services.cache`

- `invalidate(array tags)` — invalidates all cache entries with the given tags.

```twig
{% set ids = hook.event.getIds('product') %}
{% set ids = ids.only('insert').with('description', 'parentId') %}
{% if ids.empty %}{% return %}{% endif %}
{% set tags = [] %}
{% for id in ids %}{% set tags = tags|merge(['my-product-' ~ id]) %}{% endfor %}
{% do services.cache.invalidate(tags) %}
```

### `services.writer`

The app needs the matching permissions for every entity it writes.

- `upsert(string entityName, array payload)` → `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenContainerEvent`. Payload is a list of entity arrays; with an existing `id` it updates, otherwise creates.
- `delete(string entityName, array payload)` → `EntityWrittenContainerEvent`. Payload is a list of primary-key arrays, e.g. `[{ 'id': hook.productId }]`.
- `sync(array payload)` → `Shopware\Core\Framework\Api\Sync\SyncResult`. Each operation has `entity`, `action` (`upsert`/`delete`), `payload`, and optionally `key`.

```twig
{% do services.writer.sync([
    { 'entity': 'product', 'action': 'upsert', 'payload': [{ 'id': hook.updateProductId, 'active': true }] },
    { 'entity': 'product', 'action': 'delete', 'payload': [{ 'id': hook.deleteProductId }] }
]) %}
```

### `services.response`

Both methods return `Shopware\Core\Framework\Script\Api\ScriptResponse`; assign it with `hook.setResponse()`.

- `json(array data, int code = 200)` — JSON response.
- `redirect(string route, array parameters, int code = 302)` — redirect to a named route, e.g. `api.product.detail` or `frontend.detail.page`.

```twig
{% set response = services.response.json({ 'foo': 'bar' }) %}
{% do hook.setResponse(response) %}
{% set response = services.response.redirect('frontend.detail.page', { 'productId': productId }) %}
```

For Administration action buttons, the JSON body follows the action-button shape: `{ "actionType": "notification", "payload": { "status": ..., "message": ... } }`.

## Essential identifiers

- `services.cache`, `services.writer`, `services.response`, `hook.setResponse()`
- `CacheInvalidatorFacade::invalidate()`, `RepositoryWriterFacade::upsert()`, `RepositoryWriterFacade::delete()`, `RepositoryWriterFacade::sync()`
- `ScriptResponseFactoryFacade::json()`, `ScriptResponseFactoryFacade::redirect()`, `ScriptResponse`

## Gotchas

- `render()` on the core response service is deprecated (tag:v6.8.0). In Storefront script hooks type the response service as `Shopware\Storefront\Framework\Script\Api\StorefrontScriptResponseFactoryFacade`, which provides `render(view, parameters = [])`; in admin-api/store-api hooks use the core facade without `render()`.
- Rendering throws outside a `SalesChannelContext` (e.g. from an `/api` route) and requires the Storefront bundle; pass the hook's `page` parameter to the template.

## Version notes

- The core `ScriptResponseFactoryFacade::render()` path is removed in 6.8.0; the Storefront facade keeps `render()`.

## Code check (6.7.15.1)
- confirmed `CacheInvalidatorFacade::invalidate()` — array of tags — vendor/shopware/core/Framework/Adapter/Cache/Script/Facade/CacheInvalidatorFacade.php:32
- confirmed `RepositoryWriterFacade::upsert()` — entityName, payload; returns EntityWrittenContainerEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryWriterFacade.php:45
- confirmed `RepositoryWriterFacade::delete()` — entityName, payload of primary keys — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryWriterFacade.php:62
- confirmed `RepositoryWriterFacade::sync()` — operations with entity, action, payload, optional key — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryWriterFacade.php:78
- confirmed `ScriptResponseFactoryFacade::json()` — default code 200 — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:50
- confirmed `ScriptResponseFactoryFacade::redirect()` — default code 302 (HTTP_FOUND) — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:70
- deprecated `ScriptResponseFactoryFacade::render()` — tag:v6.8.0, use the Storefront facade — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:86
- confirmed `StorefrontScriptResponseFactoryFacade::render()` — Storefront replacement for rendering — vendor/shopware/storefront/Framework/Script/Api/StorefrontScriptResponseFactoryFacade.php:44
