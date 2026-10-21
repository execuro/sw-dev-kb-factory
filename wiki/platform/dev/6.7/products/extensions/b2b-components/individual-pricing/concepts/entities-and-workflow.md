---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/concepts/entities-and-workflow.md
sourceHash: 0a101103c61fab70726c7b529073c57fc01b7b7f
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/concepts/entities-and-workflow.html
title: Entities and Workflow
version: "6.7"
versions:
  - "6.7"
keywords: ["b2b_components_individual_pricing", "b2b_components_individual_pricing_tier", "b2b_components_individual_pricing_company_assignment", "b2b_components_individual_pricing_computed_cache", "b2b_components_individual_pricing_tag", "actionType", "volume_pricing", "by_percent", "whole_company", "specific_units", "individual pricing entities", "pricing rule priority"]
summary: B2B Individual Pricing data model - pricing rule, tier, company assignment, computed cache, tag tables - plus action types, scopes and rule selection.
lastBuilt: 2026-10-21
---
## What it is

Describes the entities of the B2B Individual Pricing component (pricing rule, volume tiers, company assignment, computed cache, tag mapping), their key properties and database tables, and the workflow that decides which rule prices a product.

## When to use

Reading or writing individual pricing data directly, building integrations that create pricing rules, or debugging why a customer sees (or does not see) an individual price.

## Key steps / config

**Individual pricing** (`b2b_components_individual_pricing`) — the rule:
`name`, `description`, `active`, `priority` (integer, higher = higher priority), `target` (companies, tags), `actionType`, `actionAmount`, `applyToAllProducts`, `productStreamId`, `useValidityRange`, `validFrom`, `validUntil`, `showStrikeThrough`. Table also has `created_by_id`, `updated_by_id`, `custom_fields`.

Action types: `by_percent` (reduce by percent), `by_fixed` (reduce by fixed amount), `to_fixed` (set fixed price), `volume_pricing` (tiered by quantity).

**Tier** (`b2b_components_individual_pricing_tier`, used with `volume_pricing`): `individualPricingId`, `qtyFrom` (inclusive), `qtyTo` (inclusive, null = unlimited), `price` (price collection per currency, JSON).

**Company assignment** (`b2b_components_individual_pricing_company_assignment`): `individualPricingId`, `customerId` (business partner customer), `scope`, `organizationUnitIds` (JSON array, used with `specific_units`). Scopes: `whole_company`, `all_org_units`, `specific_units`.

**Computed cache** (`b2b_components_individual_pricing_computed_cache`): `individualPricingId`, `productId` — `NULL` when the rule applies to all products; specific rows for targeted rules.

**Tag mapping** (`b2b_components_individual_pricing_tag`): `individual_pricing_id`, `tag_id`.

Relations: a rule has many tiers, company assignments, cache rows and tag rows; it uses one `product_stream`; assignments belong to `customer`; cache rows reference `product`; tag rows reference `tag`.

Workflow for a product view:
1. Not logged in: standard catalog price.
2. Logged in: load customer context, query active rules; none found: standard price.
3. Take all rules at the highest priority and evaluate them against the product; none matches: standard price.
4. One match: use it; several: calculate each price and select the lowest.
5. Calculate the final price; show it with or without the strike-through original.

Target evaluation:
- Companies: customer must be a business partner or employee, a company assignment for the customer's company must exist, scope is checked, and for specific units the customer must belong to one of them.
- Tags: customer must have at least one of the rule's tags.

## Essential identifiers

- Tables: `b2b_components_individual_pricing`, `b2b_components_individual_pricing_tier`, `b2b_components_individual_pricing_company_assignment`, `b2b_components_individual_pricing_computed_cache`, `b2b_components_individual_pricing_tag`
- Action types: `by_percent`, `by_fixed`, `to_fixed`, `volume_pricing`
- Scopes: `whole_company`, `all_org_units`, `specific_units`

## Gotchas

- Lower-priority rules are never evaluated, even if no rule at the highest priority matches the product — standard pricing is used then.

## Code check (6.7.15.1)
- unverified `b2b_components_individual_pricing` — B2B Components (commercial extension) table, not in installed core code
- unverified `b2b_components_individual_pricing_computed_cache` — B2B Components table, not in installed core code
- unverified `volume_pricing` — B2B Components action type value, not in installed core code
- unverified `specific_units` — B2B Components scope value, not in installed core code
- confirmed `product_stream` — core entity referenced by `productStreamId` — vendor/shopware/core/Content/ProductStream/ProductStreamDefinition.php:36
- confirmed `tag` — core entity referenced by the tag mapping — vendor/shopware/core/System/Tag/TagDefinition.php:41
