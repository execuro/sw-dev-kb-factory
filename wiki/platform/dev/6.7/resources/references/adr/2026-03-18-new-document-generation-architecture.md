---
id: platform/dev/6.7/resources/references/adr/2026-03-18-new-document-generation-architecture.md
title: New document generation architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-18-new-document-generation-architecture.html
sourceHash: 899563062ec2a970d65235e447f49e50f2d255e6
codeCheckedAgainst: "6.7.13.0"
keywords: ["document generation", "DocumentV2", "AbstractDocumentDataProvider", "AbstractDocumentRenderer", "shopware.document_v2.provider", "shopware.document_v2.renderer", "DocumentGenerationRequest", "RenderInput", "RenderState", "document_file", "DocumentFormat", "DocumentType", "zugferd", "invoice pdf", "adr"]
summary: "ADR: DocumentV2 architecture - generator orchestrates tagged data providers and format renderers, resolving format dependencies (HTML to PDF to Zugferd)."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-03-18) for the refactored ("DocumentV2") document generation: one document (one number) of one document type is stored as one or more document files, each in one format. A generator orchestrates, data providers collect data, renderers produce format artifacts. Implemented in 6.7.13.0 under `Shopware\Core\Checkout\DocumentV2`.

## When to use

- Generating documents through the new implementation or writing a provider/renderer for it.
- Understanding how `zugferd_embedded_pdf` is derived from `pdf`, `zugferd_xml` and `html`.

## Key steps / config

Model: an order has zero or more `document`s; each has one type and one or more `document_file`s, each in one format. The ADR keeps types/formats as strings (not DB entities). Enums: `DocumentType` — `invoice`, `delivery_note`, `credit_note`, `cancellation_invoice`; `DocumentFormat` — `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`.

Caller API — `Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerator`:

```php
public function generate(DocumentGenerationRequest $generationRequest, Context $apiContext): DocumentEntity
// new DocumentGenerationRequest(orderId, orderVersionId,
//     DocumentType|string $documentType, list<DocumentFormat|string> $requestedFormats,
//     ?documentNumber, ?documentComment, ?documentDate)
```

Flow: validate, resolve render plan, let matching providers enrich the order `Criteria`, load the order in the given version, generate a number if none given, build `RenderInput`, run renderers in plan order into `RenderState`, persist only requested formats via `DocumentPersister`.

Data provider — tagged `shopware.document_v2.provider`:

```php
final readonly class MyDataProvider extends AbstractDocumentDataProvider {
    public function getKey(): string { /* ... */ }
    public function supports(string $documentType): bool { /* ... */ }
    public function provideRenderingData(OrderEntity $order, DocumentGenerationRequest $generationRequest, Context $context): AbstractRenderData { /* ... */ }
}
```

Optional `enrichOrderCriteria(Criteria $criteria)`; the result is stored in `RenderInput` under `getKey()`.

Renderer — tagged `shopware.document_v2.renderer`:

```php
final readonly class MyRenderer extends AbstractDocumentRenderer {
    public function getFormat(): string { /* ... */ }
    public function getDocumentTypes(): array { /* ... */ }
    public function renderToString(RenderInput $input, RenderState $state, Context $context): RenderResult { /* ... */ }
}
```

Optional `supports(string $type)` and `getDependencies()` (formats). `RenderResult` holds `format`, `content`, `fileName`, `fileExtension`, `mimeType`; `RenderInput` exposes `documentType`, `documentNumber`, `order`, `getData()` / `requireData()`.

`DocumentDependencyResolver` expands transitive dependencies and sorts with Kahn's algorithm (cycle throws); plan for `zugferd_embedded_pdf`: `html`, `zugferd_xml`, `pdf`, `zugferd_embedded_pdf`.

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerator`, `DocumentGenerationRequest`
- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`
- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`
- `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `RenderInput`, `RenderState`, `RenderResult`, `AbstractRenderData`, `DocumentDependencyResolver`

## Gotchas

- The ADR draft differs from code: tags `shopware.documentV2.provider` / `shopware.documentV2.renderer`; `RenderData` is `AbstractRenderData`; providers use `supports()` not `getDocumentTypes()`; `renderToString()` also takes `Context`; no renderer `persistToFile()`.
- Overriding a built-in renderer via higher tag priority (ADR idea) fails in 6.7.13.0: `DocumentRendererRegistry` throws on a duplicate format/type pair.
- ADR update: generator creates the order version itself, preview uses `LIVE_VERSION`. In 6.7.13.0 the caller passes `orderVersionId`, `LIVE_VERSION` is rejected, and there is no preview method.
- All DocumentV2 classes are `@internal`.

## Version notes

Opt-in during 6.7 (feature flag `DOCUMENT_GENERATION_REWORK`), planned default in 6.8.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\DocumentV2\DocumentGenerator` — real class is `Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerator`
- corrected `DocumentGenerator::generate()` — docs: scalar params orderId/docType/formats/context/docNumber; code: `DocumentGenerationRequest` + `Context` — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:51
- corrected `DocumentGenerator::validateGenerationRequest()` — docs: generator creates order version itself; code rejects `LIVE_VERSION` — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:233
- corrected `shopware.document_v2.provider` — docs: `shopware.documentV2.provider` — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:66
- corrected `shopware.document_v2.renderer` — docs: `shopware.documentV2.renderer` — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:99
- corrected `AbstractDocumentDataProvider::supports()` — docs: `getDocumentTypes()` on providers — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:33
- corrected `AbstractDocumentDataProvider::provideRenderingData()` — docs: `(OrderEntity): RenderData`; code adds request and Context, returns `AbstractRenderData` — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:45
- corrected `AbstractDocumentRenderer::renderToString()` — docs: `(RenderInput, RenderState)` plus abstract `persistToFile()`; code adds Context, no persistToFile — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:65
- corrected `DocumentRendererRegistry` — docs: override built-in renderer via higher priority; code throws on duplicate format/type — vendor/shopware/core/Checkout/DocumentV2/Renderer/DocumentRendererRegistry.php:12
- confirmed `DocumentDependencyResolver` — Kahn's algorithm, throws on circular dependency — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentDependencyResolver.php:25
