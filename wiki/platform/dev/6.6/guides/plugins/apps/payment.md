---
id: platform/dev/6.6/guides/plugins/apps/payment.md
title: Payment
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/payment.html
sourceHash: aff11cca7d7b8ca2838428f1d78a36660d3a9f2c
keywords: ["payment methods", "synchronous payment", "asynchronous payment", "pay-url", "finalize-url", "prepared payments", "refund", "recurring captures", "PaymentResponse", "RefundResponse", "PaymentPayAction", "PaymentFinalizeAction", "validate call", "capture call"]
summary: "How apps integrate payment providers via manifest-defined pay/finalize URLs, synchronous/asynchronous flows, prepared payments, and refunds."
lastBuilt: "2026-09-15"
---
## What it is
Since Shopware `6.4.1.0`, apps can integrate payment providers by defining one or more payment methods in `manifest.xml`, backed by signed JSON endpoints for starting and finalizing payments.

## When to use
Use when building a payment app: simple background approval (synchronous), redirect-based provider flows (asynchronous), prepared payments captured after order placement, refunds, or recurring/subscription captures.

## Key steps / config
Define payment methods via `<<< @/docs/snippets/config/app/payments.xml`. A `finalize-url` marks an asynchronous method; omitting it defaults to synchronous. Omitting `pay-url` leaves the transaction open with no communication. The payment method identifier must not change after release, or new payment methods get created.

Synchronous flow: app responds to the `pay-url` request with a `status` (see states below), optionally a `message`.

Asynchronous flow: Shopware POSTs `order`, `orderTransaction`, `returnUrl` to `pay-url`; app responds `redirectUrl`; after the provider redirects the customer back, Shopware POSTs to `finalize-url` with `orderTransaction` and `requestData` (query params); app responds with `status`.

Prepared payments (since `6.4.9.0`): a `validate` call receives `cart`, `requestData` (from `CartOrderRoute`), and `salesChannelContext`, and may return a `preOrderPayment` object forwarded to the later `capture` call, which receives `order`, `orderTransaction`, `preOrderPayment`.

Refunds (since `6.4.12.0`): a `refund` call receives `order` and `refund` (`amount`, referenced `capture`, optional `reason`/`positions`); respond with a `status`.

Recurring captures use payloads similar to the synchronous flow, requiring the Subscriptions feature and an existing billing agreement.

```php
use Shopware\App\SDK\Context\Payment\PaymentPayAction;
#[AsController]
class PaymentController {
    #[Route('/payment/pay')]
    public function handle(PaymentPayAction $payment): ResponseInterface {
        return PaymentResponse::paid();
    }
}
```

## Essential identifiers
- `finalize-url`, `pay-url` (manifest payment method properties)
- `PaymentPayAction`, `PaymentFinalizeAction`, `PaymentValidateAction`, `PaymentCaptureAction`
- `ContextResolver::assemblePaymentPay()`, `assemblePaymentFinalize()`, `assemblePaymentValidate()`, `assemblePaymentCapture()`, `assemblePaymentRecurringCapture()`
- `PaymentResponse::paid()`, `PaymentResponse::redirect()`, `PaymentResponse::validateSuccess()`
- `RefundResponse::completed()`

## Gotchas
Prepared payments still need a fallback synchronous/asynchronous flow if checkout integration fails, especially for after-order payments where the order already exists. If the capture call sets the transaction state to anything but open, the async payment process is not started afterward.

## Version notes
Payment support: `6.4.1.0`. Prepared payments: `6.4.9.0`. Refunds: `6.4.12.0`.

Payment states: `open`, `paid`, `cancelled`, `refunded`, `failed`, `authorize`, `unconfirmed`, `in_progress`, `reminded`, `chargeback`.
Refund states: `open`, `in_progress`, `cancelled`, `failed`, `completed`.
