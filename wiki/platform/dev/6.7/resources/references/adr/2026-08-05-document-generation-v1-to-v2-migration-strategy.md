---
id: platform/dev/6.7/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.md
title: Migration strategy from document generation v1 to v2
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.html
sourceHash: 4beea812e6883050b2ad16ff927df7927fc567a1
codeCheckedAgainst: "6.7.13.0"
keywords: ["DOCUMENT_GENERATION_REWORK", "DocumentV2", "document_file", "shopware.document_v2.renderer", "shopware.document_v2.provider", "document.renderer", "document_type.renderer", "DocumentBaseConfigSyncSubscriber", "zugferd_invoice", "document generation v2", "invoice pdf migration", "adr"]
summary: "ADR: v1/v2 document generation coexist in 6.7/6.8 behind DOCUMENT_GENERATION_REWORK; v2 default in 6.8, v1 removed in 6.9 with backfills."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record for migrating from document generation v1 to the rewritten v2 (`DocumentV2` namespace). Both persist into the same `document` table, render the same Twig templates, and coexist through 6.7 and 6.8; the feature flag `DOCUMENT_GENERATION_REWORK` opts into v2.

## When to use

- Your extension registers custom document types/formats, listens to v1 document events, or decorates the v1 `DocumentGenerator`.
- You decide when to enable v2 for a shop or need to know what survives switching the flag back.

## Key steps / config

Roadmap:

| Version | Action |
|---|---|
| 6.7 | Opt-in: v2 behind the flag (default off); v1 deprecated with `@deprecated tag:v6.9.0` |
| 6.8 | Opt-out: flag flips to `default: true`; `@experimental` removed |
| 6.9 | v1 and flag removed; backfills executed |
| post-6.9 | Destructive schema drops |

Principles:

- Flag off: pure v1. Flag on: admin UI, Flow Builder actions, mail attachments, bulk edits and customer download routes use v2.
- v2 admin API routes exist regardless of the flag; storefront/Store API download routes keep their URLs.
- v1 APIs stay a public contract until 6.9. Data compatibility is one-way: v2 reads v1 data.
- v2 public entry points are annotated `@experimental stableVersion:v6.8.0 feature:DOCUMENT_GENERATION_REWORK`; internals carry `@internal`.

Compatibility:

- Read-time fallback: a `document` without `document_file` rows exposes virtual formats — `documentMediaFileId` by file extension, `documentA11yMediaFileId` as HTML.
- The v2 persister fills the primary slot with the PDF (else the single format) and the a11y slot with HTML, so v2 documents stay usable in v1.
- v1 does not regenerate media for documents that already have `document_file` rows; it fails gracefully.
- Legacy Zugferd types (`zugferd_invoice`, `zugferd_embedded_invoice`, storno/credit-note variants) are download-only; the backfill turns e.g. `zugferd_invoice` into `invoice` plus a `zugferd_xml` file.

Porting an extension: provide v2 tagged services (data provider, renderer, type) or an app manifest entry. The v1 `document.renderer` / `document_type.renderer` tags, v1 events and `DocumentGenerator` decorators are never invoked by v2. v1 and v2 variants may be registered side by side. Overrides of `@Framework/documents/*.html.twig` keep working.

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK`
- `Shopware\Core\Checkout\DocumentV2`
- `document_file`
- `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- `document.renderer`, `document_type.renderer` (v1)
- `DocumentBaseConfigSyncSubscriber`

## Gotchas

- v1 surfaces show at most two formats and default to PDF: a v2 document without PDF is reachable in v1 only via an explicit file-type request.
- The ADR names a `shopware.document_v2.type` tag and nullable `type_name` columns on `document`, `document_base_config`, `document_base_config_sales_channel`; neither was found in installed 6.7.13.0.
- In 6.7.13.0 neither the v1 `DocumentGenerator` nor `DocumentTypeDefinition` carries a `@deprecated` annotation yet.

## Version notes

- 6.9: flag and v1 branches removed; `DocumentEntity`, `DocumentDefinition`, `DocumentCollection`, `ReferenceInvoiceLoader` move into `DocumentV2`; `document_base_config.config` dropped and `DocumentBaseConfigSyncSubscriber` removed; `updateDestructive()` drops `document_type` tables, `document_type_id`, `document.document_media_file_id`, `document.document_a11y_media_file_id`.
- The ADR plans `document_type` and `document_type_translation` to be deprecated with `reason:remove-entity` for 6.9.

## Code check (6.7.13.0)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, `default: false`, `major: true`, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `shopware.document_v2.provider` — tag used by `DocumentMetaProvider`/`InvoiceDataProvider` — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:66
- confirmed `shopware.document_v2.renderer` — tag on HTML/PDF/Zugferd renderers — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:99
- unverified `shopware.document_v2.type` — no registration found under core/Checkout in 6.7.13.0
- confirmed `document.renderer` — v1 renderer tag — vendor/shopware/core/Checkout/DependencyInjection/document.xml:72
- confirmed `document_type.renderer` — v1 file-type renderer tag — vendor/shopware/core/Checkout/DependencyInjection/document.xml:125
- confirmed `DocumentBaseConfigSyncSubscriber` — event subscriber in DocumentV2 — vendor/shopware/core/Checkout/DocumentV2/Subscriber/DocumentBaseConfigSyncSubscriber.php:25
- confirmed `document_file` — table created by 6.7 migration with `document_format` column — vendor/shopware/core/Migration/V6_7/Migration1776770187AddDocumentFileTable.php:40
- confirmed `document_media_file_id` — v1 media slot FK on `document` — vendor/shopware/core/Checkout/Document/DocumentDefinition.php:66
- confirmed `document_a11y_media_file_id` — v1 a11y media slot FK — vendor/shopware/core/Checkout/Document/DocumentDefinition.php:67
