---
id: platform/func/tutorials-and-faq/documentv2.md
title: Documentv2
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/documentv2
sourceHash: a17080cbd3264852f33cbba0e85f0535ea2bd360ad6dad497ec32343d882cbad
revision:
  current: true
  range: current
  swMax: null
  swMin: null
keywords: ["document v2", "DOCUMENT_GENERATION_REWORK", "feature flag", "invoice", "credit note", "cancellation invoice", "delivery note", "ZUGFeRD", "document settings", "flow builder", "bulk edit", "dokumente"]
summary: Experimental Document V2 tutorial - enable DOCUMENT_GENERATION_REWORK, configure document settings, create invoices and other documents, formats, bulk edit.
lastBuilt: 2026-10-20
---
## What it is

A tutorial for Document V2, which creates and manages invoices, credit notes, cancellation invoices and delivery notes for orders. The feature is experimental and hidden behind a feature flag.

## When to use

Use it to enable Document V2, configure document layout, and create, download, send or bulk-process order documents.

## Key steps / config

1. Add the feature flag to the `.env` file of the installation:

```
DOCUMENT_GENERATION_REWORK=1
```

2. Check **Settings > Master data > Company information**, then **Settings > Shop > Documents**: page layout (paper size, orientation, line items per page), visible content, customer account display, addresses, file names (prefix, suffix, format additions). Verify with the document preview.
3. In an order, open Documents, select the type, one or more formats, check the document number and date, optional comment. Without an explicit number the number range of the document type is used.
4. Open the preview, adjust, then generate. Download, send by email or mark as "sent" (separate functions).

Formats per type: Invoice, Credit note and Cancellation invoice support PDF, HTML, ZUGFeRD XML and PDF with embedded ZUGFeRD; Delivery note supports PDF and HTML.

Extra prerequisites: Credit note needs an existing invoice and credit line items; Cancellation invoice needs an existing invoice; Delivery note needs a delivery date.

Other features: ZIP download of several documents, upload of existing files (maximum 50 MB per file), document creation and email attachments via Flow Builder, and create/download/delete in bulk edit with skip-existing or force-regenerate behavior.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK` (feature flag, `.env`)
- Settings paths: Settings > Master data > Company information, Settings > Shop > Documents

## Gotchas

- Document V2 is experimental; without the flag it is not available. If you lack access to the configuration, ask the technical team.
