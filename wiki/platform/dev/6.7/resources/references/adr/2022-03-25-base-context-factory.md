---
id: platform/dev/6.7/resources/references/adr/2022-03-25-base-context-factory.md
title: Base sales channel context factory
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-base-context-factory.html
sourceHash: 348ccaa00c7c419ddf3505677d8044b978468ec8
codeCheckedAgainst: "6.7.13.0"
keywords: ["BaseSalesChannelContextFactory", "CachedBaseSalesChannelContextFactory", "CachedSalesChannelContextFactory", "BaseSalesChannelContext", "AbstractSalesChannelContextFactory", "AbstractBaseSalesChannelContextFactory", "SalesChannelContextFactory", "sales channel context", "context cache", "store api performance", "logged-in customer", "adr"]
summary: "ADR: two-level context caching - CachedSalesChannelContextFactory (guests) and CachedBaseSalesChannelContextFactory (customer-independent data)."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-03-25) on making sales channel context creation cheaper for every Store API/storefront request. `CachedSalesChannelContextFactory` cannot cache once a customer or address is in the options, so the customer-independent part was split into a `BaseSalesChannelContext`, built by `BaseSalesChannelContextFactory` and cached across customers by `CachedBaseSalesChannelContextFactory`.

## When to use

When analysing sales channel context performance or cache hits, when a context switch (currency, language, payment/shipping method, country) yields unexpected data, or before decorating context creation.

## Key steps / config

Two caching levels in the installed code:

1. `Shopware\Core\System\SalesChannel\Context\CachedSalesChannelContextFactory` — caches the full `SalesChannelContext` only if none of `SalesChannelContextService::CUSTOMER_ID`, `BILLING_ADDRESS_ID`, `SHIPPING_ADDRESS_ID` is set; otherwise delegates to `getDecorated()->create()`. Key: `context-factory-<salesChannelId>` plus a hash of the sorted options; tagged `sales-channel-context`.
2. `Shopware\Core\System\SalesChannel\Context\CachedBaseSalesChannelContextFactory` — caches `Shopware\Core\System\SalesChannel\BaseSalesChannelContext` under `base-context-factory-<salesChannelId>` plus `Hasher::hash()` of the option keys `CURRENCY_ID`, `LANGUAGE_ID`, `DOMAIN_ID`, `PAYMENT_METHOD_ID`, `SHIPPING_METHOD_ID`, `VERSION_ID`, `COUNTRY_ID`, `COUNTRY_STATE_ID`. Bypasses the cache when `ORIGINAL_CONTEXT` or `PERMISSIONS` is set.

Decorating the public factory requires both abstract members:

```php
class MyContextFactory extends AbstractSalesChannelContextFactory
{
    public function getDecorated(): AbstractSalesChannelContextFactory { /* ... */ }
    public function create(string $token, string $salesChannelId, array $options = []): SalesChannelContext { /* ... */ }
}
```

The internal base contract is `create(string $salesChannelId, array $options = []): BaseSalesChannelContext`.

## Essential identifiers

- `Shopware\Core\System\SalesChannel\Context\SalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\CachedSalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\BaseSalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\CachedBaseSalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\BaseSalesChannelContext`
- `AbstractSalesChannelContextFactory`, `AbstractBaseSalesChannelContextFactory`

## Gotchas

- The base factories and `BaseSalesChannelContext` are `@internal`; intervening in base context loading easily causes cache misses and is not supported.
- A base context built for one payment/shipping method, country, etc. is shared with all logged-in users.
- The ADR snippet's `fallbackCustomerGroup` property, `BaseContext` return type and `md5(json_encode(...))` key are outdated.

## Version notes

In 6.7.13.0 `BaseSalesChannelContext` uses constructor promotion, has no fallback customer group, and adds `languageInfo` and `measurementSystemInfo`.

## Code check (6.7.13.0)
- confirmed `CachedSalesChannelContextFactory::isCacheable()` — skips cache when customer/billing/shipping address id set — vendor/shopware/core/System/SalesChannel/Context/CachedSalesChannelContextFactory.php:70
- confirmed `AbstractSalesChannelContextFactory::getDecorated()` — abstract, required — vendor/shopware/core/System/SalesChannel/Context/AbstractSalesChannelContextFactory.php:11
- confirmed `AbstractSalesChannelContextFactory::create()` — abstract, required — vendor/shopware/core/System/SalesChannel/Context/AbstractSalesChannelContextFactory.php:16
- confirmed `AbstractBaseSalesChannelContextFactory::create()` — abstract, only required member, class @internal — vendor/shopware/core/System/SalesChannel/Context/AbstractBaseSalesChannelContextFactory.php:19
- confirmed `BaseSalesChannelContextFactory` — marked @internal — vendor/shopware/core/System/SalesChannel/Context/BaseSalesChannelContextFactory.php:43
- corrected `CachedBaseSalesChannelContextFactory::create()` — docs: returns BaseContext, key via md5(json_encode); code returns BaseSalesChannelContext, key via Hasher::hash — vendor/shopware/core/System/SalesChannel/Context/CachedBaseSalesChannelContextFactory.php:24
- confirmed `SalesChannelContextService::COUNTRY_STATE_ID` — part of the base cache key set — vendor/shopware/core/System/SalesChannel/Context/CachedBaseSalesChannelContextFactory.php:45
- corrected `BaseSalesChannelContext` — docs: fallbackCustomerGroup property; code has none, adds languageInfo/measurementSystemInfo — vendor/shopware/core/System/SalesChannel/BaseSalesChannelContext.php:25
- confirmed `CachedSalesChannelContextFactory::ALL_TAG` — value sales-channel-context — vendor/shopware/core/System/SalesChannel/Context/CachedSalesChannelContextFactory.php:15
