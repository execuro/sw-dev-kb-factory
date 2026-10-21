---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2022-04-28-tax-providers.md
sourceHash: 6cd9f368931da9ccb3796c353529084c476f955e
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-04-28-tax-providers.html
title: Introducing tax providers
version: "6.7"
versions:
  - "6.7"
keywords: ["tax provider", "external tax calculation", "tax_provider", "AbstractTaxProvider", "TaxProviderResult", "TaxProviderProcessor", "TaxProviderRegistry", "shopware.tax.provider", "TaxProviderExceptions", "processUrl", "availabilityRuleId", "TaxJar", "AvaTax", "us sales tax", "adr"]
summary: "ADR: tax providers overwrite cart taxes; in 6.7 extend AbstractTaxProvider (tag shopware.tax.provider) and return TaxProviderResult."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-04-28) that adds *tax providers*: a hook that runs after the cart is calculated and can overwrite its taxes with rates from an external service such as `TaxJar`, `Vertex` or `AvaTax`. It targets markets like the USA, where the rate depends on the state and county the order ships to.

## When to use

You need tax rates the built-in tax rules cannot express, for example rates that depend on the address. Or you are writing a plugin or app that calls an external tax service.

## Key steps / config

1. **Register a `tax_provider` entity row** with the fields `id`, `identifier` (required), `active`, `name` (translated), `priority` (required), `availabilityRuleId`, `processUrl`, `appId` and `customFields` (translated).
2. **Plugin provider**: extend `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider`. Subclasses are autoconfigured with the tag `shopware.tax.provider`. `TaxProviderRegistry` keys providers by their class name, so the entity's `identifier` must be the provider's FQCN.

```php
class MyTaxProvider extends AbstractTaxProvider
{
    public function provide(Cart $cart, SalesChannelContext $context): TaxProviderResult
    {
        return new TaxProviderResult($lineItemTaxes, $deliveryTaxes, $cartPriceTaxes);
    }
}
```

3. **App provider**: set `processUrl` and `appId` on the entity instead. `TaxProviderProcessor` sends a `TaxProviderPayload` to that URL, but only if the app has been granted the tax permission.
4. **Result**: `TaxProviderResult` holds `?array $lineItemTaxes` (keyed by line item id), `?array $deliveryTaxes` (keyed by delivery id) and `?CalculatedTaxCollection $cartPriceTaxes`. If `declaresTaxes()` is true, no further provider is called, and `TaxAdjustment` overwrites the cart's taxes.

`TaxProviderProcessor::process()` skips tax-free contexts. It loads providers that are `active` and whose `availabilityRuleId` is null or matches the context's rules, and calls them in order of `priority`, highest first.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider::provide()`
- `Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`
- `Shopware\Core\Checkout\Cart\TaxProvider\TaxProviderProcessor`, `TaxProviderRegistry`
- Service tag `shopware.tax.provider`, entity `tax_provider`
- `Shopware\Core\Checkout\Cart\Exception\TaxProviderExceptions`

## Gotchas

- The ADR's `TaxProviderInterface::provideTax()`, `TaxProviderStruct` and `TaxProviderHook` do not exist. App providers are called over HTTP through `processUrl`.
- The ADR places the processor in `CartRuleLoader`, limited to logged-in customers. In the code it runs from `CartOrderRoute` when an order is placed, and from `CartLoadRoute` only when the request sets `taxed`. There is no logged-in check.
- Rules are not re-validated after taxes are overwritten.
- There is no `TaxProviderOutOfScopeException`/`TaxProviderNotAvailableException`. Any `\Throwable`, or an identifier with no service, is collected into `TaxProviderExceptions` and the next provider is tried. If anything was collected, the processor throws `TaxProviderExceptions` after the loop.
- The ADR's `providerIdentifier` is the field `identifier`, and `priority` is required with no default.

## Code check (6.7.15.1)
- absent `TaxProviderInterface` — replaced by `AbstractTaxProvider` in the installed code
- confirmed `AbstractTaxProvider::provide()` — returns `TaxProviderResult` — vendor/shopware/core/Checkout/Cart/TaxProvider/AbstractTaxProvider.php:13
- absent `TaxProviderStruct` — result struct is `TaxProviderResult`
- confirmed `TaxProviderResult::declaresTaxes()` — stops provider iteration when taxes are set — vendor/shopware/core/Checkout/Cart/TaxProvider/Struct/TaxProviderResult.php:47
- absent `TaxProviderHook` — apps are called via `processUrl` instead
- absent `TaxProviderOutOfScopeException` — all throwables collected into `TaxProviderExceptions`
- confirmed `shopware.tax.provider` — tagged iterator for the registry — vendor/shopware/core/Checkout/DependencyInjection/cart.php:374
- corrected `TaxProviderProcessor::process()` — docs: called in `CartRuleLoader` for logged-in customers; no such check, called from cart routes — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderProcessor.php:45
- corrected `identifier` — docs: field `providerIdentifier`, priority default 1 — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:64
- absent `TaxProviderNotAvailableException` — no such exception in the installed code
