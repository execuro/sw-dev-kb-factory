---
id: platform/dev/6.7/resources/references/adr/2026-03-19-new-document-generation-extension-points.md
title: New document generation extension points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-03-19-new-document-generation-extension-points.html
sourceHash: 302b8ee3672df07f12294569804cbcda8e719472
codeCheckedAgainst: "6.7.13.0"
keywords: ["document generation", "DocumentV2", "extension points", "AbstractDocumentDataProvider", "AbstractDocumentRenderer", "shopware.document_v2.provider", "shopware.document_v2.renderer", "HtmlRenderer", "PdfRenderer", "ZugferdXmlRenderer", "document twig templates", "custom document type", "app script", "adr"]
summary: "ADR: how plugins (tagged data providers, renderers, Twig) and apps (Twig, custom fields, app scripts, document gateway webhook) extend DocumentV2 generation."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-03-19) agreeing how plugins and apps should extend the new (DocumentV2) document generation. It is explicitly not the final documentation; the final extension points are to be documented in the dev docs.

## When to use

- Planning a plugin or app that changes document content, adds a document format, or adds a document type under the new implementation.

## Key steps / config

Plugins — tagged Symfony services plus Twig template extension:

Adjust HTML / PDF / XML content:
1. Optional: a data provider extending `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`, tagged `shopware.document_v2.provider`, to add order associations and extra data.
2. Extend/override blocks in the document Twig templates; they receive all data, including your provider's.

Add a document format:
1. Optional data provider (as above).
2. A renderer extending `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`, tagged `shopware.document_v2.renderer`; it can reuse other formats' output by declaring dependencies (`getDependencies()`), read from `RenderState`.

Add a document type:
1. Required data provider tagged `shopware.document_v2.provider` whose `supports()` accepts the new type.
2. Templates: the ADR intends Twig templates (HTML, optionally XML) to be enough to reuse `HtmlRenderer`, `ZugferdXmlRenderer` and `PdfRenderer`. In 6.7.13.0 those renderers support only `invoice`, so a new type also needs its own renderer(s) tagged `shopware.document_v2.renderer` that list the type in `getDocumentTypes()`.

Apps — only Twig template extension, plus:
- custom fields on the order (loaded by default) for extra data;
- an app script that enriches the order with associations, queries repositories, and returns an associative array passed to renderers and templates;
- new type + format: declare them in the app manifest, subscribe to a document gateway webhook (name TBA), generate all formats yourself, upload them as static documents within strict time limits, and return the `document` ID in the response.

Twig templates receive the `RenderInput` (document type, document number, order with loaded associations, provider data) and the usual Shopware Twig extensions such as `config` and `theme_config`. Built-in template paths: `@Framework/documents/%s.html.twig`, `@Framework/documents/zugferd/%s.xml.twig`.

## Essential identifiers

- `Shopware\Core\Checkout\DocumentV2\Provider\AbstractDocumentDataProvider`
- `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`
- `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `HtmlRenderer`, `PdfRenderer`, `ZugferdXmlRenderer`, `RenderInput`, `RenderState`

## Gotchas

- The ADR spells the tags `shopware.documentV2.provider` / `shopware.documentV2.renderer`; the installed services use the snake-case `document_v2` tags.
- Built-in `HtmlRenderer`, `PdfRenderer` and `ZugferdXmlRenderer` are `final` and return only `invoice` from `getDocumentTypes()`.
- There is no provider method listing types for the administration in the installed code; providers only declare `supports()`.
- App manifest elements for document types/formats and the document gateway webhook are not present in 6.7.13.0 (`manifest-3.0.xsd`).
- DocumentV2 classes are `@internal`.

## Version notes

The new implementation is opt-in in 6.7 (feature flag `DOCUMENT_GENERATION_REWORK`) and planned to replace the old one in 6.8.

## Code check (6.7.13.0)
- corrected `shopware.document_v2.provider` — docs: `shopware.documentV2.provider` — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:66
- corrected `shopware.document_v2.renderer` — docs: `shopware.documentV2.renderer` — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:99
- confirmed `AbstractDocumentDataProvider` — abstract readonly base, `@internal` — vendor/shopware/core/Checkout/DocumentV2/Provider/AbstractDocumentDataProvider.php:23
- confirmed `AbstractDocumentRenderer::getDependencies()` — optional format dependencies — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:57
- corrected `HtmlRenderer::getDocumentTypes()` — docs: reusable for new types via templates; code returns only invoice — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:43
- confirmed `HtmlRenderer::TEMPLATE_PATTERN` — `@Framework/documents/%s.html.twig` — vendor/shopware/core/Checkout/DocumentV2/Renderer/HtmlRenderer.php:31
- corrected `ZugferdXmlRenderer` — docs: reusable for new types; final class supporting only invoice — vendor/shopware/core/Checkout/DocumentV2/Renderer/ZugferdXmlRenderer.php:27
- corrected `PdfRenderer` — docs: reusable for new types; final class supporting only invoice — vendor/shopware/core/Checkout/DocumentV2/Renderer/PdfRenderer.php:25
- confirmed `DOCUMENT_GENERATION_REWORK` — opt-in feature flag, default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- unverified `document gateway webhook` — named TBA in the ADR; no matching manifest element found
