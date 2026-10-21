---
id: platform/func/shopware-services/shopware-payments.md
title: Shopware Payments
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/shopware-services/shopware-payments
sourceHash: 7125a879148e747948035ce7b1d27b550c6056ffe2052dc6e3c6946b542b90c3
revision:
  current: true
  range: current
  swMax: null
  swMin: null
keywords: ["shopware payments", "paypal", "onboarding", "test mode", "apple pay", "vaulting", "3d secure", "express checkout", "pay later", "capture payment", "release funds", "flow builder", "payment methods", "AUTHORIZE", "CAPTURE"]
summary: Shopware Payments (PayPal-based) - requirements, activation per version, accounts, test mode, Apple Pay, order actions, Flow Builder actions, migration.
lastBuilt: 2026-10-20
---
## What it is

Shopware Payments lets you manage supported payment methods and transactions in the Shopware Administration. It is built on PayPal infrastructure, uses a PayPal Business account, and does not replace other payment service providers.

## When to use

Use it for setup, going live, managing payment methods, handling payments in orders, migrating from the classic PayPal plugin, and troubleshooting.

## Key steps / config

Quick start: check version and merchant country, activate or install, connect an account (or use the test account), assign it to a sales channel, activate payment methods, test checkout, then switch to a production account.

Activation:
- Shopware 6.7.1.0 and later: Settings > System > Shopware Services, activate Shopware Payments, then Settings > Payment methods > Shopware Payments and start onboarding.
- Shopware 6.5.7.x to 6.6.10: Extensions > My Extensions > Apps, search "Shopware Payments", install and activate the app.

Accounts: Shopware Payments > Settings > Accounts > Add Account, select the registration country, Start onboarding. One account can serve several sales channels; wrong assignments route payments through an unintended account. Status **Active** means ready.

Test mode: Settings > Assignment tab > Details for the sales channel > select **Test mode**. Simulated transactions, no separate sandbox credentials; accounts show status **Test**.

Settings:
- Payment methods (Settings > Payment Methods): statuses Additional data required, Blocked, Under review, Active; the **Active** toggle controls checkout display.
- General: payment collection (Manual collection authorizes and captures later; Automatic collection captures immediately), Vaulting, **Block transactions without 3D Secure**, brand name, customer service instructions, Express Checkout, Pay Later banners, PayPal button color/shape/language, **Save settings**.
- Apple Pay: add the domain without protocol, download `apple-developer-merchantid-domain-association`, upload it to `/.well-known/apple-developer-merchantid-domain-association` on the public web root, then **Register Domain**.

Order tab **Shopware Payments**: payment intents `AUTHORIZE` and `CAPTURE`; actions Capture, Void authorization, Refund. Transaction status **Created** = authorized, **Completed** = captured.

Flow Builder actions: **Capture Payment** (for `AUTHORIZE` intent) and **Release Funds** (voids an authorization or fully refunds a captured payment).

Migration from classic PayPal: configure Shopware Payments with methods deactivated, assign sales channels, test, then enable new methods and deactivate the PayPal plugin methods at the same time; keep the old plugin active until open transactions are finished.

## Gotchas

- Available in Germany and Austria for now; methods depend on merchant and customer country, currency and account approvals.
- Apple Pay does not work in the test account; the association file must be reachable without authentication or redirects.
- Block transactions without 3D Secure can reduce acceptance of cards issued outside the EEA.
- Express Checkout needs Shopware 6.7.4.0 or later.
- Payment status not updating: check that the shop and Shop API are publicly accessible (maintenance, firewall).
- Community Edition SLA response time is five business days.

## Version notes

| Shopware | Minimum | Provided as |
|---|---|---|
| 6.5 | 6.5.7.0 | App |
| 6.6 | 6.6.3.0 | App |
| 6.7 | 6.7.1.0 | Shopware Services |
