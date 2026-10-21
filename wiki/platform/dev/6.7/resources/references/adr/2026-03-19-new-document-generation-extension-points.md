---
id: platform/dev/6.7/resources/references/adr/2026-03-19-new-document-generation-extension-points.md
title: New document generation extension points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-19-new-document-generation-extension-points.html
sourceHash: 302b8ee3672df07f12294569804cbcda8e719472
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractDocumentDataProvider", "AbstractDocumentRenderer", "shopware.document_v2.provider", "shopware.document_v2.renderer", "HtmlRenderer", "PdfRenderer", "ZugferdXmlRenderer", "document-generation", "RenderInput", "custom document type", "document template", "app manifest documents", "twig"]
summary: "ADR: how plugins (tagged data providers/renderers, Twig) and apps (Twig, custom fields, app scripts, manifest) extend DocumentV2 document generation."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-03-19, area after-sales) agreeing on how plugins and apps extend the new DocumentV2 document generation. It explicitly is not end-user documentation; the final extension points are to be documented in the dev docs. It builds on the 2026-03-18 architecture ADR (generator, data providers, renderers).

## When to use

- Adjusting the content or layout of generated HTML/PDF/XML documents from a plugin or app.
- Adding a new document format or a new document type.
- Deciding whether a plugin or an app can do a given document customization (apps are limited to Twig plus data enrichment).

## Key steps / config

### Plugin system

Plugins use tagged Symfony services, like the core types and formats, plus the Twig template extension system.

Adjust generated HTML / PDF / XML content and presentation:

1. (Optional) Register a data provider extending `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`, tagged `shopware.document_v2.provider`. It can add order associations (`enrichOrderCriteria`) and extra data for certain document types.
2. Extend the Twig templates you need; all template data, including your provider's data, is available, and blocks can be extended or overridden.

Add a new document format:

1. (Optional) A data provider as above.
2. A renderer extending `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`, tagged `shopware.document_v2.renderer`. It can reuse other renderers' output by declaring format dependencies (`getDependencies()`).

Add a new document type:

1. (Required, per ADR) A data provider, which also registers the type so it is selectable, e.g. in the Administration.
2. Twig templates for HTML and optionally XML, so the default `HtmlRenderer` and `ZugferdXmlRenderer` can be used; `PdfRenderer` then works from the HTML output with no rendering code. Installed template patterns: `@Framework/documents/%s.html.twig` and `@Framework/documents/zugferd/%s.xml.twig` (`%s` = document type).

### App system

Apps can only use the Twig template extension system (as themes do), so they are less powerful than plugins. Ways to add data:

- Custom fields on the order entity (set via the Admin SDK or app backend and webhooks); loaded by default and usable in Twig.
- An app script that adds order associations, queries repositories and returns an associative array passed to renderers and templates. Installed hook name: `document-generation`, triggered once per generation after the order is loaded and the number allocated, before any renderer runs.

Adjust content: optionally add order custom fields, optionally add the app script, then extend Twig templates/blocks.

Add a new document type + format: declare the type and format(s) in the app manifest so they are selectable. Installed manifest shape:

```xml
<documents>
    <document-type>
        <identifier>my_type</identifier>
        <label>...</label>
        <formats><format>pdf</format></formats>
        <config>...</config>
    </document-type>
</documents>
```

The ADR then has the app subscribe to a document gateway webhook (name TBA, similar to the checkout gateway): generate the type in all formats from scratch, upload the files to Shopware as static documents, return the `document` ID in the response, within strict time limits so Flow Builder and customer mails can use the result.

### Twig templates

Templates receive the `RenderInput` (document type, document number, order entity with loaded associations, extra provider data) plus the usual Shopware Twig extensions, e.g. `config` (system config) and `theme_config` (theme config).

## Essential identifiers

- `AbstractDocumentDataProvider` + tag `shopware.document_v2.provider`
- `AbstractDocumentRenderer` + tag `shopware.document_v2.renderer`
- `HtmlRenderer`, `PdfRenderer`, `ZugferdXmlRenderer`
- `RenderInput`
- App script hook `document-generation`; manifest `<documents>` / `<document-type>`

## Gotchas

- The ADR spells the tags `shopware.documentV2.provider` and `shopware.documentV2.renderer`; the installed tags are `shopware.document_v2.provider` and `shopware.document_v2.renderer`.
- In 6.7.15.1 types are registered as `AbstractDocumentType` services tagged `shopware.document_v2.type`, not by the provider alone.
- App identifiers may not shadow a core type, reuse `app_provided`, or collide with another app's type; manifest identifiers must match `[a-z0-9_]+`.
- No document gateway webhook exists in 6.7.15.1.

## Version notes

All DocumentV2 classes, including the `document-generation` hook (since 6.7.14.0), are `@experimental` behind `DOCUMENT_GENERATION_REWORK` until v6.8.0.

## Code check (6.7.15.1)
- corrected `shopware.document_v2.provider` — docs: shopware.documentV2.provider — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:99
- corrected `shopware.document_v2.renderer` — docs: shopware.documentV2.renderer — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:185
- confirmed `AbstractDocumentDataProvider::enrichOrderCriteria()` — optional association hook — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:37
- confirmed `AbstractDocumentRenderer::getDependencies()` — optional format dependencies — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:44
- confirmed `HtmlRenderer::TEMPLATE_PATTERN` — @Framework/documents/%s.html.twig — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:30
- confirmed `ZugferdXmlRenderer::TEMPLATE_PATTERN` — @Framework/documents/zugferd/%s.xml.twig — vendor/shopware/core/Checkout/DocumentV2/Renderer/ZugferdXmlRenderer.php:29
- confirmed `DocumentGenerationHook::HOOK_NAME` — app script hook document-generation — vendor/shopware/core/Checkout/DocumentV2/Event/Hooks/DocumentGenerationHook.php:25
- confirmed `documents` — manifest element registering app document types — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:144
- confirmed `AbstractDocumentType::getTechnicalName()` — document type registration — vendor/shopware/core/Checkout/DocumentV2/Type/AbstractDocumentType.php:15
- unverified `document gateway webhook` — ADR marks it TBA; no gateway class found in core
