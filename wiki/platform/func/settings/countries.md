---
id: platform/func/settings/countries.md
title: Countries
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/countries"
sourceHash: c722dc39d65b5523bac2d7feceecea2a5158ae2cf9d0cd91d090c340e4b1dbc2
revision:
  current: true
  range: "6.6.7.1 - 6.6.10.16"
  swMin: "6.6.7.1"
  swMax: "6.6.10.16"
keywords: ["countries", "ISO 3166", "ISO2", "ISO3", "tax-free", "VAT ID", "states regions", "address handling", "address markup", "shipping availability", "intra-community supply", "postal code validation"]
summary: Documents country configuration in Shopware — ISO codes, shipping/tax-free toggles, states/regions and address validation rules.
lastBuilt: 2026-09-15
---
## What it is

Country configuration, under **Settings > Localisation > Countries**, controls which countries are available per language/sales channel and their shipping, tax and address-format behaviour.

## When to use

Used to enable or restrict countries for shipping, configure B2C/B2B tax-free thresholds, validate VAT/postal codes, or adjust how addresses are formatted per country.

## Key steps / config

The overview shows configured countries with **position**, **ISO** (ISO 3166, e.g. `DE`) and **ISO3** (e.g. `DEU`) codes, and an **Active** toggle; new countries are added with **Create country**.

**General** tab: Name, Position, ISO2, ISO3 — must be entered in the default system language.

**Options** tab:
- **Active** / **Shipping** — enable customer selection / shipping availability (disabled shipping shows "Deliveries to the selected delivery address are not possible")
- **Tax-free (B2C)** — with **Min. cart value (net)** and **Currency dependent value** per currency
- **Tax-free (B2B)** — same, for business customers; requires a valid VAT ID on the customer account
- **Validate VAT Reg. No. format** — available for EU countries only
- **VAT Reg. No. required** — makes the VAT ID mandatory
- **Member State of the European Union** — adds an "intra-Community supply" note to documents when the customer is a commercial, tax-exempt account and the document setting is active

**States/Regions** tab: add/edit states with name, ISO code, position.

**Address-handling** tab: **Country/Region is mandatory**, **Postal code is mandatory**, **Validate postal code**, **Extended validation rules** (RegEx, e.g. `^\d{5}$` for exactly 5 digits, or `^(\d{4})\s*([A-Z]{2})$` for 4 digits + 2 letters).

**Address markup** tab: adjust address field ordering per country (e.g. US house-number-before-street), with a live preview.

## Essential identifiers

- **Settings > Localisation > Countries**
- ISO2 / ISO3 fields
- Extended validation RegEx examples: `^\d{5}$`, `^(\d{4})\s*([A-Z]{2})$`

## Gotchas

New country data must always be entered in the default system language. Double-clicking an entry in the country overview opens an inline edit mask, confirmed with the blue arrow.
