---
id: platform/dev/6.7/resources/references/adr/2024-04-01-checkout-gateway.md
title: Checkout gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-04-01-checkout-gateway.html
sourceHash: d8c237c592247c4d3d8ef7db5d76464d84f5e475
codeCheckedAgainst: "6.7.15.1"
keywords: ["CheckoutGatewayInterface", "CheckoutGatewayResponse", "CheckoutGatewayPayloadStruct", "CheckoutGatewayRoute", "/store-api/checkout/gateway", "AppCheckoutGateway", "CheckoutGatewayCommandsCollectedEvent", "gateways", "remove-payment-method", "add-cart-error", "payment method availability", "shipping method filter", "app server"]
summary: "ADR: CheckoutGatewayInterface and /store-api/checkout/gateway let apps and plugins filter payment/shipping methods and add cart errors via commands."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-04-01, area checkout) that introduces a central checkout gateway. The gateway decides which payment and shipping methods are available and which cart errors apply, based on the cart and the current sales channel context. Payment and shipping providers need this for risk assessment, unavailability rules, merchant credential checks and outage detection, and to block carts. Before the gateway, apps could only do this through app scripts, with no app-server logic involved.

## When to use

Read it when an app server or a plugin must hide or add payment or shipping methods, or block the order, based on external logic such as risk scoring, ERP or PIM decisions.

## Key steps / config

**Interface** (`Shopware\Core\Checkout\Gateway`). The input carries the cart, the sales channel context and the currently available payment and shipping methods:

```php
interface CheckoutGatewayInterface
{
    public function process(CheckoutGatewayPayloadStruct $payload): CheckoutGatewayResponse;
}
```

`CheckoutGatewayResponse` holds a `PaymentMethodCollection` (`availablePaymentMethods`), a `ShippingMethodCollection` (`availableShippingMethods`) and an `ErrorCollection` (`cartErrors`).

**Store API.** `CheckoutGatewayRoute` serves `/store-api/checkout/gateway` (route name `store-api.checkout.gateway`, GET/POST). `CartOrderRoute` calls it during order placement to validate the cart. The Storefront calls it on the checkout-confirm page and the edit-order ("after order") page. Context changes such as language or currency reload the payment method selection and call the app server again.

**App manifest.** Set the endpoint in `manifest.xml`. `AppCheckoutGateway` calls active apps that have a checkout gateway URL, one after another:

```xml
<manifest>
    <gateways>
        <checkout>https://example.com/checkout/gateway</checkout>
    </gateways>
</manifest>
```

**App payload / response.** The payload contains only technical names, not full method entities:

```json
{ "salesChannelContext": {}, "cart": {}, "paymentMethods": ["..."], "shippingMethods": ["..."] }
```

```json
[ { "command": "remove-payment-method", "payload": { "paymentMethodTechnicalName": "..." } },
  { "command": "add-cart-error", "payload": { "reason": "...", "level": 20, "blockOrder": true } } ]
```

Commands run in the order they appear in the response and are executed by handlers. Command keys in 6.7.15.1: `add-payment-method`, `remove-payment-method`, `add-shipping-method`, `remove-shipping-method`, `add-cart-error`, plus `add-payment-method-extension` and `add-shipping-method-extension`.

**Event.** `CheckoutGatewayCommandsCollectedEvent` is dispatched after `AppCheckoutGateway` has collected the commands from all app servers. Plugins can change the commands before execution, based on the same payload.

## Essential identifiers

- `Shopware\Core\Checkout\Gateway\CheckoutGatewayInterface::process()`
- `CheckoutGatewayPayloadStruct`, `CheckoutGatewayResponse`
- `CheckoutGatewayRoute`, `/store-api/checkout/gateway`
- `AppCheckoutGateway`, `CheckoutGatewayCommandsCollectedEvent`
- manifest `<gateways><checkout>`

## Gotchas

- Only one implementation ships, the app-system's `AppCheckoutGateway`. Custom plugin implementations are encouraged, but following the command structure is optional for them.
- The app PHP SDK maps the request to `CheckoutGatewayRequest` and the response to `CheckoutGatewayResponse`, with one class per command.

## Code check (6.7.15.1)
- confirmed `CheckoutGatewayInterface::process()` — takes `CheckoutGatewayPayloadStruct $payload`, returns `CheckoutGatewayResponse` — vendor/shopware/core/Checkout/Gateway/CheckoutGatewayInterface.php:11
- corrected `CheckoutGatewayResponse` — docs: EntityCollection of methods plus CartErrors; code: Payment/ShippingMethodCollection plus ErrorCollection — vendor/shopware/core/Checkout/Gateway/CheckoutGatewayResponse.php:12
- confirmed `/store-api/checkout/gateway` — route `store-api.checkout.gateway`, GET and POST — vendor/shopware/core/Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:41
- confirmed `AbstractCheckoutGatewayRoute` — injected into CartOrderRoute — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:56
- confirmed `AppCheckoutGateway` — implements CheckoutGatewayInterface — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:35
- corrected `checkoutGatewayUrl` — docs: `checkout-gateway-url`; apps filtered on app field checkoutGatewayUrl — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:105
- confirmed `gateways` — manifest element with `checkout` child (anyURI) — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:526
- confirmed `CheckoutGatewayCommandsCollectedEvent` — event class exists — vendor/shopware/core/Checkout/Gateway/Command/Event/CheckoutGatewayCommandsCollectedEvent.php:22
- corrected `add-payment-method-extension` — docs list five commands; code also has payment/shipping extension commands — vendor/shopware/core/Checkout/Gateway/Command/AddPaymentMethodExtensionCommand.php:10
- confirmed `add-cart-error` — command key — vendor/shopware/core/Checkout/Gateway/Command/AddCartErrorCommand.php:11
