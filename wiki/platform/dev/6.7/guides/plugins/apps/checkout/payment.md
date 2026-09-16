---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/checkout/payment.md
sourceHash: 7c36ae102d1621115766da35e6d459cac5d7708c
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/payment.html
title: Payment
version: "6.7"
versions:
  - "6.7"
keywords: ["app payment", "payment-method", "pay-url", "finalize-url", "validate-url", "refund-url", "recurring-url", "AppPaymentHandler", "PaymentResponse", "preOrderPayment", "redirectUrl", "prepared payment", "asynchronous payment", "refund", "recurring capture"]
summary: "App payment methods via manifest payment-method URLs (pay, finalize, validate, refund, recurring); JSON request/response shapes and status handling in 6.7."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/app-reference/payment-reference.md"]
---
## What it is

How an app integrates a payment provider: payment methods declared in `manifest.xml` point to signed JSON endpoints on the app server that Shopware's internal `AppPaymentHandler` calls for pay, finalize, validate (prepared payments), refund and recurring captures.

## When to use

Building an app (not a plugin) that offers synchronous, asynchronous (redirect), prepared, refundable or recurring (subscription) payments. Full field reference: [Payment reference](platform/dev/6.7/resources/references/app-reference/payment-reference.md).

## Key steps / config

1. Declare methods under `<payments>` in the manifest (schema `manifest-3.0.xsd`). Methods are identified by app name + `<identifier>` — never change the identifier after release, or new payment methods are created.
   ```xml
   <payments>
     <payment-method>
       <identifier>...</identifier>
       <name>...</name>
       <description>...</description>
       <pay-url>...</pay-url>
       <finalize-url>...</finalize-url>
       <validate-url>...</validate-url>
       <refund-url>...</refund-url>
       <recurring-url>...</recurring-url>
       <icon>...</icon>
     </payment-method>
   </payments>
   ```
   All URL elements are optional. No `pay-url`: the transaction stays open. `pay-url` without `finalize-url`: synchronous. With `finalize-url`: asynchronous.
2. **Synchronous pay** — POST body `{ "source": {url, shopId, appVersion}, "orderTransaction": {...}, "order": {...}, "requestData": {...}, "returnUrl": ... }`; respond `{ "status": "authorize" }` (optionally `"message"`).
3. **Asynchronous pay** — same request including `returnUrl`; respond `{ "redirectUrl": "..." }`. The shopper returns to `returnUrl`; Shopware then POSTs to `finalize-url` with `orderTransaction` and `requestData` (the provider's query parameters, `_sw_payment_token` removed). Respond with `status` (e.g. `paid`, `authorize`, `fail`, `cancel`).
4. **Prepared payments** — the `validate-url` call receives `cart`, `requestData` (the order placement request data) and `salesChannelContext` before the order is placed. Respond `{ "preOrderPayment": { ... } }`; returning a `message` or an error code aborts order placement. After the order is persisted, `pay-url` is called.
5. **Refund** — `refund-url` receives `order` and `refund` (amount, capture, reason, positions); respond with a refund transition action in `status`.
6. **Recurring** — `recurring-url` receives `orderTransaction` and `order` (payload like sync pay); respond with a `status`.

Response `status` is passed directly to the state machine as a **transition action** on `order_transaction` (or `order_transaction_capture_refund` for refunds), e.g. `paid`, `paid_partially`, `authorize`, `process`, `fail`, `cancel`, `remind`, `chargeback`, `reopen`; for refunds typically `complete`, `fail`, `reopen`.

## Essential identifiers

- Manifest: `<payments>`, `<payment-method>`, `<identifier>`, `<pay-url>`, `<finalize-url>`, `<validate-url>`, `<refund-url>`, `<recurring-url>`
- Request keys: `source`, `orderTransaction`, `order`, `requestData`, `returnUrl`, `cart`, `salesChannelContext`, `refund`
- Response keys: `status`, `message`, `redirectUrl`, `preOrderPayment`
- Core: `Shopware\Core\Framework\App\Payment\Handler\AppPaymentHandler`, `PaymentResponse`, `ValidateResponse`, `RefundResponse`
- App PHP SDK (outside core): `ContextResolver::assemblePaymentPay()`, `assemblePaymentFinalize()`, `assemblePaymentValidate()`, `assemblePaymentRefund()`, `assemblePaymentRecurringCapture()`, `PaymentResponse::paid()`, `PaymentResponse::redirect()`, `RefundResponse::completed()`

## Gotchas

- From 6.7.0.0 the app server must return a status in its response if it wants the transaction state to change; an empty `status` leaves the state untouched.
- Any non-empty `message` makes core throw (payment interrupted) — it is treated as failure even alongside a success status. `status: fail` without message also fails ("Payment was reported as failed.").
- `status: cancel` throws a customer-canceled exception instead of a plain transition.
- The docs' "payment states" list (`failed`, `cancelled`, `refunded`, `open`, ...) names states; core expects action names (`fail`, `cancel`, `refund`, `reopen`, ...).
- The docs' SDK validate example uses `PaymentResponse::validateSuccess()`; that is App PHP SDK code, not in core — the wire format is `preOrderPayment`.
- In core 6.7.13.0 `AppPaymentHandler::pay()` builds the pay payload with an empty struct in the `validateStruct` slot instead of the validate result — do not rely on `preOrderPayment` data arriving in the pay call; keep your reference app-side.
- Payment requests to the app time out after 20 seconds.
- Recurring payments require the paid Subscriptions feature; keep a normal sync/async flow available as fallback for prepared payments.

## Version notes

- App payments since 6.4.1.0; prepared payments since 6.4.9.0; refunds since 6.4.12.0.
- `capture-url` was deprecated with manifest v3.0 / Shopware 6.7 — do capture logic in `pay-url`.

## Code check (6.7.13.0)
- absent `validateSuccess` — App PHP SDK helper used in the docs; not in installed Shopware code
- confirmed `payment-method` — manifest element with pay/finalize/validate/refund/recurring URLs — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:520
- deprecated `capture-url` — deprecated with manifest v3.0, use pay-url — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-2.0.xsd:512
- confirmed `AppPaymentHandler::finalize()` — throws without finalize URL, strips `_sw_payment_token` — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:134
- corrected `AppPaymentHandler::pay()` — docs: pay call receives `preOrderPayment`; code passes an empty ArrayStruct (line 119) — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:108
- corrected `AppPaymentHandler::transitionState()` — docs: status is a payment state; code uses it as transition action — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:236
- confirmed `AbstractResponse::$message` — any message interrupts the payment — vendor/shopware/core/Framework/App/Payment/Response/AbstractResponse.php:19
- confirmed `ValidateResponse::$preOrderPayment` — validate response key — vendor/shopware/core/Framework/App/Payment/Response/ValidateResponse.php:18
- confirmed `PaymentResponse::$redirectUrl` — async redirect key — vendor/shopware/core/Framework/App/Payment/Response/PaymentResponse.php:24
- confirmed `PaymentPayloadService::PAYMENT_REQUEST_TIMEOUT` — 20 seconds — vendor/shopware/core/Framework/App/Payment/Payload/PaymentPayloadService.php:22
