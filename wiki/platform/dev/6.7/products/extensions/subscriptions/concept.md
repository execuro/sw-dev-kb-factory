---
id: platform/dev/6.7/products/extensions/subscriptions/concept.md
title: Subscription concept
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/concept.html
sourceHash: 7f801758e095d557f792aa2e4da4c96171be1e8e
codeCheckedAgainst: "6.7.15.1"
keywords: ["subscription plan", "subscription interval", "subscription_cart", "salesChannelContext.extensions.subscription", "DateInterval", "cron expression", "subscription cart", "subscription context", "managed cart", "mixed cart checkout", "separate subscription checkout", "recurring orders", "abo"]
summary: "Subscriptions extension terms: plans, relative/absolute intervals, subscription cart and context, separate vs. mixed checkout, and why scoping is opt-in."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

The core concepts of the Shopware Subscriptions extension: subscription plans, subscription intervals, subscription products/carts/contexts, and the two checkout processes (separate and mixed). It also explains why the feature isolates subscription calculation from other extensions.

## When to use

Read this before integrating an extension with subscriptions: before touching subscription carts, events, or Storefront templates, or when deciding whether your cart logic must opt in to subscription calculation.

## Key steps / config

**Terminology**

- **Subscription plan** — set of rules defining the subscription: billing interval(s) and the product the customer receives. Several intervals can be assigned to one plan. Managed in the Administration.
- **Subscription interval** — time between delivery cycles (monthly, quarterly, annually...); billing is triggered on each repeat. Managed in the Administration. Two types:
  1. *Relative* — next date derived from the previous one, using PHP's `DateInterval`.
  2. *Absolute* — fixed dates defined with cron expressions. An absolute interval may combine a relative part (every 12 weeks) with an absolute part (only Fridays); both are satisfied in sequence, so the next date can exceed 12 weeks by up to 6 days.
- **Subscription product** — a product with a plan assigned; can be bought once or subscribed at the plan's intervals. In the cart it is an ordinary product line item; since 6.7.4.0 it carries the selected plan and interval IDs in its payload.
- **Subscription** — everything needed to generate recurring orders: plan and interval, schedule of subsequent orders, deliveries remaining to fulfil the minimum delivery cycles, payment method, and a copy of the order to be placed.
- **Subscription cart** — subscription products of one plan+interval combination, calculated by the subscription cart calculator (same as the normal calculator, but with a subset of collectors/processors). Converted into a subscription after checkout. The table `subscription_cart` links the cart/context token to subscription carts/contexts.
- **Subscription context** — a sales channel context with an extension named `subscription`, reachable via `salesChannelContext.extensions.subscription`; holds the selected plan, interval and the token of the *main context* (the original sales channel context).

**Checkout processes**

- *Separate subscription checkout* — an express checkout: products are checked out one by one; each gets a new subscription cart (main cart untouched) and a derived subscription context keeping the main cart's address, shipping and payment selections.
- *Mixed cart checkout* (since 6.7.4.0) — subscription and one-time products in one main cart. Subscription items carry plan/interval metadata in their payload; per plan+interval combination a *managed* subscription cart and *managed* subscription context are derived, containing only the matching products. Each managed cart is calculated, is the point of truth for the generated subscription, and is shown as a subscription group in the Storefront. "Managed" means always derived from the original context/cart, inheriting only a subset of information.

## Essential identifiers

- `subscription_cart` (database table)
- `salesChannelContext.extensions.subscription`
- `DateInterval` (relative intervals), cron expressions (absolute intervals)

## Gotchas

- Payment data for paying subsequent orders is **not** stored in the subscription — the recurring payment method must store it.
- Integration is opt-in: PHP or Storefront manipulations only apply to subscriptions through scoped templates (see `platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md`), scoped events or special service tags (see `platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md`). This prevents existing extensions from manipulating subscription carts or blocking later order generation.
- Storefront scopes exist to hide template additions such as express checkout buttons, which are incompatible (guest checkout, no recurring payment support).
- Promotions are an example of excluded business logic, due to their complexity in recurring orders (e.g. one-use codes).
- For the separate checkout, all cart routes were copied and scoped so the correct subscription cart is resolved.
- Mixed-cart subscription carts are always derived from the main cart, so orders generated from them look as if placed independently (own total, shipping costs).

## Version notes

- Separate checkout came first. Mixed cart checkout and plan/interval IDs in the line item payload are available since 6.7.4.0.

## Code check (6.7.15.1)
- confirmed `subscription_cart` — listed in core's TABLES_WITHOUT_DEFINITION (no DAL definition) — vendor/shopware/core/Framework/DataAbstractionLayer/DefinitionValidator.php:121
- confirmed `subscription_interval.dateInterval` — interval entity has a relative date interval field — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1864
- confirmed `subscription_interval.cronInterval` — interval entity has a cron field for absolute intervals — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1865
- confirmed `subscription_plan.subscriptionIntervals` — a plan holds multiple intervals — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1810
- confirmed `subscription.remainingExecutionCount` — subscription tracks remaining deliveries — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1829
- confirmed `subscription.paymentMethodId` — subscription stores the payment method — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1833
- unverified `salesChannelContext.extensions.subscription` — provided by the commercial Subscriptions extension, not in core/storefront/administration
- unverified `subscription cart calculator` — commercial extension code, out of scope
