---
id: platform/func/shopware-6-de/saas/Shipping.md
title: Shipping
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-de/saas/Shipping
sourceHash: 2f877b9daf74ca75a49a571c1720858731311db2f6fb60aa0ae9e0cd8f696459
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["shipping method", "shipping module", "Versandart", "carrier assignment", "price matrix", "availability rule", "rule builder", "delivery time", "tracking URL", "sales channel", "technical name", "shipping costs"]
summary: "Shipping module lets merchants define shipping methods, availability rules, and price matrices; carrier assignment happens per order, not per method."
lastBuilt: "2026-09-15"
---
## What it is

The shipping module, under **Settings > Shop > Shipping** in the Shopware 6 Administration, lets you configure shipping methods that inform customers about offered shipping options, their cost, and which delivery countries are allowed or blocked. Actual carrier assignment happens manually on the order, not through a specific shipping method.

## When to use

Use this module to define which shipping options customers see at checkout, their pricing, and which sales channels offer them.

## Key steps / config

Overview columns: **name**, **description**, **active status (1)**; **List settings (2)** toggles columns; context menu (3) to edit/duplicate/delete; **Create shipping method (4)**; **Language selection (5)**.

Basic information when creating a method:
- **Name (1)**: internal and external display name.
- **Technical name (2)**: uniquely identifies the method; changing it later can break integrations relying on it.
- **Position (3)**: display order in checkout.
- **Active (4)**: whether the method is available.
- **Description (5)**: shown in overview and sales channel.
- **Upload Logo (6)**: upload, URL, or reuse existing media.
- **Delivery time (7)**: shown when the method is selected.
- **Tracking URL (8)**: use `%s` as placeholder for the tracking number.
- **Tags (9)**: keywords for finding the method later.

**Availability rule**: uses Rule Builder rules to decide when the shipping method may be used.

**Price matrix**: can be restricted by a Rule Builder rule; if no rule is set the matrix always applies. Built either from predefined **properties** (number of items, shopping cart value, weight, volume) or from **rules from the Rule Builder**. Add rows with **Add new price rule (2)**; manage via context menu (3).

## Essential identifiers

- `Settings > Shop > Shipping`
- Tracking URL placeholder: `%s`
- Price matrix basis: properties (number of items, shopping cart value, weight, volume) or Rule Builder rules

## Gotchas

- Changing a shipping method's technical name afterwards can break dependent shipping integrations.
- A shipping method must be assigned to a sales channel (in the sales channel's basic settings, item "shipping methods") to be usable by customers.
