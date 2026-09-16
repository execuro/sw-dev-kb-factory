---
id: platform/func/settings/customergroups.md
title: Customergroups
docType: functional
version: "6.5"
versions: ["6.5"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/customergroups"
sourceHash: b0328b18dd37037f8b780c5b3b12f2dbb21e850b854ee6ce084c0eacac516b21
revision:
  current: true
  range: "6.3.1.0 - 6.5.5.2"
  swMin: "6.3.1.0"
  swMax: "6.5.5.2"
keywords: ["customer groups", "standard customer group", "tax representation", "custom signup form", "company signup form", "customer group registration", "B2B components", "employee management", "quick orders", "quote management", "order approval", "technical url"]
summary: Documents Shopware customer groups — net/gross pricing, custom registration forms, and B2B Components registration options.
lastBuilt: 2026-09-15
---
## What it is

Customer groups, under **Settings > Customer groups**, determine whether prices display net or gross and can carry their own registration form.

## When to use

Used to segment customers by pricing (net vs. gross) or to offer a dedicated signup flow for groups such as B2B customers, optionally gated behind admin approval.

## Key steps / config

Creating a group (**Create customer group**) sets: **Name**, **Tax representation** (gross or net), and whether a **separate registration form** is used (customers registering via it are not auto-assigned — they land in the sales channel's standard group pending activation).

**Customer group registration** configuration, once **custom signup form** is enabled: **Title**, optional **Introduction** text, **SEO meta description**, and **Company signup form** (adds optional company/department/VAT ID fields). The form is assigned to at least one **available sales channel**; saving generates a **Technical URL** usable for links within the category module.

With the Shopware Commercial extension and at least the Evolve plan, **B2B Components** functions can be enabled per customer group at registration: **Employee Management**, **Quick Orders**, **Quote Management**, **Order Approval**.

After registration, the customer stays in the sales channel's standard customer group with a note in the customer overview until an admin **reject**s or **accept**s the group change from the customer's detail page; the customer receives an email using the _customer group change rejected_ or _customer group change accepted_ templates.

## Essential identifiers

- **Settings > Customer groups**
- **Technical URL** — generated on save
- Email template types: _customer group change rejected_, _customer group change accepted_
- B2B functions: Employee Management, Quick Orders, Quote Management, Order Approval

## Gotchas

The "standard customer group" is a fixed fallback with a hardcoded UUID — it cannot be recreated under that name if deleted, and deleting it makes the storefront inaccessible.
