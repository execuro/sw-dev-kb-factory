---
id: platform/dev/6.7/concepts/commerce/checkout-concept/document/_index.md
title: Document (v2)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/document/
sourceHash: 14be60fd78bafbd4adebc55c72ddb1ebd1a30866
codeCheckedAgainst: "6.7.15.1"
relatedPages: ["platform/dev/6.7/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.md", "platform/dev/6.7/resources/references/adr/2026-03-17-refactor-of-document-generation.md", "platform/dev/6.7/resources/references/adr/2026-03-18-new-document-generation-architecture.md", "platform/dev/6.7/resources/references/adr/2026-03-19-new-document-generation-extension-points.md"]
keywords: ["document system v2", "DOCUMENT_GENERATION_REWORK", "DocumentGenerator", "invoice", "delivery note", "credit note", "cancellation invoice", "storno", "zugferd", "pdf", "document generation", "renderer", "data provider"]
summary: "Document System (v2): experimental DOCUMENT_GENERATION_REWORK flag, document types and formats (HTML, PDF, ZUGFeRD), 6.7-6.9 rollout."
lastBuilt: 2026-10-21
---
## What it is

The Document System (v2) is the reworked generation of order-related business documents: invoices, delivery notes, credit notes and cancellation invoices. Each document can be generated in one or more file formats — HTML, PDF, ZUGFeRD XML, or ZUGFeRD-embedded PDF — and Shopware stores the generated files per order.

## When to use

When generating or extending order documents on a 6.7 shop that has opted into the new system, or when planning the move away from the legacy document system before it is removed.

## Key steps / config

1. Enable the experimental feature flag `DOCUMENT_GENERATION_REWORK` (core `feature.yaml`: `default: false`, `major: true`, `toggleable: true`).
2. Generation is split into three independent axes that all feed `DocumentGenerator` (`Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerator`):
   - **Document type** — defines *what* is generated (`invoice`, `delivery_note`, `credit_note`, `storno`).
   - **Data provider** — defines *which data* goes in.
   - **Renderer** — defines *which file format* comes out (`html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`).
3. The result is one stored document with one file per requested format.

Why the rewrite: the legacy system coupled document type and file format, so every type/format combination needed its own renderer. Adding a format meant touching every type, and adding a type meant touching every format.

ADRs:
- [Refactor of document generation](platform/dev/6.7/resources/references/adr/2026-03-17-refactor-of-document-generation.md) — why the legacy system needed a rewrite and the goals of the new one.
- [New document generation architecture](platform/dev/6.7/resources/references/adr/2026-03-18-new-document-generation-architecture.md) — entity model and generation flow.
- [New document generation extension points](platform/dev/6.7/resources/references/adr/2026-03-19-new-document-generation-extension-points.md) — how plugins and apps add document types, data providers and renderers.
- [Document generation v1 to v2 migration strategy](platform/dev/6.7/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.md) — how both systems coexist until the legacy one is removed.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK`
- `Shopware\Core\Checkout\DocumentV2\Generation\DocumentGenerator`
- `Shopware\Core\Checkout\DocumentV2\DocumentType` (`invoice`, `delivery_note`, `credit_note`, `storno`)
- `Shopware\Core\Checkout\DocumentV2\DocumentFormat` (`html`, `pdf`, `zugferd_xml`, `zugferd_embedded_pdf`)

## Gotchas

- Experimental: the API can change until v2 becomes the default in 6.8. The installed classes carry `@experimental stableVersion:v6.8.0 feature:DOCUMENT_GENERATION_REWORK`.
- v2 lives in the `Shopware\Core\Checkout\DocumentV2` namespace; the legacy system in `Shopware\Core\Checkout\Document` has same-named classes (e.g. `DocumentGenerator`), so import the correct one.
- In code, `storno` is the `DocumentType::CANCELLATION_INVOICE` case.

## Version notes

- 6.7: opt-in via `DOCUMENT_GENERATION_REWORK`; legacy stays the default.
- 6.8: flag on by default, API stabilizes, legacy still available.
- 6.9: legacy removed; v2 is the only system.

## Code check (6.7.15.1)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, default false, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `DocumentGenerator` — v2 generator class, experimental until v6.8.0 — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentGenerator.php:35
- confirmed `DocumentType::DELIVERY_NOTE` — types invoice, delivery_note, credit_note, storno — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:16
- confirmed `DocumentFormat::ZUGFERD_EMBEDDED_PDF` — formats html, pdf, zugferd_xml, zugferd_embedded_pdf — vendor/shopware/core/Checkout/DocumentV2/DocumentFormat.php:18
