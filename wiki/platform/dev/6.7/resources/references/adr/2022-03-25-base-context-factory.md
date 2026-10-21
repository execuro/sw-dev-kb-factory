---
id: platform/dev/6.7/resources/references/adr/2022-03-25-base-context-factory.md
title: Base sales channel context factory
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-base-context-factory.html
sourceHash: 348ccaa00c7c419ddf3505677d8044b978468ec8
codeCheckedAgainst: "6.7.15.1"
keywords: ["BaseSalesChannelContextFactory", "CachedBaseSalesChannelContextFactory", "CachedSalesChannelContextFactory", "SalesChannelContextFactory", "BaseSalesChannelContext", "AbstractBaseSalesChannelContextFactory", "AbstractSalesChannelContextFactory", "SalesChannelContextService", "sales channel context cache", "context caching", "store api performance", "base context"]
summary: "ADR: two-level sales channel context caching; CachedBaseSalesChannelContextFactory caches customer-independent BaseSalesChannelContext data per options."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-25, area: core) on how the sales channel context, built for every Store API and Storefront request, is cached. Building it is expensive for the database because it contains many DAL objects. The existing cache `Shopware\Core\System\SalesChannel\Context\CachedSalesChannelContextFactory` (decorating `Shopware\Core\System\SalesChannel\Context\SalesChannelContextFactory`) cannot cache once a customer is logged in, because the context then holds the customer and the selected billing and shipping addresses. The ADR adds a second, customer-independent "base" context that is cached across customers.

## When to use

- You analyse sales channel context performance or cache hit rates.
- You need to know which session parameters create separate cache permutations of the context.
- You consider decorating context creation (and need to know what is `@internal`).

## Key steps / config

Two caching levels:

1. `CachedSalesChannelContextFactory` (extends `AbstractSalesChannelContextFactory`) — global cache of the full context; fast hits for guests. It bypasses the cache when the options contain `SalesChannelContextService::CUSTOMER_ID`, `BILLING_ADDRESS_ID` or `SHIPPING_ADDRESS_ID`:

```php
class CachedSalesChannelContextFactory extends AbstractSalesChannelContextFactory
{
    public function getDecorated(): AbstractSalesChannelContextFactory { /* ... */ }

    public function create(string $token, string $salesChannelId, array $options = []): SalesChannelContext
    {
        if (!$this->isCacheable($options)) {
            return $this->getDecorated()->create($token, $salesChannelId, $options);
        }
        // ...
    }
}
```

2. `Shopware\Core\System\SalesChannel\Context\BaseSalesChannelContextFactory` builds `Shopware\Core\System\SalesChannel\BaseSalesChannelContext`, holding only sales-channel or customer-independent data (context, sales channel, currency, current customer group, tax rules, payment and shipping method, shipping location, item/total cash rounding). `Shopware\Core\System\SalesChannel\Context\CachedBaseSalesChannelContextFactory` caches it. Its contract is `AbstractBaseSalesChannelContextFactory::create(string $salesChannelId, array $options = []): BaseSalesChannelContext`. The cache key is built from the `$salesChannelId` and these option keys only (after `ksort`):

```php
SalesChannelContextService::CURRENCY_ID, LANGUAGE_ID, DOMAIN_ID,
PAYMENT_METHOD_ID, SHIPPING_METHOD_ID, VERSION_ID,
COUNTRY_ID, COUNTRY_STATE_ID
```

The ADR describes these as the session parameters `shippingMethodId`, `paymentMethodId`, `countryId` (shipping country), `countryStateId` (shipping state), `currencyId`, `languageId`. Once a base context exists for a given payment/shipping method combination, all logged-in users share it.

## Essential identifiers

- `Shopware\Core\System\SalesChannel\Context\SalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\CachedSalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\BaseSalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\Context\CachedBaseSalesChannelContextFactory`
- `Shopware\Core\System\SalesChannel\BaseSalesChannelContext`
- `AbstractSalesChannelContextFactory` (`getDecorated`, `create`), `AbstractBaseSalesChannelContextFactory` (`create`)
- `SalesChannelContextService` option constants

## Gotchas

- `BaseSalesChannelContextFactory`, `BaseSalesChannelContext`, `CachedBaseSalesChannelContextFactory` and `AbstractBaseSalesChannelContextFactory` are `@internal`; interfering with base context loading quickly causes cache misses and is not supported. Use `SalesChannelContext` in extensions.
- `CachedBaseSalesChannelContextFactory` skips its cache when the options contain `SalesChannelContextService::ORIGINAL_CONTEXT` or `PERMISSIONS`.

## Version notes

- The ADR's `BaseSalesChannelContext` listing has a `fallbackCustomerGroup` property and `create()` returning `BaseContext`. In 6.7.15.1 the class uses constructor-promoted properties without a fallback customer group (adding `LanguageInfo` and `MeasurementUnits`), and `create()` returns `BaseSalesChannelContext`.
- The ADR hashes keys with `md5(json_encode(...))`; 6.7 uses `Hasher::hash()` and an `InvalidationRaceAwareCache` with tags.

## Code check (6.7.15.1)
- confirmed `AbstractSalesChannelContextFactory::getDecorated()` — abstract member subclasses must declare — vendor/shopware/core/System/SalesChannel/Context/AbstractSalesChannelContextFactory.php:11
- confirmed `AbstractSalesChannelContextFactory::create()` — abstract, takes token, salesChannelId, options — vendor/shopware/core/System/SalesChannel/Context/AbstractSalesChannelContextFactory.php:16
- confirmed `AbstractBaseSalesChannelContextFactory::create()` — returns BaseSalesChannelContext — vendor/shopware/core/System/SalesChannel/Context/AbstractBaseSalesChannelContextFactory.php:19
- confirmed `CachedSalesChannelContextFactory::isCacheable()` — customer/billing/shipping address ids bypass cache — vendor/shopware/core/System/SalesChannel/Context/CachedSalesChannelContextFactory.php:73
- confirmed `CachedBaseSalesChannelContextFactory` — @internal, key from currency, language, domain, payment, shipping, version, country, state — vendor/shopware/core/System/SalesChannel/Context/CachedBaseSalesChannelContextFactory.php:14
- corrected `CachedBaseSalesChannelContextFactory::create()` — docs: return type `BaseContext` — vendor/shopware/core/System/SalesChannel/Context/CachedBaseSalesChannelContextFactory.php:22
- corrected `Hasher::hash` — docs: `md5(json_encode($keys))` — vendor/shopware/core/System/SalesChannel/Context/CachedBaseSalesChannelContextFactory.php:46
- confirmed `BaseSalesChannelContextFactory` — marked @internal — vendor/shopware/core/System/SalesChannel/Context/BaseSalesChannelContextFactory.php:56
- corrected `BaseSalesChannelContext` — docs: has `fallbackCustomerGroup`; 6.7 constructor has none — vendor/shopware/core/System/SalesChannel/BaseSalesChannelContext.php:25
