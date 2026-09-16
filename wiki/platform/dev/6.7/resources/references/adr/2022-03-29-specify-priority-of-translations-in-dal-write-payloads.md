---
id: platform/dev/6.7/resources/references/adr/2022-03-29-specify-priority-of-translations-in-dal-write-payloads.md
title: Specify priority of translations in DAL write payloads
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-29-specify-priority-of-translations-in-dal-write-payloads.html
sourceHash: 180c25cbc09cf495cc1f1bcc6bc5bc439f05114c
codeCheckedAgainst: "6.7.13.0"
keywords: ["translations", "TranslatedFieldSerializer", "TranslationsAssociationFieldSerializer", "TranslatedField", "iso-code", "language-id", "dal write payload", "data abstraction layer", "translation priority", "multilingual write", "locale code", "i18n"]
summary: "ADR: DAL write priority for translations — iso-code keys beat language-id keys, and translations association beats values on the translated field."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record that formally specifies which value wins when a DAL write payload supplies the same translated value in several ways. The DAL accepts translated values:

- directly on the translated field, as a plain string (language of the current context) or as an array indexed by language id or iso-code;
- on the `translations` association as an indexed array.

## When to use

- You write entities with translated fields via repositories or the Admin API and supply values for several languages in one payload.
- A translated value written in one form is unexpectedly overwritten by another form in the same payload.

## Key steps / config

Priority rules (rule 1 outranks rule 2):

1. Translations indexed by `iso-code` (e.g. `en-GB`) take precedence over values indexed by `language-id`.
2. Translations on the `translations` association take precedence over values given directly on the translated field (the field value acts as a default).

Consequence: an iso-code-indexed value on the field itself overwrites a `translations` entry indexed by language id.

```json
{
  "name": { "en-GB": "..." },
  "translations": {
    "<languageId>": { "name": "..." }
  }
}
```

Here the `en-GB` value wins if `<languageId>` is the English language. The ADR recommends iso-codes when writing several languages at once: payloads are easier to read, and they work across systems where language ids differ.

## Essential identifiers

- `translations` association in write payloads
- `Shopware\Core\Framework\DataAbstractionLayer\FieldSerializer\TranslatedFieldSerializer` — moves field-level values into `translations` only where no association value exists
- `Shopware\Core\Framework\DataAbstractionLayer\FieldSerializer\TranslationsAssociationFieldSerializer` — resolves iso-code keys to language ids and merges them over language-id entries

## Gotchas

- In the installed code, an iso-code key that does not resolve to a known language is silently dropped from the payload instead of raising an error.
- A plain string on the translated field is stored for the context language only, and only if the `translations` association does not already set that field for that language.

## Code check (6.7.13.0)
- confirmed `TranslatedFieldSerializer::normalize()` — copies field values into translations only where unset, so the association wins — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslatedFieldSerializer.php:21
- confirmed `$contextLanguage` — plain string value stored for the context language if not already set — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslatedFieldSerializer.php:45
- confirmed `TranslationsAssociationFieldSerializer::normalize()` — resolves non-uuid keys as locale codes — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslationsAssociationFieldSerializer.php:34
- confirmed `array_merge` — iso-code entry merged over the language-id entry, iso wins — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslationsAssociationFieldSerializer.php:89
- confirmed `unset` — unresolvable iso-code key dropped silently — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/TranslationsAssociationFieldSerializer.php:81
- confirmed `WriteContext::getLanguageId()` — maps locale code to language id — vendor/shopware/core/Framework/DataAbstractionLayer/Write/WriteContext.php:70
