---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/store-api.html
sourceHash: 8a24b35b0a06929c807b7975ab27eb9970976133
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "store api", "sw-context-token", "sw-access-key", "/account/login", "/store-api/b2b/offer", "/store-api/b2b/order", "/store-api/b2b/address/type/", "swagger.json", "route pattern", "authentication headers", "admin api"]
summary: B2B Suite Store API endpoints - sw-context-token and sw-access-key headers, and mapping /api/b2b/debtor/... routes to /store-api/b2b/...
lastBuilt: 2026-09-15
---
## What it is

How the B2B Suite exposes its endpoints through the Shopware 6 Store API: required authentication headers and how Admin API B2B routes translate to Store API routes. The endpoints are documented in a `swagger.json` file in the B2B Suite repository, viewable with Swagger UI.

## When to use

When calling B2B Suite functionality (offers, orders, addresses) from a storefront or headless client as a logged-in customer instead of through the Admin API.

## Key steps / config

1. Obtain a context token: send a `POST` to the Store API login route (`/store-api/account/login`, referred to in the docs as `/account/login`) with customer credentials; the response carries the context token.
2. Send both headers on every B2B Store API request:
   - `sw-context-token` — the customer context token from step 1.
   - `sw-access-key` — the sales channel access key, shown in the Administration when editing a sales channel.
3. Build the route from the Admin API route by dropping the `/api/b2b/debtor` identity prefix and using `/store-api/b2b` — the identity comes from the context token:
   - `/api/b2b/debtor/address/type/` becomes `/store-api/b2b/address/type/`
   - `/api/b2b/debtor/offer` becomes `/store-api/b2b/offer`
   - `/api/b2b/debtor/order` becomes `/store-api/b2b/order`

## Essential identifiers

- `sw-context-token` (header)
- `sw-access-key` (header)
- `/store-api/account/login`
- `/store-api/b2b/address/type/`, `/store-api/b2b/offer`, `/store-api/b2b/order`
- `swagger.json`

## Gotchas

- The Store API routes have no identity identifier segment; the customer/debtor is resolved from `sw-context-token`, so a missing or anonymous token cannot address another identity.
- The B2B routes themselves live in the B2B Suite plugin (`SwagB2bPlatform`), not in Shopware core, so they only exist when that plugin is installed.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — value `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — value `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- corrected `/store-api/account/login` — docs: `/account/login`; core route is POST `/store-api/account/login` — vendor/shopware/core/Checkout/Customer/SalesChannel/LoginRoute.php:38
- confirmed `LoginRoute::login()` — returns a `ContextTokenResponse` — vendor/shopware/core/Checkout/Customer/SalesChannel/LoginRoute.php:39
- confirmed `salesChannel.accessKey` — access key field on the sales channel detail view in the Administration — vendor/shopware/administration/Resources/app/administration/src/module/sw-sales-channel/view/sw-sales-channel-detail-base/sw-sales-channel-detail-base.html.twig:645
- unverified `/store-api/b2b/offer` — B2B Suite plugin route, plugin not installed in vendor/shopware
- unverified `/store-api/b2b/order` — B2B Suite plugin route, out of scope
- unverified `/store-api/b2b/address/type/` — B2B Suite plugin route, out of scope
