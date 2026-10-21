---
id: platform/dev/6.7/resources/guidelines/code/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/store-api.html
sourceHash: 85325a1844ccd0ca395b9c59b31283d798319f40
codeCheckedAgainst: "6.7.15.1"
keywords: ["store api", "store-api route", "StoreApiRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "StoreApiResponse", "route scope", "page loader", "sales channel api", "getDecorated", "decoration", "store-api", "coding guidelines"]
summary: Store API coding rules - routes as services with the store-api route scope, responses extend StoreApiResponse, page loaders and controllers only call routes.
lastBuilt: 2026-10-21
---
## What it is

A coding guideline for building Store API routes in the Shopware platform and for how Storefront controllers and page loaders consume them.

## When to use

When adding a new Store API endpoint, decorating an existing route or its response, or writing a Storefront controller/page loader that needs data.

## Key steps / config

Routes:

1. Do not implement anything on the old Sales Channel API (the docs say it was deprecated with the 6.4 major). Define API controllers (routes) as services and use named routes internally.
2. Put the route scope on the class or on each API method:

```php
#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Core\Framework\Routing\StoreApiRouteScope::ID]])]
```

   `ATTRIBUTE_ROUTE_SCOPE` resolves to `_routeScope`, `StoreApiRouteScope::ID` to `store-api`.
3. Response classes (and decorators of a response) extend `Shopware\Core\System\SalesChannel\StoreApiResponse`. Its constructor takes exactly one `Struct` object, exposed through `getObject()`.

In the installed code a core route follows the abstract-route pattern: `CategoryRoute extends AbstractCategoryRoute`, the abstract class declares `getDecorated()`, the core implementation throws `DecorationPatternException` there, and the route method returns a `StoreApiResponse` subclass (`CategoryRouteResponse`).

Page loaders:

- A route represents a single piece of functionality.
- Controllers and page loaders work only with routes, and may call several routes.
- A route returns a `StoreApiResponse` so it can be converted to JSON; a route response contains only one object.
- A Storefront controller never uses a repository directly; the repository is injected into a route instead.

## Essential identifiers

- `Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `Shopware\Core\Framework\Routing\StoreApiRouteScope::ID`
- `Shopware\Core\System\SalesChannel\StoreApiResponse`
- `getDecorated()` (abstract route decoration hook)

## Gotchas

- "One object per response" is structural: `StoreApiResponse::__construct()` accepts a single `Struct`, so wrap multiple values in one struct.

## Version notes

- The docs' note that the Sales Channel API would be deprecated in 6.4 is historical; in 6.7 the Store API (`/store-api/...`) is the storefront-facing API.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `StoreApiResponse` — extends Symfony `Response` — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:14
- confirmed `StoreApiResponse::__construct()` — takes one `Struct $object` — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:22
- confirmed `StoreApiResponse::getObject()` — returns the single response object — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:30
- confirmed `CategoryRoute` — class-level store-api route scope attribute — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:26
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract decoration hook — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- confirmed `CategoryRouteResponse` — extends StoreApiResponse — vendor/shopware/core/Content/Category/SalesChannel/CategoryRouteResponse.php:13
