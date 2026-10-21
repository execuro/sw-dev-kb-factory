---
id: platform/dev/6.7/guides/plugins/plugins/checkout/_index.md
title: Checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/
sourceHash: d5c85e32784df0094c311f5a6d0b73ddef84cdf8
codeCheckedAgainst: "6.7.15.1"
keywords: ["checkout", "checkout plugin", "guest checkout", "payment methods", "shipping method selection", "address validation", "order summary", "shopping cart", "promotion code", "voucher", "custom fields"]
summary: Overview of checkout plugin guides - guest checkout, custom fields, payment and shipping options, address validation, cart, promotion codes.
lastBuilt: 2026-10-21
---
## What it is

Landing page for the plugin guides about the checkout. A checkout plugin changes or extends the customer's checkout process. Areas named by the source: guest checkout, custom fields, multiple payment options, address validation, order summaries, the shopping cart, shipping method selection and promotional code support.

## When to use

As an entry point when a project needs checkout behavior beyond the core defaults - for example an additional payment option, a different shipping method selection or extra validation - and you are looking for the matching sub-guide.

## Code check (6.7.15.1)
- confirmed `CartService` — core cart service the checkout builds on — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:24
- confirmed `AbstractPaymentHandler` — base for payment options — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `AbstractShippingMethodRoute` — Store API route for shipping method selection — vendor/shopware/core/Checkout/Shipping/SalesChannel/AbstractShippingMethodRoute.php:15
