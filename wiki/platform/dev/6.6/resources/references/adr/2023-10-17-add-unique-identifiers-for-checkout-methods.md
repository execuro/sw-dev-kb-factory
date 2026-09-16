---
id: platform/dev/6.6/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.md
title: Introduction of Unique Identifiers for Checkout Methods
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-10-17-add-unique-identifiers-for-checkout-methods.html"
sourceHash: 34d4048d27e32eb4654da1be04245c18b9533bcc
keywords: ["technicalName", "payment_method", "shipping_method", "checkout methods", "unique identifier", "app manifest identifier", "payment method", "shipping method", "ADR", "app server", "Admin API"]
summary: "ADR: `payment_method`/`shipping_method` gain a `technicalName` property, mandatory in Administration and required in DB/API from 6.7.0.0."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing a `technicalName` property on the `payment_method` and `shipping_method` entities so extension developers and app servers can identify checkout methods without calling the Admin API by ID.

## When to use
Relevant when an app or plugin registers payment/shipping methods, or needs a stable identifier for a method instead of its database ID.

## Key steps / config
- `technicalName` is added to both `payment_method` and `shipping_method` entities.
- Optional in the database and API (for backward compatibility), but mandatory in the Administration; a unique index enforces uniqueness.
- From 6.7.0.0 the field becomes required in the database and API.
- Default Shopware payment/shipping methods get an auto-generated `technicalName` during migration, e.g. `payment_debitpayment` (Debit), `payment_invoicepayment` (Invoice), `payment_cashpayment` (Cash on Delivery), `payment_prepayment` (Pre Payment), `shipping_standard` (Standard), `shipping_express` (Express).
- App-provided methods get a generated `technicalName` from the app's name plus the manifest `identifier`, e.g. app `MyApp` with identifier `my_payment_method` becomes `payment_MyApp_my_payment_method`.

## Essential identifiers
- `payment_method` entity, `technicalName` property
- `shipping_method` entity, `technicalName` property

## Gotchas
Plugin developers must supply a `technicalName` for their payment/shipping methods starting at least with 6.7.0.0. Merchants must review custom-created methods for the new property. Changing `technicalName` via the administration can disrupt existing integrations.

## Version notes
Starting from 6.7.0.0, `technicalName` becomes required within the database and the API (it is optional before that version).
