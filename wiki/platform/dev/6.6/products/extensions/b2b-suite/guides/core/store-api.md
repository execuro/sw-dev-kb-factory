---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md
title: Store API
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/store-api.html
sourceHash: 8a24b35b0a06929c807b7975ab27eb9970976133
keywords: ["Store API", "b2b-suite", "sw-context-token", "sw-access-key", "authentication", "SalesChannel", "route pattern", "swagger", "swagger.json", "Swagger UI", "B2B Suite", "/account/login", "Admin API"]
summary: B2B Suite Store API docs, auth headers sw-context-token/sw-access-key, and how its routes drop the Admin API identity segment.
lastBuilt: 2026-09-15
---
## What it is

Documents how the B2B Suite exposes its endpoints through the Shopware 6 Store API, including authentication and how its route pattern differs from the Admin API's.

## When to use

Use this when calling B2B Suite endpoints from the storefront/Store API context rather than the Admin API, or when translating a known Admin API route into its Store API equivalent.

## Key steps / config

The B2B Suite endpoints are documented with swagger (an OpenAPI `swagger.json` file), viewable in Swagger UI. The suite itself is stated to be compatible with the Shopware 6 Store API.

Every request needs two headers:

- `sw-context-token` — obtained by first authenticating as a customer with a `POST` request to the `/account/login` route to get a context token.
- `sw-access-key` — the access key for the Store API, found in the Administration when editing a SalesChannel.

Route pattern: the Store API route pattern is the same as the Admin API's, but without the identity identifier segment, since identity is instead derived from the context token. Route replacement examples given by the source:

```
/api/b2b/debtor/address/type/  ->  /store-api/b2b/address/type/
/api/b2b/debtor/offer          ->  /store-api/b2b/offer
/api/b2b/debtor/order          ->  /store-api/b2b/order
```

## Essential identifiers

- Header: `sw-context-token`
- Header: `sw-access-key`
- Route: `/account/login`
- Route prefix pattern: `/api/b2b/debtor/...` (Admin API) versus `/store-api/b2b/...` (Store API)

## Gotchas

Because the Store API drops the identity identifier that the Admin API route pattern uses, a route translated between the two is not a plain prefix swap — the `debtor` identity segment present in the Admin API path (`/api/b2b/debtor/...`) is removed entirely in the Store API equivalent (`/store-api/b2b/...`), not just renamed.
