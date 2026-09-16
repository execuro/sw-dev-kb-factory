---
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/concepts/pricing-workflow.md
title: Pricing workflow
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/concepts/pricing-workflow.html
sourceHash: accec4499c76c6a799066dbeb84959d162d91897
codeCheckedAgainst: "6.7.13.0"
keywords: ["individual pricing", "AudienceContextResolver", "IndividualPricingProductSubscriber", "IndividualPricingCacheEntryUpdaterMessage", "IndividualPricingBuildCacheSingleRuleMessage", "IndividualPricingIndexingMessage", "volume_pricing", "showStrikeThrough", "computed cache", "b2b customer-specific prices", "price priority", "tier prices", "strike-through price", "price sorting filtering"]
summary: "B2B Individual Pricing runtime flow: audience context, computed-cache lookup, priority/lowest-price rule selection, volume tiers, async indexing, HTTP cache."
lastBuilt: 2026-09-15
---
## What it is

Concept page for the B2B Commercial component Individual Pricing: how customer-specific pricing rules are resolved and applied to products at runtime (after products are loaded via the Store API), how the pre-computed cache is maintained through the message queue, and how it ranks against Shopware's standard, advanced, rule-based and custom pricing.

## When to use

Read this when debugging why a B2B customer sees (or does not see) an individual price, when reasoning about priority between Individual Pricing and other price sources, or when price sorting/filtering disappears in the storefront for logged-in B2B customers.

## Key steps / config

Runtime flow (four phases):

1. **Context creation** — `AudienceContextResolver` identifies the customer type (business partner, employee, tag-based customer) and builds the audience context during request initialization.
2. **Product loading** — `IndividualPricingProductSubscriber` listens for the product-loaded event when products are loaded via the Store API.
3. **Price resolution** — the computed cache is queried for applicable rules.
4. **Price application** — single pricing (one price, optional strike-through) or volume pricing (tier prices with quantity ranges).

Resolution steps:

1. Context identification: company, groups, tags, organization units.
2. Cache lookup in the computed cache.
3. Filter rules by active status, validity period (if set), target type (company, group, tag), product stream match.
4. Sort by priority, highest first.
5. Only the highest priority level is considered; if several rules match there, the price for each is calculated and the lowest wins. No match falls back to the standard price.
6. Apply the selected rule's action (volume tier, percentage discount, fixed discount, or fixed price).

Volume pricing (action type `volume_pricing`): tiers are sorted by `qtyFrom`; a tier matches when quantity >= `qtyFrom` and (quantity <= `qtyTo` or `qtyTo` is null). No matching tier uses the base price.

Strike-through: with `showStrikeThrough` enabled, the original standard price is preserved and the calculated individual price becomes the current price, so the storefront can show both.

Priority hierarchy (highest first):

1. Individual Pricing
2. Shopware custom pricing (bypassed when an Individual Pricing rule applies)
3. Product advanced/graduated prices
4. Rule-based prices
5. Standard list price

Caching and indexing (hybrid):

- Specific products: one pre-computed cache entry per product-rule pair, built via product stream matching.
- "Apply to all products": a single entry per rule with `product_id=NULL`, price calculated at runtime.
- Entries are regenerated on rule update and removed on rule delete.

Five asynchronous indexing flows, batches of 1,000 products via the message queue:

1. Product indexing — incremental rebuild for changed products.
2. Rule changes — `IndividualPricingCacheEntryUpdaterMessage`.
3. Product stream filter changes — affected rules re-indexed.
4. Tier changes — only the affected rule via `IndividualPricingBuildCacheSingleRuleMessage`.
5. Full re-index — manual command, coordinated by `IndividualPricingIndexingMessage`.

HTTP cache by customer type:

| Customer type | Cacheable |
|---|---|
| Tag-based customers | Yes (shared by same tags) |
| Organization unit employees | Yes (shared within unit) |
| Business partner accounts | No |
| Employees without org unit | No |

Tags are checked first, then organization units, else non-cacheable.

## Essential identifiers

- `AudienceContextResolver`
- `IndividualPricingProductSubscriber`
- `IndividualPricingCacheEntryUpdaterMessage`
- `IndividualPricingBuildCacheSingleRuleMessage`
- `IndividualPricingIndexingMessage`
- `volume_pricing`, `qtyFrom`, `qtyTo`, `showStrikeThrough`

## Gotchas

- Prices are modified after query execution; MySQL/MariaDB and Elasticsearch indexes hold only the original price. Price sorting and price range filtering are therefore automatically disabled in the storefront when Individual Pricing applies to the logged-in customer.
- Indexing is queue-based: rules for specific products become visible only after the queue worker processes them. "Apply to all products" rules take effect immediately (runtime calculation).
- Business partner and org-unit-less employee responses are not HTTP-cacheable.

## Version notes

The source lists planned, not yet available, features: a migration path from Shopware custom pricing to Individual Pricing, and a mass upsert API for bulk import of pricing rules.

## Code check (6.7.13.0)
- unverified `AudienceContextResolver` — Shopware Commercial (B2B) plugin class, not in vendor/shopware/{core,storefront,administration}; out of scope
- unverified `IndividualPricingProductSubscriber` — Commercial plugin, not installed in the checked roots; out of scope
- unverified `IndividualPricingCacheEntryUpdaterMessage` — Commercial plugin, out of scope
- unverified `IndividualPricingBuildCacheSingleRuleMessage` — Commercial plugin, out of scope
- unverified `IndividualPricingIndexingMessage` — Commercial plugin, out of scope
- unverified `showStrikeThrough` — Commercial plugin field, not present in core product code; out of scope
- confirmed `EntityIndexingMessage` — core indexing message is async (`AsyncMessageInterface`), consistent with queue-based indexing — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:12
- confirmed `ProductEntity::getPrices()` — core advanced (graduated) prices that Individual Pricing ranks above — vendor/shopware/core/Content/Product/ProductEntity.php:673
