---
id: platform/dev/6.7/guides/plugins/apps/gateways/checkout/command-reference.md
title: Command Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/checkout/command-reference.html
sourceHash: 0bd10ecae672c8d2db9b5f68c8d83b954a210b9b
codeCheckedAgainst: "6.7.15.1"
keywords: ["checkout gateway", "command reference", "remove-payment-method", "remove-shipping-method", "add-cart-error", "paymentMethodTechnicalName", "shippingMethodTechnicalName", "blocking", "cart error", "gateway commands"]
summary: Checkout gateway command keys and payloads (remove-payment-method, remove-shipping-method, add-cart-error) an app server can return.
lastBuilt: 2026-10-21
---
## What it is

Reference for the commands an app server can return in a Checkout Gateway response, with each command's payload.

## Key steps / config

Each response entry has the shape `{"command": "<key>", "payload": {...}}`. Shopware builds the command object by passing the payload keys as named constructor arguments, so the keys must match exactly.

| Command | Payload | Since |
|---|---|---|
| `remove-payment-method` | `{"paymentMethodTechnicalName": "string"}` | 6.6.3.0 |
| `remove-shipping-method` | `{"shippingMethodTechnicalName": "string"}` | 6.6.3.0 |
| `add-cart-error` | `{"message": "string", "level": "int", "blocking": "boolean"}` | 6.6.3.0 |

- `remove-payment-method` / `remove-shipping-method` drop a method from the available payment or shipping methods.
- `add-cart-error` adds a cart error. `level` sets the severity of the flash message: `0` notice, `10` warning, `20` error. `blocking` decides whether checkout is blocked for the customer. In the installed code, `blocking` defaults to `false` and `level` to `10`.

The installed core also registers commands the source page does not list. Their payload keys are the constructor parameters:

- `add-payment-method`: `{"paymentMethodTechnicalName"}`
- `add-shipping-method`: `{"shippingMethodTechnicalName"}`
- `add-payment-method-extension`: `{"paymentMethodTechnicalName", "extensionKey", "extensionsPayload"}`
- `add-shipping-method-extension`: `{"shippingMethodTechnicalName", "extensionKey", "extensionsPayload"}`

## Essential identifiers

- `remove-payment-method`, `remove-shipping-method`, `add-cart-error`
- `Shopware\Core\Checkout\Gateway\Command\RemovePaymentMethodCommand`, `RemoveShippingMethodCommand`, `AddCartErrorCommand`

## Gotchas

- If a payload key is unknown or missing, the named-argument construction fails. That entry is logged as an invalid payload and skipped.

## Code check (6.7.15.1)
- confirmed `RemovePaymentMethodCommand::COMMAND_KEY` — `remove-payment-method`, arg paymentMethodTechnicalName — vendor/shopware/core/Checkout/Gateway/Command/RemovePaymentMethodCommand.php:10
- confirmed `RemoveShippingMethodCommand::COMMAND_KEY` — `remove-shipping-method`, arg shippingMethodTechnicalName — vendor/shopware/core/Checkout/Gateway/Command/RemoveShippingMethodCommand.php:10
- confirmed `AddCartErrorCommand::COMMAND_KEY` — `add-cart-error`, args message, blocking=false, level=LEVEL_WARNING — vendor/shopware/core/Checkout/Gateway/Command/AddCartErrorCommand.php:11
- confirmed `AbstractCheckoutGatewayCommand::createFromPayload()` — `new static(...$payload)` — vendor/shopware/core/Checkout/Gateway/Command/AbstractCheckoutGatewayCommand.php:16
- confirmed `Error::LEVEL_WARNING` — value 10 (NOTICE 0, ERROR 20) — vendor/shopware/core/Checkout/Cart/Error/Error.php:26
- confirmed `AddPaymentMethodCommand::COMMAND_KEY` — `add-payment-method` — vendor/shopware/core/Checkout/Gateway/Command/AddPaymentMethodCommand.php:10
- confirmed `AddShippingMethodCommand::COMMAND_KEY` — `add-shipping-method` — vendor/shopware/core/Checkout/Gateway/Command/AddShippingMethodCommand.php:10
- confirmed `AddPaymentMethodExtensionCommand::COMMAND_KEY` — `add-payment-method-extension` — vendor/shopware/core/Checkout/Gateway/Command/AddPaymentMethodExtensionCommand.php:10
- confirmed `AddShippingMethodExtensionCommand::COMMAND_KEY` — `add-shipping-method-extension` — vendor/shopware/core/Checkout/Gateway/Command/AddShippingMethodExtensionCommand.php:10
- confirmed `CheckoutGatewayException::payloadInvalid()` — construction error logged, entry skipped — vendor/shopware/core/Framework/App/Checkout/Gateway/AppCheckoutGateway.php:146
