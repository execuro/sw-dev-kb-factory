---
id: platform/dev/6.7/concepts/commerce/checkout-concept/_index.md
title: Checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/
sourceHash: 688dbb4230e8fd9fff61ad4cbf8aa5190b008583
codeCheckedAgainst: "6.7.13.0"
keywords: ["checkout", "cart to order", "order", "payment", "shipping", "CartService", "CartOrderRoute", "/store-api/checkout/order", "place order", "purchase process", "checkout concept"]
summary: Checkout concept overview - the process that turns a cart into an order and triggers payment and shipping; entry to cart, order and payment pages.
lastBuilt: 2026-09-15
---
## What it is

Overview of the checkout concept section. The checkout is the series of steps to purchase items in a store; in Shopware it covers the entire process of turning a cart into an order and initiating all associated processes such as payment and shipping. The section's sub-pages focus on carts, orders and payment.

## When to use

Entry point when orienting in checkout topics, before reading the cart, order or payment concept pages, or when you need to locate where a cart becomes an order in the installed code.

## Essential identifiers

Installed-code entry points for the cart-to-order step (not named in the source, confirmed in the 6.7 core):

- `Shopware\Core\Checkout\Cart\SalesChannel\CartService::order()` — places an order from a `Cart` and a `SalesChannelContext`, returns the order ID
- `Shopware\Core\Checkout\Cart\SalesChannel\CartOrderRoute::order()` — Store API route `/store-api/checkout/order`

## Gotchas

- Payment handling after order creation runs through `Shopware\Core\Checkout\Payment\PaymentProcessor`; in 6.7.13 that class carries a `@deprecated tag:v6.8.0 - reason:becomes-final` marker, so do not extend it.

## Version notes

- 6.8.0: `PaymentProcessor` is announced to become final (deprecation marker in the 6.7 code).

## Code check (6.7.13.0)
- confirmed `CartService::order()` — creates an order from a cart — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:154
- confirmed `/store-api/checkout/order` — Store API order route path — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:69
- confirmed `CartOrderRoute::order()` — route method returning CartOrderRouteResponse — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:77
- deprecated `PaymentProcessor` — becomes final in v6.8.0 — vendor/shopware/core/Checkout/Payment/PaymentProcessor.php:42
