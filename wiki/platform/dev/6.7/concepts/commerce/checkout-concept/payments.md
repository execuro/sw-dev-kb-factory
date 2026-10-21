---
id: platform/dev/6.7/concepts/commerce/checkout-concept/payments.md
title: Payments
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments.html
sourceHash: c4118b807f81869f48316b5af8061ab845f3c87a
codeCheckedAgainst: "6.7.15.1"
keywords: ["payment", "payment handler", "AbstractPaymentHandler", "/store-api/context", "/store-api/checkout/order", "/store-api/handle-payment", "/payment/finalize-transaction", "synchronous payment", "asynchronous payment", "order transaction", "checkout", "headless payment"]
summary: Shopware 6.7 payment flow concept - select method, place order, handle payment via payment handlers, finalize async redirects.
lastBuilt: 2026-10-21
---
## What it is

The concept page for Shopware's payment system in checkout. A payment is applied to a transaction of an order and, like any order change, goes through the state machine. Payment handlers add support for payment types; the list of handlers is stored in the database.

## When to use

Before building a payment extension or a headless checkout that places orders and runs payments through the Store API.

## Key steps / config

1. **Select payment method** - stored in the user's context, changed via `/store-api/context` (installed code: `PATCH` switches, `GET` reads).
2. **Place order** - no required parameters; built from the current context and cart, optional extras like tracking parameters or comments (`/store-api/checkout/order`). Shopware creates the order plus one open transaction as a placeholder for the payment (unique ID, payment method, amount). An order can have several transactions; only one is created here.
   - 2.1 **Prepare payment (optional)** - some integrations reserve or authorise here and store a payment intent or transaction reference; not standardised by Shopware.
3. **Handle payment** - only after the order exists; Shopware resolves the handler of the selected method (`/store-api/handle-payment`). The default Storefront runs steps 2 and 3 in one request.
   - 3.1 **Payment handler** - synchronous: the gateway answers immediately with a status. Asynchronous: the integration redirects to the gateway with transaction info and a callback URL; the frontend may pass success and error URLs. The Storefront redirects automatically; headless, the redirect URL is returned in the API response.
   - 3.2 **Gateway execution (optional, async only)** - user confirms on the gateway UI, which redirects back to the callback URL with an outcome parameter.
   - 3.3 **Finalize (optional, async only)** - the callback URL points to `/payment/finalize-transaction`; Shopware updates the transaction state and redirects to the finish page.

Installed code: a handler extends `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler` and must implement `supports()` and `pay()`; `validate()`, `finalize()`, `refund()` and `recurring()` have defaults. `pay()` returning a `RedirectResponse` makes the payment asynchronous; only then is `finalize()` called.

## Essential identifiers

- `AbstractPaymentHandler`, `PaymentHandlerType` (`REFUND`, `RECURRING`)
- `/store-api/context`, `/store-api/checkout/order`, `/store-api/handle-payment`
- `/payment/finalize-transaction` (route `payment.finalize.transaction`, GET and POST)

## Gotchas

- Implementations differ between providers; Shopware specifies no payment states or API calls. Data sharing between steps or webhooks after payment are outside the standard.
- Do not use the session in headless payment integrations.
- Keep logic out of controllers and expose payment logic through Store API routes so it works headless.

## Code check (6.7.15.1)
- confirmed `AbstractPaymentHandler` — base class for payment handlers — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `AbstractPaymentHandler::pay()` — abstract, returns ?RedirectResponse to trigger async flow — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- confirmed `AbstractPaymentHandler::finalize()` — only called after pay() returned a redirect — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:58
- confirmed `AbstractPaymentHandler::supports()` — abstract capability check per PaymentHandlerType — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- confirmed `PaymentHandlerType` — enum with RECURRING and REFUND — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:8
- confirmed `/store-api/context` — PATCH route switches the context, e.g. payment method — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextSwitchRoute.php:57
- confirmed `/store-api/checkout/order` — order placement route — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:69
- confirmed `/store-api/handle-payment` — payment handling route — vendor/shopware/core/Checkout/Payment/SalesChannel/HandlePaymentMethodRoute.php:49
- confirmed `/payment/finalize-transaction` — async callback route, GET and POST — vendor/shopware/core/Checkout/Payment/Controller/PaymentController.php:60
