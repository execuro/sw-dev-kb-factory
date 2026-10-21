---
id: platform/dev/6.7/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.html
sourceHash: 15f26d96877b13c0f1400559a0c6e9b26039b851
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b_components_shopping_list", "b2b_components_shopping_list_line_item", "shopping list", "shopping list line item", "b2b components", "database schema", "entity relationship", "customer_id", "employee_id", "sales_channel_id", "product_id", "custom_fields"]
summary: B2B Components shopping list data model - tables b2b_components_shopping_list and b2b_components_shopping_list_line_item with columns and relation.
lastBuilt: 2026-10-21
---
## What it is

The data model of the B2B Components Shopping Lists feature: two entities, the shopping list and its line items, and the database tables behind them.

- **Shopping list** — a list of products prepared for a customer or a sales channel; carries basic information such as name, customer and sales channel.
- **Shopping list line item** — one product inside a shopping list; each product in the list is one line item.

## When to use

When querying or extending shopping list data (Admin API CRUD, custom fields, SQL reporting) and you need the table names, foreign keys and the list-to-line-item relation.

## Key steps / config

Schema as given by the source (ER diagram, condensed):

```
b2b_components_shopping_list
  id PK (uuid), customer_id FK, employee_id FK, sales_channel_id FK,
  name (string), active (boolean), custom_fields (json)

b2b_components_shopping_list_line_item
  id PK (uuid), b2b_components_shopping_list_id FK, product_id FK,
  quantity (int)
```

Relation: one `b2b_components_shopping_list` has many `b2b_components_shopping_list_line_item` rows (via `b2b_components_shopping_list_id`).

## Essential identifiers

- `b2b_components_shopping_list`
- `b2b_components_shopping_list_line_item`
- `b2b_components_shopping_list_id`
- `customer_id`, `employee_id`, `sales_channel_id`, `product_id`
- `name`, `active`, `quantity`, `custom_fields`

## Gotchas

- The shopping list entity and its definitions ship with the Shopware Commercial (B2B Components) extension, not with the open-source core; the core only references the `b2b_components_shopping_list` entity name in its usage-data allow-list (fields `id`, `active`).
- Prices are not columns in either table; they are calculated on load (see the API & Pricing page of this section).

## Code check (6.7.15.1)
- confirmed `b2b_components_shopping_list` — core usage-data allow-list names the entity with fields `id`, `active` — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2092
- unverified `b2b_components_shopping_list_line_item` — defined in the Commercial extension, out of scope of the core/storefront/administration roots
- unverified `b2b_components_shopping_list_id` — line-item FK column, Commercial extension, out of scope
- unverified `employee_id` — shopping list column, Commercial extension schema, out of scope
- unverified `custom_fields` — shopping list column, Commercial extension schema, out of scope
