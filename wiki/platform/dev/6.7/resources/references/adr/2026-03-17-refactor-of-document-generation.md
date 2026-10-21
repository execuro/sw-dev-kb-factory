---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-03-17-refactor-of-document-generation.md
sourceHash: 9bb6395307c7435e344c9eb5c613b90364e52871
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-17-refactor-of-document-generation.html
title: Refactor of document generation
version: "6.7"
versions:
  - "6.7"
keywords: ["document generation", "DOCUMENT_GENERATION_REWORK", "DocumentFormat", "AbstractDocumentRenderer", "ZugferdBuilder", "document.renderer", "document_type.renderer", "DocumentGenerateOperation", "zugferd", "e-invoice", "accessible documents", "document.static", "document_base_config"]
summary: "ADR: document types get multiple formats (PDF, HTML, ZUGFeRD); opt-in rework in 6.7 drops horstoeko/zugferd and breaks extensions."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2026-03-17, area after-sales) to refactor Shopware's document generation. Accessible documents (HTML) and e-invoices (ZUGFeRD) were patched into the existing system under legal deadlines and backward-compatibility constraints (no breaks in 6.6/6.7): each ZUGFeRD variant is its own document type and the accessible HTML is an extra media file on the document entity, which leads to hard-coded file/document types across UI and code. The decision: one document type gets one or more formats, with a simpler extension API that does not rely on PHP class decoration. Architecture and extension points are covered by two follow-up ADRs (2026-03-18 new document generation architecture, 2026-03-19 extension points, linked from the upstream ADR repository).

## When to use

- You maintain a plugin or integration that renders, decorates or configures documents (renderers, Twig document templates, `document_base_config`) and need to know what will break.
- You plan app-based document generation (currently impossible: apps cannot provide or hook into generators).
- You want to try the new opt-in implementation in 6.7.

## Key steps / config

Goals the new implementation is built against:

1. One document type (e.g. invoice) has one or more formats — the installed `Shopware\Core\Checkout\DocumentV2\DocumentFormat` enum has `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`. The merchant chooses which formats to generate.
2. All formats from one generation call share the same data (e.g. the same document number) and may depend on each other (ZUGFeRD-embedded PDF combines PDF + ZUGFeRD XML; PDF can be produced from HTML via DomPDF).
3. Mail attachments work on document level and include all available formats.
4. Types and formats are extendable by plugins (more e-invoice data, another format, another type).
5. Merchants only configure settings a type actually uses; company details may move into their own entity.
6. Uploading a static file per type, bypassing generation, stays possible (`document.static` field).
7. ZUGFeRD XML is generated via Twig templates; the `horstoeko/zugferd` dependency (declared legacy) is removed.
8. Opt-in: the new implementation sits behind the feature flag `DOCUMENT_GENERATION_REWORK` (default off, major); the old implementation is to be deprecated.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK`, `Shopware\Core\Checkout\DocumentV2\DocumentFormat`
- Existing extension points affected: `document.renderer` / `AbstractDocumentRenderer`, `document_type.renderer` / `AbstractDocumentTypeRenderer`, `InvoiceRenderer`, `CreditNoteRenderer`, `DeliveryNoteRenderer`, `StornoRenderer`, `ZugferdRenderer`, `ZugferdBuilder`, `HtmlRenderer`, `PdfRenderer`, `DocumentFileRendererRegistry`, `DocumentGenerateOperation`
- Templates: `@Framework/documents/base.html.twig`, `invoice.html.twig`, `credit_note.html.twig`, `delivery_note.html.twig`, `storno.html.twig`
- Config entities: `document_base_config`, `document_base_config_sales_channel`

## Gotchas

- All extensions and integrations doing anything document-related must be updated for the new implementation; merchant UX changes are expected to be minor, and already generated documents are migrated and stay accessible.
- Impact estimate from a store scan: 204 of 3,204 plugins (6.4%) use the document API; 84 only touch Twig templates (likely unaffected, templates are kept); keeping config schemas backward compatible spares 51 more, leaving ~69 affected plugins (2.2%).
- Most used points: `invoice.html.twig` (76 plugins), `document_base_config` (77), `document_base_config_sales_channel` (54), `@Framework/documents/base.html.twig` (52), `DocumentGenerateOperation` (44); `ZugferdBuilder` and `ZugferdRenderer` had zero users.
- `ZugferdBuilder` wraps the library's builder but does not expose all its features.

## Version notes

- 6.7: new implementation is opt-in via `DOCUMENT_GENERATION_REWORK`; per the ADR it becomes the default in 6.8. In 6.7.15.1 the legacy `AbstractDocumentRenderer` carries an `ExperimentalReplacement` attribute naming `DocumentV2Renderer` as replacement with `version: 'v6.9.0'`. A separate ADR is to describe the migration strategy.

## Code check (6.7.15.1)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false, major — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `DocumentFormat` — enum html/pdf/zugferd_xml/zugferd_embedded_pdf, experimental — vendor/shopware/core/Checkout/DocumentV2/DocumentFormat.php:13
- confirmed `AbstractDocumentRenderer` — legacy base, ExperimentalReplacement to DocumentV2Renderer (v6.9.0) — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:27
- confirmed `ZugferdBuilder` — legacy ZUGFeRD builder wrapper — vendor/shopware/core/Checkout/Document/Zugferd/ZugferdBuilder.php:31
- confirmed `document.renderer` — DI tag on legacy renderers — vendor/shopware/core/Checkout/DependencyInjection/document.php:127
- confirmed `document_type.renderer` — DI tag for file type renderers (key pdf) — vendor/shopware/core/Checkout/DependencyInjection/document.php:181
- confirmed `DocumentGenerateOperation` — final struct — vendor/shopware/core/Checkout/Document/Struct/DocumentGenerateOperation.php:18
- confirmed `DocumentFileRendererRegistry` — legacy registry — vendor/shopware/core/Checkout/Document/Service/DocumentFileRendererRegistry.php:16
- confirmed `document.static` — BoolField static on document — vendor/shopware/core/Checkout/Document/DocumentDefinition.php:88
- unverified `horstoeko/zugferd` — composer dependency, outside code roots
