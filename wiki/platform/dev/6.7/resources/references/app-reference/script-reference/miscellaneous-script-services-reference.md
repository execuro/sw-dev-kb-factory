---
id: platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md
title: Miscellaneous script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.html
sourceHash: 960463ce3b8555bbfdb883d45d1ca249d1a101e2
codeCheckedAgainst: "6.7.13.0"
keywords: ["services.request", "RequestFacade", "services.acl", "AclFacade", "ArrayFacade", "services.config", "SystemConfigFacade", "system_config:read", "app scripts", "script services", "twig script request headers", "app config value"]
summary: "App script services services.request (RequestFacade), services.acl (AclFacade), services.config (SystemConfigFacade) and the ArrayFacade array wrapper."
lastBuilt: 2026-09-15
---
## What it is

Reference for the miscellaneous services available inside app scripts (Twig): `services.request` to read the current request, `services.acl` to check app privileges, `services.config` to read system/app configuration, and `ArrayFacade`, the wrapper used for arrays such as `product.payload`.

## When to use

Use when writing an app script (e.g. a custom API/Store-API endpoint script or a cart/page hook) that must inspect the incoming request, gate logic on granted privileges, read configuration, or manipulate a script-side array.

## Key steps / config

### `services.request` — `Shopware\Core\Framework\Routing\Facade\RequestFacade`

- `method()` — request method in upper case (`string`).
- `uri()` — request URI with resolved URL; `pathInfo()` — path info (may be an internal link when a SEO URL is used); `scheme()`; `ip()` — real client IP (`string|null`).
- `query()` — query parameters; `request()` — POST parameters, on `application/json` requests also the parsed JSON body.
- `headers()` — only `content-type`, `content-length`, `accept`, `accept-language`, `user-agent`, `referer` are accessible.
- `cookies()` — all request cookies as array.

```twig
{% block response %}
  {% if services.request.method != "POST" %}
    {% set response = services.response.json({'error': '...'}, 405) %}
    {% do hook.setResponse(response) %}
    {% return %}
  {% endif %}
  {% set response = services.response.json(services.request.request) %}
  {% do hook.setResponse(response) %}
{% endblock %}
```

### `services.acl` — `Shopware\Core\Framework\Script\Api\AclFacade`

- `can(string privilege): bool` — e.g. `services.acl.can('product:read')` before `services.repository.search('product', criteria)`.

### `Shopware\Core\Framework\Script\Facade\ArrayFacade`

Accessible like a normal Twig array (iterable, array access, countable). Methods: `all()`, `count()`, `merge(array|ArrayFacade)` (recursive merge), `replace(array|ArrayFacade)` (recursive replace), `push(value)`, `set(key, value)`, `remove(value)` (no-op if missing), `removeBy(index)`, `reset()`.

```twig
{% set my_array = array({'bar': 'foo', 'baz': true}) %}
{% do product.payload.merge(my_array) %}
{% do product.payload.set('test', 1) %}
```

### `services.config` — `Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade`

- `get(string key, ?string salesChannelId = null)` — any system config value, e.g. `core.listing.productsPerPage`; requires the app privilege `system_config:read`.
- `app(string key, ?string salesChannelId = null)` — value from the app's own `config.xml` (e.g. `exampleTextField`); no extra privilege. The installed code prefixes the key with `<AppName>.config.`.
- When `salesChannelId` is omitted, the current context's sales channel is used.

## Essential identifiers

- `Shopware\Core\Framework\Routing\Facade\RequestFacade` (`services.request`)
- `Shopware\Core\Framework\Script\Api\AclFacade` (`services.acl`)
- `Shopware\Core\Framework\Script\Facade\ArrayFacade`
- `Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade` (`services.config`)
- `system_config:read`

## Gotchas

- `services.request.headers()` does not expose arbitrary headers — only the six listed above.
- `services.config.get()` throws a missing-privilege error when the app lacks `system_config:read`.
- `services.config.app()` throws a `BadMethodCallException` when called outside app scripts.

## Code check (6.7.13.0)
- confirmed `RequestFacade::headers()` — filtered to the six-entry allowlist — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:127
- confirmed `RequestFacade::request()` — returns post parameters — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:116
- confirmed `RequestFacade::ip()` — returns `?string` — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:55
- confirmed `AclFacade::can()` — `can(string $privilege): bool` — vendor/shopware/core/Framework/Script/Api/AclFacade.php:29
- confirmed `ArrayFacade` — implements `IteratorAggregate`, `ArrayAccess`, `Countable` — vendor/shopware/core/Framework/Script/Facade/ArrayFacade.php:29
- confirmed `ArrayFacade::merge()` — accepts `array|ArrayFacade` — vendor/shopware/core/Framework/Script/Facade/ArrayFacade.php:106
- confirmed `ArrayFacade::removeBy()` — accepts `string|int` index — vendor/shopware/core/Framework/Script/Facade/ArrayFacade.php:70
- confirmed `system_config:read` — privilege constant checked by `get()` — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:20
- confirmed `SystemConfigFacade::get()` — optional `?string $salesChannelId = null` — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:49
- confirmed `SystemConfigFacade::app()` — only callable from app scripts; key prefixed with app name — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:77
