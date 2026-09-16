---
id: platform/dev/6.6/products/extensions/b2b-components/quotes-management/concepts/entities-and-schema.md
title: "Entities & Schema"
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/quotes-management/concepts/entities-and-schema.html
sourceHash: 3615098ab7c9d9e7abf991e6cb3f51468f522f4e
keywords: ["Quote", "QuoteDelivery", "QuoteDeliveryPosition", "QuoteLineItem", "QuoteTransaction", "QuoteComment", "QuoteEmployee", "QuoteDocument", "quotes management schema", "quote entities"]
summary: "Quotes Management schema: Quote plus QuoteDelivery, QuoteDeliveryPosition, QuoteLineItem, QuoteTransaction, QuoteComment, QuoteEmployee, QuoteDocument."
lastBuilt: "2026-09-15"
---
## What it is

Describes the entities behind Quotes Management and how they relate.

## Key steps / config

- **Quote** — state, pricing, discount, associated users/customer.
- **Quote Delivery** — shipping method, earliest/latest shipping date for a quote.
- **Quote Delivery Position** — line items of a quote delivery: quote line item, price, total price, unit price, quantity, custom fields.
- **Quote Line item** — line items of a quote; only product type is currently supported.
- **Quote Transaction** — payment amount, plus an external reference.
- **Quote Comment** — comments related to a quote.
- **Quote Employee** — employees associated with a quote.
- **Quote Document** — documents associated with a quote.

```mermaid
erDiagram
    Quote {
        id uuid PK
        version_id uuid PK
        state_id uuid
        customer_id uuid
        order_id uuid
        quote_number varchar(64)
        price json
        discount json
        amount_total double
    }
    QuoteDelivery o{--|| Quote : "has deliveries"
    QuoteDeliveryPosition o{--|| QuoteDelivery : "has positions"
    QuoteLineItem o{--|| Quote : "has line items"
    QuoteComment o{--|| Quote : "has comments"
    QuoteTransaction o{--|| Quote : "has transactions"
    QuoteDocument o{--|| Quote : "has documents"
    QuoteEmployee o{--|| Quote : "belongs to employee"
```

## Essential identifiers

- `Quote`, `QuoteDelivery`, `QuoteDeliveryPosition`, `QuoteLineItem`
- `QuoteTransaction`, `QuoteComment`, `QuoteEmployee`, `QuoteDocument`
