---
id: platform/func/extensions/customer-specific-pricing.md
title: Customer Specific Pricing
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/customer-specific-pricing
sourceHash: 6cef26a1aa58970a6dba7eedd18eb099f2e01eac597fb71472a7144d8a4c9e45
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["customer specific pricing", "individual prices", "Shopware Beyond", "Shopware Commercial", "bulk edit custom prices", "Admin API", "ERP integration", "variant ID", "graduated prices"]
summary: "API-only custom prices per customer (list, graduated, currency-dependent), synced from an external system on the Shopware Beyond plan."
lastBuilt: 2026-09-15
---
## What it is
Customer specific pricing lets merchants offer individually calculated prices per customer — list prices, graduated prices, or currency-dependent prices — synchronized into Shopware via an API, typically from an external system such as an ERP. Available from the Shopware Beyond plan via the Shopware Commercial extension.

## When to use
Use when negotiated, customer-specific price lists must be kept in sync with an external pricing system rather than maintained manually in the Administration.

## Key steps / config
- Requirements: a Shopware Beyond plan and the Shopware Commercial extension.
- Creating, reading, changing and deleting custom prices is only possible via the API — there is no Store extension and no dedicated Administration module for this function; prices are transferred entirely through the API.
- A detailed API reference for bulk-editing custom prices ("bulk-edit-custom-prices") is published as part of the Admin API documentation.
- Inheritance (as used for product variants) is not taken into account for custom prices; to target a specific variant you must use that variant's own ID.
- Storefront behaviour: once a customer with stored individual prices logs in, those prices are shown to that customer; once they log out, the original (standard) price is shown again.

## Essential identifiers
- Required plan: `Shopware Beyond`
- Required extension: `Shopware Commercial`
- Admin API operation: bulk edit custom prices

## Gotchas
- There is no administration UI for managing individual prices — everything must go through the API.
- Product-variant price inheritance does not apply to custom prices; each variant needs its own ID-targeted price entry.
