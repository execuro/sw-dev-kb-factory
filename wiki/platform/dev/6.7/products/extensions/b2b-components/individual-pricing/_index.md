---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/_index.md
relatedPages:
  - platform/dev/6.7/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.md
sourceHash: 00bbedc41cbb3ccf1b59332f56acd08aa8df3389
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/
title: Individual Pricing
version: "6.7"
versions:
  - "6.7"
keywords: ["individual pricing", "IndividualPricingApplyExtension", "IndividualPricingLookupCriteriaEvent", "IndividualPricingIndexingMessage", "b2b pricing", "customer specific prices", "volume pricing", "tiered pricing", "strike-through price", "pricing rules", "company pricing", "tag pricing"]
summary: B2B Individual Pricing component (since 6.7.8.0) - catalog-wide discounts/prices per company, org unit, employee or tag, with tiers, priority and validity.
lastBuilt: 2026-10-21
---
## What it is

Individual Pricing is a B2B component, available since Shopware 6.7.8.0, that lets merchants define catalog-wide discounts and special prices for B2B customers through pricing rules instead of managing prices per product-customer pair. Rules apply automatically based on conditions similar to product stream rules.

## When to use

B2B setups where companies negotiate different price agreements, volume (tiered) pricing is needed, specific customer segments get special prices, or seasonal/time-limited pricing must be managed centrally.

## Key steps / config

Features of a pricing rule:
- **Targets**: Companies (specific companies, organization units or employees) or Tags (customers with given tags).
- **Volume pricing (tiers)**: quantity-based tiers, each with prices in multiple currencies.
- **Product filtering**: all products, or condition components targeting products by properties, categories, manufacturers, etc.
- **Priority**: only rules at the highest priority level are evaluated; if several match there, the one giving the lowest price wins; lower-priority rules are never considered.
- **Validity periods**: optional start and end dates.
- **Strike-through**: optionally show the original price struck through.

Runtime flow when a customer browses or adds to cart:
1. Find active rules applicable to the customer context (company, tags).
2. Keep only the highest priority level and evaluate all rules on it.
3. Determine qualifying products per rule; pick the lowest resulting price if several match.
4. No match at the highest priority: standard catalog pricing is used.
5. With volume pricing, choose the tier by quantity.
6. Apply the calculated price, overriding the catalog price; keep the original for strike-through display if enabled.

Caching: hybrid strategy — pre-computed cache entries for specific products, runtime-evaluated entries for rules applying to all products — maintained by background indexing and incremental updates.

Extensibility (details in [Extensibility - Events, Messages, and Extensions](platform/dev/6.7/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.md)):
- Extensions, e.g. `IndividualPricingApplyExtension`
- Events, e.g. `IndividualPricingLookupCriteriaEvent`
- Messages, e.g. `IndividualPricingIndexingMessage`

## Essential identifiers

- `IndividualPricingApplyExtension`
- `IndividualPricingLookupCriteriaEvent`
- `IndividualPricingIndexingMessage`

## Gotchas

- Requires the Employee Management and Organization Unit B2B components to be installed and activated.

## Version notes

- Available since Shopware 6.7.8.0.

## Code check (6.7.15.1)
- unverified `IndividualPricingApplyExtension` — B2B Components (commercial extension), not in installed core/storefront/administration code
- unverified `IndividualPricingLookupCriteriaEvent` — B2B Components event, not in installed core code
- unverified `IndividualPricingIndexingMessage` — B2B Components message, not in installed core code
- confirmed `product_stream` — core product stream entity used for product filtering — vendor/shopware/core/Content/ProductStream/ProductStreamDefinition.php:36
- confirmed `tag` — core tag entity used by the Tags target — vendor/shopware/core/System/Tag/TagDefinition.php:41
