---
id: platform/func/tutorials-and-faq/selling-products-to-the-USA.md
title: Selling Products To The USA
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/selling-products-to-the-USA
sourceHash: 3b9e0568d9339ec485ba3e46b3e119d0e4adbac4ef57b83f119f31f8b819d3f5
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["USA", "sales tax", "net prices", "customer group", "tax representation", "American English", "en-US", "default tax rate", "individual states", "checkout.summaryTax", "snippet"]
summary: "Configuring Shopware for US sales: net-price customer group, en-US locale, per-state sales tax rates, and renaming the VAT label."
lastBuilt: 2026-09-15
---

## What it is

Describes the adjustments needed to sell products to the USA, where no (German) VAT applies (sale outside the EU) and instead "sales tax" applies at a rate that varies by US state.

## Key steps / config

1. **Create a new customer group**: under **Settings > Customer Groups > Add Customer Group**, set the tax representation to "Net" so net prices display for US customers.
2. **Set language/localisation**: under **Settings > Shop > Language**, add a language with locale "English, United States" and ISO code `en-US`; set the language before installing the language package, since the ISO code cannot otherwise be assigned to the default language.
3. **Assign the customer group to the sales channel**: under **Sales Channels > Customer Group**, and select the created US language.
4. **Configure tax rates**: under **Settings > Taxes > Default rate**, select Country "USA", Valid for "Individual States" (opens a state dropdown, requires the states to already exist under the country's settings), select the states sharing a rate (e.g. several states at 6%), and enter the Tax rate; states with an exclusive rate must be created individually the same way.
5. **Set snippets**: adapt the `checkout.summaryTax` snippet (default shows "VAT") via a new text module/snippet set to show a different label, e.g. "Sales tax".

## Essential identifiers

- `checkout.summaryTax` (snippet)
- Locale `en-US`
- Settings > Taxes > Default rate

## Gotchas

The US language (`en-US`) must be created before installing its language package, otherwise the ISO code cannot be assigned to the default language.
