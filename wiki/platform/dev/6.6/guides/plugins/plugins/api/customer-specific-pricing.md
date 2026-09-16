---
id: platform/dev/6.6/guides/plugins/plugins/api/customer-specific-pricing.md
title: Custom Pricing
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/api/customer-specific-pricing.html
sourceHash: 19109eaa86e80d9d48436f3b9acd32dde5a2ac1e
keywords: ["/api/_action/custom-price", "customer-specific pricing", "Custom Prices", "upsert", "delete", "customerId", "productId", "customerGroupId", "sync API", "Commercial plugin", "price override", "ERP integration"]
summary: "The Commercial plugin's /api/_action/custom-price endpoint lets ERPs upsert or delete per-customer/product price overrides."
lastBuilt: "2026-09-15"
---
## What it is

Customer-specific Pricing is a Commercial plugin feature that exposes an API to override product prices per customer via an external data repository or ERP system, by defining a custom relationship between price and the Customer entity.

## When to use

When an external ERP or data system needs to grant a specific customer a custom price for a product, requiring the Shopware 6 Commercial plugin with the `Custom Prices` feature activated in the merchant account.

## Key steps / config

Use the endpoint `/api/_action/custom-price`, authenticated the same way as any other Admin API request. The interface models itself on the sync API, so `upsert` and `delete` actions can be combined in one request.

`upsert` payload shape:

```json
[{
  "action": "upsert",
  "payload": [{
    "productId": "...",
    "customerId": "...",
    "price": [{
      "quantityStart": 1,
      "quantityEnd": null,
      "price": [{ "currencyId": "...", "gross": 0, "net": 0, "linked": true }]
    }]
  }]
}]
```

`delete` payload takes `productIds`, `customerIds`, or `customerGroupIds` arrays; at least one id must be supplied across those arrays.

Validation errors are returned in the response's `errors` key rather than as an error code; unlike the standard `sync` API, headers cannot be used to adapt this endpoint's behavior.

## Essential identifiers

- `/api/_action/custom-price`
- `upsert` / `delete` actions
- `productId`, `customerId`, `price`
- `productIds`, `customerIds`, `customerGroupIds`
- `customerGroupId` (payload field)

## Gotchas

Price filtering on the product listing page does not currently support overridden prices. ElasticSearch product mapping does not currently support this data. The `indexing-behavior`/`single-operation` header flags from the core sync API are not supported here. The `customerGroupId` parameter is a stub kept only to avoid future breaking changes and currently has no effect on the Storefront.
