---
id: platform/dev/6.7/resources/references/app-reference/payment-reference.md
title: Payment Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/payment-reference.html
sourceHash: 8e1b1553b71e27dc7f8e5516106c8c509bc0676a
codeCheckedAgainst: "6.7.13.0"
keywords: ["app payment", "payment reference", "pay url", "finalize url", "shopware-shop-signature", "orderTransaction", "returnUrl", "redirectUrl", "AppPaymentHandler", "PaymentPayload", "PaymentResponse", "payment status", "app system"]
summary: "App payment pay and finalize requests: HMAC-signed JSON body (order, orderTransaction, source) and response fields redirectUrl, status, message."
lastBuilt: 2026-09-15
---
## What it is

Reference for the HTTP requests Shopware sends to an app's payment endpoints: the `pay` request (sent when the customer hits *Confirm Order*) and the `finalize` request (sent when the customer returns to `returnUrl`). All bodies are JSON, sent as `POST`. In the installed code these calls are made by `Shopware\Core\Framework\App\Payment\Handler\AppPaymentHandler`.

## When to use

When implementing the app server side of an app-defined payment method (the pay/finalize URLs declared per payment method) and you need the exact request fields, signature header, and accepted response shapes.

## Key steps / config

1. **Verify the signature.** Every request carries the header `shopware-shop-signature`: the HMAC signature of the JSON body, signed with the shop secret from app registration.
2. **Pay request** (`POST https://payment.app/pay` in the source example). Body fields:
   - `order` — `OrderEntity` with associations (currency, addresses, line items, transactions, customer).
   - `orderTransaction` — `OrderTransactionEntity`; use `orderTransaction.id` to match the later finalize call.
   - `returnUrl` — only on asynchronous payments; redirect the customer back here.
   - `source` — `source.url`, `source.shopId`, `source.appVersion`.
   - The installed `PaymentPayload` additionally holds `requestData`, `validateStruct` and `recurring`.
3. **Pay response** (HTTP 200):
   ```json
   { "redirectUrl": "https://..." }
   { "status": "fail", "message": "..." }
   ```
   If `redirectUrl` is set, Shopware redirects the customer there. The pay URL is optional in code: without one no request is sent.
4. **Finalize request** (`POST https://payment.app/finalize`): signed the same way; the installed handler builds the same `PaymentPayload` as for pay (including `order`, `orderTransaction`, `source`), with the return request's query parameters (minus `_sw_payment_token`) as `requestData` and no `returnUrl`.
5. **Finalize response** (HTTP 200):
   ```json
   { "status": "paid" }
   { "status": "fail", "message": "..." }
   { "status": "cancel", "message": "..." }
   ```
6. `status` is applied as a state machine transition on the order transaction (e.g. `paid`, `paid_partially`, `authorize`, `process`, `fail`); without a status the transaction stays `open`.

## Essential identifiers

- `shopware-shop-signature` (request header)
- Body: `order`, `orderTransaction`, `orderTransaction.id`, `returnUrl`, `source.url`, `source.shopId`, `source.appVersion`
- Response: `redirectUrl`, `status`, `message`
- `Shopware\Core\Framework\App\Payment\Handler\AppPaymentHandler`
- `Shopware\Core\Framework\App\Payment\Payload\Struct\PaymentPayload`
- `Shopware\Core\Framework\App\Payment\Response\PaymentResponse`

## Gotchas

- Any non-empty `message` in a response makes Shopware abort the payment, regardless of `status`.
- `status: cancel` raises a customer-canceled payment exception instead of a normal transition.
- A finalize URL is mandatory once finalize is triggered; the handler throws "Finalize URL not defined" otherwise.
- The source lists `orderTransaction` and `source` as the only finalize body fields; the installed code also sends `order`.
- Requests time out after 20 seconds (`PaymentPayloadService::PAYMENT_REQUEST_TIMEOUT`).

## Version notes

- The source states the feature is available starting with Shopware 6.4.1.0.

## Code check (6.7.13.0)
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — header name `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `PaymentPayload::$orderTransaction` — payload property — vendor/shopware/core/Framework/App/Payment/Payload/Struct/PaymentPayload.php:23
- confirmed `PaymentPayload::$returnUrl` — nullable, only passed on pay — vendor/shopware/core/Framework/App/Payment/Payload/Struct/PaymentPayload.php:32
- confirmed `Source::$shopId` — source carries url, shopId, appVersion — vendor/shopware/core/Framework/App/Payload/Source.php:22
- confirmed `AppPaymentHandler::pay()` — pay URL optional, redirect only when redirectUrl set — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:108
- corrected `AppPaymentHandler::finalize()` — docs: finalize body is only orderTransaction and source; code sends full PaymentPayload incl. order — vendor/shopware/core/Framework/App/Payment/Handler/AppPaymentHandler.php:134
- confirmed `PaymentResponse::$redirectUrl` — pay response field — vendor/shopware/core/Framework/App/Payment/Response/PaymentResponse.php:24
- confirmed `PaymentResponse::$status` — transition action, default stays open — vendor/shopware/core/Framework/App/Payment/Response/PaymentResponse.php:19
- confirmed `AbstractResponse::$message` — payment fails if provided — vendor/shopware/core/Framework/App/Payment/Response/AbstractResponse.php:19
- confirmed `PaymentPayloadService::PAYMENT_REQUEST_TIMEOUT` — 20 seconds — vendor/shopware/core/Framework/App/Payment/Payload/PaymentPayloadService.php:22
