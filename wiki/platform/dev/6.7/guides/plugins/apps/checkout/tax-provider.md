---
id: platform/dev/6.7/guides/plugins/apps/checkout/tax-provider.md
title: Tax Provider
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/tax-provider.html
sourceHash: b172acf6aa247a1a7811d269363da4434fd8ada7
codeCheckedAgainst: "6.7.15.1"
keywords: ["tax-provider", "process-url", "processUrl", "lineItemTaxes", "deliveryTaxes", "cartPriceTaxes", "tax_processor", "TaxProviderResponseBuilder", "sales tax", "tax calculation", "app tax provider", "steuer"]
summary: App tax provider via manifest tax/tax-provider; checkout POSTs cart to process-url and reads lineItemTaxes, deliveryTaxes, cartPriceTaxes
lastBuilt: 2026-10-21
---
## What it is

Since 6.5.0.0, apps can supply custom tax calculations (e.g. via a third-party sales-tax service). The app declares one or more tax providers in `manifest.xml`; during checkout Shopware calls each provider's endpoint with the cart and uses the taxes it returns. Requests and responses are signed JSON.

## When to use

Tax rules depend on region (e.g. US state/county/city sales tax) and you want an external service, reached through your app backend, to compute the cart's taxes.

## Key steps / config

1. In `manifest.xml`, add a `<tax>` element containing one or more `<tax-provider>` entries. Each needs `<identifier>`, `<name>`, `<priority>` and `<process-url>`:

```xml
<tax>
    <tax-provider>
        <identifier>...</identifier>
        <name>...</name>
        <priority>1</priority>
        <process-url>https://...</process-url>
    </tax-provider>
</tax>
```

2. Install the app and grant its permissions. Declaring a tax provider adds the `tax_processor` capability permission to the app's requested permissions; Shopware only sends cart data to the app once this is granted. The provider then appears in the Administration under `Settings > Tax`.
3. At checkout, Shopware loads the active providers (optionally filtered by availability rule), sorts them by priority and POSTs to each process URL in turn until one returns taxes.
4. The request body carries `source` (`url`, `shopId`, `appVersion`), `cart` and `salesChannelContext`.
5. Respond with any of the optional keys; each tax entry has `tax`, `taxRate`, `price`:

```json
{
  "lineItemTaxes": { "<lineItem uniqueIdentifier>": [ {"tax": 0, "taxRate": 0, "price": 0} ] },
  "deliveryTaxes": { "<delivery position identifier>": [ { ... } ] },
  "cartPriceTaxes": [ { ... } ]
}
```

With the App PHP SDK, build the response with `TaxProviderResponseBuilder` (`addLineItemTax()`, `addDeliveryTax()`, `addCartTax()` taking `CalculatedTax`), resolve the request via `ContextResolver::assembleTaxProvider()` (or inject `TaxProviderAction` in the Symfony bundle), and sign it with `ResponseSigner::signResponse()`.

## Essential identifiers

- Manifest: `<tax>`, `<tax-provider>`, `<identifier>`, `<name>`, `<priority>`, `<process-url>`
- Permission: `tax_processor`
- Response keys: `lineItemTaxes`, `deliveryTaxes`, `cartPriceTaxes`
- Core: `Shopware\Core\Checkout\Cart\TaxProvider\TaxProviderProcessor`, `Shopware\Core\Checkout\Cart\TaxProvider\Struct\TaxProviderResult`
- SDK: `Shopware\App\SDK\TaxProvider\TaxProviderResponseBuilder`, `Shopware\App\SDK\Context\TaxProvider\TaxProviderAction`

## Gotchas

- Docs: Shopware waits 5 seconds for a response, then drops the connection. Respond in time.
- If `cartPriceTaxes` is given, Shopware does not recalculate tax sums and uses the provider's values. You usually need to send the whole cart to the tax service.
- A provider that fails (HTTP error, invalid JSON) is logged and skipped, and the next provider is tried.
- No tax providers are called when the context's tax state is tax-free.
- If the app has not been granted `tax_processor`, its provider is skipped silently.
- For local development the docs suggest a tunnel such as ngrok, so the shop can reach the app server.

## Version notes

Available since Shopware 6.5.0.0.

## Code check (6.7.15.1)
- confirmed `tax-provider` — children identifier, name, priority, process-url — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:620
- confirmed `TaxProvider::REQUIRED_FIELDS` — identifier, name, processUrl, priority required — vendor/shopware/core/Framework/App/Manifest/Xml/Tax/TaxProvider.php:15
- confirmed `Tax::PERMISSION` — value tax_processor — vendor/shopware/core/Framework/App/Manifest/Xml/Tax/Tax.php:14
- confirmed `Tax::PERMISSION` — added to requested permissions when tax providers are declared — vendor/shopware/core/Framework/App/Manifest/Manifest.php:340
- confirmed `whenGranted()` — app provider called only when permission granted — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderProcessor.php:115
- confirmed `sortByPriority()` — providers called in priority order — vendor/shopware/core/Checkout/Cart/TaxProvider/TaxProviderProcessor.php:97
- confirmed `TaxProviderResult::$cartPriceTaxes` — with lineItemTaxes and deliveryTaxes as result fields — vendor/shopware/core/Checkout/Cart/TaxProvider/Struct/TaxProviderResult.php:22
- confirmed `TaxProviderPayloadService::request()` — Guzzle/JSON errors logged, returns null — vendor/shopware/core/Framework/App/TaxProvider/Payload/TaxProviderPayloadService.php:31
- unverified `5 seconds` — response timeout is configured on the injected HTTP client, not found in the checked files
- unverified `TaxProviderResponseBuilder` — App PHP SDK class, outside the vendor/shopware roots
