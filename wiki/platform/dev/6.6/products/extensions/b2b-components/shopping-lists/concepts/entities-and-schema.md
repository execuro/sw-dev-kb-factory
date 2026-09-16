---
id: platform/dev/6.6/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md
title: "Entities & Schema"
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.html
sourceHash: 15f26d96877b13c0f1400559a0c6e9b26039b851
keywords: ["shopping list entity", "shopping list line item", "b2b_components_shopping_list", "b2b_components_shopping_list_line_item", "shopping lists schema", "customer product list", "sales channel", "line item"]
summary: "Shopping list entity groups products for a customer/sales channel; line items reference each product and quantity in the list."
lastBuilt: "2026-09-15"
---
## What it is

Describes the two entities behind the Shopping lists component.

## Key steps / config

- **Shopping Lists** — a list of products prepared for a customer or a sales channel, showing name, customer and sales channel.
- **Line item** — represents each individual product within a shopping list.

```mermaid
erDiagram
    b2b_components_shopping_list {
        uuid id PK
        uuid customer_id FK
        uuid employee_id FK
        uuid sales_channel_id FK
        string name
        boolean active
        json custom_fields
    }
    b2b_components_shopping_list_line_item {
        uuid id PK
        uuid b2b_components_shopping_list_id FK
        uuid product_id FK
        int quantity
    }
```

## Essential identifiers

- `b2b_components_shopping_list`
- `b2b_components_shopping_list_line_item`
