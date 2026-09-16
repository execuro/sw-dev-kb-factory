---
id: platform/func/settings/shipping.md
title: Shipping
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/shipping
sourceHash: 4f9f8303629dff36fbf166bc20fa923d0a35281685705862ead555f288fed986
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.10"
  swMin: "6.6.0.0"
  swMax: "6.6.10.10"
keywords: ["shipping methods", "settings commerce shipping", "technical name shipping method", "availability rule", "price matrix", "tax calculation shipping", "tracking URL placeholder", "rule builder shipping", "shipping method position", "assign shipping method to sales channel"]
summary: How to create and configure shipping methods under Settings > Commerce > Shipping, including availability rules, tax calculation, and the price matrix.
lastBuilt: 2026-09-15
---
## What it is

Shipping methods, managed under **Settings > Commerce > Shipping**, define how a shop offers delivery options, their pricing via a price matrix, and the rule-based conditions under which each is available.

## When to use

Use this to add a new shipping method (standard, freight, cash on delivery, etc.), change its pricing rules, or control when it is offered based on cart/customer conditions.

## Key steps / config

- Overview columns: name, description, active status, position (checkout display order), with language selection, list settings, refresh, and a context menu to edit/delete.
- **Basic information**: Name, Technical name (unique identifier for admin/extensions — optional in 6.6.0.0, mandatory from 6.7.0.0), Position, Active, Description, Upload logo, Delivery time, Tracking URL (supports a `%s` placeholder auto-filled with the order's tracking code), Tags. A delivery time set on a product overrides the shipping method's delivery time.
- **Availability rule**: uses Rule Builder rules to decide when the method can be used; a new rule can be created inline.
- **Tax calculation**: `Automatic` (proportional to cart tax rates), `Highest` (uses the highest cart tax rate), or `Fixed` (manually selected rate).
- **Price matrix**: an optional **restriction** (a Rule Builder rule) scopes when the matrix applies; the matrix itself is built either by **properties** (number of items, cart value, weight, volume) or by **rules from the Rule Builder**; **Add pricing level** adds price rules, **Add price matrix** adds another restricted matrix.
- **Assign to sales channel**: done from the sales channel's general settings, under shipping methods, where a default shipping method is also chosen.

## Essential identifiers

Admin path: **Settings > Commerce > Shipping**; tracking placeholder `%s`; tax calculation modes `Automatic`, `Highest`, `Fixed`; price matrix bases: number of items, cart value, weight, volume.

## Gotchas

- Volume for the price matrix is calculated as width × height × length in cubic millimeters by default (e.g. 300mm × 200mm × 500mm = 30,000,000 mm³).
- To replace an existing price matrix, delete it and create a new one.

## Version notes

The shipping method's Technical name is optional in 6.6.0.0 but becomes mandatory starting with 6.7.0.0.
