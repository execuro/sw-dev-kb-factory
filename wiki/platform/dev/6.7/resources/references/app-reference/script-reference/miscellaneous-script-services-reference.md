---
id: platform/dev/6.7/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.md
title: Miscellaneous script services reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/miscellaneous-script-services-reference.html
sourceHash: 960463ce3b8555bbfdb883d45d1ca249d1a101e2
codeCheckedAgainst: "6.7.15.1"
keywords: ["services.request", "services.acl", "services.config", "RequestFacade", "AclFacade", "ArrayFacade", "SystemConfigFacade", "system_config:read", "app scripts", "request headers", "app config", "privilege check", "array manipulation"]
summary: App script services services.request, services.acl and services.config, plus the ArrayFacade wrapper and its methods for array manipulation in scripts.
lastBuilt: 2026-10-21
---
## What it is

Reference for helper services available inside app scripts: `services.request` (`Shopware\Core\Framework\Routing\Facade\RequestFacade`) for reading the current request, `services.acl` (`Shopware\Core\Framework\Script\Api\AclFacade`) for privilege checks, `services.config` (`Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade`) for config values, and the `Shopware\Core\Framework\Script\Facade\ArrayFacade` wrapper used for arrays such as a line item `payload`.

## When to use

- Custom endpoint scripts that need to inspect the HTTP method, body, query or headers of the request and return a response.
- Scripts that must check whether the app was granted a privilege before loading data.
- Reading the app's own `config.xml` values or shop-wide system config.
- Manipulating array data (e.g. `product.payload`) inside cart or other scripts.

## Key steps / config

### `services.request`

All methods take no arguments:

| Method | Returns |
|---|---|
| `method()` | request method in upper case (`string`) |
| `request()` | post parameters (`array`); on `application/json` requests also the parsed JSON body |
| `query()` | query parameters (`array`) |
| `headers()` | request headers (`array`), restricted to `content-type`, `content-length`, `accept`, `accept-language`, `user-agent`, `referer` |
| `cookies()` | request cookies (`array`) |
| `ip()` | real client IP (`string` or `null`) |
| `scheme()` | request scheme |
| `pathInfo()` | path info; may be an internal link when a SEO URL is used |
| `uri()` | request URI with the resolved URL |

```twig
{% block response %}
  {% if services.request.method != "POST" %}
    {% set response = services.response.json({ 'error': 'Only POST requests are allowed' }, 405) %}
    {% do hook.setResponse(response) %}
    {% return %}
  {% endif %}
  {% do hook.setResponse(services.response.json(services.request.request)) %}
{% endblock %}
```

### `services.acl`

`can(string privilege): bool` — e.g. `services.acl.can('product:read')`, then query data only if `true`.

### `services.config`

- `app(string key, ?string salesChannelId = null)` — reads your own app's configuration (key as named in `config.xml`, e.g. `exampleTextField`); no extra privileges needed.
- `get(string key, ?string salesChannelId = null)` — reads any system config value (e.g. `core.listing.productsPerPage`); requires the `system_config:read` privilege.
- Without `salesChannelId`, the sales channel of the current context is used.

### `ArrayFacade`

Usable like a normal Twig array, plus: `all()`, `count()`, `push(value)`, `set(key, value)`, `remove(value)` (no-op if absent), `removeBy(index)`, `reset()`, `merge(array|ArrayFacade)` (recursive merge), `replace(array|ArrayFacade)` (recursive replace).

```twig
{% do product.payload.set('test', 1) %}
{% do product.payload.merge(array({'bar': 'foo', 'baz': true})) %}
```

## Essential identifiers

- `Shopware\Core\Framework\Routing\Facade\RequestFacade` (`services.request`)
- `Shopware\Core\Framework\Script\Api\AclFacade` (`services.acl`)
- `Shopware\Core\System\SystemConfig\Facade\SystemConfigFacade` (`services.config`)
- `Shopware\Core\Framework\Script\Facade\ArrayFacade`
- privilege `system_config:read`

## Gotchas

- `headers()` silently drops every header not on the allow-list above (e.g. authorization or custom headers are not readable).
- `services.config.get()` fails without `system_config:read`; use `app()` for your own app's settings instead.

## Code check (6.7.15.1)
- confirmed `RequestFacade::ALLOWED_PARAMETERS` — header allow-list content-type, content-length, accept, accept-language, user-agent, referer — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:34
- confirmed `RequestFacade::method()` — returns `string` — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:75
- confirmed `RequestFacade::ip()` — returns `?string` — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:55
- confirmed `RequestFacade::headers()` — filtered via `array_intersect_key` against the allow-list — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:127
- confirmed `RequestFacade::cookies()` — returns `array` — vendor/shopware/core/Framework/Routing/Facade/RequestFacade.php:139
- confirmed `AclFacade::can()` — `can(string $privilege): bool` — vendor/shopware/core/Framework/Script/Api/AclFacade.php:29
- confirmed `SystemConfigFacade::get()` — guarded by `system_config:read` — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:49
- confirmed `SystemConfigFacade::app()` — `app(string $key, ?string $salesChannelId = null)` — vendor/shopware/core/System/SystemConfig/Facade/SystemConfigFacade.php:77
- confirmed `ArrayFacade::merge()` — accepts `array|ArrayFacade` — vendor/shopware/core/Framework/Script/Facade/ArrayFacade.php:106
- confirmed `ArrayFacade::removeBy()` — `removeBy(string|int $index)` — vendor/shopware/core/Framework/Script/Facade/ArrayFacade.php:70
