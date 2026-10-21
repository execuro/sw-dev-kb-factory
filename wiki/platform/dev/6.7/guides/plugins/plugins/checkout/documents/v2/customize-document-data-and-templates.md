---
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.md
title: Customize Document Data and Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/customize-document-data-and-templates.html
sourceHash: 356f884ca85aa1a990a709b8a5e5488e67fb71e9
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractDocumentDataProvider", "AbstractRenderData", "ProviderInput", "shopware.document_v2.provider", "sw_extends", "invoice.html.twig", "document_footer", "DOCUMENT_GENERATION_REWORK", "extend invoice", "document template override", "zugferd template", "config variable"]
summary: "Document System v2: add data to existing documents via extra tagged providers and override @Framework/documents Twig templates with sw_extends."
lastBuilt: 2026-10-21
---
## What it is

How to add data to documents a plugin did not create (e.g. the built-in invoice) and how to override the Twig templates that render documents, in the experimental Document System v2 (`DOCUMENT_GENERATION_REWORK` feature flag).

## When to use

When an invoice, delivery note, credit note or cancellation invoice needs extra values or changed layout, without defining a new document type.

## Key steps / config

**Add data to an existing document**

Any number of providers can support the same document type. Each stores its render-data DTO under its own key; public fields on the DTO are flattened onto the template's `config` variable.

1. DTO: `readonly class InvoiceNoteRenderData extends AbstractRenderData` with `public string $invoiceNote` in the constructor (`Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData`).
2. Provider extending `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`:

```php
readonly class InvoiceNoteDataProvider extends AbstractDocumentDataProvider
{
    public function getKey(): string { return 'invoiceNote'; }
    public function supports(string $documentType): bool { return $documentType === 'invoice'; }
    public function provideRenderingData(ProviderInput $input, Context $context): AbstractRenderData
    {
        return new InvoiceNoteRenderData(invoiceNote: sprintf('Please quote order %s ...', $input->order->getOrderNumber()));
    }
}
```

3. Register it in `src/Resources/config/services.php` with the tag `shopware.document_v2.provider`.

**Override a document template**

Templates live at `@Framework/documents/` and are overridden with `sw_extends`. Overriding `invoice.html.twig` gives access to the blocks from `base.html.twig` and the `includes/` partials. Place the file at `src/Resources/views/documents/invoice.html.twig`:

```twig
{% sw_extends '@Framework/documents/invoice.html.twig' %}
{% block document_footer %}
    {{ parent() }}
    <p>{{ config.invoiceNote }}</p>
{% endblock %}
```

The same HTML templates feed every format that needs HTML, so a change reaches HTML, PDF and ZUGFeRD-embedded PDF output. ZUGFeRD XML templates under `@Framework/documents/zugferd/` are overridden the same way.

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider` (`getKey()`, `supports()`, `provideRenderingData()`)
- `Shopware\Core\Checkout\DocumentV2\Struct\AbstractRenderData`, `Shopware\Core\Checkout\DocumentV2\Struct\ProviderInput`
- Tag `shopware.document_v2.provider`
- Built-in technical names: `invoice`, `delivery_note`, `credit_note`, `storno`
- Templates `@Framework/documents/invoice.html.twig`, `@Framework/documents/base.html.twig`, `@Framework/documents/zugferd/`
- Twig blocks `document_footer`, `document_headline`

## Gotchas

- If a key is already used by another provider for the same document type, generation throws an exception. Built-in provider keys include `meta`, `invoice`, `delivery_note`, `credit_note`, `storno`.
- DTO field names must also be unique: a field that collides with a shared `config` key (e.g. `documentNumber`, `companyName`) or another provider's field throws a collision exception.
- Templates are shared with the legacy document system during the transition; overrides apply to both systems.

## Version notes

Experimental in 6.7 behind `DOCUMENT_GENERATION_REWORK`; marked `@experimental stableVersion:v6.8.0`, API may change until 6.8.

## Code check (6.7.15.1)
- confirmed `AbstractDocumentDataProvider::getKey()` — abstract, key under which the DTO is stored — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:27
- confirmed `AbstractDocumentDataProvider::supports()` — abstract, receives the document type string — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:32
- confirmed `AbstractDocumentDataProvider::provideRenderingData()` — abstract, returns `AbstractRenderData` — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:44
- confirmed `DocumentDataProviderRegistry::getByDocumentType()` — throws duplicate-provider-key for a repeated key per type — vendor/shopware/core/Checkout/DocumentV2/Provider/DocumentDataProviderRegistry.php:35
- confirmed `TemplateContext` — flattens public DTO fields into `config`, throws on key collision — vendor/shopware/core/Checkout/DocumentV2/Template/TemplateContext.php:33
- confirmed `ProviderInput::$order` — public `OrderEntity` — vendor/shopware/core/Checkout/DocumentV2/Struct/ProviderInput.php:20
- confirmed `OrderEntity::getOrderNumber()` — returns `?string` — vendor/shopware/core/Checkout/Order/OrderEntity.php:448
- confirmed `DocumentType::INVOICE` — technical name `invoice` — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:15
- confirmed `document_footer` — block defined in the footer partial — vendor/shopware/core/Framework/Resources/views/documents/includes/footer.html.twig:15
- confirmed `shopware.document_v2.provider` — tagged_iterator feeding the provider registry — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:136
