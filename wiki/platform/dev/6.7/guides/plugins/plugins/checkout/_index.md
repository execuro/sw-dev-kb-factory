---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/_index.md
sourceHash: d5c85e32784df0094c311f5a6d0b73ddef84cdf8
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/
title: Checkout
version: "6.7"
versions:
  - "6.7"
keywords: ["checkout", "checkout plugin", "guest checkout", "payment method", "shipping method", "promotion code", "voucher", "address validation", "order summary", "AbstractPaymentHandler", "CartOrderRoute", "PromotionProcessor", "CartValidatorInterface"]
summary: "Overview of checkout plugins: guest checkout, custom fields, payment and shipping selection, address validation, order summary, cart and promotion codes."
lastBuilt: 2026-09-15
---
## What it is

Entry page of the Shopware 6.7 plugin guides for the checkout area. It describes what a checkout plugin typically adds or changes: guest checkout, custom fields, multiple payment options, address validation, order summaries, the shopping cart, shipping method selection and promotional code support — adapting the checkout process to specific business requirements.

## When to use

- Orienting before building a plugin that touches any step between cart and placed order.
- Finding which sub-area (cart, payment, shipping, promotions, order) a checkout requirement belongs to.

## Essential identifiers

The source names only feature areas. The installed core code implements the main ones in these extension points (verified, see Code check):

- Payment options: `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`, handler services tagged `shopware.payment.method`.
- Cart and its validation: `Shopware\Core\Checkout\Cart\CartValidatorInterface` (`validate(Cart $cart, ErrorCollection $errors, SalesChannelContext $context)`).
- Promotion codes: `Shopware\Core\Checkout\Promotion\Cart\PromotionProcessor` (a cart processor).
- Order placement: Store API `Shopware\Core\Checkout\Cart\SalesChannel\AbstractCartOrderRoute` / `CartOrderRoute`, and `CartService::order()`.

## Code check (6.7.13.0)
- confirmed `AbstractPaymentHandler` — abstract base for payment handlers — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `shopware.payment.method` — tag on core payment handler services — vendor/shopware/core/Checkout/DependencyInjection/payment.xml:100
- confirmed `CartValidatorInterface::validate()` — cart validation contract — vendor/shopware/core/Checkout/Cart/CartValidatorInterface.php:12
- confirmed `PromotionProcessor` — implements CartProcessorInterface — vendor/shopware/core/Checkout/Promotion/Cart/PromotionProcessor.php:21
- confirmed `AbstractCartOrderRoute` — decoratable Store API order route — vendor/shopware/core/Checkout/Cart/SalesChannel/AbstractCartOrderRoute.php:14
- confirmed `CartOrderRoute` — extends AbstractCartOrderRoute — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:41
- confirmed `CartService::order()` — turns a cart into an order — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:154
