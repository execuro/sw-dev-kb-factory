---
id: platform/func/customers/customeraccount.md
title: Customeraccount
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/customers/customeraccount
sourceHash: 2e470c1e26d3036235fa4835371f506a03598c0e7cdd6392615bf49744bd4830
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.13"
  swMax: "6.6.10.13"
  swMin: "6.6.0.0"
keywords: ["customer account", "personal profile", "addresses", "orders", "subscriptions", "newsletter", "password reset", "forgotten password", "recovery link", "rate limiting", "user_recovery", "storefront login"]
summary: "Storefront customer-account dashboard (profile, addresses, orders, subscriptions) and the password-recovery flow with its security limits."
lastBuilt: "2026-09-15"
---

## What it is

The storefront "Customer account" area gives customers a dashboard-style overview of their profile, addresses, orders and subscriptions, plus a self-service password recovery flow.

## When to use

When a customer wants to review or edit their storefront account data, or has forgotten their password and needs to reset it from the login page.

## Key steps / config

- **Personal Profile**: change login details such as email address and password.
- **Addresses**: edit, delete or add saved addresses.
- **Orders**: view placed orders and processing status; use the three-dot option to repeat an order or, if payment is pending, change the payment status.
- **Subscriptions**: create subscriptions with recurring orders and configurable intervals — available from version 6.5.4.0, as a commercial feature from the Beyond plan.
- Password recovery: customer clicks "I have forgotten my password" on the storefront login page, enters their account email, receives an email with a recovery link, and uses it to set a new password. Rate limiting for this flow is configured via the `user_recovery` settings.

## Essential identifiers

`user_recovery` (password-recovery rate-limiting configuration)

## Gotchas

- The password recovery link is valid for 2 hours and can only be used once — it becomes invalid immediately after use.
- If no new password is set within the validity period, the recovery process must be started again.
- If the recovery email does not arrive, the customer should also check their spam folder.

## Version notes

Subscriptions are available from Shopware 6.5.4.0, as a commercial feature starting with the Beyond plan.
