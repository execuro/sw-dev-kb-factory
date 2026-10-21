---
id: platform/dev/6.7/resources/references/adr/2022-03-29-specify-priority-of-translations-in-dal-write-payloads.md
title: Specify priority of translations in DAL write payloads
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-29-specify-priority-of-translations-in-dal-write-payloads.html
sourceHash: 180c25cbc09cf495cc1f1bcc6bc5bc439f05114c
codeCheckedAgainst: "6.7.15.1"
keywords: ["translations", "TranslatedField", "TranslationsAssociationField", "TranslatedFieldSerializer", "TranslationsAssociationFieldSerializer", "iso-code", "language-id", "languageId", "DAL write payload", "translation priority", "multi-language write", "data abstraction layer"]
summary: "ADR: DAL translation write precedence — iso-code keys beat language-id keys, and the translations association beats values on the translated field."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-29) that formally specifies which value wins when a DAL write payload provides the same translated value in more than one place. Before this decision the priority was accidental and unspecified, which led to unexpected behaviour in some cases.

The DAL accepts translated values in several ways:

- directly on the translated field, either as a plain string (in the language of the current context) or as an array indexed by language id or by iso-code;
- on the `translations` association, as an indexed array.

## When to use

When building write payloads (Admin API sync/upserts, repository `create`/`update`/`upsert`, imports) that set translations for multiple languages, or that mix field-level values with a `translations` block, and you need to predict which value is stored.

## Key steps / config

Precedence rules, in order of importance:

1. Translations indexed by `iso-code` take precedence over values indexed by `language-id`.
2. Translations specified on the `translations` association take precedence over values specified directly on the translated field.

Rule 1 outranks rule 2: an iso-code-indexed value on the field itself overwrites a `translations`-association value that is indexed by language id. A value on the translated field is treated as the "default"; anything further specified in the association refines it.

Payload shapes involved:

```json
{
  "name": "Default (context language)",
  "description": { "en-GB": "...", "<languageId>": "..." },
  "translations": {
    "de-DE": { "name": "..." },
    "<languageId>": { "name": "..." }
  }
}
```

The ADR recommends iso-codes when writing several languages at once: the payload is easier to read, errors are easier to spot, and it works across systems where language ids differ.

How the installed code applies this: `TranslatedFieldSerializer::normalize()` copies field-level values into `translations[<key>][<field>]` only when that slot is not already set (association wins). `TranslationsAssociationFieldSerializer::normalize()` then resolves each non-UUID, non-numeric key (an iso-code such as `en-GB`) to a language id and `array_merge`s it over the entry already present under that language id (iso-code wins).

## Essential identifiers

- `translations` association (`TranslationsAssociationField`)
- `TranslatedField`
- `Shopware\Core\Framework\DataAbstractionLayer\FieldSerializer\TranslatedFieldSerializer`
- `Shopware\Core\Framework\DataAbstractionLayer\FieldSerializer\TranslationsAssociationFieldSerializer`

## Gotchas

- A plain string on the translated field is written in the context language only; it does not fill other languages.
- An iso-code key in `translations` that cannot be resolved to a language is silently dropped from the payload, not reported as an error.
- For JSON-typed translated fields, an array value is the field's value, not a per-language map.

## Code check (6.7.15.1)
- confirmed `TranslatedFieldSerializer::normalize()` — copies field values into `translations` only if not already set — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslatedFieldSerializer.php:21
- confirmed `TranslatedFieldSerializer` — plain string goes to the context language — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslatedFieldSerializer.php:19
- confirmed `JsonField` — array on a JSON translated field is not treated as a language map — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslatedFieldSerializer.php:35
- confirmed `TranslationsAssociationFieldSerializer::normalize()` — iso-code keys resolved to language ids — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslationsAssociationFieldSerializer.php:34
- confirmed `array_merge` — iso-code entry merged over the language-id entry (iso-code wins) — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslationsAssociationFieldSerializer.php:89
- confirmed `unset` — unresolvable iso-code keys removed silently — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslationsAssociationFieldSerializer.php:81
