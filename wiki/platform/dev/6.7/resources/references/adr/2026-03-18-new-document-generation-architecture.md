---
id: platform/dev/6.7/resources/references/adr/2026-03-18-new-document-generation-architecture.md
title: New document generation architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-18-new-document-generation-architecture.html
sourceHash: 899563062ec2a970d65235e447f49e50f2d255e6
codeCheckedAgainst: "6.7.15.1"
keywords: ["DocumentV2", "AbstractDocumentDataProvider", "AbstractDocumentRenderer", "shopware.document_v2.provider", "shopware.document_v2.renderer", "DocumentFormat", "DocumentType", "RenderInput", "RenderState", "document_file", "zugferd", "invoice pdf", "document generation", "DOCUMENT_GENERATION_REWORK"]
summary: "ADR: DocumentV2 design - a generator orchestrates tagged data providers and format renderers (HTML, PDF, ZUGFeRD) in dependency order."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-03-18, area after-sales) for the refactored document generation ("DocumentV2"). It defines the vocabulary (document type, document format, document file, document), the entity relations, and a three-layer design: a generator service orchestrates, data providers collect/enrich data, renderers transform it into formatted artifacts. In 6.7.15.1 the implementation lives under `Shopware\Core\Checkout\DocumentV2\` and is experimental behind a feature flag (see Version notes).

## When to use

- Writing a plugin that adds data to documents, a new document format, or a new document type on the DocumentV2 stack.
- Understanding how multi-format generation (e.g. ZUGFeRD embedded PDF built from PDF + ZUGFeRD XML, PDF built from HTML) is ordered.

## Key steps / config

Glossary:

- Document format: representation such as PDF, HTML, ZUGFeRD XML, ZUGFeRD embedded PDF (`DocumentFormat`: `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`).
- Document type: invoice, delivery note, credit note, cancellation invoice (`DocumentType`: `invoice`, `delivery_note`, `credit_note`, `storno`, plus `app_provided`).
- Document: one document number, one or more `document_file`s in different formats, all based on the same order version.

Entity relations: an order has zero or more `document`s; each `document` has one type and one or more `document_file`s; each `document_file` has one format. Types and formats are stored as plain strings, not as entities.

Caller API (installed code): the generator service in the `Generation` namespace exposes `generate(DocumentGenerationRequest $generationRequest, Context $apiContext): DocumentEntity` and `preview(...)`. The request DTO carries `orderId`, `documentType`, `requestedFormats`, optional `documentNumber`, `documentComment`, `deliveryDate`, `referencedDocumentId`. `generate` always creates a new order version; `preview` renders against `Defaults::LIVE_VERSION` and persists nothing.

Data provider (Symfony service tagged `shopware.document_v2.provider`), installed shape:

```php
readonly class MyDataProvider extends AbstractDocumentDataProvider
{
    public function getKey(): string { /* key in RenderInput */ }
    public function supports(string $documentType): bool { /* ... */ }
    public function enrichOrderCriteria(Criteria $criteria): void { /* optional */ }
    public function provideRenderingData(ProviderInput $input, Context $context): AbstractRenderData { /* ... */ }
}
```

Renderer (Symfony service tagged `shopware.document_v2.renderer`), installed shape:

```php
readonly class MyRenderer extends AbstractDocumentRenderer
{
    public function getFormat(): string { /* DocumentFormat value */ }
    public function getFileExtension(): string { /* ... */ }
    public function getDependencies(): array { return ['html']; } // optional
    public function renderToString(RenderInput $input, RenderState $state, Context $context): RenderResult { /* ... */ }
}
```

- Providers run at most once per generation call; their `AbstractRenderData` subclass is stored in `RenderInput` under `getKey()`.
- Renderers read dependency output from `RenderState`. Overriding a core renderer: give the tagged service a higher priority.
- Render order is a dependency graph (Kahn's algorithm); circular dependencies throw.
- Only requested formats are persisted as `document_file`; intermediate formats are not (installed exception: `html` is always persisted when rendered, as the accessible version).

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`, tag `shopware.document_v2.provider`
- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`, tag `shopware.document_v2.renderer`
- `DocumentGenerationRequest`, `RenderInput`, `RenderState`, `RenderResult`, `ProviderInput`, `AbstractRenderData`
- `DocumentFormat`, `DocumentType` enums
- Core renderers `HtmlRenderer`, `PdfRenderer`, `ZugferdXmlRenderer`, `ZugferdEmbeddedPdfRenderer`

## Gotchas

- The ADR names the service `Shopware\Core\Checkout\DocumentV2\DocumentGenerator`; that class does not exist. The installed class is `Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerator`, and it takes a DTO, as the ADR anticipated, not scalar parameters.
- The ADR tags `shopware.documentV2.provider` / `shopware.documentV2.renderer` are wrong; installed tags use snake case `document_v2`.
- The ADR draft signatures differ from the code: providers declare `supports(string)` instead of `getDocumentTypes()`, and `provideRenderingData` receives `ProviderInput` + `Context` and returns `AbstractRenderData`. Renderers have no `supports()` or `persistToFile()`; they declare `getFileExtension()` and `renderToString` takes a `Context`. Persistence is handled centrally by `DocumentPersister`.
- Document types are registered via `AbstractDocumentType` services tagged `shopware.document_v2.type` (`getTechnicalName()`, `getSupportedFormats()`), not only discovered from providers/renderers.
- Abstract classes were chosen over interfaces so optional methods (`enrichOrderCriteria`, `getDependencies`) have defaults and new methods can be added without breaking implementations.

## Version notes

In 6.7.15.1 the DocumentV2 classes are marked `@experimental stableVersion:v6.8.0 feature:DOCUMENT_GENERATION_REWORK`; the `DOCUMENT_GENERATION_REWORK` flag defaults to `false`. Extension points are covered by the follow-up ADR of 2026-03-19.

## Code check (6.7.15.1)
- absent `Shopware\Core\Checkout\DocumentV2\DocumentGenerator` — installed class is in the `Generation` sub-namespace
- confirmed `DocumentGenerator::generate()` — takes DocumentGenerationRequest and Context, returns DocumentEntity — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:66
- confirmed `Defaults::LIVE_VERSION` — preview uses live version, generate creates an order version — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:250
- corrected `shopware.document_v2.provider` — docs: shopware.documentV2.provider — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:99
- corrected `shopware.document_v2.renderer` — docs: shopware.documentV2.renderer — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:185
- corrected `AbstractDocumentDataProvider::supports()` — docs: getDocumentTypes(): array — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:32
- corrected `AbstractDocumentDataProvider::provideRenderingData()` — docs: (OrderEntity $order): RenderData — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:44
- corrected `AbstractDocumentRenderer::getFileExtension()` — docs: supports() and persistToFile() instead — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:35
- corrected `AbstractDocumentRenderer::renderToString()` — docs: no Context parameter — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:52
- confirmed `DocumentV2Exception::circularRenderDependency()` — thrown on circular renderer dependencies — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentDependencyResolver.php:172
