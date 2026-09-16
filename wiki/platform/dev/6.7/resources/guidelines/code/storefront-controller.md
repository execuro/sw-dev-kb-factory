---
id: platform/dev/6.7/resources/guidelines/code/storefront-controller.md
title: Storefront Controller
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html
sourceHash: 18e5b2b884a8fd0d3f21f4407a7c4b4a732db5ca
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront controller", "StorefrontController", "StorefrontRouteScope", "createActionResponse", "_httpCache", "PlatformRequest::ATTRIBUTE_HTTP_CACHE", "frontend route", "page loader", "flash bag", "renderStorefront", "coding guideline", "route attribute"]
summary: "Storefront controller rules: extend StorefrontController, StorefrontRouteScope::ID route scope, frontend.* route names, createActionResponse for writes."
lastBuilt: 2026-09-15
---
## What it is

Shopware core coding guideline for writing Storefront controllers: class and route attributes, dependency injection, and how read and write operations must go through Store API routes and page loaders.

## When to use

When adding a controller or action to the Storefront (core or plugin) and deciding how it loads data, handles writes, reports errors and caches.

## Key steps / config

Controller:

- Extend `\Shopware\Storefront\Controller\StorefrontController`.
- Put the scope attribute on the class:
  `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID]])]`
- Every action has its own `#[Route]` attribute; the route name starts with `frontend` and the route defines its HTTP method(s) (GET, POST, DELETE, PATCH).
- Concise function names, a return type hint on every action, one purpose per route.
- Inject dependencies via the constructor, define them in the DI container service definition, and assign them to private properties.
- Report errors with Symfony flash bags (`StorefrontController` defines the flash types `SUCCESS`, `DANGER`, `INFO`, `WARNING`).
- No business logic in the controller; every Storefront feature must also exist in the Store API.

Installed shape (core `NavigationController`):

```php
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class NavigationController extends StorefrontController
{
    public function __construct(private readonly NavigationPageLoaderInterface $navigationPageLoader /* ... */) {}

    #[Route(path: '/', name: 'frontend.home.page', defaults: [PlatformRequest::ATTRIBUTE_HTTP_CACHE => true], methods: [Request::METHOD_GET])]
    public function home(Request $request, SalesChannelContext $context): Response { /* renderStorefront(...) */ }
}
```

Read operations:

- Never use a repository directly; fetch data through a Store API route or page loader.
- Routes rendering a full page use a page loader class.
- Pages whose data is identical for all customers set the `_httpCache` attribute (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`) to true in the route defaults.

Write operations:

- Build the response with `createActionResponse($request)`: it redirects to the route in the `redirectTo` request parameter (with `redirectParameters`), falls back to `frontend.home.page` when `redirectTo` is empty, forwards to `forwardTo` (with `forwardParameters`), else returns an empty `Response`.
- Each write operation calls the corresponding Store API route.

## Essential identifiers

- `\Shopware\Storefront\Controller\StorefrontController`
- `\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID`
- `\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `PlatformRequest::ATTRIBUTE_HTTP_CACHE` (`_httpCache`)
- `StorefrontController::createActionResponse()`
- `StorefrontController::renderStorefront()`

## Gotchas

- `createActionResponse()` and `renderStorefront()` are `protected` — call them from inside your controller subclass.

## Code check (6.7.13.0)
- confirmed `StorefrontController` — abstract base extending Symfony AbstractController — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `StorefrontController::createActionResponse()` — protected, handles redirectTo/forwardTo — vendor/shopware/storefront/Controller/StorefrontController.php:125
- confirmed `frontend.home.page` — default redirect target of createActionResponse — vendor/shopware/storefront/Controller/StorefrontController.php:136
- confirmed `StorefrontController::renderStorefront()` — protected render helper — vendor/shopware/storefront/Controller/StorefrontController.php:67
- confirmed `StorefrontController::SUCCESS` — flash type constants — vendor/shopware/storefront/Controller/StorefrontController.php:42
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — value `_httpCache` — vendor/shopware/core/PlatformRequest.php:80
- confirmed `NavigationController` — class-level storefront scope attribute, frontend route with GET method — vendor/shopware/storefront/Controller/NavigationController.php:32
- unverified `addFlash` — flash bag helper comes from Symfony AbstractController, vendor/symfony out of scope
