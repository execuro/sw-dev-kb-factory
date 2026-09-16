---
id: platform/dev/6.7/concepts/commerce/checkout-concept/payments.md
title: Payments
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/payments.html
sourceHash: c4118b807f81869f48316b5af8061ab845f3c87a
codeCheckedAgainst: "6.7.13.0"
keywords: ["payment", "payment flow", "payment handler", "AbstractPaymentHandler", "PaymentHandlerType", "/store-api/context", "/store-api/checkout/order", "/store-api/handle-payment", "/payment/finalize-transaction", "order transaction", "asynchronous payment", "redirect payment", "headless checkout"]
summary: "Payment concept: order placement with open transaction, AbstractPaymentHandler pay/finalize, redirect flow via /payment/finalize-transaction."
lastBuilt: 2026-09-15
---
## What it is

Concept page for the Shopware payment system: a payment is applied to an order transaction through the state machine and executed by payment handlers (listed in the database per payment method), in a flow of two essential steps — placing the order and handling the payment.

## When to use

When designing a payment integration or a headless checkout and you need the order of steps, where redirects happen, and which endpoint finalizes a redirect payment.

## Key steps / config

1. Select payment method — stored in the sales channel context; change it via `/store-api/context` (PATCH).
2. Place order (`/store-api/checkout/order`) — no required parameters; uses current context and cart; optional extras like tracking parameters or comments. Creates the order plus one open transaction (ID, payment method, amount). An order can have multiple transactions.
   - 2.1 Prepare payment (optional) — integration-specific reservation/authorization; not standardized.
3. Handle payment (`/store-api/handle-payment`) — only after order placement; resolves the handler for the selected payment method. In the default Storefront, steps 2 and 3 run in one request.
   - 3.1 Handler: in 6.7.13 every handler extends `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`. `pay()` captures directly and returns `null` (synchronous case) or returns a `RedirectResponse` (asynchronous case). The frontend may pass success and error URLs; headless clients receive the redirect URL in the API response, the Storefront redirects automatically.
   - 3.2 Gateway execution (async only) — user confirms on the provider UI, then is sent to the callback URL.
   - 3.3 Finalize (async only) — callback hits `/payment/finalize-transaction`, which leads to the handler's `finalize()`; Shopware updates the transaction state and redirects to the finish page.

Handler members:

```php
class MyPaymentHandler extends AbstractPaymentHandler
{
    public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool { /* ... */ }
    public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse { /* ... */ }
    // optional overrides: validate(), finalize(), refund(), recurring()
}
```

## Essential identifiers

- `AbstractPaymentHandler::supports()`, `::pay()`, `::validate()`, `::finalize()`, `::refund()`, `::recurring()`
- `PaymentHandlerType` (`REFUND`, `RECURRING`)
- `/store-api/context`, `/store-api/checkout/order`, `/store-api/handle-payment`, `/payment/finalize-transaction`

## Gotchas

- Do not use the session in headless payment integrations.
- Keep logic out of controllers and add Store API routes for your payment so it works headless.
- Provider implementations differ; Shopware prescribes no payment states or API calls beyond this flow.
- The docs speak of two handler types (sync/async); the installed code has one abstract base — the distinction is only whether `pay()` returns a redirect. `finalize()` cannot be called unless `pay()` returned a `RedirectResponse`.
- `validate()` runs before the order is persisted; throwing a `PaymentException` there prevents the order.
- `refund()` / `recurring()` are only called when `supports()` returns true for `PaymentHandlerType::REFUND` / `::RECURRING`.

## Code check (6.7.13.0)
- corrected `AbstractPaymentHandler` — docs: synchronous and asynchronous handler types; code has one abstract base — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `AbstractPaymentHandler::supports()` — abstract, takes PaymentHandlerType — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- confirmed `AbstractPaymentHandler::pay()` — abstract, returns ?RedirectResponse — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- confirmed `AbstractPaymentHandler::validate()` — called before order persist — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:46
- confirmed `AbstractPaymentHandler::finalize()` — only after a redirect — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:58
- confirmed `PaymentHandlerType` — enum with RECURRING and REFUND — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:8
- confirmed `/store-api/context` — PATCH switches context incl. payment method — vendor/shopware/core/System/SalesChannel/SalesChannel/ContextSwitchRoute.php:57
- confirmed `/store-api/checkout/order` — order placement route — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:69
- confirmed `/store-api/handle-payment` — handle payment route — vendor/shopware/core/Checkout/Payment/SalesChannel/HandlePaymentMethodRoute.php:49
- confirmed `/payment/finalize-transaction` — finalize callback route — vendor/shopware/core/Checkout/Payment/Controller/PaymentController.php:60
