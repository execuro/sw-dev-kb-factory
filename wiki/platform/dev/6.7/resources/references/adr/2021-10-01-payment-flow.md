---
id: platform/dev/6.7/resources/references/adr/2021-10-01-payment-flow.md
title: Payment Flow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-10-01-payment-flow.html
sourceHash: 2fa7fe543e8d0127f661b12e1263c357a2a6cf99
codeCheckedAgainst: "6.7.15.1"
keywords: ["payment flow", "payment handler", "synchronous payment", "asynchronous payment", "pre-created payment", "after order payment", "AbstractPaymentHandler", "PaymentHandlerType", "AppPaymentHandler", "payUrl", "finalizeUrl", "validateUrl", "checkout", "redirect"]
summary: "ADR: standard payment flow for extensions: synchronous, asynchronous (redirect), app and pre-created payments, plus after-order retry on failure."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area checkout) defining the standard way extensions implement custom payments: synchronous and asynchronous handling, an app variant calling an external endpoint, optional support for pre-created payments, and an after-order payment loop when a transaction fails.

## When to use

Read this when implementing a payment extension (plugin or app) and you need the overall lifecycle: when the handler runs, when a redirect happens, how headless clients can pre-create payments, and what happens on failure.

## Key steps / config

**Synchronous payment** — executed right after the order is created, without user interaction. The client can pass additional data to the handler; the handler throws an exception on error.

**Asynchronous payment** — used when the customer must be redirected to the payment provider's site, which later redirects back to the shop's success or error page. The handler runs when the redirect link is prepared and again to validate ("finalize") the return.

**App payments** — follow the synchronous or asynchronous flow, but call an external HTTP endpoint defined by the app instead of PHP code; the response determines the further flow.

**Pre-created payments** — the client (e.g. a single-page app) prepares the payment directly with the provider and passes a transaction reference (token) to Shopware. The handler must verify the payload with the provider (Shopware cannot ensure it matches the cart); after verification the order is created and the handler is called again to charge. Recommended whenever creation and capture can be separated.

**After order payment (error case)** — on failure the customer can choose another payment method and retry; the whole loop starts again.

How 6.7.15.1 implements this: there is one base class, `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler`, instead of separate handler kinds:

```php
class MyPaymentHandler extends AbstractPaymentHandler
{
    public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool { /* ... */ }
    public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse { /* ... */ }
}
```

- `pay()` returning `null` = synchronous; returning a `RedirectResponse` = asynchronous, after which `finalize()` is called on return.
- `validate()` runs before the order is persisted (pre-created payment verification); throwing a `PaymentException` stops order creation. Its result is passed to `pay()` as `$validateStruct`.
- `supports()` gates the optional `PaymentHandlerType::REFUND` / `PaymentHandlerType::RECURRING` capabilities.
- Apps configure `payUrl`, `finalizeUrl` and `validateUrl` on the manifest payment method; `AppPaymentHandler` (itself an `AbstractPaymentHandler`) calls them.

## Essential identifiers

- `AbstractPaymentHandler` with `supports()`, `pay()`, `validate()`, `finalize()`
- `PaymentHandlerType` (`REFUND`, `RECURRING`)
- `AppPaymentHandler`
- App manifest payment method URLs: `payUrl`, `finalizeUrl`, `validateUrl`

## Gotchas

- In pre-created payments the handler, not Shopware, is responsible for verifying that the client-created transaction is valid for the current cart.
- `finalize()` is only ever called when `pay()` returned a `RedirectResponse`.

## Code check (6.7.15.1)
- confirmed `AbstractPaymentHandler` — single base class for all payment handlers — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `AbstractPaymentHandler::supports()` — abstract, gates optional handler types — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- confirmed `AbstractPaymentHandler::pay()` — abstract, returns ?RedirectResponse — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- confirmed `AbstractPaymentHandler::validate()` — called before order is persisted — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:46
- confirmed `AbstractPaymentHandler::finalize()` — called after redirect only — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:58
- confirmed `PaymentHandlerType` — enum with RECURRING and REFUND — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:8
- confirmed `PaymentMethod::$payUrl` — app manifest pay endpoint — vendor/shopware/core/Framework/App/Manifest/Xml/PaymentMethod/PaymentMethod.php:37
- confirmed `PaymentMethod::$finalizeUrl` — app manifest finalize endpoint — vendor/shopware/core/Framework/App/Manifest/Xml/PaymentMethod/PaymentMethod.php:39
- confirmed `PaymentMethod::$validateUrl` — app manifest validate endpoint — vendor/shopware/core/Framework/App/Manifest/Xml/PaymentMethod/PaymentMethod.php:41
- confirmed `AppPaymentHandler` — extends AbstractPaymentHandler — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:53
