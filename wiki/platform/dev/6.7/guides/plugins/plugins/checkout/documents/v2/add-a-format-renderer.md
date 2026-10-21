---
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-format-renderer.md
title: Add a Format Renderer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/add-a-format-renderer.html
sourceHash: c7b75facdb9c175ab9501f99d71ae018915146d3
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractDocumentRenderer", "RenderState", "RenderResult", "RenderInput", "shopware.document_v2.renderer", "getDependencies", "PdfRenderer", "DOCUMENT_GENERATION_REWORK", "document format", "custom renderer", "override pdf renderer", "tag priority"]
summary: "Document System v2 renderers: extend AbstractDocumentRenderer for a new format, declare dependencies, or override a built-in via tag priority."
lastBuilt: 2026-10-21
---
## What it is

How to add a new output format to the experimental Document System v2 (`DOCUMENT_GENERATION_REWORK` feature flag), and how to replace a built-in renderer for an existing format via service tag priority.

## When to use

When documents must be produced in a format the core does not render (the example adds plain text), or when a built-in renderer such as the PDF one must be fully replaced.

## Key steps / config

A renderer produces exactly one format. It extends `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer` (a `readonly` class). `getDependencies()` (optional, default `[]`) lists formats that must render first; their results are read from `RenderState`.

```php
readonly class TextRenderer extends AbstractDocumentRenderer
{
    public function getFormat(): string { return 'txt'; }
    public function getFileExtension(): string { return 'txt'; }
    public function getDependencies(): array { return ['html']; }
    public function renderToString(RenderInput $input, RenderState $state, Context $context): RenderResult
    {
        $html = $state->require('html');
        return new RenderResult($this->getFormat(), strip_tags($html->content),
            sprintf('%s_txt', $input->documentNumber), $this->getFileExtension(), 'text/plain');
    }
}
```

`RenderResult` constructor order: `format`, `content`, `fileName`, `fileExtension`, `mimeType`.

Register it in `src/Resources/config/services.php` with the tag `shopware.document_v2.renderer`.

A format only becomes selectable once a document type lists it in `getSupportedFormats()`.

**Override a built-in renderer**: the renderer registry keeps the first renderer per format, and the tagged iterator yields the highest priority first. Register your renderer for the same format string with a higher priority; the built-ins are tagged without a priority (0).

```php
$container->services()
    ->set(CustomPdfRenderer::class)
    ->tag('shopware.document_v2.renderer', ['priority' => 100]);
```

`CustomPdfRenderer` extends `AbstractDocumentRenderer` with `getFormat()` returning `pdf`; it fully replaces the built-in `PdfRenderer`, including its `html` dependency declaration (so re-declare it if you need the HTML).

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer` - `getFormat()`, `getFileExtension()`, `renderToString()`, optional `getDependencies()`
- `Shopware\Core\Checkout\DocumentV2\Struct\RenderInput` (`documentType`, `documentNumber`, `order`)
- `Shopware\Core\Checkout\DocumentV2\Struct\RenderState` (`require()`, `get()`, `has()`)
- `Shopware\Core\Checkout\DocumentV2\Struct\RenderResult`
- Tag `shopware.document_v2.renderer`
- Built-in formats: `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`

## Gotchas

- `RenderState::require()` throws if the format was not rendered before; every format a renderer reads must be declared in `getDependencies()`.
- Overriding replaces the whole renderer, dependencies included.
- This priority-based replacement replaces the legacy system's `getDecorated()` decoration chains.

## Version notes

Experimental in 6.7 behind `DOCUMENT_GENERATION_REWORK`; marked `@experimental stableVersion:v6.8.0`, API may change until 6.8.

## Code check (6.7.15.1)
- confirmed `AbstractDocumentRenderer::getFormat()` — abstract — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:30
- confirmed `AbstractDocumentRenderer::getFileExtension()` — abstract — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:35
- confirmed `AbstractDocumentRenderer::getDependencies()` — non-abstract, returns `[]` by default — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:44
- confirmed `AbstractDocumentRenderer::renderToString()` — abstract, `(RenderInput, RenderState, Context): RenderResult` — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:52
- confirmed `RenderState::require()` — throws when the format result is missing — vendor/shopware/core/Checkout/DocumentV2/Struct/RenderState.php:41
- confirmed `RenderResult::__construct()` — format, content, fileName, fileExtension, mimeType — vendor/shopware/core/Checkout/DocumentV2/Struct/RenderResult.php:20
- confirmed `RenderInput::$documentNumber` — public string property — vendor/shopware/core/Checkout/DocumentV2/Struct/RenderInput.php:29
- confirmed `shopware.document_v2.renderer` — first renderer per format wins, highest priority first — vendor/shopware/core/Checkout/DocumentV2/Renderer/DocumentRendererRegistry.php:29
- confirmed `PdfRenderer::getDependencies()` — built-in PDF renderer depends on `html` — vendor/shopware/core/Checkout/DocumentV2/Renderer/PdfRenderer.php:46
- confirmed `PdfRenderer` — built-in tagged without explicit priority — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:197
