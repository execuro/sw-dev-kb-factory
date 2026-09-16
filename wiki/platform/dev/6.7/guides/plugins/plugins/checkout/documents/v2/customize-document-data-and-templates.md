---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.md
sourceHash: 356f884ca85aa1a990a709b8a5e5488e67fb71e9
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.html
title: Customize Document Data and Templates
version: "6.7"
versions:
  - "6.7"
keywords: ["AbstractDocumentDataProvider", "AbstractRenderData", "shopware.document_v2.provider", "provideRenderingData", "sw_extends", "@Framework/documents/invoice.html.twig", "document_footer", "TemplateContext", "invoice note", "document template override", "extra document data", "zugferd", "DOCUMENT_GENERATION_REWORK"]
summary: "Document System v2: add data to built-in documents via an extra tagged provider; override @Framework/documents templates with sw_extends."
lastBuilt: 2026-09-15
---
## What it is

How a plugin adds data to documents it did not create (e.g. the built-in invoice) with an additional data provider, and overrides the Twig templates that render them, in the experimental Document System (v2). Requires the `DOCUMENT_GENERATION_REWORK` feature flag.

## When to use

You want an extra value (e.g. an invoice note) on a built-in document, or want to change the markup of a document template for HTML, PDF and ZUGFeRD-embedded-PDF output.

## Key steps / config

1. **Render data DTO** extending `Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData` with public properties (e.g. `public string $invoiceNote`). Public fields of every type-specific DTO are flattened onto the template's `config` variable.
2. **Provider** extending `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`; any number of providers can support the same document type, each under its own key:

```php
readonly class InvoiceNoteDataProvider extends AbstractDocumentDataProvider
{
    public function getKey(): string { return 'invoiceNote'; }
    public function supports(string $documentType): bool { return $documentType === 'invoice'; }
    public function provideRenderingData(OrderEntity $order, DocumentGenerationRequest $generationRequest, Context $context): AbstractRenderData
    {
        return new InvoiceNoteRenderData(
            invoiceNote: sprintf('Please quote order %s in all correspondence.', $order->getOrderNumber()),
        );
    }
}
```

3. **Register** in `PLUGIN_ROOT/src/Resources/config/services.php` with tag `shopware.document_v2.provider`.
4. **Override the template** at `PLUGIN_ROOT/src/Resources/views/documents/invoice.html.twig`:

```twig
{% sw_extends '@Framework/documents/invoice.html.twig' %}
{% block document_footer %}
    {{ parent() }}
    <p>{{ config.invoiceNote }}</p>
{% endblock %}
```

`invoice.html.twig` extends `base.html.twig`, which pulls in the `includes/` partials (e.g. `includes/footer.html.twig` with `document_footer`) via `use`, so their blocks are overridable. ZUGFeRD XML templates under `@Framework/documents/zugferd/` are overridden the same way.

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider` (`getKey()`, `supports()`, `provideRenderingData()`)
- `Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData`
- `Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerationRequest`
- Tag `shopware.document_v2.provider`
- `@Framework/documents/invoice.html.twig`, `@Framework/documents/base.html.twig`, `@Framework/documents/zugferd/`
- Block `document_footer`

## Gotchas

- The source's `provideRenderingData(ProviderInput $input, Context $context)` with `$input->order` does not match 6.7.13: `ProviderInput` does not exist; the order is passed directly as the first argument.
- A key already used by another provider for the same type throws `duplicateProviderKey`. Built-in keys: `meta` (all types) and `invoice`.
- A DTO property whose name equals a shared `config` property (company fields such as `companyName`, `pageSize`, `documentNumber`, display flags) or another DTO's property throws `templateContextPropertyCollision`.
- HTML templates feed HTML, PDF and ZUGFeRD-embedded-PDF alike. Templates are shared with the legacy document system during the transition, so overrides apply to both.

## Version notes

- Experimental in 6.7 (all v2 classes `@internal`); default with 6.8.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\DocumentV2\Struct\ProviderInput` — provider receives OrderEntity and DocumentGenerationRequest instead
- corrected `AbstractDocumentDataProvider::provideRenderingData()` — docs: (ProviderInput $input, Context $context) — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:45
- confirmed `AbstractDocumentDataProvider::getKey()` — abstract — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:28
- confirmed `AbstractDocumentDataProvider::supports()` — abstract — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:33
- confirmed `DocumentV2Exception::duplicateProviderKey()` — thrown for repeated key per type — vendor/shopware/core/Checkout/DocumentV2/Provider/DocumentDataProviderRegistry.php:47
- confirmed `DocumentV2Exception::templateContextPropertyCollision()` — DTO field collides with shared or other DTO field — vendor/shopware/core/Checkout/DocumentV2/Template/TemplateContext.php:59
- confirmed `InvoiceDataProvider::KEY` — built-in key invoice — vendor/shopware/core/Checkout/DocumentV2/Provider/InvoiceDataProvider.php:34
- confirmed `shopware.document_v2.provider` — provider tag — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:78
- confirmed `document_footer` — block in footer partial used by base template — vendor/shopware/core/Framework/Resources/views/documents/includes/footer.html.twig:15
- confirmed `sw_extends` — invoice.html.twig extends base.html.twig — vendor/shopware/core/Framework/Resources/views/documents/invoice.html.twig:10
