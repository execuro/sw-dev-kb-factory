---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/php/04-signing.md
title: Signing
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/php/04-signing.html
sourceHash: 751c12fef993085e1bac81a1dfd934f2f7651e3b
keywords: ["ResponseSigner", "signResponse", "ActionButton", "TaxProvider", "Payment", "ShopResolver", "signing", "psr-7"]
summary: "PHP App SDK signing guide: create a ResponseSigner and call signResponse for ActionButton, TaxProvider, and Payment responses."
lastBuilt: "2026-09-15"
---
## What it is

Explains that the Shopware App System requires apps to sign responses for `ActionButton`, `TaxProvider`, and `Payment` actions, so the server can verify authenticity.

## Key steps / config

Create a `ResponseSigner` and call `signResponse` with the PSR-7 response and the resolved shop:

```php
$shopResolver = new \Shopware\App\SDK\Shop\ShopResolver($repository);
$shop = $shopResolver->resolveShop($psrRequest);

$signer = new \Shopware\App\SDK\Authentication\ResponseSigner();
$signer->signResponse($psrResponse, $shop);
```

## Essential identifiers

- `\Shopware\App\SDK\Authentication\ResponseSigner`
- `ResponseSigner::signResponse()`
- `\Shopware\App\SDK\Shop\ShopResolver::resolveShop()`
