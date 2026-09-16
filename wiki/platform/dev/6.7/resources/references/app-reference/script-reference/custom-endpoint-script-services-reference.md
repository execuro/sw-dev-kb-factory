---
id: platform/dev/6.7/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.md
title: Custom Endpoint script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.html
sourceHash: d48fc7d3ec971639a953824a0f797b77cf7b2caa
codeCheckedAgainst: "6.7.13.0"
keywords: ["services.cache", "services.writer", "services.response", "CacheInvalidatorFacade", "RepositoryWriterFacade", "ScriptResponseFactoryFacade", "StorefrontScriptResponseFactoryFacade", "hook.setResponse", "custom endpoint", "app scripts", "cache invalidation", "json response"]
summary: "App script custom endpoint services: services.cache invalidate, services.writer upsert/delete/sync, services.response json/redirect/render."
lastBuilt: 2026-09-15
---
## What it is

Reference for three app-script services available in custom endpoint scripts: `services.cache` (`Shopware\Core\Framework\Adapter\Cache\Script\Facade\CacheInvalidatorFacade`), `services.writer` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryWriterFacade`) and `services.response` (`Shopware\Core\Framework\Script\Api\ScriptResponseFactoryFacade`).

## When to use

When an app script must invalidate cache tags, write or delete entities, or build the HTTP response for a custom API/Store API/Storefront endpoint or an admin action button.

## Key steps / config

**`services.cache`**
- `invalidate(array tags)` — invalidates all cache entries with the given tags. Tags can be built from written ids, e.g. `hook.event.getIds('product')`, optionally narrowed with `.only('insert').with('description', 'parentId')`.

**`services.writer`** — the app needs write permissions for the entities it touches.
- `upsert(entityName, payload)` → `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenContainerEvent`; creates, or updates when an existing `id` is passed.
- `delete(entityName, payload)` → `EntityWrittenContainerEvent`; payload is a list of primary-key arrays.
- `sync(payload)` → `Shopware\Core\Framework\Api\Sync\SyncResult`; multiple operations in one call:

```twig
{% do services.writer.sync([
    { 'entity': 'product', 'action': 'upsert', 'payload': [ { 'id': hook.updateProductId, 'active': true } ] },
    { 'entity': 'product', 'action': 'delete', 'payload': [ { 'id': hook.deleteProductId } ] },
]) %}
```

**`services.response`** — every method returns `Shopware\Core\Framework\Script\Api\ScriptResponse`, which must be assigned with `hook.setResponse()`.
- `json(array data, int code = 200)`.
- `redirect(route, parameters, code = 302)`, e.g. `'api.product.detail'` or `'frontend.detail.page'`.

```twig
{% set response = services.response.json({ 'foo': 'bar' }) %}
{% do hook.setResponse(response) %}
```

Admin action button responses use the JSON shape `{ "actionType": "notification", "payload": { "status": ..., "message": ... } }`.

**Rendering Storefront templates**: in Storefront script hooks, type the response service as `Shopware\Storefront\Framework\Script\Api\StorefrontScriptResponseFactoryFacade`, whose own template-rendering method takes a view name (e.g. `@Storefront/storefront/page/content/detail.html.twig`) and parameters; pass `hook.page` as `page`. It throws outside a `SalesChannelContext`.

## Essential identifiers

- `services.cache`, `services.writer`, `services.response`
- `Shopware\Core\Framework\Adapter\Cache\Script\Facade\CacheInvalidatorFacade`
- `Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryWriterFacade`
- `Shopware\Core\Framework\Script\Api\ScriptResponseFactoryFacade`
- `Shopware\Storefront\Framework\Script\Api\StorefrontScriptResponseFactoryFacade`
- `Shopware\Core\Framework\Script\Api\ScriptResponse`, `hook.setResponse()`

## Gotchas

- Forgetting `hook.setResponse(response)` means the created response is not used.
- The core `ScriptResponseFactoryFacade::render()` is deprecated (tag:v6.8.0); in admin-api/store-api hooks use the core facade without `render()`, and in Storefront hooks use the Storefront facade.

## Version notes

- Deprecated for 6.8.0: rendering Storefront templates through the core `response` service (`render()`); the Storefront facade provides the replacement.

## Code check (6.7.13.0)
- confirmed `CacheInvalidatorFacadeHookFactory::getName()` — service name `cache` — vendor/shopware/core/Framework/Adapter/Cache/Script/Facade/CacheInvalidatorFacadeHookFactory.php:28
- confirmed `CacheInvalidatorFacade::invalidate()` — array of tags — vendor/shopware/core/Framework/Adapter/Cache/Script/Facade/CacheInvalidatorFacade.php:32
- confirmed `RepositoryWriterFacadeHookFactory::getName()` — service name `writer` — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryWriterFacadeHookFactory.php:37
- confirmed `RepositoryWriterFacade::upsert()` — returns EntityWrittenContainerEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryWriterFacade.php:45
- confirmed `RepositoryWriterFacade::sync()` — returns SyncResult — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryWriterFacade.php:78
- confirmed `ScriptResponseFactoryFacadeHookFactory::getName()` — service name `response` — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacadeHookFactory.php:44
- confirmed `ScriptResponseFactoryFacade::json()` — default code HTTP_OK — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:50
- confirmed `ScriptResponseFactoryFacade::redirect()` — default code HTTP_FOUND — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:70
- deprecated `ScriptResponseFactoryFacade::render()` — tag:v6.8.0 — vendor/shopware/core/Framework/Script/Api/ScriptResponseFactoryFacade.php:95
- confirmed `StorefrontScriptResponseFactoryFacade` — Storefront replacement for rendering, extends core facade — vendor/shopware/storefront/Framework/Script/Api/StorefrontScriptResponseFactoryFacade.php:19
