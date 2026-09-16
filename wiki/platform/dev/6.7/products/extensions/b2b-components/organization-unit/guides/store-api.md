---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md
title: Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/guides/store-api.html
sourceHash: 604c1292a74d7966fa7df453c822f43ff16aec3b
codeCheckedAgainst: "6.7.13.0"
keywords: ["organization unit", "/store-api/organization-unit", "/store-api/organization-units", "store api", "b2b components", "employeeIds", "defaultShippingAddressId", "defaultBillingAddressId", "paymentMethodIds", "shippingMethodIds", "create organization", "delete organization units"]
summary: B2B Organization Unit Store API endpoints to create, update, get, list and delete organization units, with the request body fields.
lastBuilt: 2026-09-15
---
## What it is

Reference for the Store API endpoints the B2B Components (Commercial) plugin exposes for the *Organization Unit* entity: create, update, read one, list, and remove.

## When to use

When a headless frontend or integration must manage B2B organization units for the logged-in customer via the Store API instead of the storefront UI.

## Key steps / config

Endpoints (`{url}` = shop base URL):

| Action | Method and path |
|---|---|
| Create | `POST {url}/store-api/organization-unit` |
| Update | `POST {url}/store-api/organization-unit/{id}` |
| Get one | `GET\|POST {url}/store-api/organization-unit/{id}` |
| List | `GET\|POST {url}/store-api/organization-units` |
| Remove | `DELETE {url}/store-api/organization-unit` |

Create and update take the same body:

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

Remove takes a list of IDs:

```json
{ "ids": ["uuid"] }
```

The full request/response schema is in the "B2B Organization Unit" section of the Store API reference (Stoplight: `https://shopware.stoplight.io/docs/store-api/branches/main/b286c1f43d395-shopware-store-api`).

## Essential identifiers

- `/store-api/organization-unit`
- `/store-api/organization-unit/{id}`
- `/store-api/organization-units`
- Body fields: `name`, `defaultShippingAddressId`, `defaultBillingAddressId`, `employeeIds`, `shippingAddressIds`, `billingAddressIds`, `paymentMethodIds`, `shippingMethodIds`, `ids`

## Gotchas

- Singular path (`organization-unit`) is used for create, update, get and delete; only the list endpoint is plural (`organization-units`).
- Delete is a bulk operation on the collection path with an `ids` array, not a `DELETE` on `/{id}`.

## Code check (6.7.13.0)
- confirmed `StoreApiRouteScope::ALLOWED_PATH` — Store API routes are served under the `store-api` path prefix — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:16
- unverified `/store-api/organization-unit` — route defined in the Commercial plugin, outside the installed vendor/shopware roots
- unverified `/store-api/organization-units` — route defined in the Commercial plugin, outside the installed vendor/shopware roots
- confirmed `PaymentMethodDefinition` — core entity referenced by `paymentMethodIds` — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:39
- confirmed `ShippingMethodDefinition` — core entity referenced by `shippingMethodIds` — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:39
