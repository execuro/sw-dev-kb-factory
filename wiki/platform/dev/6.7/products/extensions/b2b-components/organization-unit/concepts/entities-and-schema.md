---
id: platform/dev/6.7/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.html
sourceHash: ce53a770c55c9376c78123d248007e5ebe827265
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b_components_organization", "b2b_components_organization_customer_address", "organization", "organization unit", "customer address", "default_billing_address_id", "default_shipping_address_id", "database schema", "entities", "b2b"]
summary: "B2B organization unit data model: b2b_components_organization and b2b_components_organization_customer_address tables, columns and relations."
lastBuilt: 2026-09-15
---
## What it is

The data model of the B2B Organization unit component (Shopware Commercial): the Organization entity and the Organization Customer Address entity, with their database tables.

## When to use

Querying, extending or migrating organization-unit data, or understanding how organizations relate to customers, addresses, employees and payment/shipping methods.

## Key steps / config

### Organization (`b2b_components_organization`)

A structural unit within a customer account. It has a name, belongs to one customer, and defines a default billing and a default shipping address chosen from that customer's addresses. Employees can be assigned to it, and specific payment and shipping methods can be assigned, which define what the organization's employees can use at checkout.

| Column | Type |
|---|---|
| `id` | uuid PK |
| `name` | string |
| `customer_id` | uuid FK |
| `default_shipping_address_id` | uuid FK |
| `default_billing_address_id` | uuid FK |
| `custom_fields` | json |

### Organization Customer Address (`b2b_components_organization_customer_address`)

Links a customer address to an organization and states whether it is used for billing or shipping.

| Column | Type |
|---|---|
| `id` | uuid PK |
| `organization_id` | uuid FK |
| `customer_address_id` | uuid FK |
| `type` | string (billing / shipping) |

Relation: an organization has many organization customer addresses ("has customer addresses").

## Essential identifiers

- `b2b_components_organization`
- `b2b_components_organization_customer_address`

## Code check (6.7.13.0)
- unverified `b2b_components_organization` — Commercial plugin entity, not in installed vendor/shopware roots
- unverified `b2b_components_organization_customer_address` — Commercial plugin entity, not installed
- confirmed `customer_address` — core entity referenced by customer_address_id and default address FKs — vendor/shopware/core/Checkout/Customer/Aggregate/CustomerAddress/CustomerAddressDefinition.php:28
- confirmed `customer` — core entity referenced by customer_id — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:62
- confirmed `payment_method` — core entity assignable to organizations — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:41
- confirmed `shipping_method` — core entity assignable to organizations — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:41
