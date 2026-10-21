---
id: platform/dev/6.7/guides/development/integrations-api/flows/create-product.md
title: Create a Product and Complete Checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/flows/create-product.html
sourceHash: 75fab3e75f16e3a69e986c5f56d75dc4526dccf5
codeCheckedAgainst: "6.7.15.1"
keywords: ["create product", "visibilities", "VISIBILITY_ALL", "sw-access-key", "sw-context-token", "sw-inheritance", "/store-api/checkout/cart/line-item", "/store-api/checkout/order", "/store-api/handle-payment", "/store-api/account/register", "/store-api/context", "checkout via api", "place order", "admin api", "store api"]
summary: "Local API flow: Admin API creates category and product, Store API runs context, cart, register, order and handle-payment."
lastBuilt: 2026-10-20
---
## What it is

A tested local golden path: create a category and a product with the Admin API, read the product through the Store API, add it to a cart, register a customer in the current Store API context, place an order and handle payment if required. Rule of thumb: Admin API creates and manages data; Store API acts like a shopper.

## When to use

When building or debugging an integration that seeds catalog data and then drives a full checkout headlessly, or when a product created via API does not appear in the Store API.

## Key steps / config

Prerequisites: running instance (Storefront and `/admin`), `curl`, `jq`, an admin user (`admin / shopware` locally), a Store API sales channel access key.

1. **Admin token** — `POST /api/oauth/token` with `grant_type` `password`, `client_id` `administration`, `scopes` `write`, `username`, `password`; take `.access_token`. Send it in the `Authorization` header as a bearer token on all Admin calls.
2. **Schemas** — download `/api/_info/openapi3.json` (which endpoint/payload) and `/api/_info/open-api-schema.json` (which fields/associations); Store API: `/store-api/_info/openapi3.json`.
3. **Look up IDs** with Admin search: `POST /api/search/tax` (`taxId`), `POST /api/search/sales-channel` with `includes.sales_channel: ["id","name","accessKey"]` (`salesChannelId` + access key), `POST /api/search/currency` with `includes.currency: [..., "isSystemDefault"]` (`currencyId` — use the system default currency).
4. **Category** — `POST /api/category` with `id` (32-char lowercase hex, e.g. from `uuidgen | tr '[:upper:]' '[:lower:]' | tr -d '-'`), `name`, `active`. Verify with `POST /api/search/category` using `ids` and `includes`.
5. **Product** — `POST /api/product`:
   ```json
   {
     "id": "...", "name": "...", "productNumber": "...",
     "stock": 10, "active": true, "taxId": "...",
     "price": [{ "currencyId": "...", "gross": 0, "net": 0, "linked": true }],
     "visibilities": [{ "salesChannelId": "...", "visibility": 30 }],
     "categories": [{ "id": "..." }]
   }
   ```
   `visibility` values: `10` (`VISIBILITY_LINK`, hidden in listings and search), `20` (`VISIBILITY_SEARCH`, hidden in listings), `30` (`VISIBILITY_ALL`, visible everywhere). Verify with `POST /api/search/product` plus header `sw-inheritance: 1` (parent-child inheritance for variants) and `associations.categories`.
6. **Store context** — `GET /store-api/context` with `sw-access-key`; read the `Sw-Context-Token` response header and send it as `sw-context-token` from now on.
7. **Read product** — `POST /store-api/search` with criteria: `term`, `filter` (e.g. `equals` on `active`, `productNumber`), `sort` (`field`, `order`, `naturalSorting`), `page`, `limit`, `includes.product`.
8. **Add to cart** — `POST /store-api/checkout/cart/line-item`:
   ```json
   { "items": [{ "id": "...", "referencedId": "...", "type": "product", "quantity": 1 }] }
   ```
   Verify with `GET /store-api/checkout/cart`.
9. **Checkout state** — needs a customer in context, billing/shipping addresses, shipping and payment method. Relevant routes: `/account/register`, `/account/login`, `/account/address`, `/context`, `/payment-method`, `/shipping-method`, `/checkout/cart`, `/checkout/order`, `/handle-payment`.
10. **Register** — fetch `salutationId` from `/store-api/salutation` and `countryId` from `/store-api/country`, then `POST /store-api/account/register` with `salutationId`, `firstName`, `lastName`, `email`, `password`, `acceptedDataProtection`, `storefrontUrl`, `billingAddress` (`firstName`, `lastName`, `street`, `zipcode`, `city`, `countryId`). Use the returned `Sw-Context-Token`; if it changed, re-add the line item.
11. **Order** — `POST /store-api/checkout/order` (optional body `customerComment`).
12. **Payment** — `POST /store-api/handle-payment` with `orderId` (required), `finishUrl`, `errorUrl` (optional). `"redirectUrl": null` means no redirect-based step is needed.

## Essential identifiers

- Headers: `sw-access-key`, `sw-context-token`, `sw-inheritance`, optionally `sw-language-id`, `sw-version-id`, `sw-currency-id`
- `ProductVisibilityDefinition::VISIBILITY_LINK` / `VISIBILITY_SEARCH` / `VISIBILITY_ALL` (10 / 20 / 30)
- Admin: `POST /api/category`, `POST /api/product`, `POST /api/search/{entity}`
- Store: `GET /store-api/context`, `POST /store-api/search`, `POST /store-api/checkout/cart/line-item`, `GET /store-api/checkout/cart`, `POST /store-api/account/register`, `POST /store-api/checkout/order`, `POST /store-api/handle-payment`

## Gotchas

- The Store API header is `sw-access-key`, not `sw-access-token`. `/store-api/context` is read with `GET` (`PATCH` on the same path switches context).
- Context tokens are ephemeral; `register`/`login` may return a new token, and the cart from the old context is then gone — re-add items.
- Product writes require a price in the system default currency; registration requires real `salutationId`/`countryId`.
- An anonymous context on `/store-api/checkout/order` yields `Customer is not logged in.` — the route requires a login, guest accounts included. An empty cart yields `Cart is empty.`
- Product missing in the Store API: check `active`, a valid `price`, `visibilities` for the sales channel, the right access key, and that the sales channel domain matches your local URL.
- Schema endpoints returning `500` or missing-table errors: the database is not initialised; re-run installation.

## Code check (6.7.15.1)
- confirmed `VISIBILITY_LINK` — value 10 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:27
- confirmed `VISIBILITY_SEARCH` — value 20 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:29
- confirmed `VISIBILITY_ALL` — value 30 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:31
- confirmed `PlatformRequest::HEADER_INHERITANCE` — value `sw-inheritance` — vendor/shopware/core/PlatformRequest.php:22
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — value `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `/store-api/context` — GET route; PATCH variant is context switch — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextRoute.php:21
- confirmed `/store-api/search` — product search route — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:40
- corrected `/store-api/checkout/order` — docs: requires logged-in customer; code: login required, guests allowed — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:69
- confirmed `/store-api/handle-payment` — GET/POST, `orderId` required, `finishUrl`/`errorUrl` optional — vendor/shopware/core/Checkout/Payment/SalesChannel/HandlePaymentMethodRoute.php:49
- confirmed `Cart is empty.` — empty-cart exception message — vendor/shopware/core/Checkout/Order/Exception/EmptyCartException.php:20
