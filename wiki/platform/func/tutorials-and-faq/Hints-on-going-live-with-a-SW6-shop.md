---
id: platform/func/tutorials-and-faq/Hints-on-going-live-with-a-SW6-shop.md
title: Hints On Going Live With A SW6 Shop
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/Hints-on-going-live-with-a-SW6-shop
sourceHash: b754b4be87b433f4cc5b2a678321f60fb0361bc39efff8af3325ca69966587a6
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["going live", "launch checklist", "demo data removal", "sandbox mode", "shipping methods check", "email templates", "number ranges", "license domain", "Shopware account", "sales channel domain", "test order", "custom links"]
summary: "Checklist for launching a Shopware 6 shop: links, demo data, shipping, sandbox payments, order/email tests, number ranges, and domain changes."
lastBuilt: "2026-09-15"
---
## What it is

This article lists the key points to check before launching a Shopware 6 shop under its final domain, especially when the shop was previously developed under a temporary subdomain.

## When to use

Use as a pre-launch checklist when moving a Shopware shop from a test/staging domain to its production domain.

## Key steps / config

- **Adjust manually maintained links**: check custom links stored on categories (category type "custom link", or category text under menu settings) and in product descriptions (Catalogue > Products), since these do not update automatically with a domain change.
- **Remove demo data**: uninstalling/deactivating the demo data extension does not remove its data; manually remove demo categories (Food, Clothing, Free time & electronics), demo manufacturers (Shopware Fashion, Shopware Food, Shopware Freetime, Shopware AG), their articles, unneeded shopping experiences, and unneeded demo properties (colour, size, material, target group, ingredients).
- **Check shipping methods**: remove or deactivate temporary/test shipping methods in each sales channel and verify frontend availability conditions.
- **Deactivate sandbox mode** of payment methods (e.g. under **Settings > Plugins > PayPal**, in the **API access data** section for the PayPal plugin); procedure varies per payment provider.
- **Check order process**: place at least one full test order per relevant combination of payment/shipping method before launch.
- **Check email templates and mailers**: place a test order and confirm the order-confirmation email is sent with correct logo, articles, variables (name, salutation, address) and bank details; verify mailer settings and that business events are mapped to the correct email templates.
- **Reset number ranges**: create a new number range under **Settings > Shop > Number ranges** so invoices start at the desired value; do not change the number range again after going live (legal requirement for consecutive invoice numbers, and to avoid ERP/CRM coordination issues).
- **Shopware account licence conversion**: in the Shopware account, rename the shop domain (only possible once) and change its usage type to productive environment.
- **Adjust the licence domain in the Admin**: update the plan domain under **Settings > System > Shopware Account**.
- **Adapt sales channel domains**: update each sales channel's domain in its **General** tab, **Domains** section.
- **Adapt domain at the hoster**: finally route the hoster's domain to the Shopware installation's main directory.

## Essential identifiers

- `Settings > Plugins > PayPal` (API access data / sandbox toggle)
- `Settings > Shop > Number ranges`
- `Settings > System > Shopware Account`
- Sales channel `General` tab, `Domains` section

## Gotchas

- The shop domain in the Shopware account can only be renamed once — confirm it is the final domain before renaming.
- Number ranges should not be changed again after going live, due to legal requirements for consecutive invoice numbers and potential ERP/CRM coordination problems.
