---
id: platform/dev/6.7/guides/development/integrations-api/flows/_index.md
title: API Flows
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/flows/
sourceHash: f32b62e483114fb3494897f8c1d57398faba4bcc
codeCheckedAgainst: "6.7.13.0"
keywords: ["api flows", "end-to-end api walkthrough", "admin api", "store api", "checkout via api", "create product api", "/store-api/checkout/cart/line-item", "/store-api/checkout/order", "/store-api/handle-payment", "headless checkout"]
summary: Index of end-to-end Shopware API flow guides; currently one flow creating a product via Admin API and completing checkout via Store API.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/integrations-api/flows/create-product.md"]
---
## What it is

A landing page for guides that show concrete end-to-end API flows, with the calls presented together in sequence rather than as isolated endpoint references.

## When to use

When you need to see how Admin API and Store API calls chain together for a complete task, instead of looking up one endpoint at a time.

## Key steps / config

Available flows:

- [Create a Product and Complete Checkout](platform/dev/6.7/guides/development/integrations-api/flows/create-product.md): create a category and a product with the Admin API, read them through the Store API, add the product to a cart, register a customer, place an order, and handle payment if needed.

The source states that more flows will be added over time.

## Code check (6.7.13.0)
- confirmed `/store-api/checkout/cart/line-item` — POST route adds items to the cart — vendor/shopware/core/Checkout/Cart/SalesChannel/CartItemAddRoute.php:49
- confirmed `/store-api/checkout/order` — POST route places the order — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:69
- confirmed `/store-api/handle-payment` — payment handling route exists — vendor/shopware/core/Checkout/Payment/SalesChannel/HandlePaymentMethodRoute.php:49
- confirmed `/store-api/account/register` — POST route registers a customer — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:102
