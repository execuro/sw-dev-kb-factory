---
id: platform/func/extensions/paypal.md
title: Paypal
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/paypal
sourceHash: c59bca00d8f666e1df10516fcd1248b6da2237a76cb7108b1a1cd6ecf4ff5307
revision:
  current: true
  range: "10.7.0 - 10.8.0"
  swMax: "10.8.0"
  swMin: "10.7.0"
keywords: ["PayPal Checkout", "SwagPayPal", "plugin:update SwagPayPal", "onboarding", "Express Checkout", "Pay Later", "vaulting", "Pay upon invoice", "Smart Payment Buttons", "PayPal Agentic Commerce", "PayPal disputes", "webhook", "3D Secure", "refund"]
summary: "PayPal Checkout extension: onboarding, API credentials, express checkout, Pay Later, vaulting, invoice, Agentic Commerce channel, refunds, disputes."
lastBuilt: 2026-10-20
---
## What it is

The PayPal extension (`SwagPayPal`) adds PayPal Checkout payment methods to Shopware: PayPal, credit and debit card, direct debit, Pay upon invoice, Pay Later, express checkout buttons, vaulting for recurring payments, refunds, dispute display and a PayPal Agentic Commerce sales channel.

## When to use

When installing or configuring PayPal payments, connecting a merchant account, tuning checkout buttons and banners, issuing refunds, reviewing disputes, or updating the extension.

## Key steps / config

- **Install**: Extensions > My extensions, Install app. The extension sends the aggregated daily total of PayPal orders to Shopware (no personal data or individual transactions).
- **Onboarding**: Settings > Commerce > Payment methods. Enable Sandbox for testing, then **Connect PayPal account** (retrieves merchant ID, generates Client ID and Secret, runs approval checks). Payment method status values: Onboarding Required, Authorized, Limited, Blocked.
- **General configuration**: Settings > Extensions > PayPal. Select sales channel; **Set PayPal as default**. Alternative to onboarding: enter Client ID, Client secret and PayPal Merchant ID (live and sandbox), with Test buttons.
- **Behavior**: payment acquisition, submit cart, brand name, landing page, submit order number with prefix/suffix, excluded products and excluded dynamic product groups.
- **Shipping tracking** (extension 5.3.0): default shipping provider under Settings > Commerce > Shipping methods; tracking ID entered in the order details is forwarded to PayPal.
- **Vaulting** (extension 8.0.0, Shopware 6.5): activate via PayPal login, then enable for PayPal, credit/debit cards and Venmo; needed for recurring payments such as subscriptions.
- **Card payments**: unbranded if advanced card activation succeeds, else branded; **Block payments from non-3DS countries** option.
- **Pay upon invoice**: onboarding required; PayPal/Ratepay collect payment; bank details appear in the order and invoice document.
- **Express Checkout**: "Direct to PayPal" on detail page, cart, off-canvas cart, login page and listing pages; button color (gold, blue, silver, white, black), shape, language as locale code such as `en_GB`, Pay Later button.
- **Pay Later banner**: Settings > Extensions > PayPal, Appearance (logo type, text color, size) and Page visibility (detail page, cart, off-canvas cart, login, footer). Pay Later in 30 days: cart 1 to 1,000 euros; PayPal instalments: 5 to 5,000 euros.
- **Smart Payment Buttons**: replace the normal checkout button; options for alternative methods, Pay Later, color, shape, language.
- **PayPal Agentic Commerce sales channel**: needs the configured extension, an eligible business account and PayPal access approval. PayPal Store Sync supports only physical products for US customers in USD. Set name, storefront sales channel, domain, currency USD, product export (variants as discrete products, interval, scheduler, dynamic product group), Active toggle; a CLI command for the export is shown after creation. The webhook status is shown; registration is in PayPal settings.
- **Refund**: in the order, PayPal tab > Create a new refund > Execute; payment status becomes Refunded.
- **Webhook**: **Refresh webhook** re-registers it; without it orders and information are not exchanged.
- **Disputes** (extension 2.1.1): Customers > PayPal Disputes, with case details and raw JSON data; filtering by sales channel needs a separate API per sales channel.
- **Update**: Extensions > My Extensions > Update, or CLI:

```text
php bin/console plugin:update SwagPayPal
```

## Gotchas

- If double opt-in on guest orders is active (Settings > Customer > Log-In & sign-up), no payment buttons show in the storefront.
- A required phone number in checkout can break PayPal Express Checkout, because PayPal does not send one by default; enable "On (required field)" for Contact telephone number in the PayPal account.
- After an SFTP/FTP update, do in order: reset OPCache (restart php-fpm or the server), clear the cache (`php bin/console cache:clear` or delete `var/cache`), update with `php bin/console plugin:update SwagPayPal` or in the Administration.
- Pay Later - Cross-Border Notifications needs enablement through a PayPal representative.

## Version notes

Page revision range is extension versions 10.7.0 to 10.8.0. Shipping tracking 5.3.0, vaulting 8.0.0, disputes 2.1.1.
