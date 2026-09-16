---
id: platform/func/extensions/paypal.md
docType: functional
title: Paypal
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/paypal
sourceHash: 61ee409052a1aaf9fc0b03a52d4f734f01423f4e01c906ac02bcb423d288996f
revision:
  current: true
  range: "8.0.0 - 9.7.6"
  swMax: "9.7.6"
  swMin: "8.0.0"
keywords: ["PayPal", "PayPal Checkout", "SwagPayPal", "vaulting", "Pay upon invoice", "Express Checkout", "Pay Later banner", "Smart Payment Buttons", "PayPal disputes", "webhook", "shipping tracking", "onboarding", "sandbox credentials", "3D Secure", "plugin:update"]
summary: "PayPal Checkout extension (SwagPayPal) covers onboarding, credentials, vaulting, pay-upon-invoice, express checkout, disputes, webhooks and CLI update."
lastBuilt: "2026-09-15"
---
## What it is

PayPal Checkout is Shopware's built-in PayPal payment extension (`SwagPayPal`), offering invoice, credit card, direct debit and other local payment methods alongside classic PayPal.

## When to use

Use it to accept PayPal-family payments (classic PayPal, invoice, instalments, credit/debit cards, Venmo vaulting) and to manage onboarding, express checkout, disputes and refunds for those orders.

## Key steps / config

- Included by default; install/activate under **Extensions > My extensions**, or configure it in the setup wizard. Only the aggregated daily total of PayPal orders is transferred to Shopware — no personal data, order numbers or individual transactions.
- Configuration entry point: **Settings > Commerce > Payment methods**, with **Enable Sandbox** and **Connect PayPal account** (onboarding retrieves the merchant ID and generates Client ID/Secret via a REST app).
- General configuration: **Settings > Extensions > PayPal**, with a sales channel selector and **Set PayPal as default**.
- API settings (alternative to onboarding): Live API credentials, Client ID, Client secret, PayPal Merchant ID, Sandbox API credentials, Sandbox client ID/secret, Sandbox PayPal Merchant ID, plus **Test** buttons for each credential set.
- Behavior settings: payment acquisition timing, Submit cart, own brand name, PayPal landing page, Submit order number (with Order number prefix/suffix), Excluded products/dynamic product groups.
- Vaulting (from PayPal version 8.0.0 and Shopware 6.5): activate via **Activate Vaulting**, then log in to the PayPal merchant account; separate toggles enable vaulting for PayPal payments, credit/debit cards, and Venmo.
- Credit/debit card: "unbranded" vs "branded" card form depending on onboarding approval; **Block payments from non-3DS countries** blocks cards when 3D Secure cannot be verified.
- Pay upon invoice: requires onboarding under **Settings > Commerce > Payment Methods**; customers pay PayPal/Ratepay directly by bank transfer.
- Express Checkout Shortcut and 'Pay Later' banner: toggles per surface (detail page, cart, off-canvas cart, login page, listing pages/footer), plus Button color/shape/language settings.
- Smart Payment Buttons: toggle, alternative payment methods, 'Pay Later' button, button color/shape/language.
- Refunds: in the order's **Paypal** tab, use **Create a new refund**, then **Execute** — sets payment status to Refunded.
- Webhook: **Refresh webhook** re-registers the webhook Shopware/PayPal use to exchange order data.
- PayPal disputes: **Customers > PayPal Disputes** lists case ID, last update, due date, status, stage and amount; case details include a raw JSON field from PayPal.
- Update: **Extensions > My Extensions > Update**, or via CLI:

```
php bin/console plugin:update SwagPayPal
```

- Troubleshooting after an SFTP/FTP update: reset OPCache, clear the shop cache (`php bin/console cache:clear` or delete `var/cache`), then run the plugin update command above.

## Essential identifiers

- Plugin: `SwagPayPal`
- CLI: `php bin/console plugin:update SwagPayPal`
- CLI: `php bin/console cache:clear`
- Admin paths: **Settings > Commerce > Payment methods**, **Settings > Extensions > PayPal**, **Customers > PayPal Disputes**

## Gotchas

Shipping tracking transfer requires PayPal version 5.3.0+ and successful checkout onboarding. Filtering disputes by sales channel requires a separate API per sales channel. If **double opt-in on guest orders** is active, no PayPal payment buttons show in the storefront. By default PayPal does not transmit a phone number, which can break checkout if the phone number is a required field — merchants must enable transmission in their PayPal account settings.

## Version notes

Vaulting requires PayPal version 8.0.0 or higher and Shopware 6.5 or higher. PayPal disputes display is available as of PayPal extension version 2.1.1.
