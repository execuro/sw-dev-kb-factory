---
id: platform/func/saas/payment.md
title: Payment
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/payment"
sourceHash: "b26bfaa77985288fa069a927a254344b83bf21d08d494ce2b5601ef913328c7f"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["payment methods", "Settings > Shop > Payment methods", "cash on delivery", "advance payment", "invoice", "fallback payment methods", "PayPal", "sales channel payment configuration", "Rule Builder", "availability rule", "default payment method"]
summary: "Configuring and assigning payment methods (cash on delivery, advance payment, invoice, PayPal) to a sales channel via Settings > Shop > Payment methods."
lastBuilt: "2026-09-15"
---
## What it is
This page documents configuring payment methods for a SaaS shop and assigning them to a sales channel, including the built-in fallback methods and PayPal.

## When to use
Use this when setting up which payment methods customers can use, assigning them to a sales channel, or configuring PayPal.

## Key steps / config
- Payment methods are set up via the dashboard checklist or under **Settings > Shop > Payment methods**; defaults are **cash on delivery**, **advance payment**, and **invoice**.
- **PayPal**: no installation required; activate the PayPal extension and link a PayPal account to enable it.
- **Assign to a sales channel**: open the sales channel's configuration, tab **General > Basic settings**, and select which payment methods are available and which is the default for new customers.
- **Fallback payment methods** (cash on delivery, prepayment, invoice) are not automated — the payment must be completed manually after ordering:
  - **Cash on delivery**: the customer pays on receipt of goods.
  - **Advance payment**: the shop provides bank details (e.g. in the *Order confirmation* email template) for the customer to transfer funds.
  - **Invoice**: goods are shipped with an invoice the customer settles afterward.
- **Fallback method configuration** (via **Create payment types**, then **Edit** per method): **Name** (shown in admin, storefront, order confirmation email, invoice), **Position** (storefront ordering, small to large), **Description** (shown in storefront and order confirmation email), **Logo**, **Active** toggle, **Allow change of payment method after order completion** (customer can change it under *orders* in their account), and **Availability rule** (defined in the Rule Builder to restrict when the method is offered).
- **Storefront display**: customers select a payment method under **Change payment method** in checkout, shown in a modal.

## Essential identifiers
- Admin paths: **Settings > Shop > Payment methods**, sales channel tab **General > Basic settings**.
- Fallback methods: cash on delivery, advance payment/prepayment, invoice.
