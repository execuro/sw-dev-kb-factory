---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/rest-api.md
title: REST API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/rest-api.html
sourceHash: 4022360fe97cd89a9087004d4292cb5ffc648844
codeCheckedAgainst: "6.7.15.1"
keywords: ["RouteProvider", "b2b_common.rest_route_provider", "/api/b2b", "getRoutes", "Shopware\\B2B\\Common\\MvcExtension\\Request", "Action suffix", "FastRoute", "swagger.json", "b2b suite", "rest api", "api controller", "custom route", "route placeholder"]
summary: "B2B Suite REST API: plain controllers with *Action methods, routes from RouteProvider services tagged b2b_common.rest_route_provider under /api/b2b."
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite's own extension of the REST API. Unlike Shopware's implementation, it reuses the services defined for the Storefront. Endpoints are documented in a `swagger.json` (swagger.io format, viewable with Swagger UI) in the B2B repository. The source links a downloadable `B2bRestApi` example plugin.

## When to use

When adding your own B2B API endpoints, including deeply nested routes with placeholders, below the `/api/b2b` prefix.

## Key steps / config

1. **Controller** — a plain PHP class registered in the DIC. An action is a public method suffixed with `Action`; it is always called with `Shopware\B2B\Common\MvcExtension\Request`. A returned array is converted to JSON automatically:

```php
class MyApiController
{
    public function helloAction(Request $request): array
    {
        return ['message' => 'hello'];
    }
}
```

2. **Route provider** — implement `Shopware\B2B\Common\Routing\RouteProvider`; `getRoutes(): array` returns routes as simple arrays of HTTP method, sub-route (concatenated to `/api/b2b`), DIC controller id and action method name (without `Action`):

```php
return [
    ['GET', '/my/hello', 'my.api_controller', 'hello'],
];
```

3. **Register both** in the DIC and tag the provider with `b2b_common.rest_route_provider` (this tag triggers route registration):

```php
$services->set('my.controller', My\Namespace\MyApiController::class);
$services->set('my.api_route_provider', My\Namespace\DependencyInjection\MyApiRouteProvider::class)
    ->tag('b2b_common.rest_route_provider');
```

4. **Placeholders** — the route parser is FastRoute (nikic/FastRoute). For parameters, add a fifth element defining the order in which they are passed to the action:

```php
['GET', '/my/hello/{name}', 'my.api_controller', 'hello', ['name']]
// public function helloAction(string $name, Request $request)
```

## Essential identifiers

- `Shopware\B2B\Common\Routing\RouteProvider` / `getRoutes()`
- `Shopware\B2B\Common\MvcExtension\Request`
- DIC tag `b2b_common.rest_route_provider`
- route prefix `/api/b2b`

## Gotchas

- The source example registers the controller as `my.controller` but the route references `my.api_controller`; the fourth route element must match the controller's actual service id.
- Placeholder values are passed before the `Request` argument, in the order given by the fifth route element.

## Code check (6.7.15.1)
- unverified `RouteProvider` — B2B Suite plugin interface (`Shopware\B2B`), not in the installed core/storefront/administration code
- unverified `b2b_common.rest_route_provider` — B2B Suite DIC tag, not found in installed core/storefront/administration code
- unverified `Shopware\B2B\Common\MvcExtension\Request` — B2B Suite plugin class, out of scope of the installed code
- unverified `FastRoute` — third-party router used by the B2B Suite, out of scope
