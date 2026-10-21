---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/store-api.html
sourceHash: 8a24b35b0a06929c807b7975ab27eb9970976133
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-context-token", "sw-access-key", "/account/login", "/store-api/b2b", "/api/b2b/debtor", "swagger.json", "b2b suite", "store api", "authentication", "context token", "access key", "route pattern"]
summary: "B2B Suite on the Store API: send sw-context-token and sw-access-key; /api/b2b/debtor/... routes map to /store-api/b2b/... without the identity."
lastBuilt: 2026-10-21
---
## What it is

How the B2B Suite works with the Shopware 6 Store API, with which it is compatible: required authentication headers and how B2B Admin API routes translate to Store API routes. Endpoints are documented in a `swagger.json` (swagger.io format, viewable with Swagger UI).

## When to use

When calling B2B Suite endpoints as a logged-in customer from a headless frontend or other Store API client.

## Key steps / config

1. **Authenticate** — every request needs two headers:
   - `sw-context-token`: obtained by authenticating as a customer with a `POST` request to the `/account/login` route (in the installed core: `/store-api/account/login`).
   - `sw-access-key`: the sales channel's Store API access key, found in the Administration when editing a sales channel.
2. **Build the route** — the pattern is the same as in the Admin API, but without the identity identifier, because the identity is taken from the context token. Examples:

| Admin API | Store API |
|---|---|
| `/api/b2b/debtor/address/type/` | `/store-api/b2b/address/type/` |
| `/api/b2b/debtor/offer` | `/store-api/b2b/offer` |
| `/api/b2b/debtor/order` | `/store-api/b2b/order` |

## Essential identifiers

- headers `sw-context-token`, `sw-access-key`
- login route `/store-api/account/login` (`POST`)
- prefix `/store-api/b2b/`

## Code check (6.7.15.1)
- confirmed `sw-context-token` — `PlatformRequest::HEADER_CONTEXT_TOKEN` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `sw-access-key` — `PlatformRequest::HEADER_ACCESS_KEY` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `/account/login` — Store API login route is `POST /store-api/account/login` — vendor/shopware/core/Checkout/Customer/SalesChannel/LoginRoute.php:38
- unverified `/store-api/b2b/offer` — B2B Suite plugin routes, not in the installed core/storefront/administration code
