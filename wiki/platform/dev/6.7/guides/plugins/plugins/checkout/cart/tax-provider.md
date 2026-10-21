---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/tax-provider.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md
sourceHash: 36018b65dbcd514cc1b3351d3c0f1b8468a64dfd
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/tax-provider.html
title: Tax Provider
version: "6.7"
versions:
  - "6.7"
keywords: ["AbstractTaxProvider", "TaxProviderResult", "shopware.tax.provider", "tax_provider", "TaxProviderDefinition", "CalculatedTaxCollection", "CalculatedTax", "TaxProviderRegistry", "tax provider", "sales tax", "custom tax calculation", "taxjar", "tax_provider.repository"]
summary: Plugin tax provider extending AbstractTaxProvider, tagged shopware.tax.provider, persisted as a tax_provider row whose identifier is the class name.
lastBuilt: 2026-10-21
---
## What it is

Since Shopware 6.5.0.0, plugins can replace the cart's tax calculation with their own logic, typically a call to a third-party tax service (e.g. for US sales tax). A plugin provides a class extending `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider`, which is called during checkout and returns new tax rates.

## When to use

When tax rates cannot be expressed with Shopware's static tax rules — per state/county/city rates, or any case where an external tax provider should compute line-item, delivery or cart-total taxes.

## Key steps / config

1. Create the provider class and implement `provide()`:

```php
use Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider;
use Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult;

class TaxProvider extends AbstractTaxProvider
{
    public function provide(Cart $cart, SalesChannelContext $context): TaxProviderResult
    {
        // key: $lineItem->getUniqueIdentifier() => new CalculatedTaxCollection([new CalculatedTax($tax, $rate, $price)])
        return new TaxProviderResult($lineItemTaxes /*, $deliveryTaxes, $cartPriceTaxes */);
    }
}
```

   `TaxProviderResult` takes three optional arguments: `lineItemTaxes` (array keyed by line-item unique identifier → `CalculatedTaxCollection`), `deliveryTaxes` (array keyed by delivery id → `CalculatedTaxCollection`), `cartPriceTaxes` (a single `CalculatedTaxCollection`). If cart price taxes are omitted, Shopware calculates the tax sums itself.

2. Register the class as a service tagged `shopware.tax.provider` in `src/Resources/config/services.php`:

```php
$services->set(TaxProvider::class)->tag('shopware.tax.provider');
```

   With autoconfiguration enabled, subclasses of `AbstractTaxProvider` receive this tag automatically.

3. Persist the provider in the `tax_provider` table (`TaxProviderDefinition::ENTITY_NAME`), either in a `MigrationStep` (`getCreationTimestamp()`, `update()`) via `$connection->insert(...)`, or in the plugin's `install` lifecycle method via `tax_provider.repository`. Row fields:

```php
[
    'id' => ..., 
    'identifier' => TaxProvider::class, // FQCN of your service class
    'active' => true,
    'priority' => 1,
    'availability_rule_id' => $ruleId, // availabilityRuleId via repository
]
```

4. The provider then appears in the Administration under `Settings > Tax`, where active state, priority and availability rule can be changed.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\TaxProvider\AbstractTaxProvider` — `provide(Cart $cart, SalesChannelContext $context): TaxProviderResult`
- `Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`
- `Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTax`, `CalculatedTaxCollection`
- `Shopware\Core\System\TaxProvider\TaxProviderDefinition` (entity `tax_provider`), `TaxProviderTranslationDefinition`
- Service tag `shopware.tax.provider`; repository `tax_provider.repository`

## Gotchas

- The `identifier` column must be the provider's class name: `TaxProviderRegistry` indexes tagged providers by `$provider::class`.
- `identifier` and `priority` are required fields; `availability_rule_id` decides when the provider applies. Do not rely on specific rules always being present — the source creates its own rule (e.g. `cart.cartAmount >= 0`) at install.
- Insert with `active => false` at install and toggle it in `activate`/`deactivate`; remove providers in `uninstall`.

## Version notes

- Available since 6.5.0.0 (`TaxProviderDefinition::since()` returns `6.5.0.0`).

## Code check (6.7.15.1)
- confirmed `AbstractTaxProvider::provide()` — sole abstract member, signature `(Cart, SalesChannelContext): TaxProviderResult` — vendor/shopware/core/Checkout/Cart/TaxProvider/AbstractTaxProvider.php:13
- confirmed `shopware.tax.provider` — tag collected by TaxProviderRegistry via tagged_iterator — vendor/shopware/core/Checkout/DependencyInjection/cart.php:374
- confirmed `shopware.tax.provider` — autoconfigured for AbstractTaxProvider subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:147
- confirmed `TaxProviderDefinition::ENTITY_NAME` — value `tax_provider` — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:30
- confirmed `TaxProviderDefinition::since()` — returns 6.5.0.0 — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:49
- confirmed `identifier` — required StringField — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:64
- confirmed `priority` — required IntField — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:68
- confirmed `availabilityRuleId` — FkField to RuleDefinition, column availability_rule_id — vendor/shopware/core/System/TaxProvider/TaxProviderDefinition.php:70
- corrected `TaxProviderResult::$cartPriceTaxes` — docs: sketched as an array; code types it ?CalculatedTaxCollection — vendor/shopware/core/Checkout/Cart/TaxProvider/Struct/TaxProviderResult.php:22
- confirmed `TaxProviderRegistry` — keys providers by `$provider::class`, matched against identifier — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderRegistry.php:8
