---
id: platform/func/settings/shop/subscriptions.md
title: Subscriptions
docType: functional
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/shop/subscriptions
sourceHash: 25f427d1d76386307f251f3e9fe7e3dedd306e4ab4c2728529e4097061506815
revision:
  current: true
  range: "6.7.0.0 - 6.7.3.1"
  swMin: "6.7.0.0"
  swMax: "6.7.3.1"
keywords: ["subscriptions", "recurring orders", "subscription plan", "subscription interval", "mixed cart", "rule builder", "flow builder", "Checkout / Subscription / Placed", "State enter / Subscription / State / Active", "Beyond plan", "PayPal Vaulting", "commerce settings"]
summary: "Configures recurring-order subscription plans, intervals, mixed carts, and Rule/Flow Builder triggers under Settings > Commerce > Subscriptions."
lastBuilt: "2026-09-15"
---

## What it is

The Subscriptions section lets merchants create recurring-order plans with configurable intervals, available under **Settings > Commerce > Subscriptions**. It is a commercial feature (Beyond plan, part of the Shopware Commercial extension) available since 6.5.4.0.

## When to use

Use it to sell products on a recurring basis (e.g. monthly deliveries), to combine one-off and subscription items in a single order via the mixed cart, or to automate subscription lifecycle notifications through Flow Builder.

## Key steps / config

- **Plans** tab: add/edit/delete plans. Each plan has Name, Active switch, an optional distinct Storefront name/Label, Description, an Availability rule (Rule Builder), and Intervals with a Minimum term and a Discount (%).
- **Products** tab: assign products to a plan (also settable from the product's own settings).
- **Intervals** tab: define reusable intervals — Name, Active toggle, Availability rule, Frequency, and time unit (days/weeks/months); Advanced settings add regular frequency, weekdays, days in the month, and months in the year.
- **Settings** tab (from 6.7.4.0): "Activate mixed carts" toggle — when enabled, customers may combine subscription and one-off products in one order; when disabled, subscription products must be purchased separately.
- Order view (Admin): mixed orders show customer details, status and total for the first delivery; items are listed with subscription items marked by a subscription number, and the subscription number links to the subscription record.
- Flow Builder triggers: `Checkout / Subscription / Placed` (fires when a new subscription is created) and `State enter / Subscription / State / Active` (fires only when an existing subscription re-enters Active, e.g. after reactivation — not on initial creation).

## Essential identifiers

- Menu path: **Settings > Commerce > Subscriptions**
- Trigger: `Checkout / Subscription / Placed`
- Trigger: `State enter / Subscription / State / Active`
- Customer-facing order actions: **Orders > Subscriptions**, pause/cancel via status dropdown

## Gotchas

- A subscription cancelled before its Minimum term is fulfilled still shows "marked for cancellation" in the admin, but recurring orders keep generating until the minimum term ends — the subscription only actually ends afterward.
- Without a minimum term, "marked for cancellation" also persists while an open/incomplete order still exists, which can look like the subscription already ended even though the final order is still processing.
- Newly created subscriptions do not fire `State enter / Subscription / State / Active` because they are created directly in the Active state; use `Checkout / Subscription / Placed` for new-subscription automations instead.
- Only prepayment and invoice are usable payment methods for subscriptions by default; PayPal (and credit cards under PayPal Vaulting) become available only once PayPal Vaulting is activated.

## Version notes

Mixed carts (combining one-off and subscription items in one order) were introduced in 6.7.4.0; the Subscriptions feature itself is available from 6.5.4.0 as part of the Beyond plan / Shopware Commercial extension.
