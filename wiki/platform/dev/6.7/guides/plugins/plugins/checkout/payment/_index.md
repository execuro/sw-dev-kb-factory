---
id: platform/dev/6.7/guides/plugins/plugins/checkout/payment/_index.md
title: Payment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/
sourceHash: d9f6d445abc682f076df171543378096854deb4c
codeCheckedAgainst: "6.7.13.0"
keywords: ["payment", "payments", "payment method", "payment provider", "psp", "refund", "payment status", "checkout", "AbstractPaymentHandler", "shopware.payment.method", "payment plugin", "cancellation"]
summary: Section index for Shopware 6.7 payment plugin guides - payment method integration, payment status, refunds, cancellations and notifications.
lastBuilt: 2026-09-15
---
## What it is

Section landing page for the plugin guides about payments in Shopware 6.7. The payment feature covers processing and managing payments: integrating payment methods, tracking payment status, handling refunds and cancellations, and sending payment notifications.

## When to use

Start here when a plugin must extend or customize payment handling beyond the core — for specific business requirements, compliance needs, or integration with a preferred payment provider. The how-to page in this section covers writing a payment plugin with a custom payment handler.

## Essential identifiers

Core entry points in the installed code that the section's guides build on (confirmed in vendor, not named on this index page itself):

- `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler` — base class for payment handlers
- `shopware.payment.method` — service tag for payment handlers
- `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\PaymentHandlerType` — `RECURRING`, `REFUND`

## Code check (6.7.13.0)
- confirmed `AbstractPaymentHandler` — abstract base class with abstract `supports` and `pay` — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `shopware.payment.method` — autoconfigured tag for `AbstractPaymentHandler` subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:130
- confirmed `PaymentHandlerType::REFUND` — enum case — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/PaymentHandlerType.php:11
