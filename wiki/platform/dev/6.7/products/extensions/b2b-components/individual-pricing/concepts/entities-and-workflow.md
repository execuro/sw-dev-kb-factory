---
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/concepts/entities-and-workflow.md
title: Entities and Workflow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/concepts/entities-and-workflow.html
sourceHash: 0a101103c61fab70726c7b529073c57fc01b7b7f
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b_components_individual_pricing", "b2b_components_individual_pricing_tier", "b2b_components_individual_pricing_company_assignment", "b2b_components_individual_pricing_computed_cache", "b2b_components_individual_pricing_tag", "actionType", "volume_pricing", "whole_company", "specific_units", "individual pricing entities", "price rule priority", "tier pricing"]
summary: "Individual Pricing data model (rule, tier, company assignment, computed cache, tag tables), action types, scopes, and highest-priority/lowest-price selection."
lastBuilt: 2026-09-15
---
## What it is

The entity model and price-application workflow of the B2B Individual Pricing component: tables for rules, tiers, company assignments, tags and the product cache, and how a rule is selected for a product.

## When to use

Reading or writing pricing rules, or debugging why a customer does or does not get an individual price.

## Key steps / config

**Rule** (`b2b_components_individual_pricing`): `name`, `description`, `active`, `priority` (higher = higher priority), `target` (companies, tags), `actionType`, `actionAmount` (percentage or fixed value), `applyToAllProducts`, `productStreamId`, `useValidityRange`, `validFrom`, `validUntil`, `showStrikeThrough`; columns also include `created_by_id`, `updated_by_id`, `custom_fields`.

Action types: `by_percent`, `by_fixed` (reduce by amount), `to_fixed` (set price), `volume_pricing` (use tiers).

**Tier** (`b2b_components_individual_pricing_tier`, for `volume_pricing`): `individualPricingId`, `qtyFrom` (inclusive), `qtyTo` (inclusive, null = unlimited), `price` (JSON price collection per currency).

**Company assignment** (`b2b_components_individual_pricing_company_assignment`): `individualPricingId`, `customerId` (business partner), `scope`, `organizationUnitIds` (JSON). Scopes: `whole_company`, `all_org_units`, `specific_units` (requires `organizationUnitIds`).

**Computed cache** (`b2b_components_individual_pricing_computed_cache`): `individualPricingId`, `productId` — `NULL` for rules applying to all products.

**Tag mapping** (`b2b_components_individual_pricing_tag`): `individual_pricing_id`, `tag_id`.

Relations: rule 1:n tiers, assignments, cache rows, tag rows; rule n:1 `product_stream`; assignment n:1 `customer`; cache n:1 `product`; tag mapping n:1 `tag`.

**Workflow per product:**

1. Not logged in → catalog price.
2. Query active rules for the customer; none → catalog price.
3. Evaluate all rules at the highest priority; none match → catalog price.
4. One match → use it; several → choose the lowest resulting price.
5. Show with original price if strike-through is enabled.

**Targets:** Companies — customer is a business partner or employee, an assignment for the company exists and the scope matches (for `specific_units`, membership in a listed organization unit). Tags — customer has at least one of the rule's tags.

## Gotchas

- Lower-priority rules are never evaluated, even when no highest-priority rule matches.
- Individual prices only apply to logged-in customers.

## Code check (6.7.13.0)
- unverified `b2b_components_individual_pricing` — B2B Components (commercial) not installed; not in vendor/shopware roots
- unverified `b2b_components_individual_pricing_computed_cache` — B2B Components, not installed
- unverified `volume_pricing` — action type defined by B2B Components, not installed
- confirmed `ProductStreamDefinition::ENTITY_NAME` — `product_stream` referenced by `productStreamId` — vendor/shopware/core/Content/ProductStream/ProductStreamDefinition.php:33
- confirmed `TagDefinition::ENTITY_NAME` — `tag` referenced by the tag mapping — vendor/shopware/core/System/Tag/TagDefinition.php:38
- confirmed `CustomerDefinition::ENTITY_NAME` — `customer` referenced by `customerId` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `ProductDefinition::ENTITY_NAME` — `product` referenced by the computed cache — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `b2b_components_organization` — organization unit entity referenced in core usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2096
