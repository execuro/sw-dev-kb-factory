---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.html
sourceHash: ce53a770c55c9376c78123d248007e5ebe827265
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b_components_organization", "b2b_components_organization_customer_address", "organization", "organization unit", "organization customer address", "database schema", "default_billing_address_id", "default_shipping_address_id", "customer_address_id", "b2b components", "entity"]
summary: Organization unit data model - b2b_components_organization and b2b_components_organization_customer_address tables, their columns and relation.
lastBuilt: 2026-10-21
---
## What it is

The entities and database schema of the B2B Components organization unit: the organization itself and the link table assigning customer addresses to an organization.

## When to use

Querying, extending or migrating organization unit data, or understanding how organizations relate to customers, addresses, employees, payment and shipping methods.

## Key steps / config

### Organization (`b2b_components_organization`)

A structural unit within a customer account. It has a name, belongs to one customer, and defines a default billing and a default shipping address chosen from that customer's addresses. Employees can be assigned to it, as can payment and shipping methods; those assignments define which options its employees see at checkout.

| Column | Type |
|---|---|
| `id` | uuid, PK |
| `name` | string |
| `customer_id` | uuid, FK |
| `default_shipping_address_id` | uuid, FK |
| `default_billing_address_id` | uuid, FK |
| `custom_fields` | json |

### Organization customer address (`b2b_components_organization_customer_address`)

Assigns a customer address to an organization and states whether it is used for billing or shipping.

| Column | Type |
|---|---|
| `id` | uuid, PK |
| `organization_id` | uuid, FK |
| `customer_address_id` | uuid, FK |
| `type` | string (billing / shipping) |

Relation: an organization has many organization customer addresses; each belongs to exactly one organization.

## Essential identifiers

- `b2b_components_organization`
- `b2b_components_organization_customer_address`

## Code check (6.7.15.1)
- confirmed `customer` — core entity referenced by `customer_id` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `customer_address` — core entity referenced by `customer_address_id` and default address FKs — vendor/shopware/core/Checkout/Customer/Aggregate/CustomerAddress/CustomerAddressDefinition.php:28
- unverified `b2b_components_organization` — commercial B2B Components entity, not in core/storefront/administration
- unverified `b2b_components_organization_customer_address` — commercial B2B Components entity, out of scope
