---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/rest-api.md
title: REST API
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/rest-api.html"
sourceHash: 9b6e7747c43f09f765149255c46858196204de36
keywords: ["rest api", "b2b suite", "RouteProvider", "b2b_common.rest_route_provider", "FastRoute", "MvcExtension", "Request", "Action suffix", "DIC controller", "routing", "swagger"]
summary: "B2B Suite REST API: plain PHP controllers with Action-suffixed methods, routes registered via a tagged RouteProvider service."
lastBuilt: "2026-09-15"
---
## What it is
Documents the B2B Suite's own REST API extension, which reuses Storefront services rather than the Doctrine ORM used by Shopware's default API, and is documented via a generated `swagger.json` viewable with Swagger UI.

## Key steps / config
A controller is a plain PHP class registered in the DIC; each action is a public method suffixed `Action` and receives `Shopware\B2B\Common\MvcExtension\Request`:

```php
class MyApiController
{
    public function helloAction(Request $request): array
    {
        return ['message' => 'hello']; // converted to JSON automatically
    }
}
```

Routes are deeply nested (unlike the default API) and are registered by implementing `Shopware\B2B\Common\Routing\RouteProvider`:

```php
class MyApiRouteProvider implements RouteProvider
{
    public function getRoutes(): array
    {
        return [
            ['GET', '/my/hello', 'my.api_controller', 'hello'],
        ];
    }
}
```

The controller and route provider are both registered as services, with the provider tagged `b2b_common.rest_route_provider` to trigger registration:

```xml
<service id="my.controller" class="My\Namespace\MyApiController"/>
<service id="my.api_route_provider" class="My\Namespace\DependencyInjection\MyApiRouteProvider">
    <tag name="b2b_common.rest_route_provider"/>
</service>
```

Routes using the `FastRoute` parser support placeholders; an optional fifth array element defines the order parameters are passed to the action, e.g. `['name']` for `/my/hello/{name}`, letting the action declare `helloAction(string $name, Request $request)`.

## Essential identifiers
- `Shopware\B2B\Common\MvcExtension\Request`
- `Shopware\B2B\Common\Routing\RouteProvider`
- `b2b_common.rest_route_provider` tag
- `FastRoute`
