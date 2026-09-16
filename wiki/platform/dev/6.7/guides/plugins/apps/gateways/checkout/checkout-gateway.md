---
id: platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md
title: Checkout Gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/checkout/checkout-gateway.html
sourceHash: f1e6167710a5449176219abe3ca9aeda1519f105
codeCheckedAgainst: "6.7.13.0"
keywords: ["checkout gateway", "app gateway", "gateways", "remove-payment-method", "add-cart-error", "CheckoutGatewayCommandsCollectedEvent", "CheckoutGatewayInterface", "app-php-sdk", "GatewayResponse", "payment method filtering", "shipping method filtering", "cart error"]
summary: App checkout gateway - manifest <gateways><checkout> URL gets cart and context at checkout, returns commands to change methods or add cart errors.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/gateways/checkout/command-reference.md"]
---
## What it is

The Checkout Gateway (since Shopware 6.6.3.0) lets an app server decide during checkout, based on the cart and sales channel context, which payment and shipping methods stay available and which cart errors are added. The app answers with commands; plugins can replace or extend the mechanism.

## When to use

An app must restrict or add payment/shipping methods or block checkout dynamically, e.g. hide its payment method for carts above 1000 EUR. Requires familiarity with app registration and request/response signing; the app server must be reachable by the shop.

## Key steps / config

1. Declare the gateway URL in `manifest.xml`:

```xml
<manifest>
    <gateways>
        <checkout>https://my-app.server.com/checkout/gateway</checkout>
    </gateways>
</manifest>
```

2. During checkout Shopware POSTs, for every active app with a checkout gateway URL, a signed JSON payload. Top-level keys in the installed code:

```json
{
  "source": { "url": "...", "shopId": "...", "appVersion": "..." },
  "salesChannelContext": { },
  "cart": { },
  "paymentMethods": ["payment-method-technical-name-1"],
  "shippingMethods": ["shipping-method-technical-name-1"]
}
```

3. Respond with commands; each entry needs `command` and `payload`, otherwise it is logged and skipped:

```json
{ "commands": [
  { "command": "remove-payment-method", "payload": { "paymentMethodTechnicalName": "payment-myApp-payment-method" } },
  { "command": "add-cart-error", "payload": { "message": "...", "blocking": false, "level": 10 } }
] }
```

   Command keys in core: `add-payment-method`, `remove-payment-method`, `add-shipping-method`, `remove-shipping-method`, `add-payment-method-extension`, `add-shipping-method-extension`, `add-cart-error` (see [command reference](platform/dev/6.7/guides/plugins/apps/gateways/checkout/command-reference.md)).
4. With `app-php-sdk` 3.0.0+ (or its Symfony bundle): resolve the shop, call `ContextResolver::assembleCheckoutGatewayRequest()` to get a `CheckoutGatewayAction`, add `RemovePaymentMethodCommand` / `AddCartErrorCommand` to a `Collection`, return `GatewayResponse::createCheckoutGatewayResponse($commands)` and sign it.
5. Plugins can listen to `Shopware\Core\Checkout\Gateway\Command\Event\CheckoutGatewayCommandsCollectedEvent`, dispatched after commands from all app servers are collected and before they are executed; it exposes `getCommands()`, `getPayload()`, `getCart()`, `getSalesChannelContext()`.

## Essential identifiers

- manifest `<gateways><checkout>`
- `Shopware\Core\Checkout\Gateway\Command\Event\CheckoutGatewayCommandsCollectedEvent`
- `Shopware\Core\Checkout\Gateway\CheckoutGatewayInterface` (plugin-side replacement point)
- command keys `remove-payment-method`, `add-cart-error`, `add-payment-method`, `remove-shipping-method`

## Gotchas

- The docs name the request keys `availablePaymentMethods` / `availableShippingMethods`; the installed payload class serialises them as `paymentMethods` / `shippingMethods` (lists of technical names).
- The docs state Shopware waits 5 seconds for a response before dropping the connection; respond quickly.
- Unknown command keys or entries without `payload` are logged (or thrown, depending on logger config) and skipped.
- The docs' Symfony bundle sample uses `RemovePaymentMethodCommand` without importing it.

## Code check (6.7.13.0)
- confirmed `checkout` — child of manifest gateways element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:515
- corrected `paymentMethods` — docs: availablePaymentMethods / availableShippingMethods — vendor/shopware/core/Framework/App/Checkout/Payload/AppCheckoutGatewayPayload.php:33
- confirmed `checkoutGatewayUrl` — only active apps with a gateway URL are called — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:98
- confirmed `CheckoutGatewayCommandsCollectedEvent` — dispatched before command execution — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:81
- confirmed `CheckoutGatewayCommandsCollectedEvent::getCommands()` — exposes collected commands — vendor/shopware/core/Checkout/Gateway/Command/Event/CheckoutGatewayCommandsCollectedEvent.php:33
- confirmed `remove-payment-method` — RemovePaymentMethodCommand key — vendor/shopware/core/Checkout/Gateway/Command/RemovePaymentMethodCommand.php:10
- confirmed `add-cart-error` — AddCartErrorCommand key, blocking and level params — vendor/shopware/core/Checkout/Gateway/Command/AddCartErrorCommand.php:11
- confirmed `CheckoutGatewayInterface` — process() interface for replacements — vendor/shopware/core/Checkout/Gateway/CheckoutGatewayInterface.php:9
- unverified `5 seconds` — response timeout not set in AppCheckoutGatewayPayloadService; HTTP client default out of scope
- unverified `Shopware\App\SDK\Response\GatewayResponse` — app-php-sdk, not in vendor/shopware roots
