---
id: platform/dev/6.7/resources/references/adr/2026-03-17-refactor-of-document-generation.md
title: Refactor of document generation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-17-refactor-of-document-generation.html
sourceHash: 9bb6395307c7435e344c9eb5c613b90364e52871
codeCheckedAgainst: "6.7.13.0"
keywords: ["document generation", "DocumentV2", "invoice", "zugferd", "e-invoice", "document format", "document type", "DOCUMENT_GENERATION_REWORK", "horstoeko/zugferd", "document.renderer", "AbstractDocumentRenderer", "document_base_config", "adr"]
summary: "ADR: refactor document generation into types with multiple formats (PDF, HTML, Zugferd), opt-in in 6.7, default in 6.8; estimated to break ~69 plugins."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-03-17) to rewrite Shopware's document generation. The existing implementation patched in accessible HTML documents and Zugferd e-invoices under legal deadlines; the refactor separates document types (invoice, delivery note, ...) from their formats (PDF, HTML, Zugferd XML, Zugferd embedded PDF) and gives extensions a cleaner API than class decoration.

## When to use

- Assessing whether a plugin or integration that touches documents will need changes for the new implementation.
- Understanding why the `DocumentV2` namespace exists next to the old `Checkout\Document` code.

## Key steps / config

Problems named in the current implementation:

- Each Zugferd document is a separate document type instead of a format; accessibility HTML is an attached media file instead of a format.
- File and document types are hard-coded in several places (e.g. the UI).
- Adding types/formats needs disproportionate effort; apps cannot provide or hook into generators (shopware#9676, shopware#10478).
- `horstoeko/zugferd` is declared legacy and wrapped behind a partial `ZugferdBuilder`.

Goals / decision:

- One document type has one or more formats, all generated from the same data and document number in one call; formats may depend on each other (e.g. PDF from HTML via DomPDF).
- Mail attachments work at document level, including all formats.
- Types and formats are extendable by plugins; merchants only configure options the type uses.
- Uploading static document files (`document.static`) to bypass generation stays possible.
- Zugferd XML is generated from Twig templates; the `horstoeko/zugferd` dependency is to be removed.
- The new implementation is opt-in during 6.7 (feature flag `DOCUMENT_GENERATION_REWORK` in the installed code) and replaces the old one in 6.8.

Follow-up ADRs: 2026-03-18 new document generation architecture, 2026-03-19 new document generation extension points.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK`
- `Shopware\Core\Checkout\DocumentV2` (new), `Shopware\Core\Checkout\Document` (old)
- Old extension points: `document.renderer`, `document_type.renderer`, `AbstractDocumentRenderer`, `AbstractDocumentTypeRenderer`, `DocumentFileRendererRegistry`, `DocumentGenerateOperation`, `InvoiceRenderer`, `PdfRenderer`, `HtmlRenderer`, `ZugferdBuilder`, `ZugferdRenderer`
- Templates: `@Framework/documents/base.html.twig`, `invoice.html.twig`, `delivery_note.html.twig`, `credit_note.html.twig`, `storno.html.twig`
- Config entities: `document_base_config`, `document_base_config_sales_channel`

## Gotchas

- All document-related extensions and integrations are expected to need updates. Of 3,204 scanned store plugins, 204 use the document API; 84 touch only Twig templates (likely unaffected), 51 more only config schemas — estimate 69 broken plugins (2.2%).
- Most used extension points: `invoice.html.twig` (76 plugins), `document_base_config` (77), `DocumentGenerateOperation` (44).
- Existing generated documents are to be migrated and stay accessible.

## Version notes

6.7: new implementation opt-in; 6.8: default, old implementation removed (should be deprecated before). In 6.7.13.0 `horstoeko/zugferd` is still a core dependency and the old classes carry no `@deprecated` tag.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — major, toggleable flag, default false; the opt-in switch — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `horstoeko/zugferd` — still required by core in 6.7.13.0 — vendor/shopware/core/composer.json:85
- confirmed `documentV2.php` — new DocumentV2 services loaded alongside old `document.xml` — vendor/shopware/core/Checkout/Checkout.php:43
- confirmed `document.renderer` — old renderer tag still in use — vendor/shopware/core/Checkout/DependencyInjection/document.xml:72
- confirmed `AbstractDocumentRenderer` — old abstract renderer, not deprecated — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:19
- confirmed `AbstractDocumentTypeRenderer` — old type renderer base — vendor/shopware/core/Checkout/Document/Service/AbstractDocumentTypeRenderer.php:9
- confirmed `DocumentGenerateOperation` — old generation struct — vendor/shopware/core/Checkout/Document/Struct/DocumentGenerateOperation.php:11
- confirmed `DocumentFileRendererRegistry` — old file renderer registry — vendor/shopware/core/Checkout/Document/Service/DocumentFileRendererRegistry.php:10
- confirmed `ZugferdBuilder` — wrapper around the Zugferd library — vendor/shopware/core/Checkout/Document/Zugferd/ZugferdBuilder.php:25
