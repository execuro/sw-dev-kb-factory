---
id: platform/func/shopware-6-de/after-order-payment-process.md
title: After Order Payment Process
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-de/after-order-payment-process
sourceHash: 9676c2b3515231b52313b44f90f219b89b6540ec1ea3466f8b1e83f27f451fe3
revision:
  current: true
  range: "6.3.3.0 - 6.4.5.1"
  swMin: "6.3.3.0"
  swMax: "6.4.5.1"
keywords: ["after order payment process", "failed payment status", "order without payment", "flow builder", "enable refunds", "cart settings", "change payment", "repeat order", "complete payment", "payment order separation"]
summary: "Explains that order creation and payment are separate in Shopware 6, and how customers retry/change payment or cancel via Cart settings > Enable refunds."
lastBuilt: "2026-09-15"
---

## What it is

This article describes how order placement and payment are decoupled in Shopware 6 (unlike Shopware 5): an order is created as soon as the customer clicks **Submit payment**, regardless of whether payment succeeds.

## When to use

Use it to understand order status behavior after a failed or cancelled payment, and to configure whether customers may cancel unpaid orders.

## Key steps / config

- **Flow Builder** (**Settings > Flow Builder**) combines triggers (e.g. an order/payment state), rules (e.g. payment methods), and actions (e.g. email templates) into flows for payment-related events. Mail-action recipients can be Standard (system-provided), Admin (all administrator users), or Custom (arbitrary addresses).
- **Cart settings**: enabling **Enable refunds** (under **Settings > Cart settings**) lets customers cancel an order themselves, e.g. after a payment cancellation.
- Order overview: an unpaid order (e.g. via PayPal) shows payment status "failed" — this indicates the customer has not completed payment yet, not a technical fault; the order still exists in the system with payment status "Open", and the customer can retry with another payment method.
- Storefront: a failed-payment order lets the customer click **Change payment** to re-enter checkout and either reuse or change the payment method; cancellation is available only if refunds are enabled.
- Customer account: the customer can restart payment via **Complete payment** or **Repeat order** from the context menu, and change the payment method there too.

## Essential identifiers

- Menu paths: **Settings > Flow Builder**, **Settings > Cart settings**
- Setting: Enable refunds
- UI actions: Change payment, Complete payment, Repeat order

## Gotchas

Once an order reaches status "paid", the customer can no longer change the payment method or complete payment themselves — the order can then only be cancelled.
