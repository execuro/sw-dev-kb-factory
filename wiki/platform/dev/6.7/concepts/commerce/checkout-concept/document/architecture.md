---
id: platform/dev/6.7/concepts/commerce/checkout-concept/document/architecture.md
title: Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/document/architecture.html
sourceHash: 2b0fcb0646442b2a5633a330f7a619133304e9a7
codeCheckedAgainst: "6.7.13.0"
keywords: ["document system v2", "DocumentGenerator", "DocumentDependencyResolver", "DocumentPersister", "RenderState", "AbstractDocumentDataProvider", "AbstractDocumentRenderer", "DocumentRendererRegistry", "DocumentConfigLoader", "document_file", "DOCUMENT_GENERATION_REWORK", "zugferd", "invoice pdf", "render plan"]
summary: "Document System v2 pipeline: DocumentGenerator, render plan, data providers, renderers, RenderState, document_file storage; 6.7.13 ships invoice only."
lastBuilt: 2026-09-15
---
## What it is

Architecture of the reworked document generation (Document System v2, namespace `Shopware\Core\Checkout\DocumentV2`): how a generation request becomes a render plan, typed render data, per-format render results and persisted `document` + `document_file` + media rows. Experimental, behind the `DOCUMENT_GENERATION_REWORK` feature flag (default off); the API can change until it becomes the default in 6.8.

## When to use

When you need to understand or debug v2 document generation (invoice HTML/PDF/ZUGFeRD), or before writing a data provider or renderer for it.

## Key steps / config

Pipeline as implemented in `DocumentGenerator::generate()` (6.7.13):

1. Validate the request: at least one format, and a non-live `orderVersionId` (the caller supplies the order version).
2. `DocumentDependencyResolver::resolve($documentType, $formats)` expands requested formats via each renderer's `getDependencies()` and topologically sorts them (Kahn's algorithm). Requesting `zugferd_embedded_pdf` yields `html`, `zugferd_xml`, `pdf`, `zugferd_embedded_pdf`.
3. `DocumentDataProviderRegistry::getByDocumentType()` returns every provider whose `supports()` matches; duplicate `getKey()` values throw. Each provider may add associations via `enrichOrderCriteria()`; the order is loaded once in the order-version context.
4. Document number: `DocumentGenerationRequest::$documentNumber` if set, otherwise `DocumentNumberGenerator` (number range type prefix `document_`).
5. Providers' `provideRenderingData()` results are stored in `RenderInput` keyed by provider key.
6. For each planned format, `DocumentRendererRegistry::getRenderer($format, $documentType)` renders via `renderToString(RenderInput, RenderState, Context)`; the result is added to `RenderState`.
7. `DocumentPersister::persist()` writes one `document` and one `document_file` per requested format; dependency-only formats are discarded.

Service tags (`vendor/shopware/core/Checkout/DependencyInjection/documentV2.php`): `shopware.document_v2.provider`, `shopware.document_v2.renderer`.

Formats (`DocumentFormat` enum): `html` (Twig), `pdf` (Dompdf from the HTML), `zugferd_xml` (EN 16931 CII, XRechnung profile), `zugferd_embedded_pdf` (PDF/A-3 with embedded XML).

Templates: `@Framework/documents/<technical_name>.html.twig` (partials in `@Framework/documents/includes/`), ZUGFeRD XML at `@Framework/documents/zugferd/<technical_name>.xml.twig`; overridable with `sw_extends`.

Config: `DocumentConfigLoader::load($documentType, $salesChannelId, $context)` merges the global `document_base_config` row, its sales-channel override and the `core.basicInformation` system config into a `DocumentConfigBundle`, with the legacy JSON `config` as fallback.

Storage skeleton:

```
document:      order_id, order_version_id, document_number
document_file: document_id, media_id, document_format   (unique per document + format)
```

## Essential identifiers

- `DocumentGenerator`, `DocumentDependencyResolver`, `DocumentPersister`, `DocumentGenerationRequest`
- `DocumentDataProviderRegistry`, `AbstractDocumentDataProvider`, `DocumentMetaProvider` (key `meta`, all types), `InvoiceDataProvider`
- `DocumentRendererRegistry`, `AbstractDocumentRenderer`, `HtmlRenderer`, `PdfRenderer`, `ZugferdXmlRenderer`, `ZugferdEmbeddedPdfRenderer`
- `RenderState`, `RenderInput`, `RenderResult`, `DocumentType`, `DocumentFormat`
- `DocumentConfigLoader`, `DocumentConfigBundle`, `document_file`

## Gotchas

- The docs describe a `DocumentTypeRegistry` fed by a `shopware.document_v2.type` tag; neither exists in 6.7.13. Types are the `DocumentType` enum: `invoice`, `delivery_note`, `credit_note`, `cancellation_invoice` (docs call it `storno`, which is the v1 `StornoRenderer::TYPE`).
- All four built-in renderers return only `invoice` from `getDocumentTypes()`, so delivery notes, credit notes and cancellation invoices cannot be rendered by v2 yet.
- Docs say the first renderer per format wins by tag priority, allowing overrides. The installed `DocumentRendererRegistry` throws `duplicateRenderer` when two renderers claim the same format and document type — no priority-based override.
- `ReferencesDocument` / `RendersReferencedSnapshot` and `referencedDocumentId` are not in the installed DocumentV2 code.
- The generator does not create the order version itself; passing the live version throws `liveVersionNotAllowed`.
- All v2 classes are marked `@internal`.

## Version notes

Experimental in 6.7 behind `DOCUMENT_GENERATION_REWORK`; the `documentV2.php` services are loaded unconditionally by `Checkout.php`, the flag gates admin UI. Planned default in 6.8.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- absent `DocumentTypeRegistry` — no such class; types are the `DocumentType` enum
- absent `shopware.document_v2.type` — only provider and renderer tags exist
- absent `ReferencesDocument` — no marker interface in installed code
- absent `RendersReferencedSnapshot` — no such interface in installed code
- corrected `DocumentType::CANCELLATION_INVOICE` — docs: technical name `storno`; v2 enum uses `cancellation_invoice` — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:18
- corrected `DocumentRendererRegistry` — docs: first renderer per format wins by tag priority; code throws on duplicate format and type — vendor/shopware/core/Checkout/DocumentV2/Renderer/DocumentRendererRegistry.php:12
- corrected `HtmlRenderer::getDocumentTypes()` — docs: four types supported; built-in renderers return only invoice — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:43
- corrected `Defaults::LIVE_VERSION` — docs: generation creates a new order version; code requires a non-live version in the request — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:233
- confirmed `AbstractDocumentRenderer::getDependencies()` — defaults to empty list, drives the render plan — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:57
