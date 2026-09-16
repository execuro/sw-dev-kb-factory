---
id: platform/dev/6.7/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.md
title: Extensibility - Events, Messages, and Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/individual-pricing/guides/extensibility-events-messages.html
sourceHash: df6a31683c7bffdf508891d1c7d2ba14fae6729f
codeCheckedAgainst: "6.7.13.0"
keywords: ["IndividualPricingApplyExtension", "individual_pricing.apply", "IndividualPricingIndexerEvent", "IndividualPricingLookupCriteriaEvent", "IndividualPricingLookupBatchCriteriaEvent", "IndividualPricingCacheEntryUpdaterMessage", "IndividualPricingBuildCacheSingleRuleMessage", "EntityIndexingMessage", "extension api", "individual pricing events", "b2b pricing subscriber", "pricing cache messages"]
summary: "Individual Pricing extension points: IndividualPricingApplyExtension, lookup/indexer events and cache indexing messages, with namespaces and properties."
lastBuilt: 2026-09-15
---
## What it is

Reference of the extension points of the B2B Commercial component Individual Pricing: one Extension API hook (`IndividualPricingApplyExtension`), three events, and two asynchronous indexing messages, with their namespaces and properties.

## When to use

When a plugin must log, validate, or alter individual prices as they are applied, add filters to the pricing cache lookup, react to pricing indexing, or hook into cache rebuild messages.

## Key steps / config

Extension — `Shopware\Commercial\B2B\IndividualPricing\Extension\IndividualPricingApplyExtension`, name `individual_pricing.apply`. Properties: `product` (ProductEntity), `individualPricing` (IndividualPricingComputedCacheEntity), `context` (SalesChannelContext). Use for auditing, validation before application, triggering external systems, adding custom data to products.

In the installed core, extensions are published as `<NAME>.pre`, `<NAME>.post` and `<NAME>.error` events; subscribe through the static helpers inherited from `Shopware\Core\Framework\Extensions\Extension`:

```php
public static function getSubscribedEvents(): array
{
    return [IndividualPricingApplyExtension::onPost() => 'onPricingApply'];
}

public function onPricingApply(IndividualPricingApplyExtension $extension): void
{
    $productId = $extension->product->getId();
    $ruleId = $extension->individualPricing->getIndividualPricingId();
    $customerId = $extension->context->getCustomer()?->getId();
}
```

Use `onPre()` to validate or prevent (call `stopPropagation()`), `onPost()` to inspect the result.

Events (namespace `Shopware\Commercial\B2B\IndividualPricing\Event\`):

| Event | Dispatched | Properties |
|---|---|---|
| `IndividualPricingIndexerEvent` | when pricing rules need indexing | `ids`, `context`, `skip` |
| `IndividualPricingLookupCriteriaEvent` | before cache query for a single product | `criteria`, `productId`, `audience`, `applicableRuleIds`, `context` |
| `IndividualPricingLookupBatchCriteriaEvent` | before cache query for a product batch | `criteria`, `productIds`, `audience`, `applicableRuleIds`, `context` |

`criteria` is a mutable Criteria: add filters, sorting, limits, associations or aggregations.

Messages (namespace `Shopware\Commercial\B2B\IndividualPricing\Domain\Indexer\`):

- `IndividualPricingCacheEntryUpdaterMessage` — rule create/update/delete; inherits from core `EntityIndexingMessage` (`data`, `offset`, `context`, `skip`, `forceQueue`, `isFullIndexing`).
- `IndividualPricingBuildCacheSingleRuleMessage` — indexing a single rule; `productIds`, `ruleId`, `context`.

## Essential identifiers

- `Shopware\Commercial\B2B\IndividualPricing\Extension\IndividualPricingApplyExtension` / `individual_pricing.apply`
- `Shopware\Commercial\B2B\IndividualPricing\Event\IndividualPricingIndexerEvent`
- `Shopware\Commercial\B2B\IndividualPricing\Event\IndividualPricingLookupCriteriaEvent`
- `Shopware\Commercial\B2B\IndividualPricing\Event\IndividualPricingLookupBatchCriteriaEvent`
- `Shopware\Commercial\B2B\IndividualPricing\Domain\Indexer\IndividualPricingCacheEntryUpdaterMessage`
- `Shopware\Commercial\B2B\IndividualPricing\Domain\Indexer\IndividualPricingBuildCacheSingleRuleMessage`
- `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage`

## Gotchas

- The source example subscribes to `IndividualPricingApplyExtension::NAME` directly. Core's `ExtensionDispatcher::publish()` dispatches only the `.pre`/`.post`/`.error` suffixed names, so a listener on the bare name does not fire if the extension is published through it; use `onPre()`/`onPost()`.
- The Commercial plugin is not part of the checked code, so the B2B class names and properties above come from the docs only.

## Code check (6.7.13.0)
- corrected `ExtensionDispatcher::publish()` — docs: subscribe to `IndividualPricingApplyExtension::NAME`; core dispatches `NAME.pre`/`.post`/`.error` — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:55
- confirmed `Extension::onPost()` — static helper returning the post event name — vendor/shopware/core/Framework/Extensions/Extension.php:47
- confirmed `Extension::stopPropagation()` — short-circuits the extended operation in a pre listener — vendor/shopware/core/Framework/Extensions/Extension.php:98
- confirmed `EntityIndexingMessage` — base with `data`, `offset`, `context`, `forceQueue`, `isFullIndexing` — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:12
- confirmed `EntityIndexingMessage::getSkip()` — skip list inherited by the updater message — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:82
- confirmed `SalesChannelContext::getCustomer()` — used in the example — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:132
- unverified `IndividualPricingApplyExtension` — Shopware Commercial plugin, not in the checked vendor roots; out of scope
- unverified `IndividualPricingLookupCriteriaEvent` — Commercial plugin, out of scope
- unverified `IndividualPricingCacheEntryUpdaterMessage` — Commercial plugin, out of scope
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
