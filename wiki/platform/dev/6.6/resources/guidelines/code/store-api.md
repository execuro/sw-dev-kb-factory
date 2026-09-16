---
id: platform/dev/6.6/resources/guidelines/code/store-api.md
title: Store API
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/store-api.html"
sourceHash: "ef7c61a4db873b4a1c3aebc566676fc4273c8f3a"
keywords: ["Store API", "StoreApiResponse", "_routeScope", "route attribute", "named routes", "sales channel api", "api controller", "page loader", "route response"]
summary: "Store API routes are services with #[Route(_routeScope: store-api)], decorate StoreApiResponse, and page loaders must call routes rather than repositories."
lastBuilt: "2026-09-15"
---
## What it is
Coding guideline covering how Store API routes must be defined and how page loaders/controllers interact with them.

## Key steps / config
### Routes
- Stop implementing the Sales Channel API; it will be deprecated in the 6.4 major release. Define API controllers (routes) as services. Use named routes internally.
- The class or each API method requires the attribute `#[Route(defaults: ['_routeScope' => ['store-api']])]`.
- A decorator of the response extends `StoreApiResponse`.

### Page Loader
- Routes represent a single functionality.
- A controller/page loader only works with routes, and can call multiple routes.
- A route has to return a `StoreApiResponse` to convert to JSON.
- A route response can only contain one object.
- The Storefront controller should never work with the repository again; it should be injected inside a route.

## Essential identifiers
- `#[Route(defaults: ['_routeScope' => ['store-api']])]`
- `StoreApiResponse`

## Gotchas
The Sales Channel API is being replaced by the Store API and will be deprecated in the 6.4 major release.
