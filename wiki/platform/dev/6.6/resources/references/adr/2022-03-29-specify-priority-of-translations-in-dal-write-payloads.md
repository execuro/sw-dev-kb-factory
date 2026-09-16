---
id: platform/dev/6.6/resources/references/adr/2022-03-29-specify-priority-of-translations-in-dal-write-payloads.md
title: Specify priority of translations in DAL write payloads
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-29-specify-priority-of-translations-in-dal-write-payloads.html"
sourceHash: "180c25cbc09cf495cc1f1bcc6bc5bc439f05114c"
keywords: ["DAL translations", "translations association", "iso-code", "language-id", "translation priority", "write payload", "translated field", "DAL write", "multi-language write"]
summary: "ADR: DAL translation overwrite priority is formalized: iso-code indexing beats language-id indexing, and the translations association beats the plain field."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record formally specifying the precedence rules when the same translated value is supplied in multiple ways in a DAL write payload.

## When to use
When writing entity payloads that set translated fields both directly and via the `translations` association, or via both `iso-code` and `language-id` indexing, and needing predictable overwrite behavior.

## Key steps / config
The DAL allows writing translated values directly on the field (as a plain string in the context language, or as an array indexed by language id or iso-code) or via the `translations` association as an indexed array. Formalized priority rules:
1. Translations indexed by `iso-code` take precedence over values indexed by `language-id`.
2. Translations specified on the `translations` association take precedence over values specified directly on the translated field.

Rule 1 outranks rule 2: an `iso-code`-indexed value directly on the field overwrites a `language-id`-indexed value in the `translations` association.

## Essential identifiers
- `translations` association (DAL)
- `iso-code` indexing
- `language-id` indexing

## Gotchas
The previous overwrite priority was accidental/unspecified and caused unexpected behaviour in some cases; developers using iso-codes for multi-language writes is the recommended, cross-system-compatible approach since ids differ per system.
