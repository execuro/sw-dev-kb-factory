---
id: platform/dev/6.7/concepts/commerce/checkout-concept/_index.md
title: Checkout
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/
sourceHash: 688dbb4230e8fd9fff61ad4cbf8aa5190b008583
codeCheckedAgainst: "6.7.15.1"
keywords: ["checkout", "cart", "order", "payment", "shipping", "Cart", "CartService", "OrderConverter", "OrderEntity", "PaymentProcessor", "checkout process", "cart to order"]
summary: "Checkout concept overview: turning a cart into an order and starting payment and shipping; entry point to cart, order and payment pages."
lastBuilt: 2026-10-21
---
## What it is

The entry page of the checkout section of the Shopware concepts documentation. The checkout is the series of steps a customer goes through to purchase items in a store: it covers the entire process of turning a cart into an order and initiating all associated processes such as payment and shipping. The section's sub-pages focus on carts, orders and payment.

## When to use

Start here for orientation on how cart, order and payment relate in Shopware 6.7 before reading the dedicated cart, order or payment concept pages.

## Key steps / config

The source gives no configuration; it describes the flow only at a high level. In the installed code the flow maps to these classes:

1. A cart (`Shopware\Core\Checkout\Cart\Cart`) collects what the customer wants to buy.
2. `Shopware\Core\Checkout\Cart\SalesChannel\CartService` turns the cart into an order via `CartService::order()`, which returns the new order ID; the cart-to-order mapping is done by `Shopware\Core\Checkout\Cart\Order\OrderConverter`.
3. The resulting order (`OrderEntity`) is the starting point for payment (`Shopware\Core\Checkout\Payment\PaymentProcessor`) and shipping.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\Cart`
- `Shopware\Core\Checkout\Cart\SalesChannel\CartService`
- `Shopware\Core\Checkout\Cart\Order\OrderConverter`
- `Shopware\Core\Checkout\Order\OrderEntity`
- `Shopware\Core\Checkout\Payment\PaymentProcessor`

## Code check (6.7.15.1)
- confirmed `Cart` — cart struct class — vendor/shopware/core/Checkout/Cart/Cart.php:21
- confirmed `CartService::order()` — turns a cart into an order and returns the order id — vendor/shopware/core/Checkout/Cart/SalesChannel/CartService.php:154
- confirmed `OrderConverter` — injected into the order persister for cart-to-order conversion — vendor/shopware/core/Checkout/Cart/Order/OrderPersister.php:27
- confirmed `OrderEntity` — order entity — vendor/shopware/core/Checkout/Order/OrderEntity.php:30
- confirmed `PaymentProcessor` — payment handling service — vendor/shopware/core/Checkout/Payment/PaymentProcessor.php:41
