---
id: platform/dev/6.7/resources/references/adr/2021-08-10-storefront-coding-standards.md
title: Storefront coding standards
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-08-10-storefront-coding-standards.html
sourceHash: 0fb181c6a6ee3d32fd42d17913a69e9df565d384
codeCheckedAgainst: "6.7.13.0"
keywords: ["StorefrontController", "StorefrontRouteScope", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "_loginRequired", "_httpCache", "XmlHttpRequest", "createActionResponse", "renderStorefront", "page loader", "pagelet loader", "route attribute", "storefront controller", "coding standards", "adr"]
summary: "ADR: Storefront controller rules - Route attribute schema (frontend. names, _loginRequired, _httpCache), StorefrontController base, page loaders, store-api use."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-08-10) that fixes the coding standards for Storefront controllers: the shape of `#[Route]` attributes, controller class rules, how write operations respond, and the role of PageLoader/PageletLoader classes.

## When to use

When writing or reviewing a Storefront controller in a plugin or in the platform, and deciding where data loading and business logic belong.

## Key steps / config

Route attribute schema:

```php
#[Route(path: '/example/endpoint/{id}', name: 'frontend.example.endpoint', options: ['seo' => false], defaults: ['id' => null, 'XmlHttpRequest' => true, '_loginRequired' => true, '_httpCache' => true], methods: ['GET', 'POST', 'DELETE'])]
```

- `path`: route path; parameters in `{}`.
- `name`: unique, starts with `frontend.`.
- `options`: `seo` (true|false) is the only option named by the ADR.
- `defaults`: default values for path/query parameters plus:
  - `XmlHttpRequest` (true|false): route is called via frontend AJAX; such routes don't return the `renderStorefront` call.
  - `_loginRequired` (true|false): a logged-in customer is required, otherwise a "permission denied" redirect.
  - `_httpCache` (true|false): whether the response is cached in the HTTP cache. Use it for pages whose data is the same for all customers.
- `methods`: `GET` (returns data or an HTML page), `POST` (sends data), `DELETE` (deletes data).

Controller rules:

- Class-level attribute: `#[Route(defaults: [\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID]])]`.
- Extend `\Shopware\Storefront\Controller\StorefrontController`.
- Declare the controller as a public service (otherwise routes can be removed from the container).
- Inject dependencies via constructor into private properties, defined in the DI container; only the container itself may be injected via `setContainer`.
- Every action has a Route with path, name and method, a concise name, a return type hint and a single purpose.
- No business logic and no direct repository/DAL use in the controller; each Storefront feature uses a store-api route service so it is also available via API.
- Report errors to the user with Symfony flash bags.
- Write operations build their response with `createActionResponse` (allows forwards and redirects) and call a corresponding store-api route.

Page loading:

- GET routes rendering a full page call a PageLoader, which collects data via the Store API and always returns a Page object.
- A PageLoader may call PageletLoaders, which return pagelet objects for part of a page.

## Essential identifiers

- `\Shopware\Storefront\Controller\StorefrontController`
- `\Shopware\Core\PlatformRequest::ATTRIBUTE_ROUTE_SCOPE`
- `\Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID`
- Route defaults `XmlHttpRequest`, `_loginRequired`, `_httpCache`; option `seo`
- `createActionResponse`, `renderStorefront`

## Gotchas

- The source's parameter list misspells the defaults as `_loginRrequired` and `__httpCache`; the code uses `_loginRequired` and `_httpCache` (as in the example attribute).
- The controller section lists PATCH as an allowed method while the schema section only names GET, POST and DELETE.

## Code check (6.7.13.0)
- confirmed `StorefrontController` — abstract base class extending Symfony `AbstractController` — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `StorefrontController::renderStorefront()` — protected render helper — vendor/shopware/storefront/Controller/StorefrontController.php:67
- confirmed `StorefrontController::createActionResponse()` — protected, takes the Request — vendor/shopware/storefront/Controller/StorefrontController.php:125
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:77
- corrected `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — docs: `__httpCache`; value is `_httpCache` — vendor/shopware/core/PlatformRequest.php:80
- corrected `PlatformRequest::ATTRIBUTE_LOGIN_REQUIRED` — docs: `_loginRrequired`; value is `_loginRequired` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `XmlHttpRequest` — used as route default together with `seo` option — vendor/shopware/storefront/Controller/CookieController.php:37
- confirmed `ATTRIBUTE_ROUTE_SCOPE` — class-level Route attribute pattern on a core controller — vendor/shopware/storefront/Controller/CookieController.php:25
- unverified `setContainer` — Symfony AbstractController, vendor/symfony out of scope
