---
id: platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md
title: Custom Fields
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/custom-field/"
sourceHash: "a2d47151a1c3f98f87108392d5c9a959171b9267"
keywords: ["custom fields", "custom field set", "entity extension", "product custom fields", "customer custom fields", "order custom fields", "administration", "API", "data type", "text field", "number field", "date field", "attributes"]
summary: "Landing page for custom fields: extra per-entity data attached to products, customers, or orders via the administration or the API."
lastBuilt: "2026-09-15"
---
## What it is

Custom fields are additional data fields that can be attached to entities such as products,
customers, or orders. They let a business store and manage extra information specific to its
own operations, beyond the standard attributes Shopware ships with.

## When to use

Use custom fields when the standard entity attributes are not enough to represent business
data. The source gives two concrete examples: a clothing store adding a custom field to track
fabric composition, or a hardware store adding one to store product dimensions. Reach for
custom fields instead of a whole new entity when the extra information belongs to an existing
entity like a product, customer, or order.

## Key steps / config

Custom fields can be created and managed in two ways, per the source:

- Through the administration UI.
- Via the API.

In both cases, users define the data type of the field (for example text, number, or date)
and assign it to a specific entity. This extends the entity's default data structure without
requiring a new entity definition.

## Essential identifiers

- Custom field — an additional data field attached to an existing entity (product, customer,
  order, etc.).
- Supported data types mentioned in the source: text, number, date.
- Entities the source calls out as typical custom-field targets: products, customers, orders.

## Gotchas

Custom fields extend the *default* data structure of an entity — they are additive, not a
replacement for the entity's standard attributes, and are intended for data specific to a
single business's operations rather than data Shopware ships with by default.
