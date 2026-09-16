---
id: platform/func/settings/snippets.md
title: Snippets
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/snippets
sourceHash: 32dfb227fc7b900d04487a44766c98ab0752003e817195ae7e836523ff1589ac
revision:
  current: true
  range: "6.4.0 - 6.7.4.2"
  swMin: "6.4.0"
  swMax: "6.7.4.2"
keywords: ["snippets", "snippet sets", "snippet key", "messages.de.base.json", "storefront.de.json", "BASE de-DE", "BASE en-GB", "bulk edit", "translations", "footer.serviceHotline", "BCP 47 language tag", "ISO 639-1"]
summary: "Manages translation/customisation snippets and snippet sets under Settings > Shop > Snippets, including creation, editing, filtering and reset."
lastBuilt: "2026-09-15"
---

## What it is

Snippets are the translation/customisation text entries used in the storefront or documents, managed under **Settings > Shop > Snippets** and grouped into snippet sets.

## When to use

Use it to translate or customize storefront/document text, add new sales-channel-specific snippet sets, or reset customised snippets back to their shipped defaults.

## Key steps / config

- Two default base sets: **BASE de-DE** and **BASE en-GB**, backed by the core files `messages.de.base.json` (or `messages.en.base.json`) plus Storefront-specific `storefront.de.json`/`storefront.en.json`. These base files should not be edited manually — they provide the reset baseline.
- **Bulk edit** edits several selected snippet sets at once; **Add snippet set** creates a new set from a base file; the context menu edits/duplicates/deletes a set; double-clicking a row enables inline editing.
- Editing a snippet: open a set, or select sets and use Bulk edit, to see all snippets by key (**Name** column) with one translation per snippet set. The reset modal lets you pick which sets to reset a key in, compares current vs. original translation, and offers "Reset for all snippet sets".
- Filters: show empty/edited/added-only snippets, filter by Author (default snippets have author "Shopware"), or by area/function (e.g. checkout).
- New snippet: created globally from the snippet list via **New Snippet**; assign a name (the snippet key, no spaces/special characters, e.g. `checkout.headline`) and per-set content, then save.
- New snippet set: via **Add snippet set** (choose a base file as fallback source) or by duplicating an existing set via its context menu. A new set needs a name, a locale (`en-GB`/`de-DE` format or a two-letter code per the BCP 47 language tag standard, limited to ISO 639-1 codes), and a base file.
- Include a link in a snippet using the HTML `a href` attribute; insert a line break using the HTML `br` attribute.
- Edit the storefront footer hotline via the `footer.serviceHotline` snippet key under **Settings > Snippets**.

## Essential identifiers

- Files: `messages.de.base.json`, `storefront.de.json` (and English equivalents)
- Snippet key example: `footer.serviceHotline`
- Locale format: BCP 47 language tag, ISO 639-1 codes

## Gotchas

Don't edit the base JSON files manually — they are required intact to reset customised snippets to their original values. A snippet set's display name cannot be changed from the snippet-list detail view (only from the set overview row via double-click).
