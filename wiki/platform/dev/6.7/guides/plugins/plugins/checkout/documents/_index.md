---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/_index.md
sourceHash: 52421b0b81580b3995118a5633f900890592d292
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/
title: Documents
version: "6.7"
versions:
  - "6.7"
keywords: ["documents", "document system v2", "legacy document system", "DocumentV2", "DOCUMENT_GENERATION_REWORK", "AbstractDocumentRenderer", "invoice", "delivery note", "pdf documents", "document generation"]
summary: Entry page for plugin document guides; points to the reworked Document System (v2) for new work and the legacy system removed in Shopware 6.9.
lastBuilt: 2026-10-21
---
## What it is

Landing page for the plugin guides on order documents (invoices, delivery notes, credit notes, custom document types). Shopware is moving from the legacy document system to the reworked Document System (v2); the section is split into one set of guides per system.

## When to use

When starting any plugin work on documents and deciding which guide set applies:

- **Document System (v2)** — the reworked system; use it for new development.
- **Legacy document system** — deprecated, removed in Shopware 6.9.

## Key steps / config

In the installed code, the two systems live side by side:

- Legacy: namespace `Shopware\Core\Checkout\Document` (renderers extend `Shopware\Core\Checkout\Document\Renderer\AbstractDocumentRenderer`, tagged `document.renderer`).
- v2: namespace `Shopware\Core\Checkout\DocumentV2` (e.g. `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer`), gated by the feature flag `DOCUMENT_GENERATION_REWORK`, which defaults to `false` and is described as experimental.

## Gotchas

- v2 is experimental in 6.7: its classes carry `@experimental stableVersion:v6.8.0 feature:DOCUMENT_GENERATION_REWORK`, so APIs may still change; the flag must be enabled to use it.

## Version notes

- 6.7: v2 available behind `DOCUMENT_GENERATION_REWORK`; legacy classes are annotated as replaced by v2 in v6.9.0.
- 6.9: legacy document system removed.

## Code check (6.7.15.1)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false, read by document code — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `DOCUMENT_GENERATION_REWORK` — read via Feature::ifNotActive in DocumentDefinition — vendor/shopware/core/Checkout/Document/DocumentDefinition.php:69
- confirmed `Shopware\Core\Checkout\DocumentV2\Renderer\AbstractDocumentRenderer` — v2 renderer base, @experimental stableVersion:v6.8.0 — vendor/shopware/core/Checkout/DocumentV2/Renderer/AbstractDocumentRenderer.php:23
- confirmed `ExperimentalReplacement` — legacy AbstractDocumentRenderer marked replaced in v6.9.0 — vendor/shopware/core/Checkout/Document/Renderer/AbstractDocumentRenderer.php:21
