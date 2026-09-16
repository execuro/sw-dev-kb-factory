---
id: platform/dev/6.6/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.md
title: "Entities & Schema"
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.html
sourceHash: ce53a770c55c9376c78123d248007e5ebe827265
keywords: ["organization entity", "organization customer address", "b2b_components_organization", "b2b_components_organization_customer_address", "billing address", "shipping address", "entity schema", "employees", "customer account", "organization unit"]
summary: "Organization entity holds name, customer, default billing/shipping address; linked via organization customer address for billing/shipping type."
lastBuilt: "2026-09-15"
---
## What it is

Describes the two entities behind the Organization unit component: the organization itself and the join entity that links customer addresses to an organization.

## Key steps / config

- The **Organization** entity has a name, belongs to a customer, and defines a default billing address and a default shipping address chosen from the customer's addresses. It can have multiple employees and assigned payment/shipping methods, which govern checkout options for its employees.
- The **Organization Customer Address** entity links a customer address to an organization and records whether the address is used for billing or shipping.

```mermaid
erDiagram
    b2b_components_organization {
        uuid id PK
        string name
        uuid customer_id FK
        uuid default_shipping_address_id FK
        uuid default_billing_address_id FK
        json custom_fields
    }
    b2b_components_organization_customer_address {
        uuid id PK
        uuid organization_id FK
        uuid customer_address_id FK
        string type
    }
```

## Essential identifiers

- `b2b_components_organization`
- `b2b_components_organization_customer_address`
