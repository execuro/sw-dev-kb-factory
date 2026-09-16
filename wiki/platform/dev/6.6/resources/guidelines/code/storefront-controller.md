---
id: platform/dev/6.6/resources/guidelines/code/storefront-controller.md
title: Storefront Controller
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html"
sourceHash: "fc4899de6fbb866a78a49d47e82c81440b23788a"
keywords: ["Storefront controller", "StorefrontController", "_routeScope", "createActionResponse", "flash bags", "frontend route", "_httpCache", "page loader", "route attribute", "business logic"]
summary: "Storefront controllers extend StorefrontController, use frontend routes with _routeScope storefront, and never contain business logic or repository access."
lastBuilt: "2026-09-15"
---
## What it is
Coding guideline for Storefront controllers: route and DI conventions, and rules for how they read and write data.

## Key steps / config
### Controller
- Each controller action requires a `#Route` attribute; the route name should start with "frontend" and define the corresponding HTTP method (GET, POST, DELETE, PATCH).
- Function names should be concise, and each function should define a return type hint; a route should have a single purpose.
- Use Symfony flash bags for error reporting.
- Each storefront functionality has to also be available inside the Store API.
- A Storefront controller should never contain business logic and has to extend `\Shopware\Storefront\Controller\StorefrontController`.
- The class requires the attribute `#[Route(defaults: ['_routeScope' => ['storefront']])]`.
- Depending services must be injected via the class constructor, defined in the DI-container service definition, and assigned to a private class property.

### Read operations inside Storefront controllers
- A Storefront controller should never use a repository directly; data should be fetched via a route or a page loader class, used for routes that load a full Storefront page.
- Pages containing data identical for all customers should have the `_httpCache` attribute.

### Write operations inside Storefront controllers
- Write operations should create their response with the `createActionResponse` function to allow different forwards and redirects, and each write operation has to call a corresponding Store API route.

## Essential identifiers
- `\Shopware\Storefront\Controller\StorefrontController`
- `#[Route(defaults: ['_routeScope' => ['storefront']])]`
- `createActionResponse`
- `_httpCache`
