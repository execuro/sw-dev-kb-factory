---
id: platform/dev/6.7/guides/plugins/apps/checkout/document.md
title: Document (v2)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/document.html
sourceHash: 82b3bdc05605ae94eb953cf8e42f953c52da0ba0
codeCheckedAgainst: "6.7.13.0"
keywords: ["document system v2", "DOCUMENT_GENERATION_REWORK", "document-type", "document-generation", "zugferd_xml", "zugferd_embedded_pdf", "addArrayExtension", "document_headline", "app document type", "invoice pdf", "document number range", "manifest documents", "app script"]
summary: "Apps and Document System v2 (experimental, DOCUMENT_GENERATION_REWORK): manifest document types, Twig templates, document-generation script data."
lastBuilt: 2026-09-15
---
## What it is

Describes how apps extend the reworked Document System (v2): the manifest registers a document type, Twig templates shipped with the app render it, and an app script provides data. The v2 system is experimental behind the `DOCUMENT_GENERATION_REWORK` feature flag and may change until it becomes the default in Shopware 6.8.

## When to use

When an app needs its own document type (e.g. a warranty certificate) or wants to add data to built-in documents under Document System v2. Check the Gotchas first: the app-side parts are not present in the installed core 6.7.13.0.

## Key steps / config

1. Enable the `DOCUMENT_GENERATION_REWORK` feature flag (default `false`).
2. Declare the type in the manifest; `identifier`, `label`, `formats` are required, `config` is optional:

```xml
<documents>
    <document-type>
        <identifier>swag_warranty</identifier>
        <label>Warranty</label>
        <formats><format>html</format><format>pdf</format></formats>
        <config>
            <page-size/><page-orientation/><items-per-page/>
            <display-header/><display-footer/>
        </config>
    </document-type>
</documents>
```

   Allowed formats are the built-in ones only: `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`. Installing seeds a number range of type `document_<identifier>`; updates sync declarations, removed ones are deleted. The identifier must be globally unique across apps.
3. Templates: `Resources/views/documents/<identifier>.html.twig` (renders `html`, `pdf`, `zugferd_embedded_pdf`), typically `{% sw_extends '@Framework/documents/base.html.twig' %}` overriding blocks like `document_headline`; for ZUGFeRD formats also `Resources/views/documents/zugferd/<identifier>.xml.twig`. Templates get `order`, the shared document meta data (e.g. `meta.documentNumber`) and order extensions; there is no typed render data.
4. Data: a script in `Resources/scripts/document-generation/` runs once per generation (after order load and number allocation, before rendering) with `hook.order`, `hook.documentType`, `hook.documentNumber`, `formats`, `context` plus `repository` and `config` facades:

```twig
{% do hook.order.addArrayExtension('swag_warranty_data', { 'warrantyEnd': ... }) %}
```

   Read it in the template via `order.extensions.swag_warranty_data.get('warrantyEnd')`.
5. Built-in documents: same script (check `hook.documentType`) plus a normal Twig override of the built-in template.

## Essential identifiers

- Feature flag `DOCUMENT_GENERATION_REWORK`
- Formats `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`
- Number range type prefix `document_`
- `@Framework/documents/base.html.twig`, block `document_headline`
- `addArrayExtension()`

## Gotchas

- In installed core 6.7.13.0 no manifest `<documents>`/`<document-type>` schema element and no `document-generation` script hook were found; `Shopware\Core\Checkout\DocumentV2\DocumentType` is an `@internal` enum of only `invoice`, `delivery_note`, `credit_note`, `cancellation_invoice`. Treat the app registration and script steps as not yet available on this version.
- No custom formats or renderers; no typed data providers (the plugin-side `AbstractDocumentDataProvider`, itself `@internal`, is not available to apps); no configuration UI beyond the manifest `config` block.
- Uninstalling deletes the app's document types but never their number ranges, so reinstalling does not reuse document numbers.

## Version notes

- Experimental in 6.7 behind `DOCUMENT_GENERATION_REWORK`; planned default in 6.8.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — major, toggleable, default false; read by the admin settings module — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `zugferd_embedded_pdf` — DocumentFormat enum has html, pdf, zugferd_xml, zugferd_embedded_pdf — vendor/shopware/core/Checkout/DocumentV2/DocumentFormat.php:18
- confirmed `NUMBER_RANGE_DOCUMENT_TYPE_PREFIX` — value `document_` in DocumentNumberGenerator — vendor/shopware/core/Checkout/DocumentV2/Config/DocumentNumberGenerator.php:21
- confirmed `DocumentType` — internal enum with four built-in types only — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:13
- confirmed `documents` — allowed app template directory under Resources/views — vendor/shopware/core/Framework/App/Template/TemplateLoader.php:21
- confirmed `document_headline` — block exists in core document templates — vendor/shopware/core/Framework/Resources/views/documents/includes/table_open.html.twig:17
- confirmed `ExtendableTrait::addArrayExtension()` — public method taking name and array — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:32
- confirmed `AbstractDocumentDataProvider` — @internal abstract provider class — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:23
- unverified `document-type` — no manifest XSD element or app-side registration found under core Framework/App in 6.7.13.0
- unverified `document-generation` — no script hook with this name found in core, storefront or administration src
