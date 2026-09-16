---
id: platform/dev/6.7/resources/guidelines/code/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/store-api.html
sourceHash: 85325a1844ccd0ca395b9c59b31283d798319f40
codeCheckedAgainst: "6.7.13.0"
keywords: ["store-api", "store api route", "StoreApiResponse", "StoreApiRouteScope", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "_routeScope", "page loader", "sales channel api", "route decoration", "getDecorated", "coding guideline", "headless"]
summary: "Store API route guidelines: StoreApiRouteScope::ID route scope, StoreApiResponse return type, one object per response, routes injected into controllers."
lastBuilt: 2026-09-15
---
## What it is

Shopware core coding guideline for implementing Store API routes and how Storefront controllers and page loaders consume them.

## When to use

When adding or decorating a Store API route, or when a Storefront controller/page loader needs data and you must decide whether to call a route or a repository.

## Key steps / config

Routes:

- Define API controllers (routes) as services and use named routes internally.
- Put the route-scope attribute on the class or on each API method:
  `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Core\Framework\Routing\StoreApiRouteScope::ID]])]`
  (in 6.7.13.0 `ATTRIBUTE_ROUTE_SCOPE` is `_routeScope` and `StoreApiRouteScope::ID` is `store-api`).
- The response class of a route extends `Shopware\Core\System\SalesChannel\StoreApiResponse`, which wraps exactly one `Struct` (constructor `__construct(protected Struct $object)`, accessor `getObject()`).

Installed pattern (core `ProductListingRoute`): an abstract route with `getDecorated()` and the action method, a concrete class carrying the scope attribute, and a dedicated response class:

```php
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]
class ProductListingRoute extends AbstractProductListingRoute
{
    public function getDecorated(): AbstractProductListingRoute { /* ... */ }

    #[Route(path: '/store-api/product-listing/{categoryId}', name: 'store-api.product.listing', methods: [...])]
    public function load(string $categoryId, Request $request, SalesChannelContext $context, Criteria $criteria): ProductListingRouteResponse { /* ... */ }
}
```

Page loader / controller rules:

- A route represents a single functionality.
- Controllers and page loaders work only with routes; they may call several routes.
- A route returns a `StoreApiResponse` so it can be converted to JSON; the response contains only one object.
- A Storefront controller never works with a repository directly; the repository is injected into the route instead.

## Essential identifiers

- `\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `\Shopware\Core\Framework\Routing\StoreApiRouteScope::ID`
- `Shopware\Core\System\SalesChannel\StoreApiResponse`
- `AbstractProductListingRoute::getDecorated()` (decoration pattern example)

## Gotchas

- Returning a plain Symfony `Response` or several objects from a route violates the guideline; wrap a single struct in a `StoreApiResponse` subclass.

## Version notes

- The source says to stop implementing the Sales Channel API, which was to be deprecated with the 6.4 major; Store API routes replace it.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `StoreApiRouteScope::ID` — value `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `StoreApiResponse` — extends Symfony Response, wraps one Struct — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:14
- confirmed `StoreApiResponse::getObject()` — returns the single wrapped object — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:30
- confirmed `ProductListingRoute` — class-level store-api route scope attribute — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingRoute.php:29
- confirmed `AbstractProductListingRoute::getDecorated()` — abstract decoration hook — vendor/shopware/core/Content/Product/SalesChannel/Listing/AbstractProductListingRoute.php:16
- confirmed `store-api.product.listing` — named route on the load method — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingRoute.php:59
- confirmed `ProductListingRouteResponse` — route response extends StoreApiResponse — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingRouteResponse.php:12
- unverified `Sales Channel API` — historical API name, not an identifier in the installed code
