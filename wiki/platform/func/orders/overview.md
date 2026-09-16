---
id: platform/func/orders/overview.md
title: Overview
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/orders/overview"
sourceHash: "151a66c9aa56ddbca8266e70bc1eb8c7bb1a61ec0d125a55cc4b11eed36db7cb"
revision:
  current: true
  range: "6.7.1.0 - 6.7.8.2"
  swMin: "6.7.1.0"
  swMax: "6.7.8.2"
keywords: ["order overview", "order filters", "order status", "payment status", "delivery status", "bulk edit", "ZUGFeRD", "documents", "order details", "affiliate code", "campaign code", "guest order", "Trigger Flows", "swag_migration_data"]
summary: "The admin order list, its filters, the order detail tabs, document/ZUGFeRD generation, and bulk-edit of multiple orders."
lastBuilt: "2026-09-15"
---
## What it is

Describes the admin order overview: the order list, its filters, the order detail view (General, Details, Documents tabs), and bulk editing of multiple orders at once.

## When to use

When looking up, filtering, editing, cancelling, or generating documents for orders, or when applying the same status/document change to many orders together.

## Key steps / config

- The order list supports hiding/showing columns, a compact mode, custom column sorting, and tools to refresh or further filter results; filters combine additively. Filter options include Affiliate code, Campaign code, Documents, Order date range, Order status (`Open`/`In progress`/`Cancelled`/`Done`, multi-select), Payment status (multi-select, e.g. `Paid`, `Refunded`, `Authorised`), Delivery status (multi-select), Payment method, Shipping method, Sales Channels, Billing/Shipping country, Customer group, Tags, Products.
- Opening an order via its order number shows the **General** tab (order summary, total, current payment/delivery/order status, tags, and item list with add/edit/remove and Delete/Add product/Add empty item/Add credit note/Show product actions) and the **Details** tab (Payment, Shipping, Order sub-sections with status history, tracking numbers, affiliate/campaign codes, and "Deactivate automatically added promotions").
- Changing a status opens a modal to optionally e-mail the customer, attach existing documents, and pick an e-mail template if none is assigned to the sales channel yet. Setting the **order status** to `Cancelled` resets stock and effectively cancels the order (only the order status reset does this, not payment/delivery status alone).
- The **Documents** tab creates invoices, delivery notes, credit notes, and cancellation invoices/partial cancellations (each depends on a prior invoice); documents can be sent as e-mail attachments with an HTML preview link, or uploaded as an already-prepared PDF.
- **ZUGFeRD** electronic invoices (mandatory for German domestic B2B since 1 January 2025) are supported from Shopware **6.6.10.0** as a separate XML file or embedded in the PDF, per the EU standard **EN 16931**, using the **CII** standard; Shopware **6.7.9.0** adds ZUGFeRD variants for additional document types. Enable "Show ZUGFeRD variants" on the document dialog to select a variant, and configure the underlying content under `Settings > Commerce > Documents`.
- **Bulk edit** (up to 1000 orders, selectable across pages) can change payment/delivery/order status, optionally send status e-mails and/or documents, and generate/download invoices, cancellation invoices, delivery notes and credit notes for the selection; a "Trigger Flows" toggle controls whether Flow Builder flows fire for the bulk change.
- Since Shopware 6, payment and order placement are decoupled: the order is created once the customer clicks **Send order**, while payment status starts `Open` until paid; customers can retry payment, change payment method, or (if "Enable refunds" is active under `Settings > Cart settings`) cancel the order from their account. Guest (no-account) orders receive an e-mail link to view the order after authenticating with e-mail and postal code.

## Essential identifiers

- Order status values: `Open`, `In progress`, `Cancelled`, `Done`
- Menu path: `Settings > Commerce > Documents`, `Settings > Cart settings`
- Standards: `EN 16931`, `CII`
- Versions: `6.6.10.0` (ZUGFeRD introduced), `6.7.9.0` (additional ZUGFeRD document types)

## Gotchas

- Only setting the **order status** (not payment or delivery status alone) to Cancelled resets stock.
- Bulk edit skips documents that already exist; only the most recent document of a given type is sent in the status e-mail.
- Order status can only bulk-change to a value valid for every selected order (e.g. mixed Open/In progress orders can only be bulk-set to Cancelled).

## Version notes

ZUGFeRD e-invoice support was introduced in Shopware 6.6.10.0; additional ZUGFeRD document-type variants were added in 6.7.9.0.
