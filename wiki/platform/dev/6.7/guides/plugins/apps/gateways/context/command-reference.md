---
id: platform/dev/6.7/guides/plugins/apps/gateways/context/command-reference.md
title: Context Gateway Command Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/gateways/context/command-reference.html
sourceHash: 1ba8ee4af3e57963210e3031646e279c289cc996
codeCheckedAgainst: "6.7.13.0"
keywords: ["context_change-currency", "context_change-language", "context_login-customer", "context_register-customer", "context_add-customer-message", "context_change-shipping-location", "RegisterCustomerCommand", "AddressResponseStruct", "context gateway", "gateway commands", "customer registration", "sales channel context"]
summary: Context gateway command keys and payloads (context_change-currency, context_register-customer, ...) plus the register-customer data fields.
lastBuilt: 2026-09-15
---
## What it is

Reference of the commands an app server can return from its context gateway endpoint to change the customer's sales channel context, plus the fields accepted in the `data` object of `context_register-customer`. All commands exist since 6.7.1.0.

## When to use

When building the app-server response for the context gateway and you need the exact command keys, payload field names, or registration data fields.

## Key steps / config

Commands (payload keys are the command constructor parameter names):

| Command | Payload |
|---|---|
| `context_add-customer-message` | `{"message": "string"}` — Storefront FlashBag message |
| `context_change-billing-address` | `{"addressId": "string"}` |
| `context_change-shipping-address` | `{"addressId": "string"}` |
| `context_change-currency` | `{"iso": "string"}` — ISO 4217 code |
| `context_change-language` | `{"iso": "string"}` — BCP 47 tag |
| `context_change-payment-method` | `{"technicalName": "string"}` |
| `context_change-shipping-method` | `{"technicalName": "string"}` |
| `context_change-shipping-location` | `{"countryIso": "string", "countryStateIso": "string"}` — both optional (nullable) |
| `context_login-customer` | `{"customerEmail": "string"}` |
| `context_register-customer` | `{"data": {...}}` |

`context_register-customer` `data` fields (passed to the Store API register route):

- Required: `firstName`, `lastName`, `email`, `storefrontUrl` (must match a domain URL of the sales channel), `billingAddress`.
- Optional: `title`, `accountType` (`private`/`business`), `salutationId`, `guest`, `requestedGroupId`, `affiliateCode`, `campaignCode`, `birthdayDay`, `birthdayMonth`, `birthdayYear`, `password` (for non-guest customers, plain text, hashed by the shop), `shippingAddress`, `vatIds`, `acceptedDataProtection`.

`AddressResponseStruct` (for `billingAddress` / `shippingAddress`):

- Required: `firstName`, `lastName`, `street`, `zipcode`, `city`, `countryId`.
- Optional: `title`, `salutationId`, `company`, `department`, `countryStateId`, `additionalAddressLine1`, `additionalAddressLine2`, `phoneNumber`.

## Essential identifiers

- `Shopware\Core\Framework\Gateway\Context\Command\RegisterCustomerCommand`
- `Shopware\Core\Framework\Gateway\Context\Command\LoginCustomerCommand`
- `ChangeCurrencyCommand`, `ChangeLanguageCommand`, `ChangePaymentMethodCommand`, `ChangeShippingMethodCommand`, `ChangeShippingLocationCommand`, `ChangeBillingAddressCommand`, `ChangeShippingAddressCommand`, `AddCustomerMessageCommand`

## Gotchas

- Docs say `guest` defaults to `true`; the register route reads it with `getBoolean('guest')`, so an omitted `guest` is treated as `false` (a regular account, which then needs `password`).
- `acceptedDataProtection` is only enforced (not blank) when the system config `core.loginRegistration.requireDataProtectionCheckbox` is enabled for the sales channel.
- For business accounts, `vatIds` can become required depending on the billing country.
- Only one register or login command per response, and no duplicate command types.

## Code check (6.7.13.0)
- confirmed `ChangeCurrencyCommand::COMMAND_KEY` — `context_change-currency`, payload `iso` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeCurrencyCommand.php:10
- confirmed `ChangeShippingLocationCommand::$countryIso` — nullable, default null, as is `countryStateIso` — vendor/shopware/core/Framework/Gateway/Context/Command/ChangeShippingLocationCommand.php:13
- confirmed `LoginCustomerCommand::$customerEmail` — payload key for `context_login-customer` — vendor/shopware/core/Framework/Gateway/Context/Command/LoginCustomerCommand.php:13
- confirmed `RegisterCustomerCommand::$data` — `context_register-customer` takes one `data` array — vendor/shopware/core/Framework/Gateway/Context/Command/RegisterCustomerCommand.php:16
- confirmed `AddCustomerMessageCommand::COMMAND_KEY` — `context_add-customer-message`, payload `message` — vendor/shopware/core/Framework/Gateway/Context/Command/AddCustomerMessageCommand.php:10
- confirmed `RegisterCustomerCommandHandler::handle()` — passes `data` to `AbstractRegisterRoute::register()` — vendor/shopware/core/Framework/Gateway/Context/Command/Handler/RegisterCustomerCommandHandler.php:29
- corrected `guest` — docs: default true; route reads `getBoolean('guest')` with no default (false when omitted) — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:111
- confirmed `storefrontUrl` — NotBlank and must be one of the sales channel domain URLs — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:295
- corrected `acceptedDataProtection` — docs: optional, default false; required when `core.loginRegistration.requireDataProtectionCheckbox` is set — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:347
- confirmed `ContextGatewayCommandValidator::validate()` — one token command, no duplicate types — vendor/shopware/core/Framework/Gateway/Context/Command/Executor/ContextGatewayCommandValidator.php:25
