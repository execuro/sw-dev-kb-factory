---
id: platform/func/settings/essential-characteristics.md
title: Essential Characteristics
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/essential-characteristics
sourceHash: 7567b3c4796ad3033340050e0603570a562442c9048da14cdcbb8729cfe6df41
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["essential characteristics", "product templates", "basic price", "manufacturer number", "EAN", "product properties", "checkout product info", "measures and packaging", "template assignment", "storefront product display"]
summary: How to build essential-characteristics templates that control which product data (basic price, EAN, dimensions, properties) is shown at checkout.
lastBuilt: 2026-09-15
---
## What it is

Essential characteristics templates control which product information (basic price, manufacturer number, EAN, dimensions, properties, etc.) is displayed at checkout. Different templates can be created to show different sets of information.

## When to use

Use this when a product needs specific data shown at checkout, or when different product types need different sets of displayed information.

## Key steps / config

- Managed under **Settings > Shop > Essential characteristics**: create with **create new**, edit via the name or the **"..."** context menu, or delete from the same menu.
- When creating/editing a template: enter a name and description under **general information**, then add data fields under **values** using **add field** (e.g. basic price calculation, properties, product information); order is changed with the arrow button, and a value is removed by checking its checkbox and clicking the trashcan icon.
- On the product detail page, a new **essential characteristics** section lets you assign one existing template to the product via a drop-down menu.

## Essential identifiers

- Admin path: **Settings > Shop > Essential characteristics**.
- Product-side assignment: the product detail page's **essential characteristics** section.

## Gotchas

For the information to actually appear in the storefront, two conditions must both be met: a template must be assigned to the product, and the data the template requests must itself be maintained on the product (e.g. for basic price calculation, the sales unit and basic unit under Measures & Packaging must be filled in).
