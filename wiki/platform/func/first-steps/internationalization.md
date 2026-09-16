---
id: "platform/func/first-steps/internationalization.md"
title: "Internationalization"
docType: "functional"
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/first-steps/internationalization"
sourceHash: "e533af156665ae89a95e4935d82b68c38bb7fa9cf9f66576cfe309adcf1ec2c7"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["internationalization", "languages", "country administration", "currencies", "tax rates", "payment methods", "shipping methods", "sales channel", "snippets", "Crowdin", "email templates", "shopping experience translation"]
summary: "Internationalization guide: add languages, activate countries, set currencies/taxes, and translate snippets, products, and Shopping Experiences."
lastBuilt: "2026-09-15"
---
## What it is
This guide helps internationalize a Shopware shop by showing what to consider when serving customers in other countries: payment methods, tax situations, currencies, translations, delivery, and shipping costs.

## When to use
Use it before expanding a shop to serve customers in additional countries.

## Key steps / config
- Add the target languages (German and English ship by default); a Shopware language pack extension can add more.
- Provide translations wherever the Admin shows a language drop-down at the top.
- Activate the relevant countries in the country administration so customers from those countries can register; select a language to translate country names.
- Translate category names by switching language at the top of the category tree (only category names are translated this way).
- Configure additional currencies as needed.
- Set appropriate tax rates for each accepted country.
- Review payment methods and shipping methods used in the target countries.
- Create a sales channel per language or subshop, matching the allowed countries and languages.
- Translate snippets (ship in German/English; extend via translation, a language plugin, or Crowdin) and email templates under **Settings > Shop > Email templates**.
- Translate products under **Catalogues > Products > Edit**.
- For Shopping Experiences: create the layout first in the default system language, then switch language via the top-right dropdown to translate its content. Layout and elements can only be created in the default language, but content (text, images, product selection) can be translated independently. Finally assign the translated shopping experience to a (translated) category.
- Test that all translations, snippets, settings, shipping and payment rules work correctly.

## Essential identifiers
- `country administration`
- `Settings > Shop > Email templates`
- `Catalogues > Products > Edit`
