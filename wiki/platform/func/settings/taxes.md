---
id: platform/func/settings/taxes.md
title: Taxes
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/taxes
sourceHash: af711b5690a2bb5958de38accde878215fbe7d427ba970bb1d0dd436ef05c473
revision:
  current: true
  range: "6.5.5.0 - 6.6.10.6"
  swMin: "6.5.5.0"
  swMax: "6.6.10.6"
keywords: ["taxes", "tax rate", "tax rule", "default tax rate", "customer groups gross net", "EU One-Stop-Shop", "OSS threshold", "tax provider", "zip code tax rule", "Active from", "Settings > Localisation > Tax"]
summary: "Manages tax rates, per-country/zip-code tax rules, EU OSS thresholds, and tax providers under Settings > Localisation > Tax."
lastBuilt: "2026-09-15"
---

## What it is

The Taxes settings, under **Settings > Localisation > Tax**, manage stored tax rates, country/region-specific tax rules, and external tax providers.

## When to use

Use it to define a store's tax rates, set country- or region-specific overrides (e.g. for US-style complex tax systems), or configure the EU One-Stop-Shop threshold response.

## Key steps / config

- Overview lists existing tax rates; a green tick marks the **Default** rate; context menu edits or deletes a rate. Whether prices display/calculate gross or net is configured per customer group.
- **Creating a new tax rate**: set a name and a percentage value; "Use as default" makes it the default applied when creating new products.
- **Editing an existing tax rate** uses the same screen as creation; changes can affect live invoice calculations for orders already using that rate.
- **Country-specific tax rules**: within a tax rate's Countries area, click **Add country** to add a rule scoped to a zip code, a zip code range, one or more states, or an entire country. An **Active from** date applies the rule from that date for storefront calculation based on existing master data — it does not recalculate prices already set on products.
- **EU One-Stop-Shop**: since 1 July 2021, the EU threshold is €10,000; stores exceeding it should register in the OSS portal and clearly display which delivery country a shown price applies to.
- **Tax provider**: lists integrated tax services; Edit exposes Settings (position/priority, activation) and Availability (an existing or new rule); priority/order is changed via drag & drop.

## Essential identifiers

- Menu path: **Settings > Localisation > Tax**
- Fields: name, percentage value, "Use as default", "Active from"

## Gotchas

An "Active from" date on a country/zip-code/state tax rule only affects storefront calculation going forward — it does not retroactively recalculate product prices.
