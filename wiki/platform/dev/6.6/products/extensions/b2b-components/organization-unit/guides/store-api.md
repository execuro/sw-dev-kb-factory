---
id: platform/dev/6.6/products/extensions/b2b-components/organization-unit/guides/store-api.md
title: Store API
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/organization-unit/guides/store-api.html
sourceHash: 604c1292a74d7966fa7df453c822f43ff16aec3b
keywords: ["store-api organization-unit", "organization unit", "store api", "create organization unit", "update organization unit", "get organization units", "remove organization units", "defaultShippingAddressId", "defaultBillingAddressId", "employeeIds"]
summary: "Store API endpoints under /store-api/organization-unit for creating, updating, fetching and removing organization units."
lastBuilt: "2026-09-15"
---
## What it is

Lists the Store API endpoints for managing *Organization Unit* records.

## Key steps / config

- Create: `POST /store-api/organization-unit` with body `{name, defaultShippingAddressId, defaultBillingAddressId, employeeIds, shippingAddressIds, billingAddressIds, paymentMethodIds, shippingMethodIds}`.
- Update: `POST /store-api/organization-unit/{id}` with the same body shape.
- Get one: `GET|POST /store-api/organization-unit/{id}`.
- Get all: `GET|POST /store-api/organization-units`.
- Remove: `DELETE /store-api/organization-unit` with body `{ids: [...]}`.

```
POST /store-api/organization-unit {
    name, defaultShippingAddressId, defaultBillingAddressId,
    employeeIds, shippingAddressIds, billingAddressIds,
    paymentMethodIds, shippingMethodIds
}
```

## Essential identifiers

- `/store-api/organization-unit`
- `/store-api/organization-unit/{id}`
- `/store-api/organization-units`
