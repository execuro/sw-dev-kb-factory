---
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/_index.md
title: Individual Pricing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/
sourceHash: 00bbedc41cbb3ccf1b59332f56acd08aa8df3389
codeCheckedAgainst: "6.7.13.0"
keywords: ["IndividualPricingApplyExtension", "IndividualPricingLookupCriteriaEvent", "IndividualPricingIndexingMessage", "individual pricing", "b2b pricing", "customer specific prices", "volume pricing", "tier prices", "strike-through price", "pricing rules", "catalog discount", "b2b components"]
summary: "B2B Individual Pricing (since 6.7.8.0): company- or tag-targeted pricing rules with tiers, product filters, priorities, validity periods and strike-through."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.md"]
---
## What it is

Individual Pricing is a B2B Components module that lets merchants define catalog-wide discounts and special prices as rules with conditions, instead of maintaining prices per product-customer combination.

## When to use

B2B shops where companies negotiate their own price agreements, volume (tiered) pricing is common, customer segments get special prices, or seasonal/time-limited pricing must be managed centrally.

## Key steps / config

Features of a pricing rule:

- **Targets**: Companies (specific companies, organization units or employees) or Tags (customers carrying given tags).
- **Volume pricing (tiers)**: quantity-based tiers, each with prices in multiple currencies.
- **Product filtering**: all products, or condition components selecting products by properties, categories, manufacturers, etc.
- **Priority**: only rules at the highest priority level are evaluated; among matches there, the lowest resulting price wins. Lower-priority rules are never considered.
- **Validity period**: optional start and end dates.
- **Strike-through**: optionally display the original price struck through.

Evaluation when a customer browses or adds to cart:

1. Find active rules applicable to the customer context (company, tags).
2. Keep only the highest priority level and evaluate those rules together.
3. Determine qualifying products per rule; with several matches pick the lowest price; with none, use standard catalog pricing.
4. Select the volume tier by quantity if configured.
5. Apply the calculated price over the catalog price; keep the original price for strike-through display if enabled.

Requirements: the Employee Management and Organization Unit components must be installed and active.

Performance: hybrid cache — pre-computed entries for specific products, runtime evaluation for rules applying to all products; maintained by background indexing and incremental updates.

## Essential identifiers

- `IndividualPricingApplyExtension` — extension point around applying prices
- `IndividualPricingLookupCriteriaEvent` — event for custom validation/filtering
- `IndividualPricingIndexingMessage` — async indexing message

Full list: [Extensibility - Events, Messages, and Extensions](platform/dev/6.7/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.md).

## Gotchas

- A high-priority rule that does not match the product falls back to catalog price rather than to lower-priority rules.

## Version notes

- Available since Shopware 6.7.8.0.

## Code check (6.7.13.0)
- unverified `IndividualPricingApplyExtension` — B2B Components (commercial) not installed in vendor/shopware roots
- unverified `IndividualPricingLookupCriteriaEvent` — B2B Components, not installed
- unverified `IndividualPricingIndexingMessage` — B2B Components, not installed
- unverified `6.7.8.0` — minimum version belongs to the B2B package; installed core is 6.7.13.0
- confirmed `b2b_components_organization` — Organization component entity referenced in core usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2096
- confirmed `ProductStreamDefinition::ENTITY_NAME` — product streams used for product filtering exist in core — vendor/shopware/core/Content/ProductStream/ProductStreamDefinition.php:33
- confirmed `TagDefinition::ENTITY_NAME` — core tag entity used by the Tags target — vendor/shopware/core/System/Tag/TagDefinition.php:38
