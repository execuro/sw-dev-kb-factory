---
id: platform/dev/6.7/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.md
title: Migration strategy from document generation v1 to v2
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-05-document-generation-v1-to-v2-migration-strategy.html
sourceHash: 7f36cd3b36cda42d86a66eb425eda63e3e691145
codeCheckedAgainst: "6.7.15.1"
keywords: ["DOCUMENT_GENERATION_REWORK", "DocumentV2", "document generation v2", "ExperimentalReplacement", "shopware.document_v2.type", "shopware.document_v2.provider", "shopware.document_v2.renderer", "document.renderer", "document_file", "type_name", "zugferd_invoice", "invoice pdf", "document migration", "AbstractDocumentRenderer"]
summary: "ADR: phased v1-to-v2 document generation migration behind DOCUMENT_GENERATION_REWORK — opt-in 6.7, default 6.8, v1 removed 6.9, schema drops after."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-08-05) giving the migration strategy for the document generation rewrite. v1 and v2 coexist throughout 6.7 and 6.8, persist into the same `document` table and render the same Twig document templates. The feature flag `DOCUMENT_GENERATION_REWORK` opts into v2.

## When to use

- Planning an extension that adds document types, formats or renderers, or listens to document events.
- Deciding when a merchant should switch to v2, or how documents stay readable across flag states.

## Key steps / config

| Phase | Version | Action |
|---|---|---|
| 1 | 6.7 | Opt-in: v2 behind the flag (default off); v1 marked `#[ExperimentalReplacement]` for removal in 6.9; backfill prepared. |
| 2 | 6.8 | Opt-out: flag `default: true`; `@experimental` removed; `#[ExperimentalReplacement]` becomes `@deprecated tag:v6.9.0`. |
| 3 | 6.9 | v1 and the flag removed; backfills executed. |
| 4 | post-6.9 | Destructive schema drops. |

Principles: flag off = pure v1. Flag on = all Shopware-driven surfaces (admin UI, Flow Builder actions, mail attachments, bulk edits, download routes) use v2. v1 APIs remain a public contract in both states until 6.9. Data compatibility is one-way: v2 reads v1 data.

Compatibility:
- **Read-time fallback**: a `document` without `document_file` rows exposes virtual formats — `documentMediaFileId` maps to the format of its file extension, `documentA11yMediaFileId` to HTML.
- **Best effort**: the v2 persister fills the primary slot with the PDF (else the single generated format) and the a11y slot with HTML, so v1 can still read it.
- **No regeneration by v1** for documents that already have `document_file` rows.
- **Legacy Zugferd types** (`zugferd_invoice`, `zugferd_embedded_invoice`, four storno/credit-note variants) show under their legacy name, download-only.
- **Idempotent backfill** creates missing `document_file` rows and normalizes e.g. `zugferd_invoice` into `invoice` + `zugferd_xml`; never touches media files.

v2 admin API routes exist regardless of the flag; storefront and Store API download routes keep their URLs. Public v2 classes carry `@experimental stableVersion:v6.8.0 feature:DOCUMENT_GENERATION_REWORK`; internals carry `@internal`.

Schema in 6.7: nullable `type_name` added to `document`, `document_base_config`, `document_base_config_sales_channel`; v2 writes `type_name` plus the legacy foreign key, v1 only the foreign key.

v2 discovers extensions only via its own tags or the app manifest:

```php
$services->set(MyType::class)->tag('shopware.document_v2.type');
$services->set(MyProvider::class)->tag('shopware.document_v2.provider');
$services->set(MyRenderer::class)->tag('shopware.document_v2.renderer');
```

Bases in `Shopware\Core\Checkout\DocumentV2`: `AbstractDocumentType` (`getTechnicalName()`, `getSupportedFormats()`), `AbstractDocumentDataProvider` (`getKey()`, `supports()`, `provideRenderingData()`), `AbstractDocumentRenderer` (`getFormat()`, `getFileExtension()`, `renderToString()`).

## Essential identifiers

- `DOCUMENT_GENERATION_REWORK` (`default: false` in 6.7)
- `#[ExperimentalReplacement(version: 'v6.9.0', feature: 'DOCUMENT_GENERATION_REWORK', ...)]`
- `shopware.document_v2.type`, `shopware.document_v2.provider`, `shopware.document_v2.renderer`
- v1 tags `document.renderer`, `document_type.renderer`
- `document_file`, `type_name`, `@Framework/documents/*.html.twig`

## Gotchas

- v1 extension points are not carried over: `document.renderer` / `document_type.renderer` registrations, v1 document events and decorators of the v1 `DocumentGenerator` are never invoked by v2. Port to v2; during transition register both variants side by side.
- Twig overrides of `@Framework/documents/*.html.twig` keep working.
- v1 surfaces show at most two formats and default to PDF; a v2 document without PDF is reachable in v1 only via an explicit file-type request.
- Amendment 2026-09-11: `Shopware\Core\Checkout\Document` is not hard-deprecated in 6.7; it carries `#[ExperimentalReplacement]`. `document_type` and `document_type_translation` are deprecated with `reason:remove-entity`.
- Amendment 2026-09-29 moves reused v1 classes (`DocumentEntity`, `DocumentDefinition`, `RenderedDocument`, `ReferenceInvoiceLoader`, ...) into `DocumentV2` behind runtime aliases; in 6.7.15.1 they are still in `Shopware\Core\Checkout\Document`.

## Version notes

- 6.8: flip the flag to `default: true`, remove `@experimental`, write `UPGRADE-6.8.md`.
- 6.9: remove the flag and all gates; delete v1 code; remove class aliases and `#[ClassMoved]` attributes; run backfills; make `document_type_id` nullable; drop `document_base_config.config` and remove `DocumentBaseConfigSyncSubscriber`; destructive migrations via `updateDestructive()`.
- Merchants: test v2 in 6.7, opt out in 6.8 if an extension is not ready; 6.9 is v2-only.

## Code check (6.7.15.1)
- confirmed `DOCUMENT_GENERATION_REWORK` — feature flag, `default: false`, `major: true`, toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:39
- confirmed `ExperimentalReplacement` — attribute class for v1 replacement markers — vendor/shopware/core/Framework/Deprecation/BCChange/ExperimentalReplacement.php:22
- confirmed `ExperimentalReplacement` — used on v1 `PdfRenderer` with `version: 'v6.9.0'` — vendor/shopware/core/Checkout/Document/Service/PdfRenderer.php:22
- confirmed `shopware.document_v2.type` — v2 type tag — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:140
- confirmed `shopware.document_v2.provider` — v2 data provider tag — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:99
- confirmed `shopware.document_v2.renderer` — v2 renderer tag — vendor/shopware/core/Checkout/DependencyInjection/documentV2.php:185
- confirmed `document.renderer` — v1 renderer tag still registered — vendor/shopware/core/Checkout/DependencyInjection/document.php:127
- confirmed `AbstractDocumentType::getSupportedFormats()` — abstract v2 type member — vendor/shopware/core/Checkout/DocumentV2/Type/AbstractDocumentType.php:22
- corrected `DocumentEntity` — docs: moved into `DocumentV2` during 6.7; still `Shopware\Core\Checkout\Document\DocumentEntity` — vendor/shopware/core/Checkout/Document/DocumentEntity.php:21
- deprecated `DocumentBaseConfigSyncSubscriber` — `@deprecated tag:v6.9.0 reason:remove-subscriber` — vendor/shopware/core/Checkout/DocumentV2/Subscriber/DocumentBaseConfigSyncSubscriber.php:27
