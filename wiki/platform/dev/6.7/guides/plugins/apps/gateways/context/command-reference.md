---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/gateways/context/command-reference.md
sourceHash: 1ba8ee4af3e57963210e3031646e279c289cc996
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/context/command-reference.html
title: Context Gateway Command Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["context gateway", "context_change-currency", "context_change-language", "context_register-customer", "context_login-customer", "context_change-shipping-location", "context_add-customer-message", "RegisterCustomerCommand", "AddressResponseStruct", "app gateway commands", "sales channel context switch", "command payload"]
summary: Command keys and payloads an app server may return from the Context Gateway, plus the data fields of context_register-customer.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/gateways/context/context-gateway.md"]
---
## What it is

Reference of the commands an app server can return in the `commands` array of a Context Gateway response, with each command's payload shape, and the accepted fields of the `data` object for `context_register-customer`. All commands exist since 6.7.1.0.

## When to use

When building the app-server response for the Context Gateway and you need the exact command key and payload keys.

## Key steps / config

Each returned command is an object `{"command": "<key>", "payload": {...}}`.

| Command | Payload |
|---|---|
| `context_add-customer-message` | `{"message": "string"}` — error message shown in the Storefront via FlashBag |
| `context_change-billing-address` | `{"addressId": "string"}` |
| `context_change-shipping-address` | `{"addressId": "string"}` |
| `context_change-currency` | `{"iso": "string"}` — ISO 4217 code |
| `context_change-language` | `{"iso": "string"}` — BCP 47 tag |
| `context_change-payment-method` | `{"technicalName": "string"}` |
| `context_change-shipping-method` | `{"technicalName": "string"}` |
| `context_change-shipping-location` | `{"countryIso": "string", "countryStateIso": "string"}` (both optional in code) |
| `context_login-customer` | `{"customerEmail": "string"}` |
| `context_register-customer` | `{"data": {...}}` — registers and logs in a new customer |

### `data` fields for RegisterCustomerCommand

- Required: `firstName`, `lastName`, `email`, `storefrontUrl` (one of the sales channel's domains, found under sales channel context -> sales channel -> domains), `billingAddress`.
- Optional: `title`, `accountType` (`private`/`business`), `salutationId`, `guest` (bool, default `true`), `requestedGroupId`, `affiliateCode`, `campaignCode`, `birthdayDay`, `birthdayMonth`, `birthdayYear`, `password` (plain text, needed for non-guest customers; hashed by the shop), `shippingAddress`, `vatIds` (array), `acceptedDataProtection` (bool, default `false`).

### AddressResponseStruct (for `billingAddress` / `shippingAddress`)

- Required: `firstName`, `lastName`, `street`, `zipcode`, `city`, `countryId`.
- Optional: `title`, `salutationId`, `company`, `department`, `countryStateId`, `additionalAddressLine1`, `additionalAddressLine2`, `phoneNumber`.

## Essential identifiers

- Command keys: `context_add-customer-message`, `context_change-billing-address`, `context_change-shipping-address`, `context_change-currency`, `context_change-language`, `context_change-payment-method`, `context_change-shipping-method`, `context_change-shipping-location`, `context_login-customer`, `context_register-customer`
- `RegisterCustomerCommand`, `AddressResponseStruct`

## Gotchas

- In core, `context_register-customer` and `context_login-customer` are "token commands" (they implement `TokenCommandInterface`) and are executed before all other commands; a new context token results.
- `RegisterCustomerCommand` takes the `data` array as-is; the field list above comes from the docs and is not validated by the command class itself.

## Code check (6.7.15.1)
- confirmed `context_add-customer-message` — AddCustomerMessageCommand::COMMAND_KEY — vendor/shopware/core/Framework/Gateway/Context/Command/AddCustomerMessageCommand.php:10
- confirmed `context_change-billing-address` — ChangeBillingAddressCommand::COMMAND_KEY, payload `addressId` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeBillingAddressCommand.php:10
- confirmed `context_change-shipping-address` — ChangeShippingAddressCommand::COMMAND_KEY — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeShippingAddressCommand.php:10
- confirmed `context_change-currency` — ChangeCurrencyCommand::COMMAND_KEY, payload `iso` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeCurrencyCommand.php:10
- confirmed `context_change-language` — ChangeLanguageCommand::COMMAND_KEY, payload `iso` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeLanguageCommand.php:10
- confirmed `context_change-payment-method` — ChangePaymentMethodCommand::COMMAND_KEY, payload `technicalName` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangePaymentMethodCommand.php:10
- confirmed `context_change-shipping-method` — ChangeShippingMethodCommand::COMMAND_KEY, payload `technicalName` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeShippingMethodCommand.php:10
- confirmed `context_change-shipping-location` — nullable `countryIso`/`countryStateIso` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeShippingLocationCommand.php:10
- confirmed `context_login-customer` — LoginCustomerCommand::COMMAND_KEY, payload `customerEmail` — vendor/shopware/core/Framework/Gateway/Context/Command/LoginCustomerCommand.php:10
- confirmed `context_register-customer` — RegisterCustomerCommand::COMMAND_KEY, takes `array $data`, implements TokenCommandInterface — vendor/shopware/core/Framework/Gateway/Context/Command/RegisterCustomerCommand.php:10
