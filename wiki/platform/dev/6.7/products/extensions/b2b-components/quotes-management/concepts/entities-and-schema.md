---
id: platform/dev/6.7/products/extensions/b2b-components/quotes-management/concepts/entities-and-schema.md
title: Entities & Schema
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/quotes-management/concepts/entities-and-schema.html
sourceHash: 3615098ab7c9d9e7abf991e6cb3f51468f522f4e
codeCheckedAgainst: "6.7.15.1"
keywords: ["quote entity", "QuoteLineItem", "QuoteDelivery", "QuoteDeliveryPosition", "QuoteTransaction", "QuoteComment", "QuoteEmployee", "QuoteDocument", "quote_number", "quote schema", "er diagram", "quotes management"]
summary: B2B Quote Management data model - Quote and its delivery, delivery position, line item, transaction, comment, employee and document entities with columns.
lastBuilt: 2026-10-21
---
## What it is

The data model of the B2B Components *Quote Management* feature (Commercial plugin): the `Quote` entity and its seven child entities, with their main columns and relations.

## When to use

When reading or extending quote data through the DAL or SQL, writing migrations or reports against quote tables, or mapping quote data to orders.

## Key steps / config

Entities and their purpose:

- **Quote** — state, pricing, discount, associated users and customer. Columns include `id`, `version_id`, `auto_increment`, `state_id`, `customer_id`, `order_id`, `order_version_id`, `quote_number` (varchar 64), `price`, `shipping_costs`, `discount` (json), `amount_total`, `amount_net`, `custom_fields`.
- **Quote Delivery** — shipping method plus earliest/latest shipping date; columns `quote_id`, `quote_version_id`, `shipping_method_id`, `shipping_costs`, `custom_fields`.
- **Quote Delivery Position** — line items of a delivery: `quote_line_item_id`, `quote_line_item_version_id`, `price`, `total_price`, `unit_price`, `quantity`, `custom_fields`.
- **Quote Line item** — `product_id`, `product_version_id`, `label`, `quantity`, `type`, `payload`, `price`, `discount`, `position`. Only the product type is supported.
- **Quote Transaction** — payment amount and an external reference: `payment_method_id`, `amount` (json).
- **Quote Comment** — `comment` (longtext), `seen_at`, `state_id`, `customer_id`.
- **Quote Employee** — employees on a quote: `employee_id`, `first_name`, `last_name`.
- **Quote Document** — `document_number`, `document_type_id`, `file_type`, `config`.

Every entity is versioned (`id` + `version_id` composite primary key), and children reference the quote via `quote_id` + `quote_version_id`.

Relations: Quote has many deliveries, line items, comments, transactions, documents and employees; a delivery has many positions; each delivery position points to a quote line item.

## Essential identifiers

- Entities: `Quote`, `QuoteDelivery`, `QuoteDeliveryPosition`, `QuoteLineItem`, `QuoteTransaction`, `QuoteComment`, `QuoteEmployee`, `QuoteDocument`
- Key columns: `quote_number`, `state_id`, `order_id`, `order_version_id`, `quote_version_id`

## Gotchas

- Quote line items support only the product type.
- Because every table is versioned, joins must include the version id column, not only `quote_id`.

## Code check (6.7.15.1)
- confirmed `quote` — core's usage-data allow-list references the quote entity — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2099
- unverified `QuoteLineItem` — entity defined in the Commercial plugin, outside the installed core/storefront/administration roots
- unverified `QuoteDelivery` — Commercial plugin entity, out of scope
- unverified `quote_number` — Commercial plugin column, out of scope
