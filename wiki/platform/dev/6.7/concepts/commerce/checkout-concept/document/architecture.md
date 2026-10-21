---
id: platform/dev/6.7/concepts/commerce/checkout-concept/document/architecture.md
title: Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/document/architecture.html
sourceHash: 2b0fcb0646442b2a5633a330f7a619133304e9a7
codeCheckedAgainst: "6.7.15.1"
keywords: ["document generation architecture", "DocumentGenerator", "DocumentDependencyResolver", "RenderState", "DocumentPersister", "DocumentTypeRegistry", "DocumentRendererRegistry", "DocumentDataProviderRegistry", "shopware.document_v2.renderer", "DocumentConfigLoader", "render plan", "document_file", "zugferd", "storno"]
summary: "Document System (v2) internals: generation pipeline, render plan, registries and service tags, referenced invoices, templates, storage."
lastBuilt: 2026-10-21
---
## What it is

Architecture of the experimental Document System (v2) (flag `DOCUMENT_GENERATION_REWORK`, namespace `Shopware\Core\Checkout\DocumentV2`): the generation pipeline, registries, render plans, referenced documents, templates, configuration and storage.

## When to use

To understand how a v2 document is produced, how formats depend on each other, or where a document type, data provider or renderer hooks in.

## Key steps / config

**Pipeline**
1. A generation request carries an order ID, a document type and the requested formats (plus `referencedDocumentId` for credit notes and storno).
2. `DocumentGenerator` loads the order once, merging in the search criteria of every matching data provider.
3. `DocumentDependencyResolver` expands the requested formats into a render plan that includes every prerequisite format.
4. Every `AbstractDocumentDataProvider` whose `supports()` matches the type returns typed render data, keyed by its provider key.
5. Each `AbstractDocumentRenderer` in the plan writes one result into `RenderState`.
6. `DocumentPersister` stores the `document` with one `document_file` and media entry per requested format.

The document number comes from the number range type `document_<technicalName>` unless the caller passes one.

| Registry | Service tag | Rule |
|---|---|---|
| `DocumentTypeRegistry` | `shopware.document_v2.type` | one type per technical name; validates formats |
| `DocumentDataProviderRegistry` | `shopware.document_v2.provider` | all matching providers run; duplicate keys throw |
| `DocumentRendererRegistry` | `shopware.document_v2.renderer` | first renderer per format wins, by tag priority |

Override a built-in renderer by registering one for the same format with a higher tag priority. Renderers declare prerequisite formats via `getDependencies()`: `pdf` needs `html`; `zugferd_embedded_pdf` needs `pdf` and `zugferd_xml`.

| Type | Formats |
|---|---|
| `invoice`, `credit_note`, `storno` (cancellation invoice) | html, pdf, zugferd_xml, zugferd_embedded_pdf |
| `delivery_note` (needs a delivery date in the request) | html, pdf |

`html` is a Twig template rendered with the document data; `pdf` prints that HTML through Dompdf; `zugferd_xml` is an EN 16931 CII e-invoice (XRechnung profile); `zugferd_embedded_pdf` is a PDF/A-3 with the XML embedded.

**Order versions:** generating creates a new order version that freezes the order state; a preview renders against the live version. Providers for documents referencing an invoice implement the `ReferencesDocument` marker interface; `RendersReferencedSnapshot` renders against the order version the referenced invoice was generated from.

**Templates:** `@Framework/documents/<technical_name>.html.twig` (partials under `@Framework/documents/includes/`) and `@Framework/documents/zugferd/<technical_name>.xml.twig`, both overridable with `sw_extends`.

**Config:** `DocumentConfigLoader` merges the global `document_base_config` row, its sales-channel override and the `core.basicInformation` company data into a typed `DocumentConfigBundle`, reading typed columns first and falling back to the legacy JSON `config`.

## Essential identifiers

- `DocumentGenerator`, `DocumentDependencyResolver`, `RenderState`, `DocumentPersister`
- `AbstractDocumentDataProvider`, `AbstractDocumentRenderer`
- `shopware.document_v2.type`, `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `ReferencesDocument`, `RendersReferencedSnapshot`, `DocumentConfigLoader`, `DocumentConfigBundle`

## Gotchas

- Experimental until 6.8. The registries and `DocumentDependencyResolver` are `@internal`; extend via the abstract base classes and service tags.
- The docs say dependency-only intermediates are discarded; in code `html` is the exception — whenever it is rendered along the way it is persisted as the document's accessible version.
- Only dependency order is guaranteed in the render plan: the resolver's own example yields `html`, `zugferd_xml`, `pdf`, `zugferd_embedded_pdf`.
- Legacy `Shopware\Core\Checkout\Document` has same-named classes (`DocumentGenerator`, `AbstractDocumentRenderer`, `DocumentRendererRegistry`).

## Code check (6.7.15.1)
- confirmed `DocumentGenerator` — v2 orchestrator — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:35
- corrected `DocumentGenerator::generate()` — docs: intermediates discarded; html is persisted whenever rendered — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:66
- corrected `DocumentDependencyResolver` — docs: plan html, pdf, zugferd_xml, zugferd_embedded_pdf; code example puts zugferd_xml before pdf — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentDependencyResolver.php:25
- confirmed `DocumentRendererRegistry` — first renderer per format wins — vendor/shopware/core/Checkout/DocumentV2/Renderer/DocumentRendererRegistry.php:12
- confirmed `DocumentDataProviderRegistry` — duplicate provider key throws — vendor/shopware/core/Checkout/DocumentV2/Provider/DocumentDataProviderRegistry.php:12
- confirmed `shopware.document_v2.type` — type service tag — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:140
- confirmed `AbstractDocumentRenderer::getDependencies()` — prerequisite formats — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:44
- confirmed `NUMBER_RANGE_DOCUMENT_TYPE_PREFIX` — value document_ — vendor/shopware/core/Checkout/DocumentV2/Config/DocumentNumberGenerator.php:21
- confirmed `RendersReferencedSnapshot` — extends ReferencesDocument — vendor/shopware/core/Checkout/DocumentV2/Provider/RendersReferencedSnapshot.php:17
- confirmed `COMPANY_INFO_CONFIG_DOMAIN` — core.basicInformation — vendor/shopware/core/Checkout/DocumentV2/Config/DocumentConfigLoader.php:37
