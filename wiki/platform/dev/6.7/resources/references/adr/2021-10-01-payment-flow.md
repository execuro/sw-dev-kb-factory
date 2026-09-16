---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/references/adr/2021-10-01-payment-flow.md
sourceHash: 2fa7fe543e8d0127f661b12e1263c357a2a6cf99
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-10-01-payment-flow.html
title: Payment Flow
version: "6.7"
versions:
  - "6.7"
keywords: ["payment flow", "payment handler", "AbstractPaymentHandler", "synchronous payment", "asynchronous payment", "pre-created payment", "after order payment", "app payment", "pay-url", "finalize-url", "validate-url", "redirect", "checkout", "adr"]
summary: "ADR: payment flow for extensions: immediate vs redirect payments, pre-created payments, after-order retry; in 6.7 unified in AbstractPaymentHandler."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2021-10-01, area checkout) defining the standard way Shopware extensions implement custom payments: a synchronous flow, an asynchronous (redirect) flow, optional support for pre-created payments, app payments via HTTP callbacks, and an after-order payment loop for failed payments.

## When to use

- You implement a payment method in a plugin or app and need the conceptual flow (pay, redirect and finalize, validate before order creation, retry after failure).
- You need to map the ADR's handler types to the handler API installed in 6.7.

## Key steps / config

The ADR's concepts, mapped to the installed 6.7 code (one base class instead of separate handler types):

1. **Synchronous payment** — executed right after order creation without user interaction; client data can be passed; errors are raised as exceptions. In code: extend `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler` and let `pay()` return `null`.
2. **Asynchronous payment** — the user is redirected to the payment provider and back to the shop's success/error page. In code: `pay()` returns a `RedirectResponse`; `finalize()` is then called on return to validate the redirect back.
3. **Pre-created payments** — a headless client prepares the payment directly with the provider and passes a transaction reference; the handler must verify the payload with the provider, then the order is created and the handler charges the payment. In code: `validate()` runs before the order is persisted; throwing a `PaymentException` stops order creation; its returned struct is passed to `pay()`.
4. **App payments** — same flows, but Shopware calls the app's HTTP endpoints instead of PHP code; the response drives the flow. Manifest elements: `pay-url`, `finalize-url`, `validate-url`.
5. **After order payment (error case)** — on failure the customer can choose another payment method and the whole loop runs again.

```php
class MyPaymentHandler extends AbstractPaymentHandler
{
    public function supports(PaymentHandlerType $type, string $paymentMethodId, Context $context): bool { /* ... */ }
    public function pay(Request $request, PaymentTransactionStruct $transaction, Context $context, ?Struct $validateStruct): ?RedirectResponse { /* ... */ }
}
```

## Essential identifiers

- `AbstractPaymentHandler::pay()`, `::finalize()`, `::validate()`, `::supports()`
- `PaymentHandlerType` (`REFUND`, `RECURRING`)
- `PaymentException`
- App manifest `payment-method` elements `pay-url`, `finalize-url`, `validate-url`

## Gotchas

- For pre-created payments the handler has to verify the given payload with the payment service; Shopware cannot ensure a frontend-created transaction matches the cart.
- The ADR recommends implementing pre-created payments when creation and capture of a payment can be separated.
- `finalize()` is only called when `pay()` returned a `RedirectResponse`.

## Version notes

- The ADR describes separate synchronous/asynchronous handler types with an optional extra interface for pre-created payments. The installed 6.7.13.0 code has no such interfaces; all handlers extend `AbstractPaymentHandler`, and optional capabilities (refund, recurring) are declared via `supports()`.

## Code check (6.7.13.0)
- confirmed `AbstractPaymentHandler` — single base class for payment handlers — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `AbstractPaymentHandler::supports()` — abstract, gates non-core methods by PaymentHandlerType — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- corrected `AbstractPaymentHandler::pay()` — docs: separate synchronous and asynchronous handlers; code returns ?RedirectResponse — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:34
- corrected `AbstractPaymentHandler::validate()` — docs: additional interface for pre-created payments; code uses this optional method — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:46
- confirmed `AbstractPaymentHandler::finalize()` — called after redirect only — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:58
- confirmed `PaymentHandlerType` — cases RECURRING and REFUND — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:11
- confirmed `pay-url` — app payment callback element in manifest schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:525
- confirmed `AppPaymentHandler` — app callbacks implemented as an AbstractPaymentHandler — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:53
- absent `SynchronousPaymentHandlerInterface` — no separate synchronous/asynchronous handler interfaces in the installed code
