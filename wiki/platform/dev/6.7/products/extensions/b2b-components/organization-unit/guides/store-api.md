---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/guides/store-api.html
sourceHash: 604c1292a74d7966fa7df453c822f43ff16aec3b
codeCheckedAgainst: "6.7.15.1"
keywords: ["organization unit", "/store-api/organization-unit", "/store-api/organization-units", "store api", "b2b components", "employeeIds", "defaultShippingAddressId", "defaultBillingAddressId", "paymentMethodIds", "shippingMethodIds", "b2b organization", "commercial plugin"]
summary: B2B Organization Unit Store API routes - create, update, get, list and delete organization units with employees, addresses, payment and shipping methods.
lastBuilt: 2026-10-21
---
## What it is

The Store API endpoints of the B2B Components *Organization Unit* feature (part of the Shopware Commercial plugin): creating, updating, reading, listing and removing organization units.

## When to use

When a headless or custom storefront client must manage a B2B customer's organization units: their employees, allowed shipping/billing addresses, default addresses, and allowed payment and shipping methods.

## Key steps / config

Create a unit with `POST {url}/store-api/organization-unit`; update one with `POST {url}/store-api/organization-unit/{id}`. Both take the same body shape:

```json
{
  "name": "string",
  "defaultShippingAddressId": "uuid",
  "defaultBillingAddressId": "uuid",
  "employeeIds": ["uuid"],
  "shippingAddressIds": ["uuid"],
  "billingAddressIds": ["uuid"],
  "paymentMethodIds": ["uuid"],
  "shippingMethodIds": ["uuid"]
}
```

Other routes:

- Get one unit: `GET|POST {url}/store-api/organization-unit/{id}`
- List units: `GET|POST {url}/store-api/organization-units` (note the plural)
- Remove units: `DELETE {url}/store-api/organization-unit` with body `{ "ids": [ ... ] }`

The full route reference is the "B2B Organization Unit" section of the Store API docs (shopware.stoplight.io).

## Essential identifiers

- `/store-api/organization-unit`, `/store-api/organization-unit/{id}`, `/store-api/organization-units`
- Body fields: `name`, `defaultShippingAddressId`, `defaultBillingAddressId`, `employeeIds`, `shippingAddressIds`, `billingAddressIds`, `paymentMethodIds`, `shippingMethodIds`, `ids`

## Gotchas

- Deletion is a bulk `DELETE` on the singular path with an `ids` array in the body, not a `DELETE` on `/{id}`.
- The routes are provided by the Commercial plugin, not by Shopware core; they are unavailable without it.

## Code check (6.7.15.1)
- confirmed `b2b_components_organization` — core's usage-data allow-list knows the B2B organization entity (fields defined in the Commercial plugin) — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2096
- unverified `/store-api/organization-unit` — route is defined in the Commercial plugin, outside the installed core/storefront/administration roots
- unverified `/store-api/organization-units` — Commercial plugin route, out of scope
- unverified `employeeIds` — request field of a Commercial plugin route, out of scope
