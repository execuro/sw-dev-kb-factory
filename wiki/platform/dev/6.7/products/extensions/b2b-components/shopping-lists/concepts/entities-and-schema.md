---
id: platform/dev/6.7/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.html
sourceHash: 15f26d96877b13c0f1400559a0c6e9b26039b851
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopping list", "b2b_components_shopping_list", "b2b_components_shopping_list_line_item", "line item", "entities", "database schema", "b2b components", "employee_id", "customer_id", "sales_channel_id", "product_id", "quantity"]
summary: B2B Shopping Lists data model - b2b_components_shopping_list table and its b2b_components_shopping_list_line_item child table with columns and relations.
lastBuilt: 2026-09-15
---
## What it is

The data model of the B2B Components Shopping Lists module: two entities, the shopping list itself and its line items, and the database tables that store them.

## When to use

When querying or extending shopping list data, writing migrations or imports into these tables, or resolving which customer, employee, sales channel or product a list entry belongs to.

## Key steps / config

- Shopping list (`b2b_components_shopping_list`): a list of products prepared for a customer or a sales channel, holding basic information such as the name, customer and sales channel.
- Line item (`b2b_components_shopping_list_line_item`): one product within a shopping list; each product in the list is one line item.
- Relation: one shopping list has many line items (line item `b2b_components_shopping_list_id` points to the list).

Schema skeleton (from the source ER diagram):

```
b2b_components_shopping_list
  id PK (uuid), customer_id FK, employee_id FK, sales_channel_id FK,
  name (string), active (boolean), custom_fields (json)
b2b_components_shopping_list_line_item
  id PK (uuid), b2b_components_shopping_list_id FK,
  product_id FK, quantity (int)
```

## Essential identifiers

- `b2b_components_shopping_list`
- `b2b_components_shopping_list_line_item`
- `b2b_components_shopping_list_id`, `customer_id`, `employee_id`, `sales_channel_id`, `product_id`
- `name`, `active`, `custom_fields`, `quantity`

## Code check (6.7.13.0)
- confirmed `b2b_components_shopping_list` — entity name (fields `id`, `active`) in the core usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2092
- unverified `b2b_components_shopping_list_line_item` — defined in the Shopware Commercial extension, not in vendor/shopware roots
- unverified `employee_id` — shopping list column defined in the Commercial extension, out of scope
- unverified `custom_fields` — shopping list column defined in the Commercial extension, out of scope
