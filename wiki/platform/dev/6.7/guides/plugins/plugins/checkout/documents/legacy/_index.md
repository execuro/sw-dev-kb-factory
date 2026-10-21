---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/_index.md
sourceHash: f97720b346b0976c037028098864242189cf5179
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/legacy/
title: Legacy
version: "6.7"
versions:
  - "6.7"
keywords: ["legacy document system", "documents", "deprecated", "document system v2", "DocumentV2", "DOCUMENT_GENERATION_REWORK", "ExperimentalReplacement", "AbstractDocumentRenderer", "shopware 6.9 removal", "document renderer"]
summary: Index of guides for the legacy document system, deprecated and removed in Shopware 6.9; successor is the experimental Document System (v2) since 6.7.
lastBuilt: 2026-10-21
---
## What it is

Index page of the guides for the legacy document system (custom documents, custom document types, renderers). The whole system is deprecated and will be removed with Shopware 6.9.

## When to use

Only when maintaining existing plugins built on the legacy system before 6.9. New development should target the Document System (v2), available as an experimental feature since Shopware 6.7.

## Key steps / config

- Legacy code lives under `Shopware\Core\Checkout\Document`; its main extension point is `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer`.
- The successor lives under `Shopware\Core\Checkout\DocumentV2` and is switched on with the feature flag `DOCUMENT_GENERATION_REWORK` (default `false`).

## Gotchas

- Legacy classes are not tagged `@deprecated` in 6.7.15.1; they carry the `ExperimentalReplacement` attribute (`version: 'v6.9.0'`, `feature: 'DOCUMENT_GENERATION_REWORK'`), so a static deprecation scan will not report them.

## Version notes

- 6.7: v2 introduced as experimental; legacy still the default.
- 6.9: legacy document system removed.

## Code check (6.7.15.1)
- confirmed `ExperimentalReplacement` — legacy AbstractDocumentRenderer replaced by DocumentV2 renderer — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:21
- confirmed `version: 'v6.9.0'` — replacement version on legacy renderer base — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:22
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false, experimental — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `ExperimentalReplacement` — also on DocumentConfigLoader, version v6.9.0 — vendor/shopware/core/Checkout/Document/Service/DocumentConfigLoader.php:23
- confirmed `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer` — v2 successor base class — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:23
