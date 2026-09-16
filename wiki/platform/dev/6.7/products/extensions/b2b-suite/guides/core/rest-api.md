---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/rest-api.md
title: REST API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/rest-api.html
sourceHash: 4022360fe97cd89a9087004d4292cb5ffc648844
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "rest api", "api/b2b", "RouteProvider", "b2b_common.rest_route_provider", "getRoutes", "api controller", "Shopware\\B2B\\Common\\MvcExtension\\Request", "fastroute", "swagger", "route placeholders", "custom api route"]
summary: "B2B Suite REST API: controllers with *Action methods, routes under /api/b2b from RouteProvider services tagged b2b_common.rest_route_provider."
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite extends the REST API with its own deeply nested routes under `/api/b2b`. Unlike the Shopware API it reuses the services defined for the Storefront. Endpoints are documented in a `swagger.json` file (viewable with Swagger UI).

## When to use

When adding your own B2B API endpoints, or when defining routes with placeholders passed to controller actions.

## Key steps / config

1. **Controller.** A plain PHP class registered in the DIC. Actions are public methods suffixed with `Action`; they receive `Shopware\B2B\Common\MvcExtension\Request` and return an array that is converted to JSON automatically.

```php
class MyApiController
{
    public function helloAction(Request $request): array
    {
        return ['message' => 'hello'];
    }
}
```

2. **Route provider.** Implement `Shopware\B2B\Common\Routing\RouteProvider`; `getRoutes(): array` returns arrays of `[HTTP method, sub-route, DIC controller id, action method name]`:

```php
return [
    ['GET', '/my/hello', 'my.api_controller', 'hello'],
];
```

The sub-route is appended to the shop's `/api/b2b` base path (e.g. `/api/b2b/my/hello`).

3. **Register** controller and provider; tag the provider with `b2b_common.rest_route_provider` (the tag triggers route registration):

```php
$services->set('my.controller', My\Namespace\MyApiController::class);
$services->set('my.api_route_provider', My\Namespace\DependencyInjection\MyApiRouteProvider::class)
    ->tag('b2b_common.rest_route_provider');
```

4. **Placeholders.** Routes are parsed with FastRoute. For parameters, add a fifth element listing the order in which placeholder values are passed to the action:

```php
['GET', '/my/hello/{name}', 'my.api_controller', 'hello', ['name']]
```

The action then receives them before the request: `helloAction(string $name, Request $request)`.

## Essential identifiers

- `Shopware\B2B\Common\Routing\RouteProvider` (`getRoutes()`)
- `Shopware\B2B\Common\MvcExtension\Request`
- Service tag `b2b_common.rest_route_provider`
- Base route `/api/b2b`

## Gotchas

- The source registers the controller as `my.controller` but references `my.api_controller` in the route arrays; the controller id in the route must match the registered service id.

## Code check (6.7.13.0)
- unverified `Shopware\B2B\Common\Routing\RouteProvider` — B2B Suite package not installed; not in vendor/shopware core/storefront/administration
- unverified `RouteProvider::getRoutes()` — B2B Suite package not installed
- unverified `Shopware\B2B\Common\MvcExtension\Request` — B2B Suite package not installed
- unverified `b2b_common.rest_route_provider` — tag not found in the installed Shopware packages
- unverified `/api/b2b` — route prefix not found in vendor/shopware/core
