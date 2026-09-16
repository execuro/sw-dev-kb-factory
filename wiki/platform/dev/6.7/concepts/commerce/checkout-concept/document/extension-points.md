---
id: platform/dev/6.7/concepts/commerce/checkout-concept/document/extension-points.md
title: Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/document/extension-points.html
sourceHash: b19a48e42671f39810d39602c6b4ab3848d0cef3
codeCheckedAgainst: "6.7.13.0"
keywords: ["document system v2", "document extension", "shopware.document_v2.provider", "shopware.document_v2.renderer", "AbstractDocumentDataProvider", "AbstractDocumentRenderer", "document template override", "sw_extends", "custom document format", "DOCUMENT_GENERATION_REWORK", "document data provider", "document renderer"]
summary: "Document System v2 extension points: tagged data providers and renderers plus Twig template overrides; no decoration, apps limited to declarative extension."
lastBuilt: 2026-09-15
---
## What it is

Overview of how Document System v2 (experimental, `DOCUMENT_GENERATION_REWORK` feature flag) is extended: tagged Symfony services and Twig template overrides, no service decoration.

## When to use

When deciding how a plugin or app should change document appearance, add data to a document, or produce another output format.

## Key steps / config

| Goal | Mechanism (6.7.13) |
|---|---|
| Change how a document looks | Override the Twig template (`sw_extends`) |
| Add data to a document | Service tagged `shopware.document_v2.provider` |
| Produce a format | Service tagged `shopware.document_v2.renderer` |

Data provider — extend the `abstract readonly class` `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`:

```php
final readonly class MyProvider extends AbstractDocumentDataProvider
{
    public function getKey(): string { /* unique key in RenderInput */ }
    public function supports(string $documentType): bool { /* ... */ }
    public function enrichOrderCriteria(Criteria $criteria): void { /* optional */ }
    public function provideRenderingData(OrderEntity $order, DocumentGenerationRequest $generationRequest, Context $context): AbstractRenderData { /* ... */ }
}
```

Renderer — extend `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`: `getFormat(): string`, `getDocumentTypes(): array`, `renderToString(RenderInput $input, RenderState $state, Context $context): RenderResult`; optionally `getDependencies(): array` (formats read from `RenderState` first).

Templates: `@Framework/documents/<technical_name>.html.twig` and `@Framework/documents/zugferd/<technical_name>.xml.twig`.

Plugins register the tagged services and override templates directly. Apps extend documents declaratively (manifest registers the type, Twig renders it, a script hook provides data) and cannot add formats, renderers or typed data providers.

## Essential identifiers

- `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `AbstractDocumentDataProvider::getKey()`, `::supports()`, `::enrichOrderCriteria()`, `::provideRenderingData()`
- `AbstractDocumentRenderer::getFormat()`, `::getDocumentTypes()`, `::getDependencies()`, `::renderToString()`
- `DocumentDataProviderRegistry`, `DocumentRendererRegistry`, `RenderState`

## Gotchas

- The docs list "Add a document type" via a `shopware.document_v2.type` tag; that tag does not exist in 6.7.13 — types come from the `DocumentType` enum and the type strings providers/renderers declare.
- "Override a built-in renderer" does not work in 6.7.13: `DocumentRendererRegistry` throws `duplicateRenderer` if a second renderer claims the same format and document type. A new renderer must use a format/type pair no built-in renderer (all `invoice`-only) occupies.
- Duplicate provider keys for one document type throw as well; the built-in `DocumentMetaProvider` uses key `meta` for every type.
- All base classes are `@internal` and `readonly`; the API can change until 6.8.
- The app `document-generation` script hook named in the docs could not be found in installed core code.

## Version notes

Experimental in 6.7; intended to become the default document system in 6.8.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- absent `shopware.document_v2.type` — no type tag; only provider and renderer tags are wired
- confirmed `shopware.document_v2.provider` — tagged iterator for DocumentDataProviderRegistry — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:78
- corrected `shopware.document_v2.renderer` — docs: add or override a format; registry rejects duplicate format and type — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:127
- confirmed `AbstractDocumentDataProvider::provideRenderingData()` — abstract, returns AbstractRenderData — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:45
- confirmed `AbstractDocumentDataProvider::enrichOrderCriteria()` — optional hook with empty default — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:38
- confirmed `AbstractDocumentRenderer::renderToString()` — abstract render method — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:65
- confirmed `DocumentMetaProvider::supports()` — returns true for all types — vendor/shopware/core/Checkout/DocumentV2/Provider/DocumentMetaProvider.php:34
- confirmed `@Framework/documents/%s.html.twig` — HTML template pattern — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:31
- unverified `document-generation` — no script hook of this name found in core; string only occurs in admin bulk-edit component names
