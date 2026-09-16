---
id: platform/dev/6.7/guides/plugins/apps/gateways/checkout/command-reference.md
title: Command Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/checkout/command-reference.html
sourceHash: 0bd10ecae672c8d2db9b5f68c8d83b954a210b9b
codeCheckedAgainst: "6.7.13.0"
keywords: ["remove-payment-method", "remove-shipping-method", "add-cart-error", "add-payment-method", "add-shipping-method", "add-payment-method-extension", "add-shipping-method-extension", "AbstractCheckoutGatewayCommand", "AddCartErrorCommand", "checkout gateway", "gateway commands", "app server response", "cart error"]
summary: Checkout gateway command names and payloads an app server returns to remove/add payment and shipping methods or add cart errors.
lastBuilt: 2026-09-15
---
## What it is

Reference of the commands an app's checkout gateway endpoint can return to Shopware. Each command has a `command` key and a `payload` object; Shopware maps the payload onto the command class constructor.

## When to use

When implementing the app-server side of the checkout gateway (manifest `<gateways><checkout>` URL) and you need the exact command keys and payload field names.

## Key steps / config

Response shape per command:

```json
{
  "commands": [
    { "command": "remove-payment-method", "payload": { "paymentMethodTechnicalName": "..." } }
  ]
}
```

Documented commands (since 6.6.3.0):

| Command | Payload | Effect |
|---|---|---|
| `remove-payment-method` | `{"paymentMethodTechnicalName": "string"}` | Removes a payment method from the available ones |
| `remove-shipping-method` | `{"shippingMethodTechnicalName": "string"}` | Removes a shipping method from the available ones |
| `add-cart-error` | `{"message": "string", "level": int, "blocking": bool}` | Adds a cart error; `level` sets the flash message severity, `blocking` blocks checkout |

Additional commands registered in the installed core (not listed on the docs page):

| Command | Payload |
|---|---|
| `add-payment-method` | `{"paymentMethodTechnicalName": "string"}` |
| `add-shipping-method` | `{"shippingMethodTechnicalName": "string"}` |
| `add-payment-method-extension` | `{"paymentMethodTechnicalName": "string", "extensionKey": "string", "extensionsPayload": {}}` |
| `add-shipping-method-extension` | `{"shippingMethodTechnicalName": "string", "extensionKey": "string", "extensionsPayload": {}}` |

For `add-cart-error`, only `message` is mandatory in code: `blocking` defaults to `false` and `level` defaults to `Error::LEVEL_WARNING` (10); `LEVEL_NOTICE` is 0, `LEVEL_ERROR` is 20.

## Essential identifiers

- `Shopware\Core\Checkout\Gateway\Command\AbstractCheckoutGatewayCommand` (`createFromPayload()` spreads the payload as named constructor arguments)
- `Shopware\Core\Checkout\Gateway\Command\RemovePaymentMethodCommand`, `RemoveShippingMethodCommand`, `AddCartErrorCommand`
- `AddPaymentMethodCommand`, `AddShippingMethodCommand`, `AddPaymentMethodExtensionCommand`, `AddShippingMethodExtensionCommand`
- `Shopware\Core\Checkout\Gateway\Command\Event\CheckoutGatewayCommandsCollectedEvent`

## Gotchas

- Payload keys must match the constructor parameter names exactly; unknown or missing keys raise an `\Error` that is logged or thrown as an invalid payload.
- A command without `command` or `payload`, or with an unknown key, is rejected as invalid / handler not found.

## Code check (6.7.13.0)
- confirmed `RemovePaymentMethodCommand::COMMAND_KEY` — value `remove-payment-method`, payload `paymentMethodTechnicalName` — vendor/shopware/core/Checkout/Gateway/Command/RemovePaymentMethodCommand.php:10
- confirmed `RemoveShippingMethodCommand::COMMAND_KEY` — value `remove-shipping-method`, payload `shippingMethodTechnicalName` — vendor/shopware/core/Checkout/Gateway/Command/RemoveShippingMethodCommand.php:10
- confirmed `AddCartErrorCommand::COMMAND_KEY` — value `add-cart-error` — vendor/shopware/core/Checkout/Gateway/Command/AddCartErrorCommand.php:11
- corrected `AddCartErrorCommand::$blocking` — docs: listed as a plain payload field; code gives it default `false` and `level` default `Error::LEVEL_WARNING` — vendor/shopware/core/Checkout/Gateway/Command/AddCartErrorCommand.php:15
- confirmed `Error::LEVEL_WARNING` — value 10 — vendor/shopware/core/Checkout/Cart/Error/Error.php:26
- confirmed `AddPaymentMethodCommand::COMMAND_KEY` — `add-payment-method`, missing from docs table — vendor/shopware/core/Checkout/Gateway/Command/AddPaymentMethodCommand.php:10
- confirmed `AddShippingMethodCommand::COMMAND_KEY` — `add-shipping-method`, missing from docs table — vendor/shopware/core/Checkout/Gateway/Command/AddShippingMethodCommand.php:10
- confirmed `AddPaymentMethodExtensionCommand::COMMAND_KEY` — `add-payment-method-extension` with `extensionKey`/`extensionsPayload` — vendor/shopware/core/Checkout/Gateway/Command/AddPaymentMethodExtensionCommand.php:10
- confirmed `AddShippingMethodExtensionCommand::COMMAND_KEY` — `add-shipping-method-extension` — vendor/shopware/core/Checkout/Gateway/Command/AddShippingMethodExtensionCommand.php:10
- confirmed `AbstractCheckoutGatewayCommand::createFromPayload()` — `new static(...$payload)` — vendor/shopware/core/Checkout/Gateway/Command/AbstractCheckoutGatewayCommand.php:16
