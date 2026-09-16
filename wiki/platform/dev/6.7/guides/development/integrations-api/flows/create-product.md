---
id: platform/dev/6.7/guides/development/integrations-api/flows/create-product.md
title: Create a Product and Complete Checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/flows/create-product.html
sourceHash: 75fab3e75f16e3a69e986c5f56d75dc4526dccf5
codeCheckedAgainst: "6.7.13.0"
keywords: ["create product via api", "headless checkout", "sw-access-key", "sw-context-token", "visibilities", "VISIBILITY_ALL", "/api/oauth/token", "/store-api/checkout/cart/line-item", "/store-api/checkout/order", "/store-api/handle-payment", "/store-api/account/register", "salutationId", "countryId", "place order api"]
summary: End-to-end local flow - Admin API token, category and product creation, Store API context, cart, customer registration, order and handle-payment.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/integrations-api/flows/_index.md"]
---
## What it is

A tested golden-path walkthrough for local development: create a category and product with the Admin API, read the product via the Store API, add it to a cart, register a customer in the current Store API context, place an order, and handle payment if needed. The source runs against a local instance on `127.0.0.1:8000` using `curl` and `jq`.

## When to use

When wiring a headless client or debugging a local setup and you need one known-good sequence of Admin API and Store API calls from product creation through order placement.

## Key steps / config

1. **Admin API token** - `POST /api/oauth/token` with the password grant (local shortcut):
   ```json
   { "grant_type": "password", "client_id": "administration", "scopes": "write", "username": "...", "password": "..." }
   ```
   Use `.access_token` as the bearer token in the `Authorization` header for all `/api/...` calls.
2. **Schemas** - `GET /api/_info/openapi3.json` (endpoints and payloads) and `GET /api/_info/open-api-schema.json` (entity fields/associations). Store API: `/store-api/_info/openapi3.json`.
3. **Look up IDs** - `POST /api/search/tax`, `/api/search/sales-channel` (includes `sales_channel: ["id","name","accessKey"]`), `/api/search/currency` (includes `isSystemDefault`). Keep `TAX_ID`, `SALES_CHANNEL_ID`, `CURRENCY_ID` (system default currency) and `STORE_API_ACCESS_KEY`.
4. **Category** - `POST /api/category` with `id` (32-char lowercase hex), `name`, `active`. Verify with `POST /api/search/category` using `ids` + `includes`.
5. **Product** - `POST /api/product`:
   ```json
   { "id": "...", "name": "...", "productNumber": "...", "stock": 10, "active": true, "taxId": "...",
     "price": [{ "currencyId": "...", "gross": 0, "net": 0, "linked": true }],
     "visibilities": [{ "salesChannelId": "...", "visibility": 30 }],
     "categories": [{ "id": "..." }] }
   ```
   `visibility` values: `10` = `ProductVisibilityDefinition::VISIBILITY_LINK` (hidden in listings and search), `20` = `VISIBILITY_SEARCH` (hidden in listings), `30` = `VISIBILITY_ALL`. Verify with `POST /api/search/product`, header `sw-inheritance: 1`, `associations: { categories: {} }`.
6. **Store API context** - `GET /store-api/context` with header `sw-access-key`; read the `sw-context-token` response header.
7. **Read product** - `POST /store-api/search` with `sw-access-key` + `sw-context-token`; criteria keys `filter` (e.g. `equals` on `productNumber`), `sort`, `page`, `limit`, `includes`, `term`.
8. **Cart** - `POST /store-api/checkout/cart/line-item`:
   ```json
   { "items": [{ "id": "...", "referencedId": "...", "type": "product", "quantity": 1 }] }
   ```
   Check with `GET /store-api/checkout/cart`.
9. **Customer** - fetch `salutationId` from `/store-api/salutation` and `countryId` from `/store-api/country`, then `POST /store-api/account/register` with `salutationId`, `firstName`, `lastName`, `email`, `password`, `acceptedDataProtection`, `storefrontUrl`, `billingAddress { firstName, lastName, street, zipcode, city, countryId }`. Take the `sw-context-token` from the response; if it changed, re-add the line item in the new context. `/store-api/account/login` is the alternative.
10. **Order** - `POST /store-api/checkout/order` (optional body `customerComment`). If the payment method needs it, `POST /store-api/handle-payment` with `orderId`, `finishUrl`, `errorUrl`; `"redirectUrl": null` means no redirect flow is required.

Other relevant Store API endpoints: `/account/address`, `/payment-method`, `/shipping-method`, `/context`. Browser reference: `/store-api/_info/stoplightio.html`.

## Essential identifiers

- Headers: `sw-access-key`, `sw-context-token` (Store API); `sw-language-id`, `sw-version-id`, `sw-inheritance`, `sw-currency-id` (Admin API, optional)
- `ProductVisibilityDefinition::VISIBILITY_LINK` / `VISIBILITY_SEARCH` / `VISIBILITY_ALL` (10/20/30)
- `/api/oauth/token`, `/api/product`, `/api/category`, `/api/search/<entity>`
- `/store-api/context`, `/store-api/search`, `/store-api/checkout/cart/line-item`, `/store-api/checkout/cart`, `/store-api/account/register`, `/store-api/checkout/order`, `/store-api/handle-payment`

## Gotchas

- Store API authenticates with `sw-access-key`, not `sw-access-token`.
- `/store-api/context` is called with `GET` (`PATCH` on the same path switches context).
- Context tokens are ephemeral; `register`/`login` may return a new `sw-context-token`, after which the cart from the old context is gone.
- Product writes require a price in the system default currency.
- Registration needs real `salutationId`/`countryId` values.
- Placing an order with an anonymous context returns `Customer is not logged in.`; an empty cart returns `Cart is empty.` - re-add the product in the current context and retry. The installed route also accepts guest customers (see Code check).
- In the installed code, `/store-api/search` runs its keyword search builder only when a `search` parameter is present; `term` in the body is the generic criteria term. The route also filters by `VISIBILITY_SEARCH`, so a product with visibility `10` is not returned.
- Product not visible in Store API: check `active`, a valid `price`, `visibilities` for the sales channel, the correct access key, and that the sales channel domain matches the local URL.
- Schema endpoints returning `500` or missing-table errors indicate an uninitialised database; re-run installation.

## Code check (6.7.13.0)
- corrected `/store-api/checkout/order` — docs: requires a logged-in customer; route sets login required with guests allowed — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:70
- confirmed `ProductVisibilityDefinition::VISIBILITY_LINK` — value 10 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:24
- confirmed `ProductVisibilityDefinition::VISIBILITY_SEARCH` — value 20 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:26
- confirmed `ProductVisibilityDefinition::VISIBILITY_ALL` — value 30 — vendor/shopware/core/Content/Product/Aggregate/ProductVisibility/ProductVisibilityDefinition.php:28
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — `sw-access-key` — vendor/shopware/core/PlatformRequest.php:19
- confirmed `PlatformRequest::HEADER_CONTEXT_TOKEN` — `sw-context-token` — vendor/shopware/core/PlatformRequest.php:18
- confirmed `/store-api/context` — GET loads the context — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextRoute.php:21
- confirmed `search` — keyword search is built only when this request parameter is set — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:53
- confirmed `/store-api/checkout/cart/line-item` — POST adds line items — vendor/shopware/core/Checkout/Cart/SalesChannel/CartItemAddRoute.php:49
- confirmed `Cart is empty.` — error message for ordering with an empty cart — vendor/shopware/core/Checkout/Order/Exception/EmptyCartException.php:20
