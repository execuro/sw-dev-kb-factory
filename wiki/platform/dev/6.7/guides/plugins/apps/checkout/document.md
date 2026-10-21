---
id: platform/dev/6.7/guides/plugins/apps/checkout/document.md
title: Document (v2)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/document.html
sourceHash: 82b3bdc05605ae94eb953cf8e42f953c52da0ba0
codeCheckedAgainst: "6.7.15.1"
keywords: ["DOCUMENT_GENERATION_REWORK", "document-type", "document-generation", "DocumentGenerationHook", "app documents", "document system v2", "zugferd_xml", "zugferd_embedded_pdf", "number range", "document_<identifier>", "app script", "twig document template", "invoice", "manifest documents"]
summary: Apps register Document System v2 types in the manifest documents block, ship Twig templates and supply data via the document-generation script hook.
lastBuilt: 2026-10-21
---
## What it is

How apps extend the experimental Document System (v2): the manifest declares a document type, Twig templates render it, and an app script hook supplies data. Requires the `DOCUMENT_GENERATION_REWORK` feature flag (default `false`); the API may change until it becomes default in Shopware 6.8.

## When to use

When an app needs its own document type (e.g. a warranty certificate) or wants to add data to built-in documents generated under the v2 system.

## Key steps / config

1. Enable `DOCUMENT_GENERATION_REWORK` and declare the type in the manifest (`manifest-3.0.xsd`). `identifier` (pattern `[a-z0-9_]+`), `label` and `formats` are required; `config` is optional and falls back to defaults:

```xml
<documents>
    <document-type>
        <identifier>swag_warranty</identifier>
        <label>Warranty</label>
        <label lang="de-DE">Garantie</label>
        <formats><format>html</format><format>pdf</format></formats>
        <config>
            <page-size>a4</page-size>
            <page-orientation>portrait</page-orientation>
            <items-per-page>10</items-per-page>
            <display-header>true</display-header>
            <display-footer>true</display-footer>
        </config>
    </document-type>
</documents>
```

   Allowed `format` values: `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`. The schema's `config` also accepts keys such as `display-page-count`, `display-prices`, `filename-prefix`, `filename-suffix`.
2. On install the type is stored and a global number range `document_<identifier>` is seeded (pattern `{n}`, start `1000`). On update, changed declarations are synchronized; removed ones are deleted.
3. Add templates in the plugin locations:
   - `Resources/views/documents/<identifier>.html.twig` — renders `html`, `pdf`, `zugferd_embedded_pdf`; typically `{% sw_extends '@Framework/documents/base.html.twig' %}` overriding blocks like `document_headline`.
   - `Resources/views/documents/zugferd/<identifier>.xml.twig` — needed for `zugferd_xml` / `zugferd_embedded_pdf`.
4. Add a script under `Resources/scripts/document-generation/`. The `document-generation` hook runs once per generation, after the order is loaded and the document number allocated, before any renderer runs. In 6.7.15.1 it exposes `orderId`, `orderVersionId`, `salesChannelId`, `documentType`, `documentNumber`, `formats` and the context, plus the `repository` and `config` facades.

Templates get the loaded `order` and shared document meta data (e.g. `meta.documentNumber`); app types have no typed render data.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK`
- `<documents>` / `<document-type>` / `identifier` / `label` / `formats` / `config`
- `document-generation` script hook (`DocumentGenerationHook`)
- `document_<identifier>` number range
- `@Framework/documents/base.html.twig`

## Gotchas

- The identifier is globally unique: install fails if another app already claimed it, if it equals a core document type, or if it is the reserved `app_provided`.
- The docs' script reads `hook.order` and calls `order.addArrayExtension('swag_warranty_data', {...})`, the template then reading `order.extensions.swag_warranty_data`. The installed `DocumentGenerationHook` has no order getter (only ids), so this hand-off could not be confirmed against 6.7.15.1.
- To enrich built-in documents, check `hook.documentType` in the script and override the built-in Twig template.
- Limits: no custom formats or renderers; no typed data providers (replaces the plugin-side `AbstractDocumentDataProvider`); the manifest `config` block is the only configuration surface; uninstalling deletes the app's document types but never their number ranges.

## Version notes

- `DocumentGenerationHook` is `@since 6.7.14.0` and `@experimental stableVersion:v6.8.0`.

## Code check (6.7.15.1)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `document-type` — manifest `documents` child — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:636
- confirmed `identifier` — restricted to `[a-z0-9_]+` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:641
- confirmed `zugferd_embedded_pdf` — one of four allowed formats with html, pdf, zugferd_xml — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:661
- confirmed `display-footer` — optional config key; schema allows more keys — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:673
- confirmed `DocumentGenerationHook::HOOK_NAME` — `document-generation` — vendor/shopware/core/Checkout/DocumentV2/Event/Hooks/DocumentGenerationHook.php:25
- corrected `DocumentGenerationHook::getOrderId()` — docs: hook exposes `order`; code exposes only order/version/sales-channel ids — vendor/shopware/core/Checkout/DocumentV2/Event/Hooks/DocumentGenerationHook.php:49
- confirmed `DocumentNumberGenerator::NUMBER_RANGE_DOCUMENT_TYPE_PREFIX` — `document_` prefix — vendor/shopware/core/Checkout/DocumentV2/Config/DocumentNumberGenerator.php:21
- confirmed `DocumentV2Exception::documentTypeAlreadyRegistered()` — identifier claimed by another app fails install — vendor/shopware/core/Checkout/DocumentV2/App/DocumentAppFeatureDefinition.php:155
- confirmed `DocumentV2Exception::documentTypeShadowsCoreType()` — core type names are also rejected — vendor/shopware/core/Checkout/DocumentV2/App/DocumentAppFeatureDefinition.php:151
