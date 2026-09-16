---
id: platform/func/settings/languages.md
title: Languages
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/languages
sourceHash: 4936bddc05e969cd154aa2eb9e4386e22ac18bd5942d39034cd856d151060e08
revision:
  current: true
  range: "6.7.3.0 - 6.7.13.1"
  swMin: "6.7.3.0"
  swMax: "6.7.13.1"
keywords: ["languages", "settings localisation languages", "ISO code", "locale", "language inheritance", "community translations", "snippet updates", "auto update snippets", "sales channel language", "create language", "edit language"]
summary: How to view, create, and edit admin languages under Settings > Localisation > Languages, including ISO code, locale, and inheritance.
lastBuilt: 2026-09-15
---
## What it is

The Languages settings, under **Settings > Localisation > Languages**, list and manage every language configured in the Administration, which are used both in the Administration itself and for translating functions such as currencies. The store's default system language is chosen at installation and cannot be changed afterwards.

## When to use

Use this page to add a new language to the shop, activate or deactivate an existing one, change how a language inherits translations, or manage community-maintained snippet updates for a language.

## Key steps / config

- The overview lists name, locale, ISO code, linked sales channels, snippet-update status, and active status; the table menu can additionally show the "Inherits from" column.
- From the overview you can update community-maintained snippets for **all** or **individual** languages, **create** new languages, **edit** existing ones, and jump to **snippets**.
- Edit language fields: **Name**, **Active**, **ISO code** (e.g. `en-GB`, `de-DE`), **Locale**, **Inherits from** (a language may inherit from only one other language, and only texts—not snippets—are inherited; multi-level inheritance is not possible), **Sales channels** (read-only link to sales channel settings), **Snippet updates** (shows whether community translations are current, available, or unsupported for manually/extension-added languages), and **Auto update** (keeps snippets current automatically).
- Create language: pick a language from a dropdown (already-created ones are greyed out; pseudo-languages such as Acholi also appear); the dialog then shows whether community translations exist for it, and the same fields as Edit language are available before saving.
- After creation, the language must be linked to a sales channel to be used in the storefront.

## Essential identifiers

- Admin path: **Settings > Localisation > Languages**.
- Fields: Name, Active, ISO code, Locale, Inherits from, Sales channels, Snippet updates, Auto update.

## Gotchas

- A language can inherit from exactly one other language; chained (multi-level) inheritance is not supported, and only individual texts, not snippets, are inherited.
- If a language cannot be found in the dropdown, it can be searched for in the Extension Store or created manually.
