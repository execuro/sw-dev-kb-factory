---
id: platform/dev/6.7/concepts/api/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/api/store-api.html
sourceHash: def093338d82dd39eacc1fa7b6d8f94308e18257
codeCheckedAgainst: "6.7.13.0"
keywords: ["store api", "/store-api", "StoreApiRouteScope", "sw-access-key", "sw-context-token", "SalesChannelApiSource", "headless", "composable frontends", "customer-facing api", "cart", "checkout", "sales channel api"]
summary: Store API concept - customer-facing JSON-over-HTTP layer for headless frontends (browsing, cart, checkout, account), anonymous or logged-in customers.
lastBuilt: 2026-09-15
---
## What it is

The Store API is the customer-facing surface of Shopware: a normalized JSON-over-HTTP interface between customer-facing applications and Shopware Core. It exposes only data relevant and safe for frontend use and supports anonymous and authenticated customers.

## When to use

Storefront/frontend interactions such as product browsing, cart handling, checkout and customer account management — especially headless frontends (SPAs, native apps). The Storefront and API consumers rely on the same underlying core services exposed through HTTP routes. For backend integrations use the Admin API.

## Key steps / config

- Routes live under the `/store-api` prefix (route scope `store-api`).
- Requests identify the sales channel with the `sw-access-key` header; the customer/cart session is carried in `sw-context-token`.
- Routes that require authentication need a sales channel API context source.
- For endpoints, authentication, schemas and request formats, the source defers to the Stoplight Store API reference (`https://shopware.stoplight.io/docs/store-api/7b972a75a8d8d-shopware-store-api`).
- Shopware's Composable Frontends are a headless frontend implementation built on the Store API.

## Essential identifiers

- `Shopware\Core\Framework\Routing\StoreApiRouteScope` (`ID = 'store-api'`)
- `Shopware\Core\PlatformRequest::HEADER_ACCESS_KEY` (`sw-access-key`), `PlatformRequest::HEADER_CONTEXT_TOKEN` (`sw-context-token`)
- `Shopware\Core\Framework\Api\Context\SalesChannelApiSource`

## Code check (6.7.13.0)
- confirmed `StoreApiRouteScope::ID` — scope id and allowed path `store-api` — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `SalesChannelApiSource` — auth-required routes need a sales channel API source — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:33
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — header `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — header `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- unverified `Composable Frontends` — separate project, out of scope
