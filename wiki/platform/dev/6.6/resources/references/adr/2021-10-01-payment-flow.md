---
id: platform/dev/6.6/resources/references/adr/2021-10-01-payment-flow.md
title: Payment Flow
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-10-01-payment-flow.html
sourceHash: eefd11f639888df44c6d687cc56b78b393f88da2
keywords: ["payment flow", "synchronous payment", "asynchronous payment", "SyncPaymentProcessException", "app payments", "pre-created payments", "payment handler", "checkout", "payment gateway redirect", "after order payment error", "custom payment method"]
summary: ADR defining synchronous, asynchronous and app payment handlers, plus optional pre-created payment support and the after-order-payment error flow.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record describing the standardized ways Shopware extensions implement custom payments: synchronous handlers, asynchronous handlers, and app-based payments.

## When to use
Relevant when implementing a custom payment method as a plugin or app and deciding which handler type fits the payment provider's flow.

## Key steps / config
- **Synchronous Payment**: executes the payment immediately after order creation, without user interaction. The handler can throw `SyncPaymentProcessException` on error.
- **Asynchronous Payment**: used when the client must be redirected to the payment gateway; the handler prepares the redirect link, and a later "finalize" call validates the redirect back.
- **App payments**: apps implement either flow but define an external HTTP API endpoint as callback instead of PHP code; the response determines the further payment flow.
- **Accepting pre-created payments**: an optional interface lets the client prepare the payment directly with the payment service and pass a transaction reference/token to Shopware; the handler must verify the payload with the payment service before charging.
- **After order payment (error case)**: on failure, the client can choose an alternative payment method and retry, restarting the sync/async loop.

## Essential identifiers
- `SyncPaymentProcessException`
- Accepting pre-created payments (optional interface for prepared payments)

## Gotchas
- The payment handler must verify a pre-created payment's payload with the payment service itself — Shopware cannot guarantee the frontend-created transaction is valid for the current cart.
- It is highly recommended to implement pre-created payment support whenever creation and capturing of the payment can be separated.
