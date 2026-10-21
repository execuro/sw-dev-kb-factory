---
id: platform/dev/6.7/resources/references/app-reference/payment-reference.md
title: Payment Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/payment-reference.html
sourceHash: 8e1b1553b71e27dc7f8e5516106c8c509bc0676a
codeCheckedAgainst: "6.7.15.1"
keywords: ["app payment", "pay url", "finalize url", "shopware-shop-signature", "orderTransaction", "OrderTransactionEntity", "OrderEntity", "returnUrl", "redirectUrl", "payment status", "source.shopId", "AppPaymentHandler"]
summary: Request and response format of the app server pay and finalize endpoints for app payment methods - signed JSON body, redirectUrl, status values.
lastBuilt: 2026-10-21
---
## What it is

Reference for the two HTTP requests Shopware sends to an app server for an app-provided payment method: **pay** and **finalize**. These are the up to two endpoints defined per payment method in the manifest. All bodies are JSON encoded and every request carries the `shopware-shop-signature` header — the HMAC signature of the JSON body, signed with the shop secret returned from the registration request. Available since Shopware 6.4.1.0.

## When to use

When implementing the app-server side of an app payment method: verifying the signature, reading the order/transaction payload, and returning a response Shopware can act on.

## Key steps / config

### Pay — e.g. `POST https://payment.app/pay`

Called when the customer clicks *Confirm Order*.

Body fields:

- `order` (`OrderEntity`, required) — the order with its necessary associations (currency, shipping address, billing address, line items).
- `orderTransaction` (`OrderTransactionEntity`, required) — the transaction to process; `orderTransaction.id` identifies it again on finalize.
- `returnUrl` (string) — where the app or payment provider must redirect the customer back to after the external payment step. Only supplied for asynchronous payments.
- `requestData` — the storefront request data posted on order confirmation.
- `source` (required) — `source.url` (shop URL), `source.shopId` (the shop id registered with the app), `source.appVersion` (installed app version).

Responses (`200`):

```json
{ "redirectUrl": "https://payment.app/user/go/here/..." }
{ "status": "fail", "message": "The shop has not provided all credentials for the payment provider." }
```

If `redirectUrl` is set, Shopware redirects the customer there.

### Finalize — e.g. `POST https://payment.app/finalize`

Called once the customer returns to the `returnUrl`. Body: `orderTransaction` (with `orderTransaction.id`), `source` (`url`, `shopId`, `appVersion`); the installed code also sends `order` and, as `requestData`, the query parameters of the return request (without `_sw_payment_token`). Shopware throws if the payment method has no finalize URL.

Responses (`200`):

```json
{ "status": "paid" }
{ "status": "fail", "message": "The user did not have adequate funds." }
{ "status": "cancel", "message": "The user did not finish payment." }
```

### How `status` is applied

- No `status` → the transaction is left unchanged (stays `open` by default).
- `cancel` → Shopware raises a customer-canceled payment exception with the given `message`.
- Any other value is executed as a state machine transition on the order transaction — typically `paid`, `paid_partially`, `authorize`, `process`, `fail`.

## Essential identifiers

- Header `shopware-shop-signature`
- Body: `order`, `orderTransaction`, `orderTransaction.id`, `returnUrl`, `requestData`, `source.url`, `source.shopId`, `source.appVersion`
- Response: `redirectUrl`, `status`, `message`
- `Shopware\Core\Framework\App\Payment\Handler\AppPaymentHandler`, `Shopware\Core\Framework\App\Payment\Payload\Struct\PaymentPayload`

## Gotchas

- `returnUrl` is absent for synchronous payments; do not rely on it unless the method is asynchronous.
- `status` values are state machine transition action names (e.g. `paid`, `fail`), not state ids.
- The installed handler also supports validate, refund and recurring requests, which this page does not document.

## Version notes

- App payments are available from Shopware 6.4.1.0.

## Code check (6.7.15.1)
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — header `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `AppPaymentHandler::pay()` — posts payload to pay URL, redirects on `redirectUrl` — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:108
- corrected `AppPaymentHandler::finalize()` — docs: body only `orderTransaction` and `source`; code also sends `order` and query params as `requestData` — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:134
- confirmed `PaymentPayload::$returnUrl` — nullable, only set when provided — vendor/shopware/core/Framework/App/Payment/Payload/Struct/PaymentPayload.php:32
- confirmed `PaymentResponse::$status` — paid, paid_partially, authorize, process, fail; default stays open — vendor/shopware/core/Framework/App/Payment/Response/PaymentResponse.php:19
- confirmed `PaymentResponse::$redirectUrl` — redirect target after pay — vendor/shopware/core/Framework/App/Payment/Response/PaymentResponse.php:24
- confirmed `StateMachineTransitionActions::ACTION_CANCEL` — `cancel` raises customer-canceled exception — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:246
