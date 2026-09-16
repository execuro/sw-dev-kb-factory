---
id: platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack.md
title: Language Pack
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/language-pack"
sourceHash: "84fe2df8f189b69e002397d32df8434facc44f245cb4f820a2ef971f6f0bb495"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["language pack", "dutch", "netherlands", "extensions", "sales channel", "domain", "tax rate", "footer navigation", "shopping experiences", "user interface language", "settings extensions"]
summary: "Sets up a Shopware 6 store for the Netherlands in Dutch using the unified Shopware language pack extension."
lastBuilt: "2026-09-15"
---

## What it is

A walkthrough for configuring a Shopware 6 store for the Netherlands in Dutch, using the
unified **Shopware language pack** extension (the current mechanism, replacing the older
individual per-language packs).

## When to use

When installing or configuring a Shopware store that needs a Dutch admin and/or
storefront, with the Netherlands as the default sales-channel country.

## Key steps / config

- Pick the installer language (Dutch in the example) — this only affects the installer
  UI, not the running shop.
- Prefer **English** or **German** as the system default language; if a different
  language is needed, install and activate the **Shopware language pack** extension in
  the next installer step.
- Set the **default currency** during installation.
- In the admin's first run wizard, install the **Shopware language pack** (offers
  multiple languages) and verify it is **installed** and **activated** under
  **Extensions > My extensions**.
- Optionally deactivate unused languages under
  **Settings > Extensions > Language Pack** — a purely cosmetic step with no
  performance impact.
- Change the admin's own UI language via the administrator's profile:
  **User interface language**, then **Save**.
- Configure the sales channel: add **countries**, set **default country** to the
  Netherlands, add **currencies** and set the **default currency** (Euro), add the
  desired **languages**, and set the channel's **default language** to Dutch.
- Adjust **Domains**: edit the domain and set its **Currency**, **Language** and
  **Snippet**; settings apply only to that one domain. Additional languages need their
  own sub-domain within the same sales channel.
- Update tax rates under **Settings > Tax**: edit the **Default tax rate** and add
  per-country rates via **Add country** (21% used for the Netherlands in the example).
- Build localized content: create footer-navigation categories under
  **Catalogues > Categories**, shop pages under **Content > Shopping Experiences**, and
  set the sales channel's **Entry point footer navigation** / **Entry point main
  navigation**.
- Translate default snippets under **Settings > Snippet** where needed.
- If demo data is installed, translate categories, products, **Properties** and
  **Property values**, which do not inherit translations automatically.

## Essential identifiers

- **Extensions > My extensions** (Shopware language pack install/activate)
- **Settings > Extensions > Language Pack** (deactivate unused languages)
- **User interface language** (admin profile setting)
- **Sales Channel** > Domains > **Edit domain**
- **Settings > Tax** > **Default tax rate**, **Add country**
- **Content > Shopping Experiences**, **Catalogues > Categories**

## Gotchas

- A category, product, property, or property-value name shown in grey has not been
  translated and falls back to the store's default language.
- Domain-level Currency/Language/Snippet settings are mandatory and only apply to that
  specific domain.
- Deactivating unused languages under Language Pack settings is optional and does not
  affect performance.

## Version notes

Describes the current, unified Shopware language pack extension; Shopware 6.2.0-6.3.5.3
used an older individual per-language pack, covered in a separate guide.
