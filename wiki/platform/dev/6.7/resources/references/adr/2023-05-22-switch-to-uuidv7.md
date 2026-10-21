---
id: platform/dev/6.7/resources/references/adr/2023-05-22-switch-to-uuidv7.md
title: Switch to UUIDv7
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-05-22-switch-to-uuidv7.html
sourceHash: 3938761d81f4ebe634b3622cbe7f6312a2779ae6
codeCheckedAgainst: "6.7.15.1"
keywords: ["Uuid", "Uuid::randomHex", "Uuid::randomBytes", "uuidv7", "uuidv4", "uuid", "primary key", "id generation", "b-tree index", "time-based uuid", "DAL", "adr"]
summary: "ADR: Shopware's Uuid class generates time-ordered UUIDv7 instead of random UUIDv4 to keep B-tree primary-key indexes compact; ids stay format-compatible."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2023, area core/DAL): Shopware switched its default id generation from random UUIDv4 to time-based UUIDv7. Only the implementation of the `Uuid` class (`Shopware\Core\Framework\Uuid\Uuid`) changed; v4 and v7 have the same length and are indistinguishable for Shopware.

## When to use

- You wonder why newly generated Shopware ids share a time-ordered prefix.
- You generate ids for bulk imports and care about database index performance.

## Key steps / config

- Generate ids as before via `Uuid::randomHex()` (32-character hex string) or `Uuid::randomBytes()` (16 binary bytes); both now produce UUIDv7.
- No migration is needed: existing UUIDv4 ids remain valid alongside new v7 ids.

## Essential identifiers

- `Shopware\Core\Framework\Uuid\Uuid`
- `Uuid::randomHex()`, `Uuid::randomBytes()`

## Gotchas

- Rationale: UUIDv4's fully random prefix makes database B-tree indexes inefficient. The UUIDv7 time-based prefix is less spread, so the index allocates fewer new pages and stays smaller. The ADR measured roughly 8 % faster bulk product inserts.
- Do not rely on id ordering or version bits for logic: Shopware treats v4 and v7 identically, and older data still contains v4 ids.

## Code check (6.7.15.1)
- confirmed `Uuid::randomHex()` — hex-encodes randomBytes() — vendor/shopware/core/Framework/Uuid/Uuid.php:26
- confirmed `Uuid::randomBytes()` — uses a UnixTimeGenerator (time-based) — vendor/shopware/core/Framework/Uuid/Uuid.php:40
- confirmed `BinaryUtils::applyVersion` — version bits set to 7 — vendor/shopware/core/Framework/Uuid/Uuid.php:47
- confirmed `Uuid::VALID_PATTERN` — accepts any variant, 32 hex chars — vendor/shopware/core/Framework/Uuid/Uuid.php:19
