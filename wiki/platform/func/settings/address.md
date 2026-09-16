---
id: platform/func/settings/address.md
title: Address
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/address
sourceHash: 8e8442c1dd1a4d862aa22662c3a8396954e42a52c00f5da0b7cbade1ebe9d0f8
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["address settings", "zip code position", "postal code", "country settings", "address formatting", "city name order", "sales channel", "customer account"]
summary: "Configures whether the zip code is shown before or after the city name, per sales channel, under Address settings."
lastBuilt: 2026-09-15
---
## What it is
Address settings let merchants configure the position of the postal/zip code relative to the city name when addresses are formatted and displayed.

## When to use
Use when a country's expected address format places the zip code before or after the city name and the default formatting needs country- or sales-channel-specific adjustment.

## Key steps / config
Navigate to Settings > Shop > Address settings to choose whether the zip code appears in front of or behind the city name. Since not every country uses the same convention, this can be configured separately for each sales channel.

## Essential identifiers
- Menu path: `Settings > Shop > Address settings`

## Gotchas
- The zip code is visible in the storefront customer account.

## Version notes
- A previous formatting option was updated and removed as of Shopware version 6.6.x.x.
