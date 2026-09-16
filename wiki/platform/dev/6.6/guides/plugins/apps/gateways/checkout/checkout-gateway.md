---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/gateways/checkout/checkout-gateway.md
sourceHash: fe40348df102ba4fb00ba8578ea1081f445a9088
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/gateways/checkout/checkout-gateway.html
title: Checkout Gateway
version: "6.6"
versions:
  - "6.6"
keywords: ["Checkout Gateway", "gateways", "manifest.xml", "SalesChannelContext", "Cart", "remove-payment-method", "add-cart-error", "CheckoutGatewayCommandsCollectedEvent", "app-php-sdk", "GatewayResponse", "CheckoutGatewayAction", "ResponseSigner"]
summary: "Checkout Gateway (6.6.3.0+) lets an app's manifest register a checkout URL that returns commands to alter cart/payment/shipping."
lastBuilt: 2026-09-15
---
## What it is

Introduced in Shopware 6.6.3.0, the Checkout Gateway lets an app server make cart- and context-aware decisions during checkout, focused here on the app integration (a plugin-based replacement is also possible).

## When to use

When an app needs to remove payment/shipping methods or add cart errors based on the current cart and sales channel context during checkout, e.g. blocking a payment method above a price threshold.

## Key steps / config

Declare the gateway in `manifest.xml` under a `gateways` parent with a `checkout` URL:

```xml
<manifest>
    <gateways>
        <checkout>https://my-app.server.com/checkout/gateway</checkout>
    </gateways>
</manifest>
```

Shopware calls this URL during checkout, waiting at most 5 seconds for a response, and sends the current `SalesChannelContext`, `Cart`, and available payment/shipping methods as payload. The response contains a `commands` array (see the command reference at `platform/dev/6.6/guides/plugins/apps/gateways/checkout/command-reference.md`), e.g.:

```json5
{
  "commands": [
    { "command": "remove-payment-method", "payload": { "paymentMethodTechnicalName": "..." } },
    { "command": "add-cart-error", "payload": { "message": "...", "blocking": false, "level": 10 } }
  ]
}
```

With the App PHP SDK (checkout gateway support added in version 3.0.0), resolve the request with `$contextResolver->assembleCheckoutGatewayRequest($request, $shop)` into a `CheckoutGatewayAction`, build a `Collection` of commands such as `RemovePaymentMethodCommand`/`AddCartErrorCommand`, and return `GatewayResponse::createCheckoutGatewayResponse($commands)` signed via `ResponseSigner`. The Symfony Bundle exposes the same flow through a controller action typed with `CheckoutGatewayAction $action`. Plugins can observe and adjust the collected commands via `Shopware\Core\Checkout\Gateway\Command\Event\CheckoutGatewayCommandsCollectedEvent`, dispatched after all app servers have responded.

## Essential identifiers

- `<gateways><checkout>` in `manifest.xml`
- `Shopware\App\SDK\Gateway\Checkout\CheckoutGatewayCommand`
- `Shopware\App\SDK\Gateway\Checkout\Command\{AddCartErrorCommand,RemovePaymentMethodCommand}`
- `assembleCheckoutGatewayRequest()`, `GatewayResponse::createCheckoutGatewayResponse()`
- `Shopware\Core\Checkout\Gateway\Command\Event\CheckoutGatewayCommandsCollectedEvent`

## Gotchas

Shopware waits only 5 seconds for the checkout gateway response; a slow app server causes a timeout and dropped connection.

## Version notes

Checkout Gateway was introduced in Shopware 6.6.3.0; App PHP SDK support for it was added in SDK version 3.0.0.
