---
id: platform/dev/6.6/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.md
title: In-App Purchase Gateway
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/gateways/in-app-purchase/in-app-purchase-gateway.html
sourceHash: 20b59eb388f34a193c56f0d97ae23d830b3fe7bf
keywords: ["in-app purchase", "In-App Purchase Gateway", "gateways", "inAppPurchase", "manifest.xml", "checkout gateway", "InAppPurchasesGatewayEvent", "app-php-sdk", "InAppPurchaseProvider", "FilterAction", "purchases array", "gateway timeout"]
summary: "Manifest gateway lets an app server restrict which In-App Purchases a customer may buy during checkout via a signed JSON callback."
lastBuilt: "2026-09-15"
---
## What it is
The In-App Purchase Gateway lets an app server restrict which In-App Purchases (IAPs) are allowed during checkout, based on decision logic run on the app server. Available since Shopware 6.6.9.0.

## When to use
Use it when an app sells multiple In-App Purchases and needs server-side logic (e.g. tier exclusivity) to disallow specific purchases before checkout completes. Current limitation: it only restricts the checkout of new IAPs, not full listing filtering.

## Key steps / config
Declare the gateway URL in `manifest.xml` under `gateways` with an `inAppPurchases` element:

```xml
<manifest>
    <gateways>
        <inAppPurchases>https://my-app.server.com/inAppPurchases/gateway</inAppPurchases>
    </gateways>
</manifest>
```

Shopware calls this URL during IAP checkout with a JSON payload:

```json5
{
  "source": { "url": "...", "shopId": "...", "appVersion": "...", "inAppPurchases": "..." },
  "purchases": ["my-in-app-purchase-bronze", "my-in-app-purchase-silver", "my-in-app-purchase-gold"]
}
```

Respond with the allowed purchase identifiers in a `purchases` array (empty array disallows all). Since `app-php-sdk` `4.0.0`, use `InAppPurchaseProvider`, `ContextResolver::assembleInAppPurchasesFilterRequest()`, and `Shopware\App\SDK\Context\Gateway\InAppFeatures\FilterAction` to build the response with `InAppPurchasesResponse::filter($purchases)`.

## Essential identifiers
- `inAppPurchases` (manifest `gateways` property)
- `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent`
- `Shopware\App\SDK\Context\InAppPurchase\InAppPurchaseProvider`
- `Shopware\App\SDK\Context\Gateway\InAppFeatures\FilterAction`
- `ContextResolver::assembleInAppPurchasesFilterRequest()`

## Gotchas
The Shopware shop waits only 5 seconds for a gateway response; a slow app server causes a timeout and dropped connection.

## Version notes
In-App Purchase Gateway requires Shopware 6.6.9.0 or later; earlier versions do not support it.
