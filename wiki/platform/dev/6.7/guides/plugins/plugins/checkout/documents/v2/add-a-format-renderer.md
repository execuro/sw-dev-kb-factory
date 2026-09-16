---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-format-renderer.md
sourceHash: c7b75facdb9c175ab9501f99d71ae018915146d3
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/add-a-format-renderer.html
title: Add a Format Renderer
version: "6.7"
versions:
  - "6.7"
keywords: ["AbstractDocumentRenderer", "RenderInput", "RenderState", "RenderResult", "shopware.document_v2.renderer", "getFormat", "getDocumentTypes", "getDependencies", "renderToString", "DocumentRendererRegistry", "PdfRenderer", "document format", "txt renderer", "DOCUMENT_GENERATION_REWORK"]
summary: "Document System v2: write an AbstractDocumentRenderer for a new output format, declare document types and dependencies, tag shopware.document_v2.renderer."
lastBuilt: 2026-09-15
---
## What it is

How a plugin adds an output format (e.g. plain text) to the experimental Document System (v2) by implementing a renderer. Each renderer produces exactly one format for the document types it lists, and can consume already-rendered formats it depends on. Requires the `DOCUMENT_GENERATION_REWORK` feature flag.

## When to use

You need a document file format the built-ins (`html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`) do not provide, or you are evaluating whether a built-in renderer can be replaced.

## Key steps / config

1. Extend `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`. Required: `getFormat()`, `getDocumentTypes()`, `renderToString()`. Optional: `getDependencies()` (formats rendered first and available in `RenderState`), `supports()` (defaults to checking `getDocumentTypes()`).

```php
readonly class TextRenderer extends AbstractDocumentRenderer
{
    public function getFormat(): string { return 'txt'; }
    public function getDocumentTypes(): array { return ['invoice']; }
    public function getDependencies(): array { return ['html']; }
    public function renderToString(RenderInput $input, RenderState $state, Context $context): RenderResult
    {
        $html = $state->require('html');
        return new RenderResult('txt', strip_tags($html->content), sprintf('%s_txt', $input->documentNumber), 'txt', 'text/plain');
    }
}
```

`RenderResult` constructor order: `format`, `content`, `fileName`, `fileExtension`, `mimeType`. `RenderInput` exposes `documentType`, `documentNumber`, `order` and provider data via `getData()`/`requireData()`. `RenderState::require()` throws when the format was not rendered, so every format read must be listed in `getDependencies()`.
2. Register the service in `PLUGIN_ROOT/src/Resources/config/services.php` with tag `shopware.document_v2.renderer`:

```php
$container->services()
    ->set(TextRenderer::class)
    ->tag('shopware.document_v2.renderer');
```

3. A dependency must also be resolvable for the same document type: `DocumentDependencyResolver` throws `rendererNotFound` if no renderer for the dependent format lists that type.

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`
- `Shopware\Core\Checkout\DocumentV2\Struct\RenderInput`, `...\Struct\RenderState`, `...\Struct\RenderResult`
- `Shopware\Core\Framework\Context`
- Tag `shopware.document_v2.renderer`
- `Shopware\Core\Checkout\DocumentV2\Renderer\DocumentRendererRegistry`

## Gotchas

- The source says a format becomes selectable once a document type lists it in `getSupportedFormats()`; in 6.7.13 there is no type class — the renderer's `getDocumentTypes()` decides which types get the format.
- The source's `getFileExtension()` is not a base member; the extension is passed to `RenderResult`.
- Overriding a built-in renderer by registering the same format with a higher tag `priority` (e.g. `['priority' => 100]`) does not work in 6.7.13: `DocumentRendererRegistry` throws `duplicateRenderer` when two renderers claim the same format and document type. Built-in `PdfRenderer` and siblings are `final`.
- The source notes this replaces the legacy `getDecorated()` decoration chains.

## Version notes

- Experimental in 6.7 (all v2 classes `@internal`); default with 6.8.

## Code check (6.7.13.0)
- confirmed `AbstractDocumentRenderer::getFormat()` — abstract — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:31
- corrected `AbstractDocumentRenderer::getDocumentTypes()` — docs: omitted from example; abstract and required — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:40
- confirmed `AbstractDocumentRenderer::getDependencies()` — optional, defaults to empty list — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:57
- confirmed `AbstractDocumentRenderer::renderToString()` — abstract, (RenderInput, RenderState, Context): RenderResult — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:65
- confirmed `RenderState::require()` — throws for unrendered format — vendor/shopware/core/Checkout/DocumentV2/Struct/RenderState.php:41
- confirmed `RenderResult::__construct()` — format, content, fileName, fileExtension, mimeType — vendor/shopware/core/Checkout/DocumentV2/Struct/RenderResult.php:20
- corrected `DocumentV2Exception::duplicateRenderer()` — docs: first renderer per format kept, higher priority replaces built-in — vendor/shopware/core/Checkout/DocumentV2/Renderer/DocumentRendererRegistry.php:31
- confirmed `shopware.document_v2.renderer` — renderer tag — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:127
- confirmed `PdfRenderer::getDependencies()` — built-in PDF depends on html — vendor/shopware/core/Checkout/DocumentV2/Renderer/PdfRenderer.php:49
- unverified `getFileExtension()` — not declared by AbstractDocumentRenderer; not searched in the whole index
