---
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.md
title: Add a Document Type
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/add-a-document-type.html
sourceHash: 4e1d76d68fde05abc92ca2d028c88cde9d77179c
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractDocumentType", "AbstractDocumentDataProvider", "AbstractRenderData", "ProviderInput", "shopware.document_v2.type", "shopware.document_v2.provider", "DOCUMENT_GENERATION_REWORK", "custom document type", "document data provider", "document template", "number range", "document_type"]
summary: "New Document System v2 type: type class, data provider with render DTO, service tags, Twig template, document_type row, number range."
lastBuilt: 2026-10-21
---
## What it is

How to add a new kind of document in the experimental Document System v2 (`DOCUMENT_GENERATION_REWORK` feature flag): define the type, provide the data it renders, register both as tagged services, add a Twig template, and create the database rows.

## When to use

When a plugin needs a document kind other than the built-in invoice, cancellation invoice, delivery note and credit note, rendered through the v2 renderers (HTML, PDF, optionally ZUGFeRD).

## Key steps / config

1. **Type class** - extends `Shopware\Core\Checkout\DocumentV2\Type\AbstractDocumentType` (a `readonly` class) and declares the technical name and supported formats:

```php
readonly class ExampleDocumentType extends AbstractDocumentType
{
    final public const TECHNICAL_NAME = 'example_document';
    public function getTechnicalName(): string { return self::TECHNICAL_NAME; }
    public function getSupportedFormats(): array { return ['html', 'pdf']; }
}
```

2. **Render data DTO** - a `readonly` class extending `Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData` with public constructor properties (e.g. `public string $noteText`). Public properties end up on the template's `config` variable.

3. **Data provider** - extends `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`:

```php
readonly class ExampleDocumentDataProvider extends AbstractDocumentDataProvider
{
    public function getKey(): string { return 'example'; }
    public function supports(string $documentType): bool { return $documentType === ExampleDocumentType::TECHNICAL_NAME; }
    public function enrichOrderCriteria(Criteria $criteria): void { $criteria->addAssociation('lineItems'); }
    public function provideRenderingData(ProviderInput $input, Context $context): AbstractRenderData { /* ... */ }
}
```

`enrichOrderCriteria()` is optional (empty default); it adds associations loaded before `provideRenderingData()` runs. `ProviderInput` exposes `order`, `generationRequest` and `resolvedReference`.

4. **Services** (`src/Resources/config/services.php`): tag the type with `shopware.document_v2.type` and the provider with `shopware.document_v2.provider`.

5. **Template** - the HTML renderer resolves `@Framework/documents/<technical_name>.html.twig`, so place it at `src/Resources/views/documents/example_document.html.twig`:

```twig
{% sw_extends '@Framework/documents/base.html.twig' %}
{% block document_headline %}
    <h1 class="headline">Example document {{ documentNumber }}</h1>
    <p>{{ config.noteText }}</p>
{% endblock %}
```

Types offering `zugferd_xml` also need `src/Resources/views/documents/zugferd/example_document.xml.twig`.

6. **Database rows** - a `document_type` row whose `technical_name` matches the type (the `document` table has a foreign key on it), and a number range of type `document_example_document` (prefix `document_` + technical name). The migration code is identical to the legacy system's custom document type guide.

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Type\AbstractDocumentType` - `getTechnicalName()`, `getSupportedFormats()`, optional `allowsNegativeLineItems()`
- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider` - `getKey()`, `supports()`, `enrichOrderCriteria()`, `provideRenderingData()`
- `Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData`, `Shopware\Core\Checkout\DocumentV2\Struct\ProviderInput`
- Tags `shopware.document_v2.type`, `shopware.document_v2.provider`
- Template paths `@Framework/documents/<technical_name>.html.twig`, `@Framework/documents/zugferd/<technical_name>.xml.twig`
- Number range type `document_<technical_name>`

## Gotchas

- The document type string must match `^[a-z0-9_]+$`; `RenderInput` throws otherwise.
- Public DTO fields are flattened into `config`; a field name that collides with a shared key (e.g. `documentNumber`, `companyName`, `pageSize`) or with another provider's field throws a template-context collision exception.
- Two providers with the same `getKey()` for one document type throw a duplicate-provider-key exception.
- A format is only offered if the type lists it in `getSupportedFormats()` and a renderer for it exists.

## Version notes

Experimental in 6.7 behind `DOCUMENT_GENERATION_REWORK` (default off); classes are marked `@experimental stableVersion:v6.8.0`, and the API can change until 6.8.

## Code check (6.7.15.1)
- confirmed `AbstractDocumentType::getTechnicalName()` — abstract; with `getSupportedFormats()` the required members — vendor/shopware/core/Checkout/DocumentV2/Type/AbstractDocumentType.php:15
- confirmed `AbstractDocumentType::getSupportedFormats()` — abstract, returns list of format strings — vendor/shopware/core/Checkout/DocumentV2/Type/AbstractDocumentType.php:22
- confirmed `AbstractDocumentDataProvider::enrichOrderCriteria()` — non-abstract with empty body, optional — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:37
- confirmed `AbstractDocumentDataProvider::provideRenderingData()` — abstract, `(ProviderInput, Context): AbstractRenderData` — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:44
- confirmed `ProviderInput::$order` — public `OrderEntity` property — vendor/shopware/core/Checkout/DocumentV2/Struct/ProviderInput.php:20
- confirmed `shopware.document_v2.type` — tag collected via tagged_iterator into `DocumentTypeRegistry` — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:161
- confirmed `shopware.document_v2.provider` — tag collected into `DocumentDataProviderRegistry` — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:136
- confirmed `@Framework/documents/%s.html.twig` — HtmlRenderer template pattern keyed by document type — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:30
- confirmed `@Framework/documents/zugferd/%s.xml.twig` — ZugferdXmlRenderer template pattern — vendor/shopware/core/Checkout/DocumentV2/Renderer/ZugferdXmlRenderer.php:29
- confirmed `DocumentNumberGenerator::NUMBER_RANGE_DOCUMENT_TYPE_PREFIX` — `document_` prefixed to the document type for the number range — vendor/shopware/core/Checkout/DocumentV2/Config/DocumentNumberGenerator.php:21
