---
id: platform/dev/6.6/guides/plugins/apps/tax-provider.md
title: Tax provider
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/tax-provider.html
sourceHash: 28a2a9edbdaeca391e03fd6baa67ba8be87052c5
keywords: ["tax provider", "tax-provider", "processUrl", "manifest.xml", "lineItemTaxes", "deliveryTaxes", "cartPriceTaxes", "TaxProviderResponseBuilder", "TaxProviderAction", "CalculatedTax", "Settings > Tax", "6.5.0.0"]
summary: "Apps can register custom tax calculation providers via manifest.xml, called during checkout to override cart/line-item/delivery taxes."
lastBuilt: "2026-09-15"
---
## What it is
Since Shopware `6.5.0.0`, apps can integrate custom tax calculations by providing an endpoint Shopware calls during checkout to supply tax rates, e.g. via a third-party tax provider service.

## When to use
Use for country/state-specific tax logic (particularly complex in the US) that the core tax rules can't express, delegated to an external tax provider.

## Key steps / config
Declare via `<<< @/docs/snippets/config/app/tax.xml`, defining one or more `tax-provider` entries inside a `tax` parent element. After installation the provider appears under Settings > Tax and is used automatically during checkout.

Shopware calls `processUrl` for active providers, sorted by priority, until one succeeds:

```json
{
  "source": { "url": "...", "shopId": "...", "appVersion": "..." },
  "cart": { },
  "salesChannelContext": { }
}
```

Response may override per line item, per delivery, or the whole cart:

```json
{
  "lineItemTaxes": { "unique-identifier-of-lineitem": [{"tax":19,"taxRate":23,"price":19}] },
  "deliveryTaxes": { "unique-identifier-of-delivery-position": [{"tax":19,"taxRate":23,"price":19}] },
  "cartPriceTaxes": [{"tax":19,"taxRate":23,"price":19}]
}
```

App PHP SDK usage: `ContextResolver::assembleTaxProvider()` yields a `TaxProviderAction`; build the response with `TaxProviderResponseBuilder`, calling `addLineItemTax()`, `addDeliveryTax()`, `addCartTax()` with `CalculatedTax` instances, then `$signer->signResponse($builder->build(), $shop)`.

## Essential identifiers
- `tax-provider`, `processUrl` (manifest / endpoint)
- `TaxProviderAction`, `TaxProviderResponseBuilder`, `CalculatedTax`
- `ContextResolver::assembleTaxProvider()`
- `lineItemTaxes`, `deliveryTaxes`, `cartPriceTaxes`

## Gotchas
The Shopware shop waits only 5 seconds for a tax provider response; a slow app times out and the connection is dropped. If `cartPriceTaxes` is given, Shopware does not recalculate the tax sums itself and uses the provider's values directly.

## Version notes
Tax provider apps require Shopware 6.5.0.0 or later.
