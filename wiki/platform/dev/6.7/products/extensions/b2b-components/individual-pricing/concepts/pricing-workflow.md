---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/concepts/pricing-workflow.md
sourceHash: accec4499c76c6a799066dbeb84959d162d91897
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/concepts/pricing-workflow.html
title: Pricing workflow
version: "6.7"
versions:
  - "6.7"
keywords: ["AudienceContextResolver", "IndividualPricingProductSubscriber", "IndividualPricingCacheEntryUpdaterMessage", "IndividualPricingBuildCacheSingleRuleMessage", "IndividualPricingIndexingMessage", "showStrikeThrough", "volume_pricing", "individual pricing workflow", "price override", "computed cache", "price sorting filtering", "http cache"]
summary: How B2B Individual Pricing overrides prices at runtime - resolution phases, priority, tiers, computed cache, async indexing, HTTP cache and sorting limits.
lastBuilt: 2026-10-21
---
## What it is

Explains how B2B Individual Pricing plugs into Shopware's pricing: prices are overridden at runtime while sales channel products are loaded, resolved from a pre-computed cache, maintained by asynchronous indexing, with defined precedence over other price sources.

## When to use

Debugging why a customer sees a specific price, understanding delays after editing rules, planning HTTP cache behaviour for B2B customers, or explaining why price sorting/filtering is missing in the storefront.

## Key steps / config

Price override phases:
1. **Context creation** — `AudienceContextResolver` identifies the customer type (business partner, employee, tag-based customer) and prepares the audience context during request initialization.
2. **Product loading** — when products are loaded via the Store API, `IndividualPricingProductSubscriber` listens to the product-loaded event and starts pricing application.
3. **Price resolution** — the computed cache is queried for applicable rules per product; at the highest priority, the lowest resulting price wins.
4. **Price application** — single pricing sets one price (optional strike-through); volume pricing assigns tier prices with quantity ranges.

Resolution steps: identify company, groups, tags, organization units → cache lookup → filter by active status, validity period, target type, product stream → sort by priority (desc) → evaluate all highest-priority rules and pick the lowest price → apply the action (percentage, fixed discount, fixed price, or tier).

Volume pricing (`volume_pricing`): tiers sorted by `qtyFrom`; a tier matches when quantity ≥ `qtyFrom` and (quantity ≤ `qtyTo` or `qtyTo` is null); no matching tier → base price.

Strike-through (`showStrikeThrough`): the original standard price is preserved, the individual price becomes the current price, and the storefront can show both.

Precedence (highest first):
1. Individual Pricing
2. Shopware custom pricing (bypassed whenever an Individual Pricing rule applies)
3. Product advanced/graduated prices
4. Rule-based prices
5. Standard list price

Caching and indexing:
- Specific products: one pre-computed cache row per product-rule pair. Apply-to-all rules: a single row with `product_id=NULL`, price calculated at runtime (once per request).
- Indexing is queue-based, in batches of 1,000 products. Five flows: product indexing (incremental per changed product); rule create/update dispatches `IndividualPricingCacheEntryUpdaterMessage`; product stream filter changes re-index affected rules; tier changes update only that rule via `IndividualPricingBuildCacheSingleRuleMessage`; full re-index via a manual command coordinated by `IndividualPricingIndexingMessage`.
- Cache rows are regenerated on rule update and removed on rule deletion.

HTTP cache by customer type:

| Customer type | Cacheable |
|---|---|
| Tag-based customers | Yes (shared by same tags) |
| Organization unit employees | Yes (shared within unit) |
| Business partner accounts | No |
| Employees without org unit | No |

Tags are checked first, then organization units, else non-cacheable.

## Essential identifiers

- `AudienceContextResolver`, `IndividualPricingProductSubscriber`
- `IndividualPricingCacheEntryUpdaterMessage`, `IndividualPricingBuildCacheSingleRuleMessage`, `IndividualPricingIndexingMessage`
- `showStrikeThrough`, `volume_pricing`, `qtyFrom`, `qtyTo`

## Gotchas

- Prices are modified after the query runs; MySQL/Elasticsearch indexes hold only the original price, so price sorting and price range filtering would be wrong. They are automatically disabled in the storefront when Individual Pricing applies to the logged-in customer.
- After creating/updating rules for specific products, new prices appear only after the queue has processed the indexing messages; time depends on affected product count, worker configuration and queue load. Apply-to-all rules take effect immediately.
- The source's full re-index command name is not given.

## Version notes

- The source lists planned, not yet available, work: a migration path from custom pricing to Individual Pricing and a mass upsert API for bulk rule import.

## Code check (6.7.15.1)
- unverified `AudienceContextResolver` — B2B Components (commercial extension), not in installed core code
- unverified `IndividualPricingProductSubscriber` — B2B Components subscriber, not in installed core code
- unverified `IndividualPricingCacheEntryUpdaterMessage` — B2B Components message, not in installed core code
- unverified `IndividualPricingBuildCacheSingleRuleMessage` — B2B Components message, not in installed core code
- unverified `IndividualPricingIndexingMessage` — B2B Components message, not in installed core code
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — core product-loaded event name `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `SalesChannelEntityLoadedEvent` — sales-channel variant of loaded events, name prefixed `sales_channel.` — vendor/shopware/core/System/SalesChannel/Entity/SalesChannelEntityLoadedEvent.php:20
- confirmed `ProductPriceDefinition` — core advanced (graduated) product prices entity — vendor/shopware/core/Content/Product/Aggregate/ProductPrice/ProductPriceDefinition.php:24
- confirmed `product_stream` — core entity used for rule product matching — vendor/shopware/core/Content/ProductStream/ProductStreamDefinition.php:36
