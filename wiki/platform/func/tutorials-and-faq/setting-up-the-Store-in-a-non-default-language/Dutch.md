---
id: platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch.md
title: Dutch
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Dutch
sourceHash: 84fe2df8f189b69e002397d32df8434facc44f245cb4f820a2ef971f6f0bb495
revision:
  current: true
  range: "6.2.0 - 6.3.5.4"
  swMax: "6.3.5.4"
  swMin: "6.2.0"
keywords: ["Dutch", "Netherlands", "language pack", "sales channel", "default language", "default currency", "domain", "snippet set", "tax rate", "footer navigation", "landing page", "shopping experiences", "demo data"]
summary: "Setting up a Shopware store for the Netherlands in Dutch: installer language, sales channel, domain, 21% tax, footer/landing pages, demo data translation."
lastBuilt: 2026-09-15
---

## What it is

A worked example of setting up a Shopware 6 store for the Netherlands with Dutch as the store language, using the individual language pack workflow (Shopware 6.2.0 - 6.3.5.4).

## When to use

Reference when configuring a store's admin/storefront language, sales channel defaults, domain, and demo data for the Netherlands specifically, or as a template for any non-default-language setup on this Shopware version range.

## Key steps / config

- **Installer**: pick the desired language (Dutch in this example) from the installer's language dropdown; English or German is recommended as the system default language, otherwise install and activate the Shopware language pack extension during installation. Set the default currency.
- **First run wizard**: install the Shopware language pack extension, then verify under **Extensions > My extensions** that the required language pack is installed and activated. Unused languages can optionally be deactivated under **Settings > Extensions > Language Pack**.
- **Admin language**: under the user profile (**Administrator**), set "User interface language" and save.
- **Store language**: on the sales channel, add the required countries, set the default country to the Netherlands, add currencies and set the default currency to Euro, set available languages and the default language to Dutch, then save.
- **Domain**: under the sales channel's **Domains**, edit the relevant domain to set its URL, Currency, Language, and Snippet set; configure both http and https domains identically. Additional languages need their own sub-domain (e.g. `www.mystore.com/de`).
- **Tax**: under **Settings > Tax**, edit a tax rate, set Name and Default tax rate, and optionally add country-specific rates (example: Netherlands at 21%, default rate changed from 19%).
- **Custom pages**: create categories under **Catalogues > Categories** (e.g. a "Footer Navigation" top-level category with sub-categories), set the sales channel's footer/main-navigation entry points, create pages via **Content > Shopping Experiences**, and translate names/layouts per language.
- **Demo data**: if installed, category and product names must be translated per language under **Catalogues > Categories**/Products (names shown in grey indicate an untranslated fallback); Properties and Property values need separate translation via their `...` menu.

## Essential identifiers

- Settings > Extensions > Language Pack
- Content > Shopping Experiences
- Settings > Tax

## Gotchas

A category/product/property name shown in grey in the admin means it falls back to the store default language because no translation has been entered for the selected language yet.

## Version notes

This individual-language-pack workflow applies to Shopware 6.2.0 - 6.3.5.4.
