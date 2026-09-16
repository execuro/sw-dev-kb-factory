---
id: platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/bilinguale.md
title: Bilinguale
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/bilinguale"
sourceHash: "1caacd01cc67217c1047eb177ddf70deb9aa7d2b3567b6230d392f564121cac6"
revision:
  current: true
  range: "6.3.5.3"
  swMax: null
  swMin: null
keywords: ["bilingual", "swiss", "switzerland", "german", "french", "shopware language pack", "extensions", "sales channel", "domain", "swiss francs", "tax rate", "footer navigation"]
summary: "Sets up a bilingual German/French Swiss Shopware 6 store using the unified Shopware language pack extension, from version 6.3.5.3 onward."
lastBuilt: "2026-09-15"
---

## What it is

A walkthrough for building a bilingual German/French Shopware 6 store for Switzerland
using the newer, unified **Shopware language pack** extension (rather than the older
per-language pack). It applies from Shopware 6.3.5.3 onward, superseding the older
per-language-pack Swiss guide.

## When to use

When setting up or migrating a Swiss shop on Shopware 6.3.5.3+ that needs both German
(default) and French storefronts, with Swiss francs as currency.

## Key steps / config

- Pick German as the installer language; this only affects the installer, not the shop.
- Set German as the **system default language** and install the **Shopware language
  pack** (which offers multiple languages) during the first run wizard, then verify it
  is **installed** and **activated** under **Extensions > My extensions**.
- Optionally deactivate unused languages under
  **Settings > Extensions > Language Pack** — purely cosmetic, with no performance
  impact, but reduces clutter in language drop-downs.
- Change the admin's own UI language via the administrator's profile:
  **User interface language**, then **Save**. Any installed language is available to any
  administrator; English and German are always available as system defaults.
- Configure the sales channel: add **countries**, set **default country** to
  Switzerland, add **currencies** including Swiss francs and set the **default
  currency**, add German and French to the channel's **languages**, and set **default
  language** to German.
- Adjust **Domains**: edit the existing domain and set its **Currency** to Swiss francs;
  add a second domain (e.g. a `/fr` sub-domain) for the French storefront with its own
  **Currency**, **Language** and **Snippet** — settings apply only to that one domain.
- Update tax rates under **Settings > Tax**: edit the **Default tax rate** and add
  per-country rates via **Add country** (7.7% used for Switzerland in the example).
- Build localized content: create footer-navigation categories under
  **Catalogues > Categories**, translatable shop pages created under
  **Content > Shopping Experiences** (a single page can be translated rather than
  duplicated per language), and set the sales channel's **Entry point footer
  navigation** / **Entry point main navigation**.
- Translate default snippets under **Settings > Snippet** where needed.
- If demo data is installed, translate categories, products, **Properties** and
  **Property values**, which do not inherit translations automatically.

## Essential identifiers

- **Extensions > My extensions** (Shopware language pack install/activate)
- **Settings > Extensions > Language Pack** (deactivate unused languages)
- **User interface language** (admin profile setting)
- **Sales Channel** > Domains > **Edit domain** / **Add domain**
- **Settings > Tax** > **Default tax rate**, **Add country**
- **Content > Shopping Experiences**, **Catalogues > Categories**, **Settings > Snippet**

## Gotchas

- Deactivating unused languages under Language Pack settings is optional and has no
  performance effect; it only tidies the drop-down menus.
- Each domain's Currency/Language/Snippet settings only apply to that domain — the
  French sub-domain needs its own configuration.
- A shop page under Shopping Experiences can be translated in place and reused across
  languages instead of creating a separate page per language.

## Version notes

Applies from Shopware 6.3.5.3 onward, using the unified Shopware language pack
extension; earlier Shopware 6.2.0-6.3.5.3 installs used the older individual
per-language language pack described in a separate guide.
