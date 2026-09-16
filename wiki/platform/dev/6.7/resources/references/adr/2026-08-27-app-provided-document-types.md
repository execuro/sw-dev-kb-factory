---
id: platform/dev/6.7/resources/references/adr/2026-08-27-app-provided-document-types.md
title: App provided document types and the `app_provided` sentinel
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-27-app-provided-document-types.html
sourceHash: 63585c727b9c61f20785e0b806899f7df011308c
codeCheckedAgainst: "6.7.13.0"
keywords: ["app_provided", "document_type", "document_type_id", "document.config.documentType", "DocumentType", "DocumentV2", "documents manifest", "app document types", "sentinel row", "document number range", "adr"]
summary: "ADR: app document types point document_type_id at a shared app_provided sentinel row until 6.9; real type stored in document.config.documentType."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record: DocumentV2 registers document types as code strings, and apps can register their own through the manifest `<documents>` block. Because `document.document_type_id` stays `NOT NULL` until 6.9, every app document points at one shared, reserved `document_type` row named `app_provided`.

## When to use

You build an app that registers document types, or you read `document` rows created by apps and need the real type identifier.

## Key steps / config

- A migration seeds a single shared sentinel `document_type` row.
- Every app document sets `document_type_id` to that row.
- The real app identifier is stored in `document.config.documentType`; v2 always reads the identifier from the config.
- App document numbers use a global number range seeded per identifier, created once and never removed.
- Identifiers must be unique across core and all apps at persist time.

Rejected alternatives: making `document_type_id` nullable now (belongs to 6.9, breaks v1 surfaces reading the column); one `document_type` row per app identifier (rebuilds the table being removed).

## Essential identifiers

- `document.document_type_id` (NOT NULL foreign key to `document_type`)
- `document.config.documentType`
- `DocumentType` enum (`Shopware\Core\Checkout\DocumentV2`)
- manifest `<documents>` block

## Gotchas

- `app_provided` is reserved: apps cannot claim it and no documents of that type are generated; it only fills the foreign key. Do not reuse the string while the legacy table exists.
- The ADR names a `DocumentType::APP_PROVIDED` case, but installed 6.7.13.0 `DocumentType` only has `INVOICE`, `DELIVERY_NOTE`, `CREDIT_NOTE`, `CANCELLATION_INVOICE`; the sentinel string and a manifest `<documents>` element were also not found.

## Version notes

- No schema change in 6.7 and 6.8.
- The sentinel, seed migration, enum case and validation guard are `@deprecated tag:v6.9.0` and are removed with the legacy `document_type` table in 6.9.

## Code check (6.7.13.0)
- absent `APP_PROVIDED` — no such enum case or constant anywhere in the installed code
- unverified `app_provided` — sentinel string not found in installed core; seed migration not present in 6.7.13.0
- unverified `<documents>` — no `documents` element found under the app manifest code in core
- confirmed `DocumentType` — DocumentV2 enum with invoice, delivery note, credit note, cancellation cases only — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:13
- confirmed `document_type_id` — `FkField` flagged `Required` on `document` — vendor/shopware/core/Checkout/Document/DocumentDefinition.php:62
- confirmed `document_type` — `DocumentTypeDefinition::ENTITY_NAME`, not yet deprecated — vendor/shopware/core/Checkout/Document/Aggregate/DocumentType/DocumentTypeDefinition.php:26
