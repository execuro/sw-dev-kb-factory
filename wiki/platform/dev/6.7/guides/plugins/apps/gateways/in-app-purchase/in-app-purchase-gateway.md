---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md
sourceHash: bacd44c98b4ba1ca3ee9a74fc52068bbddc05dce
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.html
title: In-App Purchase Gateway
version: "6.7"
versions:
  - "6.7"
keywords: ["in-app purchase gateway", "inAppPurchases", "InAppPurchasesGatewayEvent", "gateways manifest", "iap", "restrict in-app purchases", "purchases filter", "InAppPurchasesResponse", "FilterAction", "app-php-sdk", "app server gateway", "in-app purchase checkout"]
summary: In-App Purchase Gateway lets an app server filter which In-App Purchases a user may buy at checkout via the manifest gateways inAppPurchases URL.
lastBuilt: 2026-10-21
---
## What it is

The In-App Purchase Gateway lets an app server restrict which of its In-App Purchases a user may buy. Currently it only restricts the checkout of new In-App Purchases. In-App Purchases exist since Shopware 6.6.9.0.

## When to use

When the decision whether a user may buy a specific In-App Purchase depends on logic on your app server (e.g. hide lower tiers once the user owns the top tier).

## Key steps / config

1. Register the gateway URL in `manifest.xml` with the `inAppPurchases` element inside `gateways`:

```xml
<manifest>
    <gateways>
        <inAppPurchases>https://my-app.server.com/inAppPurchases/gateway</inAppPurchases>
    </gateways>
</manifest>
```

   After installation the gateway is used immediately.

2. During checkout of an In-App Purchase, Shopware calls that URL with a signed JSON payload; `purchases` contains the single purchase the user wants to buy:

```json
{
  "source": { "url": "...", "shopId": "...", "appVersion": "...", "inAppPurchases": "<JWT of active purchases>" },
  "purchases": ["my-in-app-purchase-gold"]
}
```

3. Respond within five seconds with the identifiers the user is allowed to buy; an empty array disallows the purchase:

```json
{ "purchases": ["my-in-app-purchase-bronze", "my-in-app-purchase-silver"] }
```

   Shopware intersects the returned list with the requested `purchases`, so the app can only remove entries, not add new ones.

4. With `app-php-sdk` 4.0.0+: `ContextResolver::assembleInAppPurchasesFilterRequest()` returns a `Shopware\App\SDK\Context\Gateway\InAppFeatures\FilterAction`; remove disallowed entries from `getPurchases()` and return a signed `InAppPurchasesResponse::filter($purchases)`. The Symfony bundle injects `FilterAction` into the controller action.

## Essential identifiers

- Manifest element `<gateways><inAppPurchases>`
- `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent` — dispatched after the app server response is received; plugins can manipulate the allowed purchases
- Payload/response key `purchases`
- SDK: `ContextResolver::assembleInAppPurchasesFilterRequest()`, `FilterAction`, `InAppPurchaseProvider`

## Gotchas

- The docs prose names the property `inAppPurchase`; the manifest element Shopware parses is `inAppPurchases` (plural).
- Shopware waits five seconds for the response, then drops the connection.
- The source's Symfony bundle sample ends with `GatewayResponse::createCheckoutGatewayResponse($commands)` with an undefined `$commands`; it appears copied from the checkout gateway sample.

## Version notes

- In-App Purchases are available since 6.6.9.0; gateway support in `app-php-sdk` since 4.0.0.

## Code check (6.7.15.1)
- corrected `inAppPurchases` — docs: property `inAppPurchase`; manifest tag parsed is `inAppPurchases` — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/Gateways.php:20
- confirmed `InAppPurchasesGatewayEvent` — dispatched after the app response — vendor/shopware/core/Framework/App/InAppPurchases/Gateway/InAppPurchasesGateway.php:36
- confirmed `InAppPurchasesGatewayEvent` — class exists in the documented namespace — vendor/shopware/core/Framework/App/InAppPurchases/Event/InAppPurchasesGatewayEvent.php:21
- confirmed `AppEntity::getInAppPurchasesGatewayUrl()` — gateway skipped when no URL is set — vendor/shopware/core/Framework/App/InAppPurchases/Gateway/InAppPurchasesGateway.php:28
- confirmed `purchases` — response list intersected with requested purchases — vendor/shopware/core/Framework/App/InAppPurchases/Payload/InAppPurchasesPayloadService.php:32
- confirmed `InAppPurchasesPayload::$purchases` — request payload list — vendor/shopware/core/Framework/App/InAppPurchases/Payload/InAppPurchasesPayload.php:25
- unverified `assembleInAppPurchasesFilterRequest` — app-php-sdk, out of scope
- unverified `five seconds` — timeout value not located in the checked files
