---
id: platform/dev/6.7/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md
title: Introduction of Unique Identifiers for Checkout Methods
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.html
sourceHash: 34d4048d27e32eb4654da1be04245c18b9533bcc
codeCheckedAgainst: "6.7.15.1"
keywords: ["technicalName", "technical_name", "payment_method", "shipping_method", "PaymentMethodDefinition", "ShippingMethodDefinition", "payment method identifier", "shipping method identifier", "unique index", "app payment method", "checkout methods", "adr"]
summary: "ADR: payment_method and shipping_method get a unique technicalName, required from 6.7.0.0; migration and app lifecycle generate values automatically."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-10-17, area Checkout) introducing a `technicalName` property on the `payment_method` and `shipping_method` entities as a stable unique identifier, so extensions and app servers can identify methods without looking up IDs through the Admin API.

## When to use

- A plugin creates payment or shipping methods and must supply a `technicalName`.
- An app server needs to recognise a payment/shipping method by a fixed name instead of a shop-specific ID.
- A merchant reviews custom-created methods after the field became required.

## Key steps / config

1. Field: `technicalName` (column `technical_name`, `VARCHAR(255)`) on both entities, with a unique constraint `uniq.technical_name`. Before 6.7.0.0 it was optional in DB/API but mandatory in the Administration; from 6.7.0.0 it is required in the database and API (the 6.7 definitions flag it `Required`).
2. Plugins: pass `technicalName` in the payload when creating payment and shipping methods.
3. Default Shopware methods receive generated names via migration:

| Type | Name | Technical name |
|---|---|---|
| Payment | Debit | `payment_debitpayment` |
| Payment | Invoice | `payment_invoicepayment` |
| Payment | Cash on Delivery | `payment_cashpayment` |
| Payment | Pre Payment | `payment_prepayment` |
| Shipping | Standard | `shipping_standard` |
| Shipping | Express | `shipping_express` |

Payment names are built as `payment_` + lowercased short class name of the handler; shipping names as `shipping_` + lowercased default name.

4. App methods get names generated from the app name and the manifest `identifier`: `payment_<AppName>_<identifier>` (e.g. `payment_MyApp_my_payment_method`) and `shipping_<AppName>_<identifier>` (e.g. `shipping_MyApp_my_shipping_method`).

## Essential identifiers

- `technicalName` / `technical_name` on `payment_method` and `shipping_method`
- `Shopware\Core\Checkout\Payment\PaymentMethodDefinition`, `Shopware\Core\Checkout\Shipping\ShippingMethodDefinition`
- Unique index `uniq.technical_name`
- Migration `Migration1697112043AddPaymentAndShippingTechnicalName`

## Gotchas

- Changing a `technicalName` in the Administration can break existing integrations that rely on it.
- Merchants must update their custom-created payment and shipping methods with a `technicalName`.
- The migration only fills `technical_name` where it is still `NULL` (`UPDATE IGNORE`), and the shipping defaults are matched by their system-language name `Standard`/`Express`; renamed defaults are not covered.

## Version notes

- Before 6.7.0.0: optional in DB/API, mandatory in the Administration.
- 6.7.0.0 and later: required in DB and API.

## Code check (6.7.15.1)
- confirmed `technicalName` — payment_method StringField flagged ApiAware and Required — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:82
- confirmed `technicalName` — shipping_method StringField flagged ApiAware and Required — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:80
- confirmed `Migration1697112043AddPaymentAndShippingTechnicalName` — migration adding the column and filling defaults — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:22
- confirmed `uniq.technical_name` — unique constraint added on `payment_method` — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:39
- confirmed `uniq.technical_name` — unique constraint added on `shipping_method` — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:50
- confirmed `payment_cashpayment` — payment names derived as payment_ + lowercased handler class name — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:54
- confirmed `shipping_` — default shipping names built from lowercased Standard/Express — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:82
- confirmed `technicalName` — app payment methods get `payment_%s_%s` from app name and identifier — vendor/shopware/core/Framework/App/Lifecycle/Handler/PaymentMethodLifecycleHandler.php:83
- confirmed `technicalName` — app shipping methods get `shipping_%s_%s` from app name and identifier — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:78
