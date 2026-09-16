---
id: platform/func/extensions/dynamiccontent.md
title: Dynamiccontent
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/dynamiccontent
sourceHash: 200f7db3faac1c3b180966552dfbfd76aadd5bfac146ca7170c540120693c19e
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Dynamic Access", "Rule Builder", "visibility rules", "categories", "products", "variants", "Import/Export", "swagDynamicAccessRules", "dynamic_access", "Evolve plan"]
summary: "Evolve-plan Dynamic Access extension hides categories, products, or variants from the storefront based on Rule Builder rules."
lastBuilt: "2026-09-15"
---

## What it is

The Dynamic Access extension (Shopware Evolve plan, from Shopware 6.4.6.0) hides categories, products, or individual product variants from the storefront based on Rule Builder rules.

## When to use

When specific categories or products should be visible only to selected customer groups or conditions — e.g. showing certain products only to a given customer group.

## Key steps / config

- Install via **Extensions > My Extensions**, activate via the button on the left.
- No dedicated admin menu item — the extension is embedded directly in category and product configuration.
- **Categories**: under **Catalogues > Categories > General** tab, General section, select one or more Rule Builder rules; the category is shown only if all selected rules apply (no rule selected means always visible).
- **Products**: under **Catalogues > Products > General > Visibility & structure**, the same rule-selection behaviour applies.
- **Variants**: rules can also be set individually per variant, under its own Visibility & structure section; a purple chain icon indicates the setting is inherited from the main product until the inheritance is broken.
- **Bulk assignment**: via Import/Export, duplicate the default product profile under **Settings > Import/Export > Profiles**, add a mapping to the database entry `swagDynamicAccessRules`, export, edit the `dynamic_access` CSV column with the Rule ID, then re-import via the customized profile.

## Essential identifiers

`swagDynamicAccessRules`, `dynamic_access` (CSV column), Rule Builder

## Gotchas

- Hiding a category also requires hiding its contained products, otherwise they remain findable via search.
- Mutually exclusive rules can make a category or product never appear — avoid combining rules that way.
- If a product already in a customer's basket is subsequently hidden by a rule, checkout is blocked until it is removed from the basket.
- A product variant is only fully hidden from the product detail page once all its variants are unavailable due to rules; an individually hidden variant just becomes unselectable.

## Version notes

Available since Shopware 6.4.6.0.
