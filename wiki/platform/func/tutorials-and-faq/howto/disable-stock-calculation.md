---
id: platform/func/tutorials-and-faq/howto/disable-stock-calculation.md
title: "Disable Stock Calculation"
docType: functional
version: "6.5"
versions: ["6.5"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/howto/disable-stock-calculation"
sourceHash: "58a42db01e3b818f0d8a74d22f99bba7a4d323dbda6856afea5c80b76fdbe0f2"
revision:
  current: true
  range: "6.5.4.0 - 6.5.8.14"
  swMin: "6.5.4.0"
  swMax: "6.5.8.14"
keywords: ["disable stock calculation", "enable_stock_management", "shopware.yaml", "stock management", "ERP integration", "config/packages", "cache clear", "sales tracking", "stock values", "product overview Sales column"]
summary: "Disabling Shopware's built-in stock calculation via shopware.yaml so an external ERP manages stock instead, from Shopware 6.5.4.0."
lastBuilt: "2026-09-15"
---
## What it is

Since Shopware 6.5.4.0, the internal stock calculation can be disabled so that an external system — for example an ERP — handles all stock-related calculations instead of Shopware itself.

## When to use

Use this when stock levels are managed by an external ERP and you want Shopware to stop calculating stock changes on its own, to avoid the two systems fighting over the same values.

## Key steps / config

- New Shopware projects (and updates whose `config/packages/` .yaml files were left at defaults) may contain only a `lock.yaml` file under `config/packages/`. If so, create a new `shopware.yaml` file there first.
- In `config/packages/shopware.yaml`, add:
```
shopware:
  stock:
    enable_stock_management: false
```
- Clear the shop's cache after making the change.

## Essential identifiers

- `config/packages/shopware.yaml`
- `shopware.stock.enable_stock_management`

## Gotchas

- Existing stock values are preserved, but once disabled, Shopware no longer adds or subtracts stock in response to placed or delivered orders — an external system (e.g. an ERP) must own those calculations instead.
- Disabling stock calculation also stops sales tracking: the "Sales" column in the product overview no longer reflects order activity, since it relies on the same internal calculation.
