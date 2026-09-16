---
id: platform/dev/6.6/concepts/commerce/checkout-concept/payments.md
title: Payments
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/commerce/checkout-concept/payments.html
sourceHash: c4118b807f81869f48316b5af8061ab845f3c87a
keywords: ["payment", "payment handler", "synchronous payment", "asynchronous payment", "checkout", "transaction", "order", "store-api/context", "payment/finalize-transaction", "payment gateway", "payment flow", "state machine"]
summary: "Describes Shopware's payment flow: select payment, place order, handle payment via sync or async payment handlers."
lastBuilt: "2026-09-15"
---
## What it is

This page documents Shopware 6's payment system, which is part of the checkout process. A payment is applied to a transaction of an order via the state machine, and the payment system is composed of payment handlers stored in the database.

## When to use

Relevant when implementing or understanding a payment integration, especially deciding between synchronous and asynchronous payment handling, or debugging the order/payment flow in headless or Storefront scenarios.

## Key steps / config

The payment and checkout flow has two essential steps:

1. **Select payment method** — the current payment method is stored in the user context, manipulated via the route `/store-api/context`.
2. **Place order** — creates the order from the current context and cart, together with an open transaction (a placeholder for payment). A transaction has a unique ID, payment method, and total amount. An order can have multiple transactions, but only one is created here.
   - **2.1 Prepare payment (optional)** — some integrations create a payment reservation/authorization at this point (not standardized by Shopware).
3. **Handle payment** — determines the correct payment handler for the selected payment method. In the default Storefront, steps 2 and 3 are initiated in the same request.
   - **3.1 Payment handler** — two types: *Synchronous payment* (integration calls the gateway, which responds immediately with a status) and *Asynchronous payment* (redirects the user to a target defined by the payment integration, carrying transaction info and a callback URL; the frontend can define success/error URLs used for the eventual redirect).
   - **3.2 Payment execution on gateway (optional)** — async only; user performs final checks/authorizations on the gateway UI, then is redirected back to the callback URL with an outcome parameter.
   - **3.3 Payment finalize (optional)** — async only; triggered by the callback URL, which points to `/payment/finalize-transaction`; Shopware updates the transaction status and redirects to the finish page.

## Essential identifiers

- `/store-api/context` — route for the current payment method / user context
- `/payment/finalize-transaction` — callback URL for asynchronous payment finalization

## Gotchas

- The session should not be used in headless payment integrations.
- Controllers should not contain logic; Store API routes must be added for the payment so it works in headless scenarios.
- The actual implementation of payment integrations differs between providers; Shopware's specification does not include guidelines about payment states or specific API calls — some integrations share data between steps or use webhooks, going beyond Shopware's standards.
