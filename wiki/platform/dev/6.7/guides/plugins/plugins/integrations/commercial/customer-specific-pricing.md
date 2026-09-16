---
id: platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md
title: Custom Pricing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.html
sourceHash: 42c56ed537c1f428912c51cfddd781087ef55e9e
codeCheckedAgainst: "6.7.13.0"
keywords: ["/api/_action/custom-price", "customer-specific pricing", "custom prices", "custom_price", "customerId", "productId", "customerGroupIds", "upsert", "delete", "sync api", "erp price override", "commercial plugin", "indexing-behavior"]
summary: "Commercial plugin route /api/_action/custom-price: sync-style upsert/delete of per-customer product price overrides, payload shape and known caveats."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Customer-specific pricing is a Commercial plugin feature that lets an external data source or ERP override a product's price for an individual customer. It defines a relationship between the price and the Customer entity and is driven through a single Admin API action route modelled on the sync API.

## When to use

When prices negotiated per customer live in an ERP or other external system and must override the standard product price in Shopware.

## Key steps / config

1. Prerequisites: a Shopware 6 installation, the Commercial plugin installed and activated (see [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)), and the `Custom Prices` feature activated in the relevant merchant account.
2. Authenticate like any other Admin API request.
3. `POST` to `/api/_action/custom-price` with a sync-style array of commands. `upsert` and `delete` can be sent alone or combined; each command runs independently and isolated.

`upsert` payload — `productId`, `customerId`, `price` (price rules with quantity range and per-currency prices):

```json
[{ "action": "upsert", "payload": [{
  "productId": "...", "customerId": "...",
  "price": [{ "quantityStart": 1, "quantityEnd": null,
    "price": [{ "currencyId": "...", "gross": 0.0, "net": 0.0, "linked": true }] }]
}]}]
```

`delete` payload — any combination of `customerIds`, `productIds`, `customerGroupIds`, but at least one UUID must be supplied across the three arrays:

```json
[{ "action": "delete", "payload": [{
  "productIds": ["..."], "customerIds": ["..."], "customerGroupIds": []
}]}]
```

4. Check the response body: validation errors do not produce an error status code; they are reported under the `errors` key.

## Essential identifiers

- `/api/_action/custom-price`
- Actions: `upsert`, `delete`
- Upsert fields: `productId`, `customerId`, `price` (`quantityStart`, `quantityEnd`, `currencyId`, `gross`, `net`, `linked`)
- Delete fields: `customerIds`, `productIds`, `customerGroupIds`
- Feature toggle in the merchant account: `Custom Prices`

## Gotchas

- Unlike the core `/api/_action/sync`, you cannot send headers to change the endpoint's behaviour; the source names `indexing-behavior` and `single-operation` as unsupported. Product indexing is handled per request automatically.
- Price filtering on the product listing page does not take overridden prices into account.
- Elasticsearch product mapping does not include customer-specific pricing data.
- The `customerGroupId` parameter in the request body is a stub kept to avoid future breaking changes; it has no effect on the Storefront.

## Code check (6.7.13.0)
- unverified `/api/_action/custom-price` — route is shipped by the Commercial plugin, not in the installed vendor/shopware packages
- confirmed `custom_price` — entity listed with id, productId, customerId, customerGroupId, price in core's usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1794
- confirmed `customerGroupId` — field exists on custom_price per the allow list (docs: stub, no Storefront effect) — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1798
- confirmed `/api/_action/sync` — core sync route the custom-price API is modelled on — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `indexing-behavior` — core sync API header constant — vendor/shopware/core/PlatformRequest.php:29
- confirmed `single-operation` — only still sent by the Administration repository client; core PHP does not read it — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:204
- unverified `errors` — response error key of the Commercial route, not in installed packages
