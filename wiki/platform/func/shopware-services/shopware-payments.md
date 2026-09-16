---
id: platform/func/shopware-services/shopware-payments.md
title: Shopware Payments
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/shopware-services/shopware-payments
sourceHash: e3043aeb6298fee7773bc7e45da5feb2fdedd381305c47d531c5b475b2009951
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Shopware Payments", "PayPal infrastructure", "Vaulting", "3D Secure", "PayPal Express Checkout", "Pay Later banners", "Apple Pay", "merchant account", "AUTHORIZE", "CAPTURE", "Capture Payment flow action", "Release Funds flow action", "test account", "domain association file"]
summary: "Shopware Payments: PayPal-based payment product managed in the Admin, covering settings, Apple Pay, accounts, order actions, and migration."
lastBuilt: "2026-09-15"
---
## What it is

Shopware Payments is a standalone Shopware payment product built on PayPal's global infrastructure and fully managed within the Shopware Administration, allowing merchants to activate, manage and optimize payment methods without additional systems. It does not lock merchants into a closed ecosystem; external PSPs can still be used alongside it.

## When to use

Use it to accept PayPal-infrastructure-based payment methods (PayPal, cards, Klarna, Apple Pay, Google Pay, SEPA, etc.), manage Apple Pay domains, manage multiple merchant accounts per sales channel, or migrate from the classic PayPal plugin integration.

## Key steps / config

**Requirements**: Shopware 6.5.7.0+, 6.6.3.0+; available as a service from 6.7.1.0. Needs a valid Shopware installation and PayPal Business Services in a supported region. Currently available to merchants in Germany and Austria, with more EU markets and the US planned.

**Getting started**: from 6.7.1.0, activate under **Settings > System > Shopware Services**, then access via main navigation "Shopware Payments" or **Settings > Payment methods > Shopware Payments**. For 6.5.7.x–6.6.10, install as an app via **Extensions > My Extensions > Apps**.

**Settings > General**: Select Sales Channel scope; **Payment Collection** (Payment Intent: manual/authorize-only vs automatic capture); **Vaulting** (store cards/PayPal for future purchases, required for recurring/subscription payments); **Security** ("Block transactions without 3D Secure"); Text specifications (brand name, customer service instructions); **PayPal Express Checkout** (from 6.7.4.0 only) and **PayPal Pay Later advertising** (both configurable per page: Product Detail Page, Cart, Off-Canvas Cart, Login Page, Listing Pages, Footer for Pay Later); PayPal button appearance (Color, Shape, Locale).

**Settings > Payment Methods**: statuses are Additional Data Required, Blocked, Active, Under Review; toggle **Active** per method.

**Settings > Apple Pay**: requires an active production merchant account (not supported in the test account); Add Domain → enter domain only (no protocol) → download the `apple-developer-merchantid-domain-association` file → upload it publicly accessible, e.g. served at `https://your-domain/.well-known/apple-developer-merchantid-domain-association` (Shopware web root is the `public` directory) → Register Domain.

**Settings > Accounts**: Add Account starts onboarding (creates/links a PayPal Business account); Select a Country; assign Sales Channels to an account; a built-in **Test Account** (no real payments) is available under the Assignment tab's Details → Test mode.

**Order Management**: the order's Shopware Payments tab shows Payment Information (payer info, amounts, payment intent, dates) and Payment History; **Payment Intent** values are `AUTHORIZE` and `CAPTURE`. Manual actions: Capture, Cancel authorization, Create new refund. Flow Builder actions: **Capture Payment** (for `AUTHORIZE` intent) and **Release Funds** (voids authorization or issues full refund depending on status).

**Migration from PayPal**: verify all currently used payment methods exist in Shopware Payments; avoid offering the same method via both integrations simultaneously; validate checkout; deactivate the PayPal plugin's payment methods only after activating the Shopware Payments equivalents, and keep the PayPal plugin installed/active until no refunds or follow-up on old orders remain.

## Essential identifiers

- `Settings > System > Shopware Services`
- `Settings > Payment methods > Shopware Payments`
- Payment Intent values: `AUTHORIZE`, `CAPTURE`
- Domain file: `apple-developer-merchantid-domain-association`
- Flow actions: Capture Payment, Release Funds
- Payment method statuses: Additional Data Required, Blocked, Active, Under Review

## Gotchas

- PayPal Express Checkout requires Shopware 6.7.4.0+ due to app-system limitations in earlier versions.
- Not all cards support 3D Secure (particularly cards issued outside the EEA); enabling "Block transactions without 3D Secure" can reduce card acceptance for international customers.
- Apple Pay domain registration is not supported on the test account; domains must be assigned to an active production account.
- If the shop is not publicly reachable, Shopware Payments cannot sync payment statuses via the Shop API, causing delayed or missing updates.

## Version notes

Shopware Payments supports 6.5 from 6.5.7.0 and 6.6 from 6.6.3.0; from 6.7.1.0 it is provided as a service activated under Shopware Services rather than installed as an app; PayPal Express Checkout requires 6.7.4.0+.
