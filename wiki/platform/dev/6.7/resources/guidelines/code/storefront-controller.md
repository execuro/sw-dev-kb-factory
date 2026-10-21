---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/code/storefront-controller.md
sourceHash: 18e5b2b884a8fd0d3f21f4407a7c4b4a732db5ca
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html
title: Storefront Controller
version: "6.7"
versions:
  - "6.7"
keywords: ["StorefrontController", "StorefrontRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "createActionResponse", "_httpCache", "#[Route]", "frontend route name", "page loader", "store api route", "flash bag", "storefront controller guidelines", "coding standards"]
summary: "Storefront controller rules: StorefrontController base, route scope attribute, page loaders, Store API writes, createActionResponse."
lastBuilt: 2026-10-21
---
## What it is

The Shopware coding guideline for Storefront controllers: how a controller class and its actions must be declared, how they read data, and how write operations must be implemented.

## When to use

When writing or reviewing a controller in a plugin or in core that serves Storefront pages, widgets, or form actions, and you need the conventions Shopware expects for routing, dependency injection, data loading, and responses.

## Key steps / config

Class level:

- Extend `\Shopware\Storefront\Controller\StorefrontController` (an abstract class extending Symfony's `AbstractController`).
- Add the class attribute `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID]])]` (the constants resolve to `_routeScope` and `storefront`).
- Inject dependencies through the constructor, define them in the DI container service definition, and assign them to private properties (core uses `private readonly` promoted constructor parameters).
- Never put business logic in the controller.

Action level:

- Every action has a `#[Route]` attribute with a route name starting with `frontend` and the HTTP method(s) defined (GET, POST, DELETE, PATCH).
- Keep function names concise, declare a return type, and give each route a single purpose.
- Report errors via Symfony flash bags.
- Every Storefront feature must also be available in the Store API.

```php
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class ExampleController extends StorefrontController
{
    public function __construct(private readonly ExamplePageLoader $loader) {}

    #[Route(path: '/example', name: 'frontend.example.page',
        defaults: [PlatformRequest::ATTRIBUTE_HTTP_CACHE => true],
        methods: [Request::METHOD_GET])]
    public function index(Request $request, SalesChannelContext $context): Response { /* ... */ }
}
```

Read operations:

- Never use a repository directly; fetch data via a Store API route or a page loader.
- Routes that render a full page use a page loader class for all their data.
- Pages whose data is identical for all customers set the `_httpCache` route default (`PlatformRequest::ATTRIBUTE_HTTP_CACHE => true`).

Write operations:

- Each write calls the corresponding Store API route.
- Build the response with `createActionResponse($request)` so callers can control forwards and redirects.

## Essential identifiers

- `\Shopware\Storefront\Controller\StorefrontController`
- `\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID`
- `\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `PlatformRequest::ATTRIBUTE_HTTP_CACHE` (`_httpCache`)
- `StorefrontController::createActionResponse()`

## Gotchas

- `createActionResponse()` reads the request parameters `redirectTo` (with `redirectParameters`) and `forwardTo` (with `forwardParameters`); an empty `redirectTo` redirects to `frontend.home.page`, and with neither set it returns an empty `Response`.
- Core also registers widget/pagelet routes with names starting `widgets.` (e.g. `widgets.wishlist.pagelet`), so the `frontend` prefix rule applies to page and action routes.

## Code check (6.7.15.1)
- confirmed `StorefrontController` — abstract class extending AbstractController — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StorefrontController::createActionResponse()` — handles redirectTo/forwardTo request params — vendor/shopware/storefront/Controller/StorefrontController.php:126
- confirmed `StorefrontController::renderStorefront()` — protected render helper used by page actions — vendor/shopware/storefront/Controller/StorefrontController.php:68
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — value `_httpCache` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `ATTRIBUTE_HTTP_CACHE` — used as route default on a product page route — vendor/shopware/storefront/Controller/ProductController.php:59
- confirmed `StorefrontRouteScope::ID` — class-level Route attribute pattern on a core controller — vendor/shopware/storefront/Controller/WishlistController.php:39
- confirmed `frontend.wishlist.page` — core route name using the frontend prefix — vendor/shopware/storefront/Controller/WishlistController.php:59
- confirmed `widgets.wishlist.pagelet` — core widget route not using the frontend prefix — vendor/shopware/storefront/Controller/WishlistController.php:105
