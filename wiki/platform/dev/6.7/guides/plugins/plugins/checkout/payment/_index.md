---
id: platform/dev/6.7/guides/plugins/plugins/checkout/payment/_index.md
title: Payment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/payment/
sourceHash: d9f6d445abc682f076df171543378096854deb4c
codeCheckedAgainst: "6.7.15.1"
keywords: ["payment", "payment method", "payment provider", "payment status", "refund", "cancellation", "payment notification", "AbstractPaymentHandler", "shopware.payment.method", "payment plugin", "psp"]
summary: Overview of the plugin guides for payments in Shopware 6.7 - payment methods, payment status, refunds, cancellations and payment provider integration.
lastBuilt: 2026-10-21
---
## What it is

Section overview for payment-related plugin guides. Payment in Shopware covers processing and managing payments: integrating payment methods, tracking payment status, handling refunds and cancellations, and sending payment notifications. These functions exist in the core; plugins extend or customize them for business requirements, compliance needs, or integration with a preferred payment provider.

## When to use

Start here when a plugin has to add a payment method, integrate a payment service provider, or change how an existing payment method behaves. In the installed 6.7 code, a plugin payment handler extends `Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AbstractPaymentHandler` and is registered with the `shopware.payment.method` service tag; refunds and recurring payments are opt-in via its `supports()` method.

## Code check (6.7.15.1)
- confirmed `AbstractPaymentHandler` — abstract base for payment handlers — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:18
- confirmed `AbstractPaymentHandler::supports()` — abstract, decides refund/recurring support — vendor/shopware/core/Checkout/Payment/Cart/PaymentHandler/AbstractPaymentHandler.php:24
- confirmed `shopware.payment.method` — autoconfigured tag for AbstractPaymentHandler subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:131
