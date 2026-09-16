---
id: platform/func/settings/currencies.md
title: Currencies
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/currencies
sourceHash: 1350e9a7cf1bca46cd241a2466e082930af015f5c829f469a11202ef2d147a16
revision:
  current: true
  range: "6.1.0 - 6.4.1.2"
  swMax: "6.4.1.2"
  swMin: "6.1.0"
keywords: ["currencies", "ISO code", "currency factor", "price rounding", "Settings > Shop", "system standard currency", "currency symbol", "decimal places", "grand total rounding"]
summary: "Manages sales-channel currencies: create/edit/remove, ISO code and factor, and per-currency or per-country price rounding."
lastBuilt: 2026-09-15
---
## What it is
The Currencies module (Settings > Shop, left admin menu) manages the currencies available to a shop's sales channels: creating, editing, and removing currencies, and configuring their conversion factor and price rounding.

## When to use
Use when adding a new sales currency, adjusting how prices round in the cart/subtotals, or changing how a currency's symbol is formatted per language.

## Key steps / config
- Overview: lists configured currencies; edit or remove via the context menu. The system currency's factor should always remain unchanged.
- Create a new currency ("Add currency"): fields are Name, ISO code (see the linked list of currency codes), Short name (must be exactly three letters, e.g. `EUR`), Symbol (e.g. `€`), Factor (conversion factor relative to the system standard currency, e.g. `1.17085` for USD). New currencies must be maintained in the system standard language.
- Price rounding (per currency): Decimal places, Interval (rounding granularity for markets whose smallest unit of account is smaller than the smallest physical coin/note), Round for net customers too, and a separate Grand total sub-section repeating those settings for the shopping cart's total.
- Country: "Add country" lets you define different price-rounding settings per country.
- Edit an existing currency: same fields as creation; switching Language lets you add per-language translations shown in the storefront.
- Remove a currency: only possible in a self-hosted environment, and only if the currency is no longer assigned anywhere; the system reports where it is still in use if removal fails.
- Display: the storefront's currency symbol placement/format follows the selected language's ISO code, e.g. German shows "499.99 $" while English shows "US$499.99" for the same USD amount.

## Essential identifiers
- Menu path: `Settings > Shop` (Currencies)
- Currency fields: `Name`, `ISO code`, `Short name`, `Symbol`, `Factor`
- Price-rounding fields: `Decimal places`, `Interval`, `Round for net customers too`, `Grand total`

## Gotchas
- Removing a currency is only possible in a self-hosted environment.
- A currency cannot be removed while still assigned to any sales channel or other reference.
- Short name must be exactly three letters.
