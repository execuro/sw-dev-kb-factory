---
id: platform/func/tutorials-und-faq/general-information/paypal-checkout.md
title: "Paypal Checkout"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-und-faq/general-information/paypal-checkout"
sourceHash: "3cf752aaebb34439cdd840f5a9b42e48cc85e7b8cc16a7af1ae8b5024a7c63c6"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["PayPal Checkout", "PayPal PLUS", "sandbox account", "onboarding", "Paypal settings", "Sales Channels", "Payment Types", "payment methods", "Use sandbox data", "Connect Paypal sandbox account", "Start onboarding", "checkout"]
summary: "Guide to switching from PayPal PLUS to PayPal Checkout in Shopware 6: connecting a sandbox/live account, onboarding, and activating payment methods."
lastBuilt: "2026-09-15"
---
## What it is
Describes PayPal Checkout, PayPal's successor to PayPal PLUS, and how to switch a Shopware 6 shop to it.

## When to use
Use when migrating a shop from PayPal PLUS to PayPal Checkout to offer additional payment methods, many of which do not require the customer to have a PayPal account.

## Key steps / config
1. Go to **Settings > Extensions > Paypal**.
2. To test first, click **Connect Paypal sandbox account** and log in with sandbox data; a success message confirms the account is ready to use PayPal checkout.
3. Check the **Use sandbox data** checkbox when a sandbox account was connected.
4. Click **Start onboarding** to activate the additional PayPal-integrated payment methods — without onboarding, only the normal PayPal payment method can be used. Re-enter access data and connect the account again when prompted.
5. After a successful onboarding, PayPal PLUS can be deactivated as it is no longer needed.
6. Activate the desired new payment methods via the **Active** slider.
7. Assign the activated payment methods to a sales channel under **Sales Channels > Payment Types**; a green dot indicates the payment method is active and usable.

## Essential identifiers
- `Settings > Extensions > Paypal`
- `Sales Channels > Payment Types`
- Buttons: **Connect Paypal sandbox account**, **Start onboarding**, **Use sandbox data**

## Gotchas
Without completing onboarding, only the standard PayPal payment method works; the other PayPal-integrated methods stay inactive until onboarding is done, and each method must still be individually activated and assigned to a sales channel.
