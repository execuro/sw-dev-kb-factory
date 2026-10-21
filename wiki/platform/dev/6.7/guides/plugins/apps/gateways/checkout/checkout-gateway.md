---
id: platform/dev/6.7/guides/plugins/apps/gateways/checkout/checkout-gateway.md
title: Checkout Gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/checkout/checkout-gateway.html
sourceHash: f1e6167710a5449176219abe3ca9aeda1519f105
codeCheckedAgainst: "6.7.15.1"
keywords: ["checkout gateway", "gateways", "manifest.xml", "CheckoutGatewayCommandsCollectedEvent", "remove-payment-method", "add-cart-error", "GatewayResponse", "app-php-sdk", "checkout_gateway", "payment method", "shipping method", "app server"]
summary: App checkout gateway URL in manifest <gateways>; the app server answers with commands that remove payment/shipping methods or add cart errors.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/gateways/checkout/command-reference.md"]
---
## What it is

The Checkout Gateway, available since Shopware 6.6.3.0, sends the cart, the sales channel context and the available payment and shipping methods to an app server during checkout. The server replies with commands that change those methods or add cart errors. The design also allows a plugin to provide its own replacement.

## When to use

Your app has to decide during checkout which payment or shipping methods are offered, or whether to show or block with a cart error. For example, it might hide its payment method for carts above 1000€.

## Key steps / config

1. Declare the gateway URL in `manifest.xml`:

```xml
<manifest>
    <gateways>
        <checkout>https://my-app.server.com/checkout/gateway</checkout>
    </gateways>
</manifest>
```

2. During checkout, Shopware posts a signed JSON payload to that URL for every active app with a checkout gateway URL. The payload shape in 6.7:

```json
{ "source": { "url": "...", "shopId": "...", "appVersion": "..." },
  "cart": {}, "salesChannelContext": {},
  "paymentMethods": ["<technical-name>"], "shippingMethods": ["<technical-name>"] }
```

3. Respond (signed) with `{"commands": [{"command": "<key>", "payload": {...}}]}`. For example, `remove-payment-method` takes `{"paymentMethodTechnicalName": "..."}`, and `add-cart-error` takes `{"message", "blocking", "level"}`. All commands are listed in the [command reference](platform/dev/6.7/guides/plugins/apps/gateways/checkout/command-reference.md).
4. With `app-php-sdk` 3.0.0 or later, use `ContextResolver::assembleCheckoutGatewayRequest()` to get a `CheckoutGatewayAction`. Add `RemovePaymentMethodCommand` / `AddCartErrorCommand` to a `Collection`, then return `GatewayResponse::createCheckoutGatewayResponse($commands)` signed by the response signer. The Symfony bundle can inject `CheckoutGatewayAction` directly into a controller action.
5. Plugins can listen to `Shopware\Core\Checkout\Gateway\Command\Event\CheckoutGatewayCommandsCollectedEvent`. It is dispatched after the commands of all apps are collected and before they run. Use `getCommands()` and `getPayload()` on it to add or change commands.

## Essential identifiers

- `<gateways><checkout>` manifest element
- `Shopware\Core\Checkout\Gateway\Command\Event\CheckoutGatewayCommandsCollectedEvent`
- Command keys `remove-payment-method`, `add-cart-error`
- SDK: `Shopware\App\SDK\Context\Gateway\Checkout\CheckoutGatewayAction`, `Shopware\App\SDK\Response\GatewayResponse`

## Gotchas

- Shopware waits only 5 seconds for a response before dropping the connection.
- The docs name the payload lists `availablePaymentMethods`/`availableShippingMethods`. The core payload struct serialises them as `paymentMethods`/`shippingMethods`.
- The app must have the `checkout_gateway` permission granted. Requested-but-unconsented permissions do not count. Without it, Shopware does not call the app.
- An entry without `command` or `payload`, or with an unknown command key, is logged and skipped.
- Your app server must be reachable from the Shopware server; for development, use a tunnel such as ngrok.

## Version notes

- Introduced in 6.6.3.0. Support in `app-php-sdk` since 3.0.0.

## Code check (6.7.15.1)
- confirmed `gateways.checkout` — manifest anyURI element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:528
- corrected `AppCheckoutGatewayPayload::$paymentMethods` — docs: availablePaymentMethods/availableShippingMethods keys — vendor/shopware/core/Framework/App/Checkout/Payload/AppCheckoutGatewayPayload.php:33
- confirmed `CheckoutGateway::PERMISSION` — `checkout_gateway`, must be granted — vendor/shopware/core/Framework/App/Manifest/Xml/Gateway/CheckoutGateway.php:13
- confirmed `CheckoutGatewayCommandsCollectedEvent` — dispatched before commands execute — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:88
- confirmed `CheckoutGatewayCommandsCollectedEvent::getCommands()` — exposes collected commands — vendor/shopware/core/Checkout/Gateway/Command/Event/CheckoutGatewayCommandsCollectedEvent.php:35
- confirmed `command` — response entries need `command` and `payload` keys — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:114
- confirmed `RemovePaymentMethodCommand::COMMAND_KEY` — `remove-payment-method` — vendor/shopware/core/Checkout/Gateway/Command/RemovePaymentMethodCommand.php:10
- confirmed `AddCartErrorCommand::COMMAND_KEY` — `add-cart-error`, blocking default false, level default LEVEL_WARNING — vendor/shopware/core/Checkout/Gateway/Command/AddCartErrorCommand.php:11
- unverified `timeout` — 5 s limit comes from HTTP client configuration not checked
- unverified `Shopware\App\SDK\Response\GatewayResponse` — app-php-sdk, out of scope
