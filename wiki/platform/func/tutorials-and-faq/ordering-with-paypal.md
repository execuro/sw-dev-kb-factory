---
id: platform/func/tutorials-and-faq/ordering-with-paypal.md
title: Ordering With Paypal
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/ordering-with-paypal
sourceHash: 30eb3c94f6722fc8e1d53ad621086ea918ed0bbaa5accf467066c8de9dc2e191
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["PayPal", "payment status", "Cancelled", "Failed", "Unconfirmed", "order overview", "payment_id", "order_id", "tracking_id", "dealer_id", "merchant_id", "checkout"]
summary: "Explains PayPal payment statuses (Cancelled, Failed, Unconfirmed) in Shopware orders and how Shopware/PayPal field names map."
lastBuilt: 2026-09-15
---

## What it is

Explains the characteristics of the order process when paying with PayPal: an order is placed as soon as the customer clicks "submit order" in the Storefront, independent of whether the payment itself later succeeds — payment and order are detached from each other.

## When to use

Useful when investigating why an order shows an unexpected payment status, or when cross-referencing an order with entries in the PayPal Merchant Account.

## Key steps / config

Payment statuses seen on orders:
- **Cancelled**: the customer closed the PayPal payment window via "Cancel and return to shop"; the order was already placed and the payment cancelled. The customer can adjust the payment method under "Orders" and retry payment.
- **Failed**: not a technical problem with the PayPal extension — the payment was not completed by the customer. Status starts as "Open" and becomes "Failed" if the customer cancels the payment process.
- **Unconfirmed**: the order was placed but PayPal received no transaction (e.g. the browser crashed during payment); the order is normally not listed in the shop's PayPal account. The customer can change the payment method and pay again.

In the customer account, a failed order lets the customer either "change payment method" (redirects to checkout, order shown as "In progress") or "repeat the last order" (creates a new order).

Field name mapping between Shopware Admin (under **Orders > Overview > Your order > PayPal**) and the PayPal Merchant Account:

| Shopware | PayPal | Description |
|---|---|---|
| `Payment_id` | `Order_id` | Unique ID the order is assigned to |
| `Tracking_id` | `Capture_id`/`transaction_id`/`resource_id` | ID used to track the payment |
| `Dealer_id` | `Merchant_id`/`payer_id` | Unique ID assigned when the account was created; identifies the merchant |

## Essential identifiers

- `Payment_id`, `Tracking_id`, `Dealer_id` (Shopware)
- `Order_id`, `Capture_id`, `transaction_id`, `resource_id`, `Merchant_id`, `payer_id` (PayPal)
