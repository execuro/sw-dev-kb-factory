---
id: platform/dev/6.7/products/extensions/subscriptions/concept.md
title: Subscription concept
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/concept.html
sourceHash: 7f801758e095d557f792aa2e4da4c96171be1e8e
codeCheckedAgainst: "6.7.13.0"
keywords: ["subscription plan", "subscription interval", "subscription cart", "subscription context", "subscription_cart", "salesChannelContext.extensions.subscription", "DateInterval", "cron expression", "separate checkout", "mixed cart checkout", "managed cart", "recurring orders", "subscriptions"]
summary: "Subscriptions concepts: plans, relative/absolute intervals, subscription cart and context, separate vs. mixed checkout, opt-in design."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

Core terminology and architecture of the Subscriptions extension: subscription plans, subscription intervals, subscription products, subscriptions, subscription carts and contexts, and the two checkout processes (separate and mixed cart).

## When to use

Read before building anything on top of subscriptions (cart processors, templates, event subscribers), to understand why regular cart/Storefront/event logic does not automatically apply to subscription carts.

## Key steps / config

### Terminology

- **Plan** — set of rules defining the subscription: billing interval(s) and the product. Multiple intervals can be assigned to one plan. Managed in the Administration.
- **Interval** — time between delivery cycles; billing is triggered on each cycle. Managed in the Administration. Two types:
  - *Relative*: computed from the previous interval, using PHP's `DateInterval`.
  - *Absolute*: fixed dates, defined with cron expressions. May combine a relative part (e.g. every 12 weeks) with an absolute part (only Fridays); both are satisfied in sequence, so the next date can exceed 12 weeks by up to 6 days.
- **Subscription product** — a product with a plan assigned; buyable one-off or as subscription. In the cart it is an ordinary product line item; since 6.7.4.0 it carries the selected plan and interval IDs in its payload.
- **Subscription** — everything needed to generate recurring orders: plan and interval, schedule, remaining deliveries for the minimum delivery cycles, payment method, and a copy of the order to repeat. It does not contain payment credentials.
- **Subscription cart** — contains subscription products of a single plan+interval combination, calculated by the subscription cart calculator (differs from the normal calculator only in the subset of collectors/processors). Converted into a subscription after checkout. The table `subscription_cart` links the cart/context token to subscription carts/contexts.
- **Subscription context** — a sales channel context with an extension named `subscription`, accessible via `salesChannelContext.extensions.subscription`; holds the selected plan, interval and the token of the main context. The original context is called the *main context*.

### Checkout processes

- **Separate subscription checkout** — express-style isolated checkout: products checked out one by one; each gets a new subscription cart (main cart untouched) and a derived subscription context (keeps address, shipping and payment selections). Cart routes are copied and scoped to resolve the subscription cart. See [separate checkout](platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md).
- **Mixed cart checkout** (since 6.7.4.0) — subscription and one-time products in one main cart; line items carry plan/interval metadata in the payload. For each plan+interval combination a *managed* subscription cart and *managed* subscription context are derived from the main cart/context; they are calculated, act as the source of truth for the generated subscriptions, and appear as a subscription group in the Storefront.

### Opt-in design

Existing extensions do not affect subscriptions by default. To apply PHP or Storefront logic to subscriptions, opt in via [scoped templates](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md), scoped events, or special service tags (see the separate checkout guide).

## Gotchas

- Recurring payment methods must store the payment information for subsequent orders themselves; the subscription does not.
- Promotions are an example of logic deliberately kept out of subscription calculation (recurring orders, one-use codes).
- Storefront scopes exist so that template additions such as express checkout buttons (guest checkout, possibly no recurring payment support) can be hidden for subscriptions.
- Managed carts/contexts are always derived from the main cart/context; only a subset of information is inherited from an existing managed cart or context.

## Version notes

- 6.7.4.0: mixed cart checkout added; subscription product line items carry plan and interval IDs in their payload. The separate checkout was the original implementation.

## Code check (6.7.13.0)
- confirmed `subscription_cart` — table name is known to core's DefinitionValidator table list — vendor/shopware/core/Framework/DataAbstractionLayer/DefinitionValidator.php:118
- confirmed `ExtendableTrait::getExtension()` — core mechanism behind context extensions such as `subscription` — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:51
- unverified `salesChannelContext.extensions.subscription` — Subscriptions extension code is not installed in the checked vendor roots
- unverified `DateInterval` — PHP built-in class, outside vendor/shopware
