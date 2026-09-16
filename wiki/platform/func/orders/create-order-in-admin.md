---
id: platform/func/orders/create-order-in-admin.md
title: Create Order In Admin
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/orders/create-order-in-admin"
sourceHash: "60a34d803e74a1244188a91bdc47ad7f5485364d28b4588117d27b8821ffbc90"
revision:
  current: true
  range: "6.5.0.0 - 6.6.10.18"
  swMin: "6.5.0.0"
  swMax: "6.6.10.18"
keywords: ["Add order", "manual order creation", "add product", "add empty position", "add credit note", "order options", "Save order", "shipping costs", "create customer", "PayPal orders", "Change payment method", "order overview"]
summary: "How to manually create an order in the Shopware admin: select customer, add items, set options, and save."
lastBuilt: "2026-09-15"
---
## What it is

Describes the admin module for manually creating an order on behalf of a customer.

## When to use

When a merchant needs to enter an order manually, e.g. for a phone or offline sale, rather than the customer placing it through the storefront.

## Key steps / config

1. From the order overview, click **Add order** to open the creation mask.
2. **Select customer** from the customer list (shows name, customer number, sales channel, e-mail), or create a new customer directly from the same view.
3. Add items via **Add product** (search is scoped to this order; price is auto-determined by customer group gross/net but editable; tax rate defaults from the product but is editable), **Add empty position** (a product that does not exist in the shop; requires a name, tax rate, and quantity), or **Add credit note** (a manual credit independent of any discount campaign; tax rate is derived automatically from the order's product items and cannot be edited manually).
4. Set **Options**: order/payment/shipping configuration, automatic discounts, order language, a discount code, payment method (only shown if "Allow as subsequent payment method" is set for that method and it is assigned to the sales channel), billing address, currency, shipping method, shipping costs, and whether the shipping address matches the billing address.
5. Click **Preview**, then **Save order** to create it — this triggers the order confirmation e-mail. The order is not saved before this step.

Shipping costs can be changed later by double-clicking the shipping-costs entry below the order items.

## Essential identifiers

- Admin buttons: `Add order`, `Add product`, `Add empty position`, `Add credit note`, `Preview`, `Save order`, `Create customer`
- Text module: `account.orderContextMenuChangePayment`

## Gotchas

- The order is not saved until **Save order** is clicked, even after Preview.
- If a customer pays by PayPal on an admin-created order, the payment must be completed afterwards by the customer via their account (menu **Orders** > **Change payment method**), or via the link in the order confirmation e-mail.
