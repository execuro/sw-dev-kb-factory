---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/tax-provider.md
title: Tax Provider
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/tax-provider.html
sourceHash: 36018b65dbcd514cc1b3351d3c0f1b8468a64dfd
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractTaxProvider", "TaxProviderResult", "shopware.tax.provider", "tax_provider", "tax_provider.repository", "TaxProviderDefinition", "CalculatedTaxCollection", "CalculatedTax", "TaxProviderRegistry", "tax provider", "sales tax", "custom tax calculation", "third-party tax service"]
summary: Plugin tax providers - extend AbstractTaxProvider, tag it shopware.tax.provider, and persist a tax_provider row whose identifier is the class name.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md"]
---
## What it is

Since Shopware 6.5.0.0, plugins can supply custom tax calculations (e.g. calling an external tax service such as for US sales tax). A plugin provides a class extending `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider`, which is called during checkout to provide new tax rates.

## When to use

When tax rates depend on rules too complex for static tax rules (state, county or city level) and a third-party tax provider should compute taxes for line items, deliveries or the cart total.

## Key steps / config

1. Extend `AbstractTaxProvider` and implement its only abstract method `provide`, returning a `Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`:

```php
class TaxProvider extends AbstractTaxProvider
{
    public function provide(Cart $cart, SalesChannelContext $context): TaxProviderResult
    {
        // key: $lineItem->getUniqueIdentifier() => new CalculatedTaxCollection([new CalculatedTax($tax, $taxRate, $price)])
        return new TaxProviderResult($lineItemTaxes /*, $deliveryTaxes, $cartPriceTaxes */);
    }
}
```

   `TaxProviderResult` takes three optional arguments: `lineItemTaxes` (keyed by line item unique identifier, also for nested line items), `deliveryTaxes` (keyed by delivery id) and `cartPriceTaxes` (a `CalculatedTaxCollection` with totals; if omitted, Shopware calculates the sums itself).

2. Register the service with the tag `shopware.tax.provider` in `services.php`:

```php
$services->set(TaxProvider::class)->tag('shopware.tax.provider');
```

   With autoconfiguration enabled, subclasses of `AbstractTaxProvider` receive this tag automatically.

3. Persist the provider in the `tax_provider` table, via a migration (`MigrationStep` with `getCreationTimestamp()` and `update()`, inserting into `TaxProviderDefinition::ENTITY_NAME`) or via `tax_provider.repository` in the plugin's `install` lifecycle method. Required data:

```php
[
    'id' => ..., 'identifier' => TaxProvider::class,
    'priority' => 1, 'active' => false,
    'availabilityRuleId' => $ruleId, // column availability_rule_id
]
```

4. Manage active state, priority and availability rule in the Administration under `Settings > Tax`.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider::provide(Cart $cart, SalesChannelContext $context): TaxProviderResult`
- `Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`
- `Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTaxCollection`, `CalculatedTax`
- DI tag `shopware.tax.provider`
- `Shopware\Core\System\TaxProvider\TaxProviderDefinition` (entity `tax_provider`), `tax_provider.repository`
- `Shopware\Core\Checkout\Cart\TaxProvider\TaxProviderRegistry`

## Gotchas

- The `identifier` stored in the database must be the fully-qualified class name: `TaxProviderRegistry` keys registered providers by `$provider::class`.
- `identifier` and `priority` are required fields on the `tax_provider` entity.
- Do not rely on specific rules (e.g. "Always valid (Default)") always being present; the source suggests creating your own availability rule on install.
- Add an `uninstall` method removing your providers, and optionally `activate`/`deactivate` to toggle them.
- `TaxProviderResult` is marked `@internal` in 6.7.13.0, although plugins must instantiate it as the return type of `provide`.

## Code check (6.7.13.0)
- confirmed `AbstractTaxProvider::provide()` — sole abstract member — vendor/shopware/core/Checkout/Cart/TaxProvider/AbstractTaxProvider.php:13
- confirmed `TaxProviderResult` — ctor args lineItemTaxes, deliveryTaxes, cartPriceTaxes, all nullable; class docblock `@internal` — vendor/shopware/core/Checkout/Cart/TaxProvider/Struct/TaxProviderResult.php:13
- confirmed `shopware.tax.provider` — tagged iterator for TaxProviderRegistry — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:206
- confirmed `shopware.tax.provider` — autoconfigured for AbstractTaxProvider subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:146
- confirmed `TaxProviderRegistry::__construct()` — identifier is `$provider::class` — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderRegistry.php:20
- confirmed `TaxProviderDefinition::ENTITY_NAME` — value `tax_provider` — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:27
- confirmed `identifier` — StringField, Required — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:61
- confirmed `priority` — IntField, Required — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:65
- confirmed `availabilityRuleId` — FkField on availability_rule_id — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:67
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, with `update()` at line 33 — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
