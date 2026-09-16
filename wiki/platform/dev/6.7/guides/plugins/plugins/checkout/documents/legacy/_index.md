---
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/_index.md
title: Legacy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/legacy/
sourceHash: f97720b346b0976c037028098864242189cf5179
codeCheckedAgainst: "6.7.13.0"
keywords: ["legacy document system", "documents legacy", "deprecated", "document system v2", "DOCUMENT_GENERATION_REWORK", "AbstractDocumentRenderer", "document.renderer", "document renderer", "shopware 6.9 removal", "document generation"]
summary: Section index for the legacy document system guides; deprecated, removed in Shopware 6.9, succeeded by the experimental Document System (v2) from 6.7.
lastBuilt: 2026-09-15
---
## What it is

Section index for the guides documenting the legacy document system (e.g. adding a custom document type with its own renderer). The page consists of a deprecation warning: the legacy document system is deprecated and will be removed with Shopware 6.9. Its successor, the Document System (v2), is available as an experimental feature since Shopware 6.7 and has its own concept page and guides.

## When to use

When maintaining a plugin that already builds on the legacy document system, or when targeting Shopware 6.7/6.8 installations where the v2 system is not enabled. New development should use the Document System (v2) guides instead.

## Essential identifiers

- `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer` with the DI tag `document.renderer` — the legacy renderer contract used by the guides in this section.
- `DOCUMENT_GENERATION_REWORK` — the 6.7.13.0 feature flag enabling the new document generation implementation.

## Gotchas

- In 6.7.13.0 the v2 flag defaults to `false` and is described as experimental, so the legacy system is what runs by default.
- `AbstractDocumentRenderer` itself has no `@deprecated` annotation in 6.7.13.0; the deprecation is stated in the documentation.

## Version notes

- Shopware 6.7: Document System (v2) introduced as experimental.
- Shopware 6.9: legacy document system removed.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — major, toggleable, default false, experimental — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `AbstractDocumentRenderer` — legacy renderer base, abstract, not annotated deprecated — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:19
- confirmed `document.renderer` — autoconfigured for AbstractDocumentRenderer subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:126
- confirmed `document.renderer` — tagged iterator consumed in core document services — vendor/shopware/core/Checkout/DependencyInjection/document.xml:116
