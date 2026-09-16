---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/tax-provider.md
title: Tax provider
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/tax-provider.html"
sourceHash: "1823b921c429c473c64b956995be0bd37991fcc3"
keywords: ["tax provider", "TaxProvider", "AbstractTaxProvider", "TaxProviderResult", "shopware.tax.provider", "sales tax", "tax calculation", "tax_provider.repository", "CalculatedTaxCollection", "provide method", "third-party tax service"]
summary: "Explains building a custom TaxProvider plugin class to calculate cart taxes and registering/activating it via DI and the tax_provider.repository."
lastBuilt: "2026-09-15"
---
## What it is
Documents how a plugin integrates a custom tax calculation (e.g. delegating to a third-party tax provider) since Shopware 6.5.0.0, by extending `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider`.

## When to use
Needed when a shop must apply non-standard, jurisdiction-specific tax calculation (common in the US) instead of Shopware's default tax logic, typically by calling an external tax service during checkout.

## Key steps / config
1. Create a class extending `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider` and implement `provide(Cart $cart, SalesChannelContext $context): TaxProviderResult`. Build a `$lineItemTaxes` array keyed by `$lineItem->getUniqueIdentifier()`, each value a `CalculatedTaxCollection` of `CalculatedTax` instances, and return a `TaxProviderResult`.
2. Register the class in `services.xml` and tag it `shopware.tax.provider`:
```xml
<service id="Swag\BasicExample\Checkout\Cart\Tax\TaxProvider">
    <tag name="shopware.tax.provider" />
</service>
```
3. Persist the tax provider to the database, either via a migration inserting into the `tax_provider` entity (`Shopware\Core\System\TaxProvider\TaxProviderDefinition`) with fields `id`, `identifier` (the provider's FQCN), `active`, `priority`, `availability_rule_id`, `created_at`; or via the entity repository `tax_provider.repository` in the plugin's `install` lifecycle method, creating an availability `rule.repository` entry first.
4. The result is visible and manageable in Administration under `Settings > Tax` (active state, priority, availability rule).

## Essential identifiers
- `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider` (base class, `provide` method)
- `Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`
- `Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTax` / `CalculatedTaxCollection`
- Service tag `shopware.tax.provider`
- `Shopware\Core\System\TaxProvider\TaxProviderDefinition` (entity `tax_provider`)
- Repository id `tax_provider.repository`

## Gotchas
Shopware looks for the `uniqueIdentifier` property of each line item to match tax entries, including nested line-item structures; keys in `$lineItemTaxes` must use that identifier. If `cartPriceTaxes` is omitted from the `TaxProviderResult`, Shopware calculates the tax sums itself.
