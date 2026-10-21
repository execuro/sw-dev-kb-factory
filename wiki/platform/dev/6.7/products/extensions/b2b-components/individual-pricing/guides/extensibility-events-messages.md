---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.md
sourceHash: df6a31683c7bffdf508891d1c7d2ba14fae6729f
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.html
title: Extensibility - Events, Messages, and Extensions
version: "6.7"
versions: ["6.7"]
keywords: ["IndividualPricingApplyExtension", "individual_pricing.apply", "IndividualPricingIndexerEvent", "IndividualPricingLookupCriteriaEvent", "IndividualPricingLookupBatchCriteriaEvent", "IndividualPricingCacheEntryUpdaterMessage", "IndividualPricingBuildCacheSingleRuleMessage", "EntityIndexingMessage", "extension point", "b2b individual pricing", "customer specific prices", "pricing cache indexing"]
summary: B2B Individual Pricing extension points - the individual_pricing.apply extension, lookup criteria/indexer events and cache indexing messages.
lastBuilt: 2026-10-21
---
## What it is

The extensibility surface of the B2B Individual Pricing component (Shopware Commercial): one Extension API hook (`IndividualPricingApplyExtension`), three events for indexing and pricing lookup, and two asynchronous indexing messages on the message bus.

## When to use

- Add logging, validation, side effects or product data when individual pricing is applied to a product.
- Add filters, sorting, limits or associations to the criteria used to look up computed pricing for one or many products.
- Invalidate your own caches or sync external pricing systems when pricing rules are indexed or changed.

## Key steps / config

**Extension** — `Shopware\Commercial\B2B\IndividualPricing\Extension\IndividualPricingApplyExtension`, extension name `individual_pricing.apply`. Public properties: `product` (`ProductEntity`), `individualPricing` (`IndividualPricingComputedCacheEntity`), `context` (`SalesChannelContext`).

The core Extension API dispatches every extension under derived event names (`<name>.pre`, `<name>.post`, `<name>.error`), exposed as static helpers on the base class. Subscribe through those helpers:

```php
public static function getSubscribedEvents(): array
{
    return [IndividualPricingApplyExtension::onPost() => 'onPricingApply'];
}

public function onPricingApply(IndividualPricingApplyExtension $extension): void
{
    $productNumber = $extension->product->getProductNumber();
    $ruleId = $extension->individualPricing->getIndividualPricingId();
    $customerId = $extension->context->getCustomer()?->getId();
}
```

**Events** (namespace `Shopware\Commercial\B2B\IndividualPricing\Event\`):

| Event | Dispatched | Properties |
|---|---|---|
| `IndividualPricingIndexerEvent` | when pricing rules need indexing | `ids`, `context`, `skip` |
| `IndividualPricingLookupCriteriaEvent` | before the cache query for a single product | `criteria` (mutable `Criteria`), `productId`, `audience` (`AudienceContext`), `applicableRuleIds`, `context` |
| `IndividualPricingLookupBatchCriteriaEvent` | before the cache query for a product batch | `criteria`, `productIds`, `audience`, `applicableRuleIds`, `context` |

**Messages** (namespace `Shopware\Commercial\B2B\IndividualPricing\Domain\Indexer\`):

- `IndividualPricingCacheEntryUpdaterMessage` — rule create/update/delete; extends core `EntityIndexingMessage`, so it carries `data`, `offset`, `context`, `skip`, `forceQueue`, `isFullIndexing`.
- `IndividualPricingBuildCacheSingleRuleMessage` — indexing a single pricing rule; carries `productIds`, `ruleId`, `context`.

## Essential identifiers

- `Shopware\Commercial\B2B\IndividualPricing\Extension\IndividualPricingApplyExtension` / `individual_pricing.apply`
- `IndividualPricingApplyExtension::onPre()`, `::onPost()`, `::onError()`
- `Shopware\Commercial\B2B\IndividualPricing\Event\IndividualPricingIndexerEvent`
- `Shopware\Commercial\B2B\IndividualPricing\Event\IndividualPricingLookupCriteriaEvent`
- `Shopware\Commercial\B2B\IndividualPricing\Event\IndividualPricingLookupBatchCriteriaEvent`
- `Shopware\Commercial\B2B\IndividualPricing\Domain\Indexer\IndividualPricingCacheEntryUpdaterMessage`
- `Shopware\Commercial\B2B\IndividualPricing\Domain\Indexer\IndividualPricingBuildCacheSingleRuleMessage`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage`

## Gotchas

- The source example subscribes with `IndividualPricingApplyExtension::NAME => 'onPricingApply'`. The core `ExtensionDispatcher::publish()` never dispatches the bare name, only `NAME.pre`, `NAME.post` and `NAME.error`. A listener keyed on the bare name does not fire if the commercial code dispatches through `ExtensionDispatcher`. Use `onPre()` to act before pricing is applied (you can set `result` and call `stopPropagation()`), and `onPost()` to act after it.
- On `EntityIndexingMessage`, `skip` is read through `getSkip()`, `forceQueue` through `forceQueue()`, and `isFullIndexing` is a public property.
- The B2B commercial classes are not part of the core packages, so their signatures could not be checked against the installed code.

## Code check (6.7.15.1)
- corrected `ExtensionDispatcher::pre()` — docs: subscribe to `IndividualPricingApplyExtension::NAME`; core dispatches `<name>.pre`/`.post`/`.error` only — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:55
- confirmed `Extension::onPre()` — static helper returning the pre event name from the subclass `NAME` — vendor/shopware/core/Framework/Extensions/Extension.php:38
- confirmed `Extension::onPost()` — post event name after the operation produced a result — vendor/shopware/core/Framework/Extensions/Extension.php:47
- confirmed `EntityIndexingMessage` — core base of the cache entry updater message — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:12
- confirmed `EntityIndexingMessage::$isFullIndexing` — public constructor-promoted bool, next to `forceQueue` — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:32
- confirmed `EntityIndexingMessage::getSkip()` — skip list accessor — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:82
- confirmed `ProductEntity::getProductNumber()` — used by the logging example — vendor/shopware/core/Content/Product/ProductEntity.php:985
- confirmed `SalesChannelContext::getCustomer()` — nullable customer, hence `?->` in the example — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:132
- confirmed `Criteria` — mutable criteria type passed by the lookup events — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- unverified `IndividualPricingApplyExtension` — Shopware Commercial B2B class, not in the core/storefront/administration packages
