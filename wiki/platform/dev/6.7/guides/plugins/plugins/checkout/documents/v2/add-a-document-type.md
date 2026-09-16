---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md
sourceHash: 4e1d76d68fde05abc92ca2d028c88cde9d77179c
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.html
title: Add a Document Type
version: "6.7"
versions:
  - "6.7"
keywords: ["AbstractDocumentDataProvider", "AbstractRenderData", "AbstractDocumentRenderer", "shopware.document_v2.provider", "shopware.document_v2.renderer", "provideRenderingData", "enrichOrderCriteria", "getDocumentTypes", "document_type", "document number range", "custom document type", "DOCUMENT_GENERATION_REWORK", "document template"]
summary: "Document System v2: add a document type with a data provider, renderers listing its name, a Twig template, a document_type row and number range."
lastBuilt: 2026-09-15
---
## What it is

How a plugin adds a new kind of document to the experimental Document System (v2): render data DTO plus data provider, renderers that accept the type's technical name, a Twig template, and the database rows (`document_type`, number range). Requires the `DOCUMENT_GENERATION_REWORK` feature flag.

## When to use

You need a document other than the built-in ones (e.g. `example_document`) generated from an order through the v2 pipeline.

## Key steps / config

In the installed 6.7.13 code a document type is only a technical-name string (lowercase letters, digits, underscores); there is no type class or type tag. It is "supported" when renderers and providers accept it.

1. **Render data DTO** extending `Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData`; its public properties are flattened onto the template's `config` variable (e.g. `noteText` → `config.noteText`).
2. **Data provider** extending `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`:

```php
readonly class ExampleDocumentDataProvider extends AbstractDocumentDataProvider
{
    public function getKey(): string { return 'example'; }
    public function supports(string $documentType): bool { return $documentType === 'example_document'; }
    public function enrichOrderCriteria(Criteria $criteria): void { $criteria->addAssociation('lineItems'); }
    public function provideRenderingData(OrderEntity $order, DocumentGenerationRequest $generationRequest, Context $context): AbstractRenderData
    {
        return new ExampleRenderData(noteText: 'Thank you for your order!');
    }
}
```

`enrichOrderCriteria()` is optional and runs before the order is loaded.
3. **Renderers**: the renderer registry maps (document type, format) to a renderer via `AbstractDocumentRenderer::getDocumentTypes()`. The built-in `HtmlRenderer`, `PdfRenderer`, `ZugferdXmlRenderer` and `ZugferdEmbeddedPdfRenderer` are `final` and list only `invoice`, so a new type needs its own renderer for every format it offers (declaring `getFormat()`, `getDocumentTypes()`, `renderToString()`); a PDF renderer declares `getDependencies()` returning `['html']`.
4. **Register services** in `PLUGIN_ROOT/src/Resources/config/services.php`: tag providers `shopware.document_v2.provider` and renderers `shopware.document_v2.renderer`.
5. **Template**: the built-in HTML renderer resolves `@Framework/documents/%s.html.twig` with the document type; ZUGFeRD XML uses `@Framework/documents/zugferd/%s.xml.twig`. Source example `PLUGIN_ROOT/src/Resources/views/documents/example_document.html.twig`:

```twig
{% sw_extends '@Framework/documents/base.html.twig' %}
{% block document_headline %}
    <h1 class="headline">Example document {{ documentNumber }}</h1>
    <p>{{ config.noteText }}</p>
{% endblock %}
```

6. **Database rows** (migration, same as legacy): a `document_type` row whose `technical_name` equals your type (persisting throws "document type not found" otherwise) and a number range of type `document_example_document` (prefix `document_` + type).

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider` (`getKey()`, `supports()`, `enrichOrderCriteria()`, `provideRenderingData()`)
- `Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData`
- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`
- `Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerationRequest`
- Tags `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `@Framework/documents/<technical_name>.html.twig`, number range `document_<technical_name>`

## Gotchas

- The source shows a `readonly class ExampleDocumentType extends AbstractDocumentType` with `getTechnicalName()`/`getSupportedFormats()` and a `shopware.document_v2.type` tag; neither the class nor the tag exists in 6.7.13.
- The source's `provideRenderingData(ProviderInput $input, Context $context)` signature does not match the installed abstract method; `ProviderInput` does not exist.
- Two renderers for the same format and type throw `duplicateRenderer`; provider keys must be unique per type; DTO property names must not collide with shared `config` keys (e.g. `companyName`, `pageSize`) — `templateContextPropertyCollision`.
- `DocumentMetaProvider` (key `meta`) supports every type and is required by the built-in HTML/PDF renderers.

## Version notes

- Experimental in 6.7 (all v2 classes `@internal`); default with 6.8.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\DocumentV2\Type\AbstractDocumentType` — no document type base class; types are strings accepted by renderers/providers
- absent `Shopware\Core\Checkout\DocumentV2\Struct\ProviderInput` — provider receives order and generation request instead
- absent `shopware.document_v2.type` — only provider and renderer tags are registered
- corrected `AbstractDocumentDataProvider::provideRenderingData()` — docs: (ProviderInput $input, Context $context) — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:45
- confirmed `AbstractDocumentDataProvider::enrichOrderCriteria()` — optional hook, empty default — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:38
- corrected `AbstractDocumentRenderer::getDocumentTypes()` — docs: type class declares getSupportedFormats() — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:40
- confirmed `HtmlRenderer::getDocumentTypes()` — built-in HTML renderer lists only invoice — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:43
- confirmed `HtmlRenderer::TEMPLATE_PATTERN` — @Framework/documents/%s.html.twig — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:31
- confirmed `DocumentNumberGenerator::NUMBER_RANGE_DOCUMENT_TYPE_PREFIX` — document_ prefix for number range type — vendor/shopware/core/Checkout/DocumentV2/Config/DocumentNumberGenerator.php:21
- confirmed `shopware.document_v2.provider` — provider tag — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:78
