---
id: platform/dev/6.7/resources/references/adr/2024-04-01-checkout-gateway.md
title: Checkout gateway
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-04-01-checkout-gateway.html
sourceHash: d8c237c592247c4d3d8ef7db5d76464d84f5e475
codeCheckedAgainst: "6.7.13.0"
keywords: ["checkout gateway", "CheckoutGatewayInterface", "CheckoutGatewayResponse", "CheckoutGatewayRoute", "/store-api/checkout/gateway", "AppCheckoutGateway", "CheckoutGatewayCommandsCollectedEvent", "gateways", "remove-payment-method", "add-cart-error", "payment method availability", "shipping method filter", "app manifest"]
summary: "Checkout gateway ADR: CheckoutGatewayInterface, /store-api/checkout/gateway, app manifest gateways/checkout URL, commands such as remove-payment-method."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-04-01, area checkout) introducing a central checkout gateway: an interface invoked during checkout that decides, based on cart and sales channel context, which payment and shipping methods are available and whether cart errors (including order-blocking ones) apply. Apps hook in via a manifest endpoint that answers with commands.

## When to use

When a payment/shipping provider or an external system (ERP, PIM, risk assessment, provider outage check) must filter payment/shipping methods or block the order at checkout, from an app server or a plugin.

## Key steps / config

1. **Interface** `Shopware\Core\Checkout\Gateway\CheckoutGatewayInterface`:
   ```php
   public function process(CheckoutGatewayPayloadStruct $payload): CheckoutGatewayResponse;
   ```
   The payload (`Shopware\Core\Checkout\Gateway\Command\Struct\CheckoutGatewayPayloadStruct`) carries cart, sales channel context and currently available payment/shipping methods. `CheckoutGatewayResponse` holds a `PaymentMethodCollection`, a `ShippingMethodCollection` and a cart `ErrorCollection` (getters/setters for each).
2. **Store API**: `CheckoutGatewayRoute` at `/store-api/checkout/gateway` (route name `store-api.checkout.gateway`, GET/POST). `CartOrderRoute` depends on the gateway route to validate the cart during order placement. The Storefront calls it on checkout-confirm and edit-order pages; context changes (language, currency) reload the payment method selection.
3. **App manifest** endpoint:
   ```xml
   <manifest>
       <gateways>
           <checkout>https://example.com/checkout/gateway</checkout>
       </gateways>
   </manifest>
   ```
   `AppCheckoutGateway` calls every active app with a checkout gateway URL, in sequence.
4. **App payload** (methods as technical names only):
   ```json
   { "salesChannelContext": {...}, "cart": {...},
     "paymentMethods": ["<technical-name>", ...],
     "shippingMethods": ["<technical-name>", ...] }
   ```
5. **App response**: an ordered list of commands, executed in the given order. Payload keys map to the command's constructor arguments:
   ```json
   [
     { "command": "remove-payment-method", "payload": { "paymentMethodTechnicalName": "..." } },
     { "command": "add-cart-error", "payload": { "message": "...", "blocking": true, "level": 20 } }
   ]
   ```
   Command keys: `add-payment-method`, `remove-payment-method`, `add-shipping-method`, `remove-shipping-method`, `add-cart-error`, plus `add-payment-method-extension` and `add-shipping-method-extension` in the installed code.
6. **Event** `CheckoutGatewayCommandsCollectedEvent` is dispatched after all app commands are collected and before execution, so plugins can modify the command collection.

## Essential identifiers

- `CheckoutGatewayInterface`, `CheckoutGatewayPayloadStruct`, `CheckoutGatewayResponse`
- `CheckoutGatewayRoute`, `/store-api/checkout/gateway`
- `AppCheckoutGateway`, `CheckoutGatewayCommandsCollectedEvent`
- manifest `gateways` > `checkout`
- `AbstractCheckoutGatewayCommand`

## Gotchas

- For the initial release only one implementation is supported: the app-system one. `AppCheckoutGateway` is annotated `@internal`.
- Following the command structure is encouraged but not mandatory for a custom plugin implementation.
- Unknown command keys or a missing `payload` are logged (or thrown) and skipped.
- The ADR's `add-cart-error` sample uses `reason`/`blockOrder`; the installed command reads `message`/`blocking`/`level`.

## Code check (6.7.13.0)
- confirmed `CheckoutGatewayInterface::process()` — takes CheckoutGatewayPayloadStruct, returns CheckoutGatewayResponse — vendor/shopware/core/Checkout/Gateway/CheckoutGatewayInterface.php:11
- corrected `CheckoutGatewayResponse` — docs: EntityCollection of methods plus CartErrors; code: PaymentMethodCollection, ShippingMethodCollection, ErrorCollection — vendor/shopware/core/Checkout/Gateway/CheckoutGatewayResponse.php:12
- confirmed `CheckoutGatewayRoute` — path /store-api/checkout/gateway, GET and POST — vendor/shopware/core/Checkout/Gateway/SalesChannel/CheckoutGatewayRoute.php:41
- confirmed `AbstractCheckoutGatewayRoute` — injected into CartOrderRoute for order validation — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:56
- confirmed `AppCheckoutGateway` — implements the interface, filters apps on checkoutGatewayUrl — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:33
- confirmed `CheckoutGatewayCommandsCollectedEvent` — dispatched before command execution — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:81
- confirmed `gateways` — manifest element with checkout anyURI child — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:513
- confirmed `RemovePaymentMethodCommand` — key remove-payment-method, payload paymentMethodTechnicalName — vendor/shopware/core/Checkout/Gateway/Command/RemovePaymentMethodCommand.php:8
- corrected `AddCartErrorCommand` — docs: payload reason/blockOrder; code: message, blocking, level — vendor/shopware/core/Checkout/Gateway/Command/AddCartErrorCommand.php:9
- confirmed `AbstractCheckoutGatewayCommand::createFromPayload()` — spreads payload into constructor arguments — vendor/shopware/core/Checkout/Gateway/Command/AbstractCheckoutGatewayCommand.php:16
