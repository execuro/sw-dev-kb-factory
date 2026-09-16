---
id: platform/func/settings/Newsletter-configuration.md
title: Newsletter Configuration
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/Newsletter-configuration"
sourceHash: 70fa6c4874430157d4083f4b6d6821b386fcfc9504d9d7c71a8277e02fab7054
revision:
  current: true
  range: "6.5.0.0 - 6.6.10.20"
  swMin: "6.5.0.0"
  swMax: "6.6.10.20"
keywords: ["newsletter", "double opt-in", "newsletter recipients", "subscription url", "newsletter form", "shopping experiences", "email recipients", "newsletter menu item", "service menu", "footer menu", "sales channel"]
summary: Explains newsletter double opt-in settings, email recipient configuration, and how to build a newsletter registration link.
lastBuilt: 2026-09-15
---
## What it is

Shopware has no built-in newsletter-sending function; instead it offers a module to manage and export recipients, configurable under **Settings > Content > Newsletter**.

## When to use

Relevant when enabling double opt-in for newsletter subscriptions or when adding a newsletter registration link/form to the storefront.

## Key steps / config

Under **Settings > Content > Newsletter**:
- **Sales Channel** — apply settings to one or all sales channels
- **Subscription url** — the registration URL used to confirm the subscription
- **Double Opt-In** — activates the double opt-in procedure
- **Double Opt-In for registered customers** — extends double opt-in to registered customers
- **Double Opt-In Domain** — domain used for the confirmation link; defaults to the sales channel domain if left empty

To create a newsletter registration link: build a **Shopping Experiences** layout (Content > Shopping Experiences), add a **form** block, set its **form type** to **Newsletter** via the block's cogwheel settings, then save the experience. Link it from the footer or service menu by creating a category under **Catalogues > Categories**, assigning the experience world on its **Layout** tab, and adding the category to the service/footer menu.

## Essential identifiers

- **Settings > Content > Newsletter** — configuration page
- **Subscription url**, **Double Opt-In**, **Double Opt-In Domain** — config fields
- Form block **form type: Newsletter**

## Gotchas

If double opt-in is activated, the confirmation link sent by email is always valid (does not expire). Customers only receive the configured email templates when no internal email recipients are stored under Email recipients.
