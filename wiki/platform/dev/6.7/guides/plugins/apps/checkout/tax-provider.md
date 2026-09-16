---
id: platform/dev/6.7/guides/plugins/apps/checkout/tax-provider.md
title: Tax Provider
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/tax-provider.html
sourceHash: b172acf6aa247a1a7811d269363da4434fd8ada7
codeCheckedAgainst: "6.7.13.0"
keywords: ["tax-provider", "process-url", "TaxProviderProcessor", "TaxProviderResponse", "lineItemTaxes", "deliveryTaxes", "cartPriceTaxes", "sales tax", "tax calculation", "app tax", "steuer", "TaxProviderResponseBuilder"]
summary: "App tax providers: manifest tax-provider (process-url, priority); checkout POSTs the cart, app returns lineItemTaxes/deliveryTaxes/cartPriceTaxes."
lastBuilt: 2026-09-15
---
## What it is

Since 6.5.0.0 an app can replace cart tax calculation (e.g. US sales tax via a third-party provider) by exposing a signed JSON endpoint that Shopware calls during checkout to obtain tax rates for line items, deliveries or the whole cart.

## When to use

Taxes depend on rules too complex for static tax rates (state/county/city sales tax) and should come from an external tax service. Requires familiarity with app registration and request/response signing; the app server must be reachable from Shopware.

## Key steps / config

1. Declare one or more `tax-provider` entries inside a `tax` element in `manifest.xml`; all four children are required:
   ```xml
   <tax>
       <tax-provider>
           <identifier>...</identifier>
           <name>...</name>
           <priority>...</priority>
           <process-url>...</process-url>
       </tax-provider>
   </tax>
   ```
2. After installation the provider appears in the Administration under `Settings > Tax` and is used at checkout.
3. During cart processing, active tax providers whose availability rule matches (or that have none) are sorted by `priority`, highest first. For an app provider, Shopware POSTs to its process URL:
   ```json
   { "source": { "url": "...", "shopId": "...", "appVersion": "..." },
     "cart": { }, "salesChannelContext": { } }
   ```
4. Respond with any combination of optional keys, each tax entry `{"tax": .., "taxRate": .., "price": ..}`:
   ```json
   { "lineItemTaxes": { "<lineItem uniqueIdentifier>": [ {"tax":19,"taxRate":23,"price":19} ] },
     "deliveryTaxes": { "<delivery position identifier>": [ { } ] },
     "cartPriceTaxes": [ { } ] }
   ```
5. If `cartPriceTaxes` is given, Shopware uses those tax sums instead of recalculating them.

App PHP SDK (outside core): `ContextResolver::assembleTaxProvider()`, `TaxProviderResponseBuilder` with `addLineItemTax()`, `addDeliveryTax()`, `addCartTax()`, `build()`; Symfony bundle action `Shopware\App\SDK\Context\TaxProvider\TaxProviderAction`.

## Essential identifiers

- Manifest: `<tax>`, `<tax-provider>`, `<identifier>`, `<name>`, `<priority>`, `<process-url>`
- Response keys: `lineItemTaxes`, `deliveryTaxes`, `cartPriceTaxes`
- Core: `Shopware\Core\Checkout\Cart\TaxProvider\TaxProviderProcessor`, `Shopware\Core\Framework\App\TaxProvider\Payload\TaxProviderPayloadService`, `Shopware\Core\Framework\App\TaxProvider\Response\TaxProviderResponse`

## Gotchas

- The docs say providers are tried one-by-one until one returns taxes. In 6.7.13.0 core returns the result of the **first** app provider (by priority) immediately; if its request fails or yields nothing, later providers are not asked and no taxes are adjusted.
- HTTP/JSON errors from the app endpoint go through the exception logger and the request yields no result.
- The docs warn Shopware waits only 5 seconds for a response; respond quickly.
- Tax providers are skipped entirely when the context tax state is tax-free.

## Code check (6.7.13.0)
- confirmed `tax-provider` — identifier, name, priority, process-url — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:607
- confirmed `TaxProvider::REQUIRED_FIELDS` — all four fields required — vendor/shopware/core/Framework/App/Manifest/Xml/Tax/TaxProvider.php:15
- confirmed `TaxProviderCollection::sortByPriority()` — providers sorted before processing — vendor/shopware/core/System/TaxProvider/TaxProviderCollection.php:19
- corrected `TaxProviderProcessor::handleAppRequest()` — docs: providers tried one-by-one; first app provider result is returned directly — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderProcessor.php:109
- confirmed `TaxProviderProcessor::process()` — skipped for tax-free state — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderProcessor.php:42
- confirmed `TaxProviderResponse::$lineItemTaxes` — response key parsed with deliveryTaxes, cartPriceTaxes — vendor/shopware/core/Framework/App/TaxProvider/Response/TaxProviderResponse.php:20
- confirmed `TaxProviderPayloadService::request()` — errors logged, returns null — vendor/shopware/core/Framework/App/TaxProvider/Payload/TaxProviderPayloadService.php:31
- unverified `5 seconds` — no explicit timeout set in TaxProviderPayloadService; HTTP client config not checked
- unverified `TaxProviderResponseBuilder` — App PHP SDK, outside installed core roots
