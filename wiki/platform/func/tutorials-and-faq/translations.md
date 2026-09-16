---
id: platform/func/tutorials-and-faq/translations.md
title: Translations
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/translations"
sourceHash: "e541b403016a2ea2147b47514fe4cc6bb4dc359033016fc335dcb863d60a6ac9"
revision:
  current: true
  range: "6.0.0"
  swMax: null
  swMin: null
keywords: ["snippets", "snippet set", "community translations", "translate.shopware.com", "individual texts", "languages", "de-de", "en-gb", "inheritance language", "crowdin", "localisation settings"]
summary: "Explains Shopware's two translation mechanisms: system-text snippet sets and individually translated content, plus community translations."
lastBuilt: "2026-09-15"
---

## What it is

Explains the two ways text is translated in Shopware 6: **snippets** for fixed system
texts (e.g. button labels), and direct translation of **individual texts** (e.g. product
names/descriptions) per configured language.

## When to use

When a shop needs to add a new storefront/admin language, customize system wording for a
language, or translate individual content such as products, shipping/payment method
names, or Shopping Experiences.

## Key steps / config

- System texts are edited under **Settings > Localisation > Snippets**. A separate
  snippet set exists per language; Shopware ships **BASE en-GB** and **BASE de-DE** sets
  with full coverage.
- To customize texts for a language, duplicate a base set as a starting point — either
  **BASE en-GB**, or a community-translation base set such as **BASE nl-NL** — then edit
  individual snippets; untranslated entries stay in the duplicated set's language until
  edited.
- The snippet overview lets multiple languages be selected and edited side by side.
- Additional language packs with more translations can be found in the Extension Store.
- **Community translations**: Shopware itself ships only **de-DE** and **en-GB**;
  translations for all other languages are community-maintained on
  translate.shopware.com and installed automatically when the corresponding language is
  added. A scheduled task periodically checks for and downloads newer community
  translations in the background.
- Languages are managed under **Settings > Localisation > Languages**.
- Community-translated system texts are first machine-translated, then only considered
  reviewed once a community member checks them — accuracy varies by language; shopware
  AG is responsible only for the **de-DE** and **en-GB** translations it ships.
- For **individual texts**: open the item (e.g. a product) in the language it was
  originally created in, switch the language selector at the top to the target
  language, and translate the now-displayed fields. A language's configured
  **inheritance language** supplies the fallback text (shown greyed out) for anything
  not yet translated.

## Essential identifiers

- **Settings > Localisation > Snippets**, **Settings > Localisation > Languages**
- **BASE en-GB**, **BASE de-DE** (shipped snippet sets)
- translate.shopware.com (community translation platform)

## Gotchas

- Only **de-DE** and **en-GB** translations are guaranteed/supported by shopware AG; all
  other languages rely on community accuracy and review.
- Untranslated individual-text fields display the content inherited from the language's
  configured inheritance language, shown in a slightly greyed-out style.
