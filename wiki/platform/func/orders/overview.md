---
id: platform/func/orders/overview.md
title: Overview
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/orders/overview
sourceHash: 468088bbb761aae3d59fb11fe2471dee6b25040ef9d25e781b33c328fad100b6
revision:
  current: true
  range: "6.7.1.0 - 6.7.8.2"
  swMax: "6.7.8.2"
  swMin: "6.7.1.0"
keywords: ["order overview", "order details", "order status", "payment status", "delivery status", "bulk edit", "documents", "ZUGFeRD", "EN 16931", "Peppol", "storno bill", "credit note", "guest order", "Enable refunds", "bestellungen"]
summary: Admin order module - filters, order details, statuses and emails, documents incl. ZUGFeRD, bulk edit, Peppol FAQ, payment flow, guest orders.
lastBuilt: 2026-10-20
---
## What it is

Documentation of the Administration order module: the order list with filters, the order detail tabs (General, Details, Documents), document creation including ZUGFeRD e-invoices, bulk edit, and how payment and guest orders behave in Shopware 6.

## When to use

Use it when you need to know how order, payment and delivery statuses interact, how to cancel an order, which documents can be created in what order, or how bulk edit and e-invoicing work.

## Key steps / config

- Filters (combined, each entry narrows the list): affiliate code, campaign code, documents, order date range, order status, payment status, delivery status, payment method, shipping method, sales channels, billing country, shipping country, customer group, tags, products. Affiliate and campaign filters appear only if such codes exist.
- Status change opens a modal to send a status email, optionally with documents attached. If the sales channel has no mail template for that status, you assign one first. Flow Builder defines which template is used per status.
- Cancellation: set the **order status** to "Canceled". Only the order status resets stock; canceling only payment or delivery status does not.
- Items tab: add product, add empty item (own name, price, tax rate), add credit note (negative gross price), delete, show product. Mixed tax rates are supported.
- Documents: **Create New**, pick type, number and date (next number from the number range by default), optional custom PDF upload, comment, preview. Partial cancellations, cancellation invoices and credit notes need an existing invoice.
- ZUGFeRD: enable **Show ZUGFeRD variants**, choose a variant; "(embedded)" variants embed the XML in the PDF, others provide separate XML. Content comes from **Settings > Commerce > Documents**. The format uses CII and complies with EN 16931.
- Bulk edit: up to 1000 orders at once. Options: change payment, delivery or order status; **Send: status emails**; **Send: Documents** (with "Skip already sent documents"); generate Invoice, Storno bill, Delivery note, Credit note; download as merged PDF; **Trigger Flows** option to avoid flows running twice.
- Customer-side order cancellation requires **Settings > Cart settings > Enable refunds**.

## Gotchas

- Orders with a created invoice cannot be deleted.
- Payment status Refunded, Partially refunded or Chargeback requires prior Paid or Partially paid. Delivery status Returned or Partially returned requires prior Shipped or Partially shipped. Order status Completed requires In progress first; to go back to Open the order must be Completed or Canceled first.
- In bulk edit only a status valid for all selected orders can be set (e.g. an open and an in-progress order can only both be canceled). Deactivating status emails also suppresses emails sent by flows.
- Changing billing or delivery address, email or phone on an order does not change the customer account defaults; status mails use the new email.
- Peppol is a transport network, not a format, and is not part of the standard. The source recommends invoicing in the ERP with a certified Access Point provider, or an Extension Store extension; there is no commitment to native support.
- Guest orders: customers cannot log in; the confirmation email contains a link, and access needs email address and postal code.

## Version notes

ZUGFeRD e-invoices are supported from 6.6.10.0 (mandatory for domestic German B2B since 1 January 2025). From 6.7.9.0 additional documents can be created in ZUGFeRD format.
