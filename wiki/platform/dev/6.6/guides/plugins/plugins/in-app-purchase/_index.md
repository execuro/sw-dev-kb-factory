---
id: platform/dev/6.6/guides/plugins/plugins/in-app-purchase/_index.md
title: In-App Purchases
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 6e92b12673f0568713a2638626e5b7e34977b037
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/in-app-purchase/
keywords: ["In-App Purchase", "InAppPurchase", "isActive", "Shopware.InAppPurchase", "inAppPurchaseCheckout", "InAppPurchasesGatewayEvent", "paywall", "extension monetization", "app gateway", "purchase checkout"]
summary: "In-App Purchases let extensions lock features behind a paywall, checked via the InAppPurchase service or Shopware.InAppPurchase in admin."
lastBuilt: "2026-09-15"
---
## What it is

In-App Purchases are a mechanism, available since Shopware 6.6.9.0, that lets an extension lock certain features behind a paywall within the same extension — e.g. offering a free version with limited features and a paid version with more.

## When to use

Use this when an extension wants to gate specific functionality unless the merchant has purchased an in-app add-on, either in PHP backend code, in the Administration, or by allowing users to trigger a purchase checkout.

## Key steps / config

- Check activation status in PHP by injecting the `InAppPurchase` class:

```php
class Example
{
    public function __construct(
        private readonly InAppPurchase $inAppPurchase,
    ) {}

    public function someFunction() {
        if ($this->inAppPurchase->isActive('MyExtensionName', 'my-iap-identifier')) {
            // ...
        }
    }
}
```

- Check activation status in the Administration:

```js
if (Shopware.InAppPurchase.isActive('MyExtensionName', 'my-iap-identifier')) {};
```

- Trigger a purchase checkout in the Administration via the `inAppPurchaseCheckout` store:

```js
{
    computed: {
        inAppPurchaseCheckout() {
            return Shopware.Store.get('inAppPurchaseCheckout');
        }
    },
    methods: {
        onClick() {
            this.inAppPurchaseCheckout.request({ identifier: 'my-iap-identifier' }, 'MyExtensionName');
        }
    }
}
```

## Essential identifiers

- `InAppPurchase::isActive(string $extensionName, string $identifier)`
- `Shopware.InAppPurchase.isActive()`
- `Shopware.Store.get('inAppPurchaseCheckout')`
- `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent`

## Gotchas

Apps can manipulate the available In-App Purchases via the app gateway; plugins can listen to `InAppPurchasesGatewayEvent`, which is dispatched after the In-App Purchases Gateway has received the app server's response, allowing plugins to manipulate the available In-App Purchases.

## Version notes

Available since Shopware 6.6.9.0.
