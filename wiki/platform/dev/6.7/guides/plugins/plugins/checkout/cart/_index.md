---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/_index.md
title: Cart
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/
sourceHash: f6300964821c981f925605fb587989b78953c44e
codeCheckedAgainst: "6.7.15.1"
keywords: ["cart", "shopping cart", "basket", "line items", "cart discounts", "custom prices", "tax rates", "cart persistence", "cart validation", "add to cart", "checkout"]
summary: Overview of cart plugin guides - adding products, line item discounts and custom prices, taxes, cart persistence and cart validation.
lastBuilt: 2026-10-21
---
## What it is

Landing page for the plugin guides about the cart. The cart functions are part of the Shopware core; plugins customize them for specific business requirements. Areas named by the source: adding products to the cart, displaying cart contents, adding discounts to line items, updating cart items, adding custom prices to line items, applying tax rates, proceeding to checkout, persisting cart data, integrating with the checkout process and validating the cart.

## When to use

As an entry point when you need to change how the cart behaves - discounts, prices, taxes, persistence or validation - and are looking for the matching sub-guide.

## Code check (6.7.15.1)
- confirmed `CartService` — core service for cart operations — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:24
- confirmed `CartProcessorInterface` — extension point for discounts and prices — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:10
- confirmed `AbstractCartPersister` — base for cart persistence — vendor/shopware/core/Checkout/Cart/AbstractCartPersister.php:14
- confirmed `CartValidatorInterface` — extension point for cart validation — vendor/shopware/core/Checkout/Cart/CartValidatorInterface.php:10
