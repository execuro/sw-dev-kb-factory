---
id: platform/func/settings/Numberranges.md
title: Numberranges
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/Numberranges"
sourceHash: 8cef74b6dac62b5d38bac025ca13b81c6c7b89a409d120e9d4aadbfdb4b88103
revision:
  current: true
  range: "6.0.0 - 6.6.10.10"
  swMin: "6.0.0"
  swMax: "6.6.10.10"
keywords: ["number ranges", "number range pattern", "prefix", "suffix", "advanced mode", "order number", "customer number", "invoice number", "product number", "Global", "sales channel assignment", "number range types"]
summary: Documents Shopware number range configuration, the pattern syntax for custom formatting, and the available number range types.
lastBuilt: 2026-09-15
---
## What it is

Number ranges are character/number sequences used to uniquely identify orders, customers, documents and similar entities, configured under **Settings > General > Number ranges**.

## When to use

Used to define how identifiers such as order numbers, invoice numbers, or customer numbers are formatted, including per-sales-channel assignment and legally required formatting like dates.

## Key steps / config

Each number range has: **Name/Description**, **Prefix**, **Start number**, **Suffix**, an **Advanced mode** toggle, **Current number** (last assigned), **Preview**, and **Assignment** (purpose + sales channel; unassigned channels fall back to Global).

With **Advanced mode** enabled, prefix/suffix are replaced by a **Pattern** field supporting variables:
- `{n}` — the incrementing number, starting at the start number
- `{date}` — current date, `YYYY-MM-DD`
- `{date_dmy}` — custom date format using `Y`/`y`/`M`/`m`/`D`/`d`

Example patterns (start number 12345):
```
Order{n}-{date}          -> Order12345-2019-05-23
Order{n}-{date_d.m.Y}    -> Order12345-23.05.2019
Order{n}-{date_Y-M-D}    -> Order12345-2019-MAY-THU
Order{n}_{date_dmy}      -> Order12345_230519
```

Prefix/Suffix are stored as `varchar` database fields, so letters, numbers, and special characters are all allowed without restriction.

## Essential identifiers

- **Settings > General > Number ranges**
- Pattern variables: `{n}`, `{date}`, `{date_dmy}`
- Number range types: Partial cancellation, Pending Order, Delivery notes, Credit notes, Orders, Subscription numbers, Invoices, Order Returns, Products, Quotes, Cancellations, Customers, Quote

## Gotchas

If no explicit number range is assigned to a sales channel, the system always falls back to the **Global** range.
