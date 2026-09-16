---
id: platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian.md
title: Italian
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Italian
sourceHash: 999dcacd3f60a3dee17ba895ba32c4cfa2d5a9592e585056ff13ccc0881ef51f
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Italian", "Italy", "language pack", "sales channel", "default language", "default currency", "domain", "snippet set", "tax rate", "footer navigation", "landing page", "shopping experiences", "demo data"]
summary: "Setting up a Shopware store for Italy in Italian: sales channel defaults, domain, 22% tax rate, footer/landing pages, demo data translation."
lastBuilt: 2026-09-15
---

## What it is

A worked example of setting up a Shopware 6 store for Italy with Italian as the store language, using the individual language pack workflow. The source notes this workflow applies to Shopware 6.2.0 - 6.3.5.4 with the individual language pack; a separate article covers 6.3.5.4+ with the new Shopware language pack and 6.4.

## When to use

Reference when configuring a store's admin/storefront language, sales channel defaults, domain, and demo data specifically for Italy, or as a template for any non-default-language setup on this version range.

## Key steps / config

- **Installer**: pick Italian from the installer's language dropdown; English or German is recommended as the system default language, otherwise install and activate the corresponding language plug-in during installation. Set the default currency.
- **First run wizard**: install the needed language pack (Italian in this example) and verify under **Settings > System > Plugins** that it is installed and activated.
- **Admin language**: under the user profile (**Administrator**), set "User interface language" to Italian and save.
- **Store language**: on the sales channel, add the required countries, set the default country to Italy, add currencies and set the default currency to Euro, set available languages and the default language to Italian, then save.
- **Domain**: under the sales channel's **Domains**, edit the relevant domain to set its URL, Currency, Language, and Snippet; configure both http and https domains identically. Additional languages need their own sub-domain (e.g. `www.mystore.com/de`).
- **Tax**: under **Settings > Tax**, edit a tax rate, set Name and Default tax rate, and optionally add country-specific rates (example: Italy at 22%, default rate changed from 19%; Germany also added).
- **Custom pages**: create categories under **Catalogues > Categories** (e.g. a "Footer Navigation" top-level category with sub-categories "Shop Service" and "Information"), set the sales channel's footer/main-navigation entry points, create pages via **Content > Shopping Experiences**, and translate names/layouts per language.
- **Demo data**: if installed, category and product names must be translated per language under **Catalogues > Categories**/Products (names shown in grey indicate an untranslated fallback); Properties and Property values need separate translation via their `...` menu.

## Essential identifiers

- Settings > System > Plugins
- Content > Shopping Experiences
- Settings > Tax

## Gotchas

A category/product/property name shown in grey in the admin means it falls back to the store default language because no translation has been entered for the selected language yet.
