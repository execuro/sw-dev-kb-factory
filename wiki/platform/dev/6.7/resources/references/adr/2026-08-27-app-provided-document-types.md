---
id: platform/dev/6.7/resources/references/adr/2026-08-27-app-provided-document-types.md
title: App provided document types and the `app_provided` sentinel
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-27-app-provided-document-types.html
sourceHash: 63585c727b9c61f20785e0b806899f7df011308c
codeCheckedAgainst: "6.7.15.1"
keywords: ["app_provided", "DocumentType::APP_PROVIDED", "document_type", "document.document_type_id", "document.config.documentType", "Migration1786369207SeedAppProvidedDocumentType", "DocumentV2", "<documents>", "app document types", "sentinel row", "document type identifier", "manifest"]
summary: "ADR: app document types share one seeded app_provided document_type row; the real identifier is kept in document.config.documentType."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-08-27, area after-sales) explaining how documents generated for app-registered document types satisfy the `NOT NULL` foreign key `document.document_type_id` while DocumentV2 identifies types by code strings instead of database rows. The answer is one shared, reserved `document_type` row named `app_provided`.

## When to use

- You build an app that registers document types through the manifest `<documents>` block and want to know how its documents are stored.
- You read `document` rows and need to find the real type of an app-generated document.
- You choose an identifier for an app document type and need to know which names are reserved.

## Key steps / config

1. Apps register their document types in the app manifest `<documents>` block (manifest schema 3.0). App types get no `document_type` rows of their own.
2. A migration, `Migration1786369207SeedAppProvidedDocumentType`, seeds one shared sentinel row in `document_type` (with translations "App document" / "App-Dokument"). It is idempotent: it does nothing if the row already exists.
3. When an app document is persisted and no `document_type` row matches its identifier, but the document type registry supports the identifier, the persister points `document_type_id` at the sentinel row.
4. The real app identifier is stored in `document.config.documentType`. DocumentV2 code always reads the type from the config, never from the foreign key.
5. Identifier validation at app registration: an app identifier may not equal the reserved sentinel name, may not shadow a core `DocumentType` value (`invoice`, `delivery_note`, `credit_note`, `storno`), and may not be one another app already claimed.

```text
document.document_type_id    -> shared sentinel document_type row
document.config.documentType -> real app identifier
```

## Essential identifiers

- `document_type`, `document.document_type_id`, `document.config.documentType`
- `Migration1786369207SeedAppProvidedDocumentType`
- `Shopware\Core\Checkout\DocumentV2\DocumentType` (enum)
- manifest `<documents>` element

## Gotchas

- `app_provided` (`DocumentType::APP_PROVIDED`) is reserved: apps cannot claim it, and nothing generates documents of that type. It exists only to fill the foreign key. Do not reuse the string `app_provided` for anything else while the legacy table exists.
- Identifiers are unique across core and all apps at persist time.
- App document numbers use a global number range seeded per identifier, created once and never removed.
- Rejected alternatives: making `document_type_id` nullable now (a 6.9 schema change that would break v1 surfaces reading the column), and one `document_type` row per app identifier (rebuilds the per-type table being removed).

## Version notes

- No schema change during 6.7 and 6.8.
- The sentinel, the `DocumentType::APP_PROVIDED` case and the reserved-identifier validation guard are `@deprecated tag:v6.9.0` and are removed together with the legacy `document_type` table. The ADR names the seed migration as part of that removal too.

## Code check (6.7.15.1)
- deprecated `DocumentType::APP_PROVIDED` — enum case, removed with legacy `document_type` table — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:26
- deprecated `app_provided` — value of the deprecated enum case — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:26
- deprecated `DocumentV2Exception::documentTypeReservedIdentifier()` — validation guard for the reserved name — vendor/shopware/core/Checkout/DocumentV2/DocumentV2Exception.php:219
- deprecated `DocumentPersister::getDocumentTypeId()` — falls back to the sentinel row id — vendor/shopware/core/Checkout/DocumentV2/Generation/DocumentPersister.php:305
- confirmed `Migration1786369207SeedAppProvidedDocumentType` — seeds the shared row, skips if present — vendor/shopware/core/Migration/V6_7/Migration1786369207SeedAppProvidedDocumentType.php:21
- confirmed `document.config.documentType` — holds the real app identifier — vendor/shopware/core/Migration/V6_7/Migration1786369207SeedAppProvidedDocumentType.php:16
- confirmed `DocumentType` — enum with invoice, delivery_note, credit_note, storno — vendor/shopware/core/Checkout/DocumentV2/DocumentType.php:13
- confirmed `DocumentV2Exception::documentTypeShadowsCoreType()` — identifiers may not shadow core types — vendor/shopware/core/Checkout/DocumentV2/App/DocumentAppFeatureDefinition.php:151
- confirmed `documents` — manifest-3.0 `documents` element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:144
