---
id: platform/dev/6.6/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.md
title: Custom endpoint script services reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/script-reference/custom-endpoint-script-services-reference.html
sourceHash: 4cf106fb39be317ca84cc963756fa621a8db6be2
keywords: ["services.cache", "CacheInvalidatorFacade", "services.writer", "RepositoryWriterFacade", "services.response", "ScriptResponseFactoryFacade", "upsert", "sync", "hook.setResponse", "custom api endpoint script", "cache invalidation script"]
summary: "Reference for custom-endpoint script services: services.cache, services.writer (upsert/delete/sync) and services.response (json/redirect/render)."
lastBuilt: 2026-09-15
---
## What it is

This page documents the PHP facade classes for app scripts that implement custom API endpoints: `services.cache` (`CacheInvalidatorFacade`), `services.writer` (`RepositoryWriterFacade`), and `services.response` (`ScriptResponseFactoryFacade`).

## Key steps / config

`services.cache` (`Shopware\Core\Framework\Adapter\Cache\Script\Facade\CacheInvalidatorFacade`): `invalidate(tags)` invalidates all cache entries with the given tags (array).

`services.writer` (`Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryWriterFacade`) — requires the app to have correct data permissions: `upsert(entityName, payload)` creates or updates entities (update if `id` is present and exists, else create), returns `EntityWrittenContainerEvent`; `delete(entityName, payload)` deletes entities by primary key, returns `EntityWrittenContainerEvent`; `sync(payload)` executes multiple upsert/delete operations in one call, returns `Shopware\Core\Framework\Api\Sync\SyncResult`.

```twig
{% do services.writer.upsert('tax', [
    { 'name': 'new Tax', 'taxRate': 99.9 }
]) %}
```

`services.response` (`Shopware\Core\Framework\Script\Api\ScriptResponseFactoryFacade`) returns `Shopware\Core\Framework\Script\Api\ScriptResponse`, which must be assigned via `hook.setResponse()`: `json(data, code = 200)`; `redirect(route, parameters, code = 302)`; `render(view, parameters)` renders a twig template into a `StorefrontResponse` — throws if called outside a `SalesChannelContext` or if the Storefront bundle is not installed.

```twig
{% set response = services.response.json({ 'foo': 'bar' }) %}
{% do hook.setResponse(response) %}
```

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Cache\Script\Facade\CacheInvalidatorFacade` (`services.cache`)
- `Shopware\Core\Framework\DataAbstractionLayer\Facade\RepositoryWriterFacade` (`services.writer`)
- `Shopware\Core\Framework\Script\Api\ScriptResponseFactoryFacade` (`services.response`)
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityWrittenContainerEvent`
- `Shopware\Core\Framework\Api\Sync\SyncResult`
- `Shopware\Core\Framework\Script\Api\ScriptResponse`
- `hook.setResponse()`

## Gotchas

- `render()` throws an exception when called outside a `SalesChannelContext` (e.g. from an `/api` route) or if the Storefront bundle is not installed.
- Both `upsert()`/`delete()`/`sync()` on `services.writer` require the app to hold correct write permissions for the target entity.
