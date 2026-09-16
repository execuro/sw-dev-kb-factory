---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/_index.md
sourceHash: d850cc3a24f4f9ca16043a1a3b27b361897611a2
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/v2/
title: v2
version: "6.7"
versions:
  - "6.7"
keywords: ["DOCUMENT_GENERATION_REWORK", "document system v2", "DocumentV2", "shopware.document_v2.provider", "shopware.document_v2.renderer", "AbstractDocumentDataProvider", "AbstractDocumentRenderer", "document generation", "invoice pdf", "document templates", "feature flag", "document type"]
summary: Index of Document System v2 plugin guides (document types, format renderers, data and template customization), experimental in 6.7.
lastBuilt: 2026-09-15
---
## What it is

Entry page for the guides on extending the reworked Document System (v2) as a plugin developer. It links three topics: adding a document type, adding a format renderer, and customizing document data and templates.

## When to use

You are building a plugin against the new document generation in 6.7 and need to pick the right guide: a new kind of document, a new output file format (or replacing a built-in one), or extra data/template changes on existing documents such as the invoice.

## Key steps / config

Prerequisites: a running plugin and the `DOCUMENT_GENERATION_REWORK` feature flag enabled for testing.

- **Add a document type** — create a new kind of document: data provider, Twig template, the `document_type` row and the number range that numbers it.
- **Add a format renderer** — output a new file format.
- **Customize document data and templates** — add data to documents you did not create and override the Twig templates that render them.

Extension points in the installed code (`Shopware\Core\Checkout\DocumentV2`):

- Data providers extend `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider` and are tagged `shopware.document_v2.provider`.
- Format renderers extend `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer` and are tagged `shopware.document_v2.renderer`.
- Built-in formats (`DocumentFormat`): `html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK`
- `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`
- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`

## Gotchas

- The API is experimental and can change until v2 becomes the default. All v2 classes in 6.7.13 are marked `@internal`.
- The feature flag defaults to `false` (`major: true`, `toggleable: true`).

## Version notes

- Experimental in 6.7; becomes the default with Shopware 6.8. The legacy document system is removed with 6.9.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false, described as experimental — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `shopware.document_v2.provider` — tagged iterator for DocumentDataProviderRegistry — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:78
- confirmed `shopware.document_v2.renderer` — tagged iterator for DocumentRendererRegistry — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:127
- confirmed `AbstractDocumentDataProvider` — abstract provider base, @internal — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:23
- confirmed `AbstractDocumentRenderer` — abstract renderer base, @internal — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:24
- confirmed `DocumentFormat` — enum html/pdf/zugferd_xml/zugferd_embedded_pdf — vendor/shopware/core/Checkout/DocumentV2/DocumentFormat.php:13
