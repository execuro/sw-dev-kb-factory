---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/gateways/checkout/command-reference.md
sourceHash: 80c15cdfd314f0c3113136b91e42859a1494b733
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/gateways/checkout/command-reference.html
title: Checkout Gateway Command Reference
version: "6.6"
versions:
  - "6.6"
keywords: ["remove-payment-method", "remove-shipping-method", "add-cart-error", "paymentMethodTechnicalName", "shippingMethodTechnicalName", "checkout gateway commands", "cart error level", "blocking"]
summary: "Reference of Checkout Gateway response commands: remove-payment-method, remove-shipping-method, add-cart-error, all since 6.6.3.0."
lastBuilt: 2026-09-15
---
## What it is

Reference table of the commands a Checkout Gateway response can send back to Shopware.

## Key steps / config

| Command | Payload | Since |
|---|---|---|
| `remove-payment-method` | `{"paymentMethodTechnicalName": "string"}` | 6.6.3.0 |
| `remove-shipping-method` | `{"shippingMethodTechnicalName": "string"}` | 6.6.3.0 |
| `add-cart-error` | `{"message": "string", "level": "int", "blocking": "boolean"}` | 6.6.3.0 |

`remove-payment-method` removes a payment method from the available payment methods. `remove-shipping-method` removes a shipping method from the available shipping methods. `add-cart-error` adds an error to the cart; `level` sets the severity of the cart error flash message, and `blocking` decides whether checkout is blocked for the customer.

## Essential identifiers

- `remove-payment-method`, `remove-shipping-method`, `add-cart-error`
- payload keys: `paymentMethodTechnicalName`, `shippingMethodTechnicalName`, `message`, `level`, `blocking`

## Version notes

All three commands are available since Shopware 6.6.3.0.
