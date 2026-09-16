---
id: platform/func/settings/shop/delivery-times.md
title: Delivery Times
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/shop/delivery-times
sourceHash: 743bab5bf6fc7dacfa5e23bf537e9c285b1419733c1db3423e5d052835b7ad22
revision:
  current: true
  range: "6.2.0 - 6.6.10.10"
  swMin: "6.2.0"
  swMax: "6.6.10.10"
keywords: ["delivery times", "settings commerce delivery times", "create delivery time", "show delivery time in cart", "restocking time", "dynamic delivery calculation", "assign delivery time product", "assign delivery time shipping method", "cart settings delivery time"]
summary: How to create delivery times and assign them to products or shipping methods, including the dynamic delivery-date calculation shown in the cart.
lastBuilt: 2026-09-15
---
## What it is

Delivery times inform customers of the expected delivery window for individual products, shown e.g. on the product detail page, and configured under **Settings > Commerce > Delivery times**.

## When to use

Use this to define delivery-time ranges, assign one to a shipping method as a fallback, assign one to a specific product, or enable dynamic delivery-date display in the shopping cart.

## Key steps / config

- Create with **Create delivery time**; edit via the name or **"..."** menu; delete via the same menu.
- Fields: **name** (shown on the product detail page), **unit** (day, week, month, or year), **minimum** and **maximum** (integers) — used to automatically calculate displayed date ranges.
- **Assign delivery time in the shipping method**: set under the shipping method's basic information; used in cart/checkout only when no delivery time is assigned to the individual product. Useful for setting country- or shipping-method-specific delivery times (e.g. a separate shipping method per delivery country).
- **Assign a delivery time to a product**: done in the product's deliverability section; a product-level delivery time overrides the shipping method's delivery time for that product.
- **Show/hide delivery times in the shopping cart**: toggled per sales channel via **Settings > General > Cart settings** > **Show delivery time in shopping cart** (disabled by default). The dynamic date range shown is based on the current date, the product's delivery time, and — for out-of-stock products — the restocking time.

## Essential identifiers

Admin path: **Settings > Commerce > Delivery times**; cart toggle: **Settings > General > Cart settings > Show delivery time in shopping cart**; delivery time units: day, week, month, year.

## Gotchas

For the delivery time to display by default in the storefront, **Show delivery time in cart** must be activated under Settings > General > Shopping cart in addition to the delivery time itself being configured.
