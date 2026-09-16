---
id: platform/func/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish.md
title: Irish
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/setting-up-the-Store-in-a-non-default-language/Irish
sourceHash: f29182bb867afc143c2081a97fc0d675c462b4d05970d7c328470db73b3c631d
revision:
  current: true
  range: "6.2.0 - 6.3.5.3"
  swMax: "6.3.5.3"
  swMin: "6.2.0"
keywords: ["Irish", "Ireland", "English", "language pack", "sales channel", "default language", "default currency", "domain", "snippet set", "tax rate", "footer navigation", "landing page", "shopping experiences", "demo data"]
summary: "Setting up a Shopware store for Ireland using English: sales channel defaults, domain, 23% tax rate, footer/landing pages, demo data."
lastBuilt: 2026-09-15
---

## What it is

A worked example of setting up a Shopware 6 store for Ireland with English as the store language, using the individual language pack workflow (Shopware 6.2.0 - 6.3.5.3).

## When to use

Reference when configuring a store's sales channel defaults, domain, and demo data specifically for Ireland, or as a template for a non-default-language setup on this Shopware version range.

## Key steps / config

- **Installer**: pick English from the installer's language dropdown; English or German are the system default languages in Shopware — a different language requires installing the corresponding language plug-in. Set the default currency.
- **First run wizard**: a language pack install is optional here since English is already a default language. The admin language can be changed per-user under the profile (**Administrator > User interface language**); different users can use different admin languages.
- **Store settings**: on the sales channel, add the countries to use, set the default country to Ireland, add currencies and set the default currency to Euro, set available languages and the default language to English, then save.
- **Domain**: if using more than English, reflect the settings on the domain via **Domains > Edit domain** (URL, Currency, Language, Snippet), keeping http and https domains consistent; additional languages need their own sub-domain (e.g. `www.mystore.com/de`).
- **Tax**: under **Settings > Tax**, edit a tax rate's Name and Default tax rate, and add country-specific rates (example: Ireland at 23%, default rate changed from 20%; United Kingdom also added).
- **Custom pages**: create categories under **Catalogues > Categories** (e.g. "Footer Navigation" with sub-categories "Shop Service" and "Information"), set the sales channel's footer entry point, create shop/landing pages via **Content > Shopping Experiences**, and assign layouts to categories.
- **Demo data**: category/product names must be updated or newly created for the target language; a second language's untranslated entries fall back to the store default language, shown in grey. Properties and Property values are edited the same way via their `...` menu.

## Essential identifiers

- Content > Shopping Experiences
- Settings > Tax
- Sales channel > Domains > Edit domain

## Gotchas

An entity name shown in grey when a second language is selected means it falls back to the store default language because no value has been entered for that language.

## Version notes

This individual-language-pack workflow applies to Shopware 6.2.0 - 6.3.5.3.
