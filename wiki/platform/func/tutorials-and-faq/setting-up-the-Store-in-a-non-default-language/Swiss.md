---
id: platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss.md
title: Swiss
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Swiss"
sourceHash: "6bbbcd8ed01020948de1c22d965c65576214cb50f88456622a042befc299bf64"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["swiss", "switzerland", "multilingual", "german", "french", "language pack", "sales channel", "domain", "swiss francs", "tax rate", "footer navigation", "shopping experiences", "user interface language"]
summary: "Guide to setting up a Shopware 6 store for Switzerland with German and French, covering admin language, sales channel and per-domain settings."
lastBuilt: "2026-09-15"
---

## What it is

A walkthrough for configuring a Shopware 6 store for Switzerland with both German and
French storefronts, using the individual (per-language) language pack. It applies only to
Shopware 6.2.0 up to 6.3.5.3; a newer unified Shopware language pack is used from
6.3.5.3/6.4 onward.

## When to use

When installing a Shopware 6.2.0-6.3.5.3 instance for a Swiss shop that must serve German
as the default admin/store language while also offering a French storefront under its own
sub-domain, with Swiss francs as currency.

## Key steps / config

- During installation, pick the installer language (German in the example); this only
  affects the installer UI.
- Set German as the **system default language** and add French by installing and
  activating the French language plug-in in the first run wizard.
- Set the **default currency** during installation.
- In the admin, install the **language pack** you need under
  **Settings > System > Plugins** and verify it is **installed** and **activated**.
- Change the admin's own UI language under the administrator's profile:
  **User interface language**, then **Save**.
- Configure the sales channel: add **countries**, set **default country** to
  Switzerland, add **currencies** including Swiss francs and set the **default
  currency**, add German and French to the channel's **languages**, and set the
  **default language** to German.
- Adjust **Domains**: edit the existing domain, set its **Currency** to Swiss francs;
  add a second domain (e.g. a `/fr` sub-domain) for the French storefront, with its own
  **Currency**, **Language** and **Snippet** — each domain's settings only apply to that
  domain.
- Update tax rates under **Settings > Tax**, editing the **Default tax rate** and adding
  per-country rates via **Add country** (the guide uses 7.7% for Switzerland).
- Build localized content: create footer-navigation categories under
  **Catalogues > Categories**, assign shop pages created under
  **Content > Shopping Experiences** to translated sub-categories, and set the sales
  channel's **Entry point footer navigation** / **Entry point main navigation**.
- Translate default snippets under **Settings > Snippet** where the defaults do not
  match expectations.
- If demo data is installed, translate categories, products, **Properties** and
  **Property values**, since properties/values do not inherit translations
  automatically.

## Essential identifiers

- **User interface language** (admin profile setting)
- **Sales Channel** > Domains > **Edit domain** / **Add domain** (Currency / Language /
  Snippet)
- **Settings > System > Plugins** (language pack install/activate)
- **Settings > Tax** > **Default tax rate**, **Add country**
- **Content > Shopping Experiences**, **Catalogues > Categories**
- **Settings > Snippet**

## Gotchas

- The store front only shows a language switcher once more than one language and domain
  are configured for the sales channel.
- A category/product name shown in grey indicates it has not been translated and falls
  back to the store's default language.
- Each domain's Currency/Language/Snippet settings apply only to that domain — the
  French sub-domain must be configured separately from the main domain.
- Every administrator can pick their own preferred UI language independently, as long as
  it is installed; English and German are always available as system defaults.

## Version notes

Valid only for Shopware 6.2.0 through 6.3.5.3 using the individual per-language language
pack; Shopware 6.3.5.3 and 6.4+ use a newer, unified Shopware language pack instead,
covered in a separate guide.
