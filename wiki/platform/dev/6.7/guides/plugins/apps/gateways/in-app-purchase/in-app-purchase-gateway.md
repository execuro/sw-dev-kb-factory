---
id: platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md
title: In-App Purchase Gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.html
sourceHash: bacd44c98b4ba1ca3ee9a74fc52068bbddc05dce
codeCheckedAgainst: "6.7.13.0"
keywords: ["in-app purchase gateway", "inAppPurchases", "gateways", "InAppPurchasesGatewayEvent", "InAppPurchasesGateway", "InAppPurchasesResponse", "purchases", "FilterAction", "iap", "app server", "restrict purchases", "manifest.xml"]
summary: "In-App Purchase gateway (6.6.9.0+): manifest gateways/inAppPurchases URL; app server returns the allowed purchase identifiers in a purchases array."
lastBuilt: 2026-09-15
---
## What it is

The In-App Purchase Gateway lets an app server decide which In-App Purchases a user may buy. Currently it only restricts the checkout of new In-App Purchases. In-App Purchases exist since Shopware 6.6.9.0.

## When to use

When an app sells In-App Purchases and needs server-side logic to block some of them, e.g. hide lower tiers once the user owns a higher one.

## Key steps / config

1. Register the gateway URL in `manifest.xml` (element name is `inAppPurchases`, plural):

```xml
<manifest>
    <gateways>
        <inAppPurchases>https://my-app.server.com/inAppPurchases/gateway</inAppPurchases>
    </gateways>
</manifest>
```

2. During checkout of an In-App Purchase, Shopware POSTs a signed JSON request to that URL:

```json
{
  "source": { "url": "...", "shopId": "...", "appVersion": "...", "inAppPurchases": "<JWT of active purchases>" },
  "purchases": ["my-in-app-purchase-gold"]
}
```

3. Respond with the identifiers the user is allowed to buy; an empty array disallows the purchase:

```json
{ "purchases": ["my-in-app-purchase-bronze"] }
```

4. With `app-php-sdk` 4.0.0+, `ContextResolver::assembleInAppPurchasesFilterRequest()` returns a `FilterAction` whose `getPurchases()` collection you filter before signing the response; the Symfony bundle injects `FilterAction` into the controller.

## Essential identifiers

- manifest `<gateways><inAppPurchases>`
- `purchases` (request and response key)
- `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent` — dispatched after the app response is received; carries the `InAppPurchasesResponse`, so plugins can change the available purchases

## Gotchas

- The prose on the docs page says `inAppPurchase`; the schema element is `inAppPurchases`.
- The core intersects the returned `purchases` with the requested ones, so the app can only remove identifiers, never add new ones.
- If the app has no gateway URL, the gateway is skipped and no event is dispatched.
- `InAppPurchasesGatewayEvent` and `InAppPurchasesGateway` are marked `@internal` in the installed core; not a stable extension API.
- Docs: Shopware waits five seconds for the response before dropping the connection.
- The docs' SDK snippets are inconsistent (import `InAppPurchaseResponse` but call `InAppPurchasesResponse::filter()`; the Symfony example returns `createCheckoutGatewayResponse($commands)` with an undefined `$commands`). Check the SDK before copying.

## Code check (6.7.13.0)
- confirmed `gateways.inAppPurchases` — xs:anyURI element in manifest schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:517
- confirmed `InAppPurchasesGateway::process()` — returns null when no gateway URL — vendor/shopware/core/Framework/App/InAppPurchases/Gateway/InAppPurchasesGateway.php:26
- confirmed `InAppPurchasesPayload::$purchases` — request list of purchase identifiers — vendor/shopware/core/Framework/App/InAppPurchases/Payload/InAppPurchasesPayload.php:25
- confirmed `purchases` — response intersected with requested purchases — vendor/shopware/core/Framework/App/InAppPurchases/Payload/InAppPurchasesPayloadService.php:32
- confirmed `InAppPurchasesResponse::$purchases` — response property — vendor/shopware/core/Framework/App/InAppPurchases/Response/InAppPurchasesResponse.php:22
- corrected `InAppPurchasesGatewayEvent` — docs: plugin event; class is `@internal` — vendor/shopware/core/Framework/App/InAppPurchases/Event/InAppPurchasesGatewayEvent.php:19
- unverified `FilterAction` — app-php-sdk, out of scope
- unverified `timeout` — five-second limit not traced in the checked files
