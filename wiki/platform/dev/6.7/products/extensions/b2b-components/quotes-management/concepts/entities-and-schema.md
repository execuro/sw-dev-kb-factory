---
id: platform/dev/6.7/products/extensions/b2b-components/quotes-management/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/quotes-management/concepts/entities-and-schema.html
sourceHash: 3615098ab7c9d9e7abf991e6cb3f51468f522f4e
codeCheckedAgainst: "6.7.13.0"
keywords: ["quote entity", "QuoteDelivery", "QuoteDeliveryPosition", "QuoteLineItem", "QuoteTransaction", "QuoteComment", "QuoteEmployee", "QuoteDocument", "quote_number", "quote schema", "database tables", "b2b quotes"]
summary: B2B Quote Management entities (quote, delivery, delivery position, line item, transaction, comment, employee, document), their columns and relations.
lastBuilt: 2026-09-15
---
## What it is

The data model of the B2B Components (Commercial) Quote Management feature: eight versioned entities centred on `Quote`, with their key columns and relations.

## When to use

When querying, extending or migrating quote data, writing DAL criteria against quote associations, or mapping quote data to orders/carts.

## Key steps / config

Entities:

- **Quote** — state, pricing, discount, associated users, customer. Columns: `id`, `version_id`, `auto_increment`, `state_id`, `customer_id`, `order_id`, `order_version_id`, `quote_number` (varchar 64), `price`, `shipping_costs`, `discount` (json), `amount_total`, `amount_net` (double), `custom_fields`.
- **QuoteDelivery** — delivery info: `quote_id`/`quote_version_id`, `shipping_method_id`, `shipping_costs`, `custom_fields`; the source also mentions earliest and latest shipping date.
- **QuoteDeliveryPosition** — line items of a delivery: `quote_line_item_id`/`quote_line_item_version_id`, `price` (json), `total_price`, `unit_price`, `quantity` (int), `custom_fields`.
- **QuoteLineItem** — `product_id`/`product_version_id`, `label`, `quantity`, `type`, `payload`, `price`, `discount`, `position`. Only the product type is currently supported.
- **QuoteTransaction** — payment amount and optional external reference: `payment_method_id`, `amount` (json), `custom_fields`.
- **QuoteComment** — `comment` (longtext), `seen_at` (datetime(3)), `state_id`, `customer_id`.
- **QuoteEmployee** — employees on a quote: `employee_id`, `first_name`, `last_name`.
- **QuoteDocument** — `document_number`, `document_type_id`, `file_type`, `config` (json), `custom_fields`.

All entities have a composite primary key `id` + `version_id` (uuid); children reference the quote via `quote_id` + `quote_version_id`.

Relations (skeleton):

```
Quote 1--* QuoteDelivery
Quote 1--* QuoteLineItem
Quote 1--* QuoteComment
Quote 1--* QuoteTransaction
Quote 1--* QuoteDocument
Quote 1--* QuoteEmployee
QuoteDelivery 1--* QuoteDeliveryPosition
QuoteLineItem 1--* QuoteDeliveryPosition
```

## Essential identifiers

- `Quote`, `QuoteDelivery`, `QuoteDeliveryPosition`, `QuoteLineItem`, `QuoteTransaction`, `QuoteComment`, `QuoteEmployee`, `QuoteDocument`
- Columns: `quote_number`, `state_id`, `order_id`, `order_version_id`, `quote_version_id`, `employee_id`, `document_type_id`

## Gotchas

- Quote entities are versioned: every foreign key to a quote or quote line item needs the matching `*_version_id` column.
- `QuoteLineItem` supports only the product type; other line item types (promotions, custom) are not supported.

## Code check (6.7.13.0)
- unverified `Quote` — entity definitions live in the Commercial plugin, outside the installed vendor/shopware roots
- unverified `QuoteLineItem` — Commercial plugin, outside the installed vendor/shopware roots
- confirmed `LineItem::PRODUCT_LINE_ITEM_TYPE` — core product line item type value `product` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:24
- confirmed `StateMachineStateDefinition` — core entity referenced by `state_id` — vendor/shopware/core/System/StateMachine/Aggregation/StateMachineState/StateMachineStateDefinition.php:30
- confirmed `CustomerDefinition` — core entity referenced by `customer_id` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:60
- confirmed `OrderDefinition` — core entity referenced by `order_id` — vendor/shopware/core/Checkout/Order/OrderDefinition.php:56
- confirmed `ShippingMethodDefinition` — referenced by `shipping_method_id` — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:39
- confirmed `PaymentMethodDefinition` — referenced by `payment_method_id` — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:39
- confirmed `DocumentTypeDefinition` — referenced by `document_type_id` — vendor/shopware/core/Checkout/Document/Aggregate/DocumentType/DocumentTypeDefinition.php:24
- confirmed `ProductDefinition` — referenced by `product_id` — vendor/shopware/core/Content/Product/ProductDefinition.php:83
