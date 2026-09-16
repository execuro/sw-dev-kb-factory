---
id: platform/dev/6.6/resources/references/adr/2022-03-25-base-context-factory.md
title: Base context factory
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-base-context-factory.html"
sourceHash: "e466fad4960bc81472e6d85dd181dd4c6343b6c2"
keywords: ["BaseContextFactory", "BaseContext", "CachedSalesChannelContextFactory", "CachedBaseContextFactory", "SalesChannelContextFactory", "SalesChannelContextService", "sales channel context cache", "internal", "shippingMethodId", "paymentMethodId", "cache permutation"]
summary: "ADR: BaseContextFactory/BaseContext split out customer-independent sales-channel data so it can be cached even for logged-in customers."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record introducing `Shopware\Core\System\SalesChannel\Context\BaseContextFactory` and `Shopware\Core\System\SalesChannel\BaseContext` to cache the customer-independent portion of the sales channel context.

## When to use
When investigating sales-channel-context caching behavior or cache-miss issues, or when a store-api request builds a `SalesChannelContext` and performance of context construction matters.

## Key steps / config
- `Shopware\Core\System\SalesChannel\Context\SalesChannelContextFactory` (cached via `CachedSalesChannelContextFactory`) cannot cache the full context once a customer is logged in, because it embeds the customer and their billing/shipping addresses.
- `BaseContextFactory` builds a `BaseContext` containing only sales-channel-scoped or customer-independent data (customer group, currency, sales channel, tax rules, payment/shipping method, rounding config, etc.).
- `CachedBaseContextFactory` caches the `BaseContext` keyed on a subset of options: `shippingMethodId`, `paymentMethodId`, `countryId`, `countryStateId`, `currencyId`, `languageId` (plus `domainId`/`versionId` in the cache key construction).
- Caching now happens at two levels: `CachedSalesChannelContextFactory` for anonymous/global hits, and `CachedBaseContextFactory` for the customer-independent base data shared across all logged-in users.

## Essential identifiers
- `Shopware\Core\System\SalesChannel\Context\SalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\CachedSalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\BaseContextFactory`
- `Shopware\Core\System\SalesChannel\BaseContext`
- `Shopware\Core\System\SalesChannel\Context\CachedBaseContextFactory`

## Gotchas
`BaseContextFactory` and `BaseContext` are marked `@internal` and not intended for extension — modifying how the base context loads can easily cause cache misses.
