---
id: platform/dev/6.7/guides/development/integrations-api/flows/_index.md
title: API Flows
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/flows/
sourceHash: f32b62e483114fb3494897f8c1d57398faba4bcc
codeCheckedAgainst: "6.7.15.1"
keywords: ["api flows", "end-to-end", "admin api", "store api", "create product", "checkout", "cart", "register customer", "place order", "handle payment", "walkthrough"]
summary: Index of end-to-end Shopware API walkthroughs; currently one flow - create a category and product via Admin API and complete checkout via Store API.
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/guides/development/integrations-api/flows/create-product.md
---
## What it is

Index of guides that show concrete end-to-end API flows — sequences of calls seen together rather than isolated endpoint references. More flows are planned.

## When to use

When you need a tested sequence spanning both the Admin API and the Store API, rather than documentation for a single endpoint.

## Key steps / config

Available flow:

- platform/dev/6.7/guides/development/integrations-api/flows/create-product.md — create a category and a product with the Admin API, read them through the Store API, add the product to a cart, register a customer, place an order, and handle payment if needed.

The flow touches these core routes: Admin `POST /api/category`, `POST /api/product`; Store `GET /store-api/context`, `POST /store-api/checkout/cart/line-item`, `POST /store-api/account/register`, `POST /store-api/checkout/order`, `/store-api/handle-payment`.

## Code check (6.7.15.1)
- confirmed `/store-api/context` — GET route `store-api.context` — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextRoute.php:21
- confirmed `/store-api/checkout/cart/line-item` — POST route `store-api.checkout.cart.add` — vendor/shopware/core/Checkout/Cart/SalesChannel/CartItemAddRoute.php:49
- confirmed `/store-api/account/register` — POST route — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:105
- confirmed `/store-api/checkout/order` — POST route, login required (guests allowed) — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:69
- confirmed `/store-api/handle-payment` — GET/POST route — vendor/shopware/core/Checkout/Payment/SalesChannel/HandlePaymentMethodRoute.php:49
