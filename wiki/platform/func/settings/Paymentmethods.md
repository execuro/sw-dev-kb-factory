---
id: platform/func/settings/Paymentmethods.md
title: Paymentmethods
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/Paymentmethods"
sourceHash: ddf84b053733d5cd2c2d105d0ce994c7c7e115eb8e68843d6de68e46af1323a4
revision:
  current: true
  range: "6.5.7.0 - 6.6.10.10"
  swMin: "6.5.7.0"
  swMax: "6.6.10.10"
keywords: ["payment methods", "technical name", "availability rule", "rule builder", "sales channel", "cash on delivery", "invoice", "prepayment", "direct debit", "payment type", "storefront payment"]
summary: Explains configuring payment methods in Shopware — technical names, position, availability rules and storefront visibility.
lastBuilt: 2026-09-15
---
## What it is

The payment methods module, under **Settings > Commerce > Payment methods**, lists and configures the payment options a shop can offer.

## When to use

Used when adding, editing or restricting which payment methods customers can select, and when deciding which methods are actually offered in a given sales channel.

## Key steps / config

The overview lists methods by **name**, **active status**, and **short description**, editable/deletable via the context menu. By default, cash on delivery, invoice, prepayment and direct debit are active — but a method must also be assigned in the sales channel's payment settings to appear in the storefront.

**Add payment method** form fields:
- **Name** — display name
- **Technical name** — unique identifier for the payment method; changing it can make existing payment methods inoperable, so it should only be changed once (for plugin-added methods, wait for the vendor's update; for self-created methods, set it early)
- **Position** — display order in the storefront
- **Description** — short text
- **Logo** — upload, pick from media, or load from a URL
- **Active** — enable/disable toggle
- **Allow change of payment method after order completion** — lets customers change payment method post-order under their account's Orders section

## Essential identifiers

- **Settings > Commerce > Payment methods**
- **Technical name** field
- **Availability rule** — built via the Rule Builder; leave blank/NULL for unrestricted availability

## Gotchas

Changing a payment method's technical name after it has been set can break existing payment method references — avoid changing it once established.
