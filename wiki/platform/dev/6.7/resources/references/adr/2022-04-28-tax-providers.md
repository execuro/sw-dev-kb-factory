---
id: platform/dev/6.7/resources/references/adr/2022-04-28-tax-providers.md
title: Introducing tax providers
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-04-28-tax-providers.html
sourceHash: 6cd9f368931da9ccb3796c353529084c476f955e
codeCheckedAgainst: "6.7.13.0"
keywords: ["tax provider", "tax_provider", "AbstractTaxProvider", "TaxProviderProcessor", "TaxProviderResult", "TaxProviderRegistry", "shopware.tax.provider", "TaxProviderDefinition", "availabilityRuleId", "external tax calculation", "us sales tax", "adr"]
summary: "ADR: tax_provider entity plus AbstractTaxProvider services (tag shopware.tax.provider) let external services overwrite cart taxes after calculation."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-04-28, area checkout) introducing *tax providers*: a hook that runs after the cart is calculated and may overwrite line item, delivery and total taxes. Motivation: countries such as the USA have state/county-specific rates, served by external services like `TaxJar`, `Vertex` or `AvaTax`.

## When to use

When a shop needs taxes computed by an external service or custom logic instead of Shopware's static tax rates, or when debugging why cart taxes differ from the configured tax rules.

## Key steps / config

Described as implemented in the installed code (the ADR's proposed names differ, see Gotchas):

1. A `tax_provider` entity (`TaxProviderDefinition`) registers providers. Fields: `id`, `identifier` (required), `active`, `name` (translated), `priority` (required int), `processUrl` (app providers), `availabilityRuleId`, `appId`, `customFields` (translated). Defaults: `active` true.
2. Implement a service extending `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider`. It is autoconfigured with the tag `shopware.tax.provider`. The entity's `identifier` must be the provider's class name — `TaxProviderRegistry` keys services by `$provider::class`.

```php
class MyTaxProvider extends AbstractTaxProvider
{
    public function provide(Cart $cart, SalesChannelContext $context): TaxProviderResult
    {
        return new TaxProviderResult($lineItemTaxes, $deliveryTaxes, $cartPriceTaxes);
    }
}
```

3. `TaxProviderResult` (`Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`) holds `?array $lineItemTaxes` (key: line item id), `?array $deliveryTaxes` (key: delivery id) and `?CalculatedTaxCollection $cartPriceTaxes`.
4. `TaxProviderProcessor::process()` loads active providers whose `availabilityRuleId` is null or matches the context rule ids, sorts them by priority, and calls each one. App providers (with `app` and `processUrl`) are called via an HTTP request instead of a PHP service.
5. The first result where `declaresTaxes()` is true stops the loop; its taxes are applied via `TaxAdjustment`.

## Essential identifiers

- `tax_provider` / `TaxProviderDefinition`
- `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider::provide()`
- `Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`
- `TaxProviderProcessor`, `TaxProviderRegistry`
- service tag `shopware.tax.provider`

## Gotchas

- The ADR names `TaxProviderInterface::provideTax()`, `TaxProviderStruct`, `TaxProviderHook`, `TaxProviderNotAvailableException`, `TaxProviderOutOfScopeException` and a `providerIdentifier` field; none exist in the installed code.
- The ADR says the processor runs in `CartRuleLoader`. In code it is invoked from `CartOrderRoute` when placing an order and from `CartLoadRoute` only when the request passes `taxed`.
- Provider exceptions (including a missing provider for an identifier) are collected; if any occurred, the processor logs and throws them after the loop. Since taxes are applied after full cart calculation, rules depending on changed taxes are not re-validated.
- Tax-free contexts (`CartPrice::TAX_STATE_FREE`) skip tax providers entirely.

## Version notes

`TaxProviderDefinition::since()` returns `6.5.0.0`.

## Code check (6.7.13.0)
- corrected `AbstractTaxProvider` — docs: TaxProviderInterface with provideTax() — vendor/shopware/core/Checkout/Cart/TaxProvider/AbstractTaxProvider.php:11
- confirmed `AbstractTaxProvider::provide()` — abstract method returning TaxProviderResult — vendor/shopware/core/Checkout/Cart/TaxProvider/AbstractTaxProvider.php:13
- corrected `TaxProviderResult` — docs: TaxProviderStruct — vendor/shopware/core/Checkout/Cart/TaxProvider/Struct/TaxProviderResult.php:13
- confirmed `shopware.tax.provider` — autoconfigured tag for AbstractTaxProvider — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:146
- corrected `identifier` — docs: providerIdentifier; registry keys by class name — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:61
- confirmed `priority` — required IntField; no default in getDefaults() — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:65
- confirmed `tax_provider` — entity name — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:27
- corrected `TaxProviderProcessor` — docs: called in CartRuleLoader; code calls it from CartOrderRoute and CartLoadRoute — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderProcessor.php:26
- absent `TaxProviderHook` — not found in installed code; app providers use processUrl requests instead
- absent `TaxProviderOutOfScopeException` — not found in installed code; all Throwables are collected
