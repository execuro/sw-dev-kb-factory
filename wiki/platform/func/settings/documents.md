---
id: platform/func/settings/documents.md
title: Documents
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/documents"
sourceHash: a3fbd31f94a65074dbef5c847923be728b397830ed5bf404a7cfc91013491d58
revision:
  current: true
  range: "6.7.0.0 - 6.7.4.2"
  swMin: "6.7.0.0"
  swMax: "6.7.4.2"
keywords: ["documents", "document templates", "invoice template", "delivery note", "credit note", "cancellation invoice", "company settings", "filename prefix", "filename suffix", "intra-community delivery", "e-invoice", "page format"]
summary: Documents Shopware's document template settings for invoices, delivery notes, credit notes and cancellation invoices, plus company letterhead data.
lastBuilt: 2026-09-15
---
## What it is

The document settings, under **Settings > Commerce > Documents**, configure templates for generated documents (invoice, delivery note, credit note, cancellation invoice), including company logo and bank details.

## When to use

Used when customizing which order information appears on generated PDFs/HTML documents, or when a sales channel needs its own document template overriding the global one.

## Key steps / config

Shopware ships global templates for delivery note, invoice, credit note and cancellation invoice; custom templates can be created via **Create document** and assigned to one or more sales channels, overriding the global template. The four document types share the same configuration options.

**Assignment**: **Document type** (only changeable on custom templates).

**Settings**: Technical name, Company logo, Filename prefix/suffix (placed before/after the document number), Page orientation, Page format (default A4), Items per page (page-break threshold), File formats (PDF and/or HTML), Display header, Display footer, Display page count, Display line items, Display line item positions, Display prices, Display document in "My Account", Display divergent delivery address, Display "intra-Community delivery" label (Invoice/Cancellation Invoice only, requires EU country + Tax-Free B2B), Display customer VAT-ID.

**Company settings** (letterhead): Display return address, Display company address, Street, Postal code, City, Country, Name, Email address, Phone number, Website, Tax number, Tax office, Company Reg No., Bank, IBAN, BIC, Place of jurisdiction / Commercial register no., Place of fulfilment, Business executive, and **Payment due date** — a relative modifier such as `+2 days` (the `+` is required; omitting it, e.g. `2 days`, can cause e-invoice generation errors). This field only affects the e-invoice XML, not the visible invoice.

## Essential identifiers

- **Settings > Commerce > Documents**
- **Payment due date** modifier format, e.g. `+2 days`
- Document types: delivery note, invoice, credit note, cancellation invoice

## Gotchas

Entering the **Payment due date** without the `+` modifier (e.g. `2 days` instead of `+2 days`) may cause errors when generating the e-invoice. Enabling **Display document in "My Account"** does not apply retroactively to documents created before the change. For multi-language sales channels, a separate document per channel is recommended for linguistic consistency.
