---
id: platform/dev/6.6/resources/references/app-reference/payment-reference.md
title: Payment Reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/payment-reference.html
sourceHash: 25ef85a99c5e16a5d257d4febe10e89675e12201
keywords: ["payment app", "pay endpoint", "finalize endpoint", "shopware-shop-signature", "OrderEntity", "OrderTransactionEntity", "returnUrl", "app payment provider", "asynchronous payment", "hmac signature", "source.shopId"]
summary: "Documents the Pay and Finalize HTTP endpoints an app's external payment server must implement, with request/response shapes."
lastBuilt: 2026-09-15
---
## What it is

This page documents the two HTTP requests Shopware sends to an app's external payment server: `Pay` and `Finalize`. Available starting Shopware `6.4.1.0`. All bodies are JSON encoded.

## Key steps / config

`POST https://payment.app/pay` is called when the user confirms the order. Body includes `order` (`OrderEntity`), `orderTransaction` (`OrderTransactionEntity`), `orderTransaction.id`, `returnUrl` (async payments only), `source.url`, `source.shopId`, `source.appVersion`. Header `shopware-shop-signature` carries the HMAC signature of the JSON body, signed with the shop secret from the registration request.

```json5
/* Successful redirect */
{ "redirectUrl": "https://payment.app/user/go/here/..." }
```
```json5
/* Failure due to missing credentials */
{ "status": "fail", "message": "..." }
```

`POST https://payment.app/finalize` is called once the user returns to the `returnUrl` provided in the Pay response. Body includes `orderTransaction`, `orderTransaction.id`, `source.url`, `source.shopId`, `source.appVersion`.

```json5
/* Successful */
{ "status": "paid" }
```
```json5
/* Failure due to missing funds */
{ "status": "fail", "message": "..." }
```
```json5
/* User did not finish payment */
{ "status": "cancel", "message": "..." }
```

## Essential identifiers

- Endpoints: `POST https://payment.app/pay`, `POST https://payment.app/finalize`
- Header: `shopware-shop-signature`
- Fields: `order`, `orderTransaction`, `orderTransaction.id`, `returnUrl`, `source.url`, `source.shopId`, `source.appVersion`
- Response statuses: `paid`, `fail`, `cancel`

## Gotchas

- `returnUrl` is only supplied for asynchronous payments.
- The `shopware-shop-signature` header must be validated using the shop secret returned from the registration request.
