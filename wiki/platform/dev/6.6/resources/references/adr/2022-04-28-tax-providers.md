---
id: "platform/dev/6.6/resources/references/adr/2022-04-28-tax-providers.md"
title: "Introducing tax providers"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-04-28-tax-providers.html"
sourceHash: "6cd9f368931da9ccb3796c353529084c476f955e"
keywords: ["TaxProviderProcessor", "TaxProviderInterface", "TaxProviderStruct", "TaxProviderHook", "TaxProviderNotAvailableException", "TaxProviderOutOfScopeException", "tax_provider", "shopware.tax.provider", "tax provider", "CartRuleLoader", "tax rate", "checkout tax"]
summary: "ADR: tax providers overwrite cart taxes via TaxProviderInterface, tagged shopware.tax.provider, called after cart calculation in CartRuleLoader."
lastBuilt: "2026-09-15"
---
## What it is
ADR introducing tax providers, a mechanism to override tax calculation after the cart is calculated, for regions with complex tax rates (e.g. US states/counties) via external providers like TaxJar, Vertex, or AvaTax.

## When to use
When checkout needs to override calculated cart taxes with rates supplied by an external tax provider for a logged-in customer whose availability rule matches.

## Key steps / config
- New entity `tax_provider` registers providers with fields: IdField `id`, TranslatedField `name`, IntField `priority` (default 1), FkField `availabilityRuleId`, StringField `providerIdentifier` (unique), TranslatedField `customFields`.
- `TaxProviderProcessor` runs inside `CartRuleLoader`, after the whole cart (promotions, deliveries) is calculated; rule re-validation does not happen afterwards.
- A tax provider is called only if a customer is logged in and its availability rule matches; higher `priority` is called first.
- The processor calls the class tagged `shopware.tax.provider`, named by `providerIdentifier`, implementing `TaxProviderInterface`. If the class does not exist, `TaxProviderHook` is thrown instead so app scripting can fill the response.

```php
interface TaxProviderInterface
{
    public function provideTax(Cart $cart, SalesChannelContext $context): TaxProviderStruct;
}
```

```php
class TaxProviderStruct extends Struct
{
    protected ?array $lineItemTaxes = null;
    protected ?array $deliveryTaxes = null;
    protected ?CalculatedTaxCollection $cartPriceTaxes = null;
}
```

## Essential identifiers
`TaxProviderProcessor`, `TaxProviderInterface`, `TaxProviderStruct`, `TaxProviderHook`, `TaxProviderNotAvailableException`, `TaxProviderOutOfScopeException`, `tax_provider` entity, `shopware.tax.provider` tag, `CartRuleLoader`.

## Gotchas
If `TaxProviderNotAvailableException` is thrown or no field on `TaxProviderStruct` is filled, the next provider by priority is tried. Any other exception (e.g. connection issues) also moves to the next provider; if none succeed, the first exception is thrown to avoid invalid taxes. Once any `TaxProviderStruct` value is filled, no further providers are called.
