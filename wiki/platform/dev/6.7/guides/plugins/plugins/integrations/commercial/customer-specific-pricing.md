---
id: platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md
title: Custom Pricing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.html
sourceHash: 42c56ed537c1f428912c51cfddd781087ef55e9e
codeCheckedAgainst: "6.7.15.1"
keywords: ["customer-specific pricing", "custom prices", "custom price", "/api/_action/custom-price", "upsert", "delete", "productId", "customerId", "customerIds", "productIds", "customerGroupIds", "sync api", "price override", "erp pricing", "commercial plugin"]
summary: Commercial plugin route /api/_action/custom-price - sync-style upsert/delete of per-customer product price overrides from an ERP.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Customer-specific pricing is a Commercial plugin feature that lets an external data source or ERP override the price of a product for a particular customer. It defines a custom relationship between the current price and the Customer entity and is driven through an Admin API route.

## When to use

When an ERP or external pricing system must push granular per-customer price overrides into Shopware.

## Key steps / config

1. Install and activate the Commercial plugin (see the [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)), and have the `Custom Prices` feature activated within the merchant account.
2. Authenticate against the Admin API like any other admin request.
3. Send commands to `/api/_action/custom-price`. The body is shaped like a sync API request; `upsert` and `delete` actions can be used alone or combined in one request, and each command runs independently and isolated.

`upsert` payload entries take `productId`, `customerId` and `price` (a price-rule list with quantity ranges and per-currency prices):

```json
[{ "action": "upsert", "payload": [{
  "productId": "...", "customerId": "...",
  "price": [{ "quantityStart": 1, "quantityEnd": null,
    "price": [{ "currencyId": "...", "gross": 0.0, "net": 0.0, "linked": true }] }]
}]}]
```

`delete` payload entries accept any combination of the ID arrays `customerIds`, `productIds`, `customerGroupIds`; at least one UUID must be supplied in one of them:

```json
[{ "action": "delete", "payload": [{
  "productIds": ["..."], "customerIds": ["..."], "customerGroupIds": []
}]}]
```

## Essential identifiers

- `/api/_action/custom-price`
- Actions `upsert`, `delete`
- Upsert fields `productId`, `customerId`, `price` (`quantityStart`, `quantityEnd`, `currencyId`, `gross`, `net`, `linked`)
- Delete fields `customerIds`, `productIds`, `customerGroupIds`
- Response key `errors`

## Gotchas

- Errors do not produce an error status code (as with the sync API); validation errors are returned in the `errors` key.
- Unlike the core `sync` route, headers cannot be used to adapt the endpoint's behaviour; the optional sync header flags (`indexing-behavior`, `single-operation`) are not supported. Indexing of relevant product data is handled per request.
- Price filtering on the product listing page does not support the overridden prices.
- Elasticsearch product mapping does not support customer-specific pricing data.
- The `customerGroupId` parameter in the request body is a non-functional stub kept to avoid future breaking changes; data passed for it does not affect the Storefront.

## Code check (6.7.15.1)
- unverified `/api/_action/custom-price` — route ships in the Commercial plugin, outside core/storefront/administration
- unverified `Custom Prices` — Commercial plugin feature toggle, out of scope
- confirmed `/api/_action/sync` — core sync route the custom-price API models itself on — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `PlatformRequest::HEADER_INDEXING_BEHAVIOR` — core sync header `indexing-behavior`, not honoured by the custom-price route per docs — vendor/shopware/core/PlatformRequest.php:29
- unverified `single-operation` — no core PHP constant; only sent by the administration client's repository code
