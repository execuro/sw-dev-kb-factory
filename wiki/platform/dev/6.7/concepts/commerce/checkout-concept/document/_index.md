---
id: platform/dev/6.7/concepts/commerce/checkout-concept/document/_index.md
title: Document (v2)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/checkout-concept/document/
sourceHash: 14be60fd78bafbd4adebc55c72ddb1ebd1a30866
codeCheckedAgainst: "6.7.13.0"
keywords: ["DOCUMENT_GENERATION_REWORK", "document system v2", "document generation", "DocumentGenerator", "invoice", "delivery note", "credit note", "cancellation invoice", "ZUGFeRD", "pdf", "data provider", "document renderer", "feature flag"]
summary: Document System (v2) - experimental rework behind DOCUMENT_GENERATION_REWORK splitting document type, data provider and renderer; rollout 6.7 opt-in to 6.9.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.md", "platform/dev/6.7/resources/references/adr/2026-03-17-refactor-of-document-generation.md", "platform/dev/6.7/resources/references/adr/2026-03-18-new-document-generation-architecture.md", "platform/dev/6.7/resources/references/adr/2026-03-19-new-document-generation-extension-points.md"]
---
## What it is

Overview of the reworked Document System (v2), which generates order-related business documents (invoices, delivery notes, credit notes, cancellation invoices) in one or more file formats: HTML, PDF, ZUGFeRD XML, or ZUGFeRD-embedded PDF. Generated files are stored per order. It is experimental and enabled via the `DOCUMENT_GENERATION_REWORK` feature flag; its API may change until it becomes the default in Shopware 6.8.

## When to use

Evaluating or preparing for the new document generation, planning plugin/app document extensions, or deciding whether to enable the flag on 6.7.

## Key steps / config

Why a rewrite: the legacy system couples document type and file format, so each type/format combination needs its own renderer (adding a format touches every type and vice versa). v2 splits generation into three independent axes feeding a generator:

```
Document type  -> what is generated      \
Data provider  -> which data goes in      > generator -> stored document (one file per format)
Renderer       -> which file format out  /
```

Enable on 6.7: the flag `DOCUMENT_GENERATION_REWORK` is declared in core `feature.yaml` with `default: false`, `major: true`, `toggleable: true`; switch it on like any toggleable feature flag.

Rollout:

- 6.7 — opt-in via `DOCUMENT_GENERATION_REWORK`; legacy remains default.
- 6.8 — flag on by default, API stabilizes; legacy still available.
- 6.9 — legacy removed; v2 only.

ADRs:

- [Refactor of document generation](platform/dev/6.7/resources/references/adr/2026-03-17-refactor-of-document-generation.md) — why and goals.
- [New document generation architecture](platform/dev/6.7/resources/references/adr/2026-03-18-new-document-generation-architecture.md) — entity model and flow.
- [New document generation extension points](platform/dev/6.7/resources/references/adr/2026-03-19-new-document-generation-extension-points.md) — adding types, data providers, renderers.
- [Migration strategy v1 to v2](platform/dev/6.7/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.md) — coexistence until 6.9.

## Essential identifiers

- Feature flag `DOCUMENT_GENERATION_REWORK`
- Legacy (current default) service `Shopware\Core\Checkout\Document\Service\DocumentGenerator`; legacy renderer types `invoice`, `delivery_note`, `credit_note`, `storno`, `zugferd_invoice`, `zugferd_embedded_invoice` (one renderer per type/format combination)

## Gotchas

- In the installed 6.7.13.0 packages the flag is only read by the Administration (document settings UI) and by the `companyInformation` card in `basicInformation.xml`; no core PHP code checks it, and no v2 document-type/data-provider/renderer classes were found — the backend described here is not yet in this core version.
- Experimental: API can change before 6.8.

## Version notes

- 6.7 opt-in, 6.8 default, 6.9 legacy removed.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature.yaml entry, default false, major true, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `DOCUMENT_GENERATION_REWORK` — read by admin document settings page — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-document/page/sw-settings-document-detail/sw-settings-document-detail.html.twig:299
- confirmed `companyInformation` — system config card gated by the flag — vendor/shopware/core/System/Resources/config/basicInformation.xml:64
- confirmed `DocumentGenerator` — legacy generator service (generate/preview) — vendor/shopware/core/Checkout/Document/Service/DocumentGenerator.php:37
- confirmed `ZugferdEmbeddedRenderer::TYPE` — legacy per-format renderer `zugferd_embedded_invoice` — vendor/shopware/core/Checkout/Document/Renderer/ZugferdEmbeddedRenderer.php:13
- confirmed `InvoiceRenderer::TYPE` — legacy `invoice` renderer — vendor/shopware/core/Checkout/Document/Renderer/InvoiceRenderer.php:27
- unverified `data provider` — v2 data-provider/document-type extension classes not found in installed core; described only in ADRs
