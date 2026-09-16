---
id: platform/dev/6.7/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md
title: Introduction of Unique Identifiers for Checkout Methods
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.html
sourceHash: 34d4048d27e32eb4654da1be04245c18b9533bcc
codeCheckedAgainst: "6.7.13.0"
keywords: ["technicalName", "technical_name", "payment_method", "shipping_method", "payment method identifier", "shipping method identifier", "uniq.technical_name", "payment_cashpayment", "shipping_standard", "app payment method", "manifest identifier", "checkout methods"]
summary: "ADR: technicalName unique identifier on payment_method and shipping_method; required in DB/API since 6.7.0.0, auto-generated for defaults and app methods."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area Checkout, 2023-10-17) adding a unique `technicalName` property to the `payment_method` and `shipping_method` entities so extensions and app servers can identify methods without looking up IDs via the Admin API.

## When to use

Read this when creating payment or shipping methods from a plugin or app, when an integration needs a stable identifier for a checkout method, or when merchants' custom methods lack a technical name after upgrading.

## Key steps / config

- Property `technicalName` (DB column `technical_name`) on `payment_method` and `shipping_method`, guarded by a unique index `uniq.technical_name`.
- Transition: optional in database and API but mandatory in the Administration; from 6.7.0.0 required in database and API. In 6.7.13.0 both definitions declare `(new StringField('technical_name', 'technicalName'))->addFlags(new ApiAware(), new Required())`, and the columns are `NOT NULL`.
- Plugins must supply a `technicalName` for their payment and shipping methods (at the latest from 6.7.0.0).
- The migration generates names for Shopware's default methods:

| Type | Name | Technical name |
|---|---|---|
| Payment | Debit | `payment_debitpayment` |
| Payment | Invoice | `payment_invoicepayment` |
| Payment | Cash on Delivery | `payment_cashpayment` |
| Payment | Pre Payment | `payment_prepayment` |
| Shipping | Standard | `shipping_standard` |
| Shipping | Express | `shipping_express` |

- App methods get a generated name from the app name and the manifest `identifier`: `payment_<AppName>_<identifier>` / `shipping_<AppName>_<identifier>`, e.g. `payment_MyApp_my_payment_method`, `shipping_MyApp_my_shipping_method`.

## Essential identifiers

- `technicalName` / `technical_name` on `payment_method`, `shipping_method`
- `Shopware\Core\Checkout\Payment\PaymentMethodDefinition`, `Shopware\Core\Checkout\Shipping\ShippingMethodDefinition`
- `uniq.technical_name`

## Gotchas

- Merchants must review custom-created payment and shipping methods and set `technicalName` in the Administration.
- Changing `technicalName` in the Administration can break existing integrations. In 6.7.13.0 the payment detail field is disabled when the technical name is provided by the extension.

## Version notes

- 6.5 (migration `Migration1697112043AddPaymentAndShippingTechnicalName`): nullable column, unique index, generated values.
- 6.7.0.0 (`Migration1697112044PaymentAndShippingTechnicalNameRequired`): column made `NOT NULL`, field `Required` in the API.

## Code check (6.7.13.0)
- confirmed `technicalName` — required, API-aware StringField on payment method — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:79
- confirmed `technicalName` — required, API-aware StringField on shipping method — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:77
- confirmed `uniq.technical_name` — unique constraint added on `payment_method` — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:39
- confirmed `payment_cashpayment` — default payment names derived from handler class name — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:54
- confirmed `shipping_` — default shipping names are `shipping_` + lowercased Standard/Express — vendor/shopware/core/Migration/V6_5/Migration1697112043AddPaymentAndShippingTechnicalName.php:82
- confirmed `technical_name` — `payment_method` column NOT NULL in 6.7 — vendor/shopware/core/Migration/V6_7/Migration1697112044PaymentAndShippingTechnicalNameRequired.php:28
- confirmed `payment_%s_%s` — app payment method technical name pattern — vendor/shopware/core/Framework/App/Lifecycle/Handler/PaymentMethodLifecycleHandler.php:82
- confirmed `shipping_%s_%s` — app shipping method technical name pattern — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:78
- confirmed `technicalNameIsProvided` — Admin field required, disabled when provided — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-payment/page/sw-settings-payment-detail/sw-settings-payment-detail.html.twig:104
