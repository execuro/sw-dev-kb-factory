---
id: platform/dev/6.7/concepts/api/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/api/store-api.html
sourceHash: def093338d82dd39eacc1fa7b6d8f94308e18257
codeCheckedAgainst: "6.7.15.1"
keywords: ["store api", "store-api", "headless", "customer-facing api", "storefront api", "composable frontends", "spa", "cart", "checkout", "sw-access-key", "sw-context-token", "/store-api/checkout/cart", "/store-api/account/login"]
summary: "Store API concept: Shopware's customer-facing JSON/HTTP API for headless frontends - browsing, cart, checkout, accounts; anonymous or logged-in customers."
lastBuilt: 2026-10-20
---
## What it is

The Store API is Shopware's customer-facing surface: a normalized interface layer between customer-facing applications and the Shopware Core. It exposes only data that is relevant and safe for frontend use and supports both anonymous and authenticated customers.

## When to use

For storefront/frontend interactions — product browsing, cart handling, checkout and customer account management — and for headless frontends (SPAs, native apps) that consume Shopware functionality as JSON over HTTP. Shopware's Composable Frontends are a headless implementation built on it.

## Key steps / config

- Core business logic is exposed as HTTP routes under `/store-api/...` in the `store-api` route scope; the Storefront and API consumers rely on the same underlying services.
- Requests identify the sales channel with the `sw-access-key` header; a customer/cart context is carried in `sw-context-token`.
- Example routes: `/store-api/checkout/cart` (read/delete cart), `/store-api/account/login`, `/store-api/context`.
- For endpoints, authentication methods, schemas and request formats, refer to the Store API reference (Stoplight: "Store API – Stoplight Reference", `https://shopware.stoplight.io/docs/store-api/7b972a75a8d8d-shopware-store-api`).

## Essential identifiers

- `sw-access-key`, `sw-context-token`
- `/store-api/checkout/cart`, `/store-api/account/login`, `/store-api/context`
- Route scope `store-api`

## Code check (6.7.15.1)
- confirmed `StoreApiRouteScope::ID` — route scope `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — header `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — header `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `/store-api/checkout/cart` — cart read route (GET, POST) — vendor/shopware/core/Checkout/Cart/SalesChannel/CartLoadRoute.php:39
- confirmed `/store-api/account/login` — customer login route — vendor/shopware/core/Checkout/Customer/SalesChannel/LoginRoute.php:38
- confirmed `/store-api/context` — context read route — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextRoute.php:21
