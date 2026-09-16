---
id: platform/dev/6.6/resources/references/adr/2024-04-01-checkout-gateway.md
title: Checkout gateway
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-04-01-checkout-gateway.html"
sourceHash: d8c237c592247c4d3d8ef7db5d76464d84f5e475
keywords: ["CheckoutGatewayInterface", "CheckoutGatewayRoute", "AppCheckoutGateway", "checkout-gateway-url", "CheckoutGatewayCommandsCollectedEvent", "gateways manifest", "add-payment-method", "remove-payment-method", "add-shipping-method", "remove-shipping-method", "add-cart-error", "CheckoutGatewayResponse", "store-api checkout gateway"]
summary: "ADR: `CheckoutGatewayInterface` lets apps/plugins filter payment/shipping methods and block carts via `/store-api/checkout/gateway`."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing a centralized `CheckoutGatewayInterface` that decides which payment/shipping methods are available and whether the cart can proceed to checkout, based on cart and sales channel context.

## When to use
Relevant when a plugin or app needs to filter payment/shipping methods, block a cart during checkout (e.g. risk assessment, provider outage), or otherwise make server-side checkout decisions from an app backend.

## Key steps / config
- `CheckoutGatewayInterface::process(CheckoutGatewayPayloadStruct): CheckoutGatewayResponse` is invoked during checkout; the response carries an `EntityCollection` of eligible payment/shipping methods plus `CartErrors`.
- New store API route `CheckoutGatewayRoute` at `/store-api/checkout/gateway`, called during checkout-confirm, edit-order ("after order"), and as part of `CartOrderRoute` requests; context changes (language, currency) re-trigger it.
- Response manipulation uses an executable chain of `CheckoutGatewayCommands`, executed in order; initial commands: `add-payment-method`, `remove-payment-method`, `add-shipping-method`, `remove-shipping-method`, `add-cart-error`.
- For apps, `AppCheckoutGateway` calls each active app that defines a `checkout-gateway-url`... via a new `<gateways><checkout>` element in the app's `manifest.xml`:

```xml
<manifest>
    <gateways>
        <checkout>https://example.com/checkout/gateway</checkout>
    </gateways>
</manifest>
```

- App payload shape sent to the app server:

```json
{
    "salesChannelContext": SalesChannelContextObject,
    "cart": CartObject,
    "paymentMethods": ["payment-method-technical-name-1"],
    "shippingMethods": ["shipping-method-technical-name-1"]
}
```

`paymentMethods`/`shippingMethods` only carry technical names, not full entities.
- New event `CheckoutGatewayCommandsCollectedEvent`, dispatched after `AppCheckoutGateway` collects commands from all app servers, lets plugins alter commands before execution.

## Essential identifiers
- `Shopware\Core\Checkout\Gateway\CheckoutGatewayInterface`
- `CheckoutGatewayRoute` (`/store-api/checkout/gateway`)
- `AppCheckoutGateway`
- `CheckoutGatewayCommandsCollectedEvent`
- `CheckoutGatewayPayloadStruct`, `CheckoutGatewayResponse`

## Gotchas
Custom plugin implementations of `CheckoutGatewayInterface` are encouraged, but not required, to follow the command structure — only the app-system's implementation relies on it. Commands execute in the order given in the response.
