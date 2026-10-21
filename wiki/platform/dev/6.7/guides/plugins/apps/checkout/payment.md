---
id: platform/dev/6.7/guides/plugins/apps/checkout/payment.md
title: Payment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/payment.html
sourceHash: 7c36ae102d1621115766da35e6d459cac5d7708c
codeCheckedAgainst: "6.7.15.1"
keywords: ["app payment", "payment-method", "pay-url", "finalize-url", "validate-url", "refund-url", "recurring-url", "preOrderPayment", "PaymentResponse", "RefundResponse", "ContextResolver", "AppPaymentHandler", "prepared payment", "asynchronous payment", "psp integration"]
summary: App payment methods - manifest URLs, sync/async pay, finalize, prepared payments, refunds, recurring captures and response status values.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/resources/references/app-reference/payment-reference.md"]
---
## What it is

How an app provides payment methods (since 6.4.1.0): Shopware calls signed JSON endpoints on the app server to start, finalize, validate, refund or recurringly capture payments, and transitions the order transaction according to the returned `status`.

## When to use

When integrating a payment provider via an app: background approval (synchronous), redirect to a provider (asynchronous), checkout-embedded prepared payments, refunds, or subscription captures. The app server must be reachable from the Shopware server.

## Key steps / config

1. Declare payment methods in the manifest. Each is identified by app name + `identifier`; changing the identifier after release creates a new payment method.

```xml
<payments>
    <payment-method>
        <identifier>myMethod</identifier>
        <name>...</name>
        <pay-url>...</pay-url>
        <finalize-url>...</finalize-url>
        <validate-url>...</validate-url>
        <refund-url>...</refund-url>
        <recurring-url>...</recurring-url>
    </payment-method>
</payments>
```

   No `pay-url`: no app call, transaction stays open. `pay-url` only: synchronous. `pay-url` + `finalize-url`: asynchronous.
2. **Synchronous pay**: request has `source` (`url`, `shopId`, `appVersion`), `orderTransaction`, `order`. Respond `{"status": "authorize"}` (or `paid`, ...). SDK: `$contextResolver->assemblePaymentPay(...)` and `PaymentResponse::paid()`; Symfony bundle: controller argument `PaymentPayAction`.
3. **Asynchronous pay**: request additionally has `returnUrl`; respond `{"redirectUrl": "..."}` (SDK `PaymentResponse::redirect($url)`). After the customer returns, Shopware POSTs to `finalize-url` with `orderTransaction` and `requestData` (provider query parameters); respond with `status` (SDK `assemblePaymentFinalize`, `PaymentFinalizeAction`).
4. **Prepared payments** (since 6.4.9.0): during order placement Shopware calls `validate-url` with `cart`, `requestData` (from the `CartOrderRoute` request) and `salesChannelContext`. Return an error code or `message` to stop the order, otherwise:

```json
{ "preOrderPayment": { "myCustomReference": "1234567890" } }
```

   After the order is persisted, `pay-url` is called (SDK `assemblePaymentValidate`/`PaymentValidateAction`, then `assemblePaymentCapture`/`PaymentCaptureAction`).
5. **Refund** (since 6.4.12.0): the app must have registered captures and created a refund. Request: `order`, `refund` (`amount`, `capture`, optional `reason`, `positions`). Respond `{"status": "completed"}` (SDK `assemblePaymentRefund`, `RefundResponse::completed()`).
6. **Recurring captures** (Subscriptions feature, paid plans): `recurring-url` gets `orderTransaction` and `order`; respond with `status` (SDK `assemblePaymentRecurringCapture`).

Core applies `status` as a state machine transition action on the order transaction (refund: on the capture refund), e.g. `paid`, `paid_partially`, `authorize`, `process`, `remind`, `chargeback`.

## Essential identifiers

- Manifest: `<payments>`, `<payment-method>`, `identifier`, `pay-url`, `finalize-url`, `validate-url`, `refund-url`, `recurring-url`
- Request keys: `source`, `orderTransaction`, `order`, `returnUrl`, `requestData`, `cart`, `salesChannelContext`, `refund`
- Response keys: `status`, `redirectUrl`, `message`, `preOrderPayment`
- SDK: `Shopware\App\SDK\Context\ContextResolver`, `Shopware\App\SDK\Response\PaymentResponse`, `Shopware\App\SDK\Response\RefundResponse`, `Shopware\App\SDK\Context\Payment\PaymentPayAction`
- Core: `AppPaymentHandler`

## Gotchas

- From 6.7.0.0 the app server **must** return a `status` if the transaction state should change.
- Any non-empty `message` makes core abort with `AppException::interrupted` (even beside `status: authorize`, as in the docs' example); `status: fail` aborts the same way; `status: cancel` raises a customer-canceled exception.
- The docs list state names (`open`, `cancelled`, `refunded`, `failed`, `in_progress`, `unconfirmed`, `reminded`) as status values; core needs a transition action valid from the current state.
- The docs' SDK validate example uses `PaymentResponse::validateSuccess([...])`, not present in the installed Shopware code; the wire contract is the `preOrderPayment` JSON.
- The docs say `preOrderPayment` is forwarded to the following `pay` call; in 6.7.15.1 `AppPaymentHandler::pay()` sends an empty struct instead.
- Still offer a regular sync/async flow in case the prepared checkout integration fails.

## Version notes

- 6.4.1.0 app payments; 6.4.9.0 prepared payments; 6.4.12.0 refunds; 6.7.0.0 `status` mandatory for state changes.

## Code check (6.7.15.1)
- absent `validateSuccess` — not found anywhere in the installed code index; SDK-side helper only
- confirmed `pay-url` — optional `payment-method` element, as are finalize-/validate-/refund-/recurring-url — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:538
- confirmed `finalize-url` — absence means synchronous flow — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:539
- confirmed `ValidateResponse::$preOrderPayment` — validate response key — vendor/shopware/core/Framework/App/Payment/Response/ValidateResponse.php:18
- corrected `AppPaymentHandler::pay()` — docs: validate's preOrderPayment is forwarded to pay; code passes a new empty ArrayStruct — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:108
- corrected `PaymentResponse::$status` — docs: list of state names; code uses it as transition action (paid, paid_partially, authorize, process, fail) — vendor/shopware/core/Framework/App/Payment/Response/PaymentResponse.php:19
- confirmed `AppException::interrupted()` — thrown whenever the response carries an error message — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:230
- confirmed `StateMachineTransitionActions::ACTION_FAIL` — `fail` status yields an error message and aborts — vendor/shopware/core/Framework/App/Payment/Response/PaymentResponse.php:42
- confirmed `StateMachineTransitionActions::ACTION_CANCEL` — `cancel` throws customerCanceled — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:246
- confirmed `_sw_payment_token` — stripped from query params before they are sent as finalize requestData — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:138
