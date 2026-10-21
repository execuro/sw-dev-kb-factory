---
id: platform/dev/6.7/guides/development/testing/store/content-and-translations.md
title: Content and Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/content-and-translations.html
sourceHash: 3401f26b7e001e008b2df9c01eb0217677358eeb
codeCheckedAgainst: "6.7.15.1"
keywords: ["store listing", "extension description", "translations", "plugin.png", "plugin-icon", "favicon", "screenshots", "composer.json license", "manufacturer profile", "allowed html tags", "admin translations", "fallback language", "dsgvo"]
summary: Shopware Store listing rules - description lengths, allowed HTML, screenshots, plugin.png icon, EN/DE translations, license and manufacturer profile
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/testing/store/store-review-errors.md", "platform/dev/6.7/guides/plugins/themes/_index.md", "platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/development/testing/store/faq.md"]
---
## What it is

Store review requirements for listing text, translations, preview images, the extension icon, license data and the manufacturer profile. HTML/packaging issues are covered in [Common Store review errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md).

## When to use

When preparing or fixing the Shopware Store listing and account data of an extension before submission.

## Key steps / config

Store listing:

- Publish in the international store; the German store is optional but then requires a 1:1 English/German translation.
- **Short description**: 150–185 characters (teaser, "Customers also bought/viewed", meta description).
- **Long description**: at least 200 characters, detailed functionality; 1:1 EN/DE when both are used.
- Describe the extension and use cases accurately; include complete setup/configuration instructions.
- Avoid the words "plugin" and "shopware" in the display name; no blank spaces as filler.
- Clean HTML only; inline styles are stripped. Allowed tags:

```
<a> <p> <br> <b> <strong> <i> <ul> <ol> <li> <h2> <h3> <h4> <h5>
```

- No advertising for own services and no contact information (support emails, backlinks) in the Administration, description or images.

Images and screenshots:

- English-only screenshots for the English listing; no mixed languages in one image; only images showing the extension's function; no advertising for other extensions or services.
- Show Storefront and Administration usage incl. configuration; at least one storefront and one admin screenshot of main features; mobile and desktop preferred.
- Store a favicon `plugin.png` (84–256px in both dimensions) under `src/Resources/config/` so the extension is identifiable in **Administration > Extension Manager**.
- [Themes](platform/dev/6.7/guides/plugins/themes/_index.md) need a preview image in the Theme Manager; [Shopping Experiences CMS elements](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) need an element icon.
- Preview requirements: see the [FAQ](platform/dev/6.7/guides/development/testing/store/faq.md).

Admin translations:

- Extensions must work independently of the system language, with a proper fallback (usually English) for missing translations. English must always be available for settings and error messages.
- Declare available languages in the Shopware Account ("Description & images" → "Translations into the following languages are available").

License: the license in the Shopware Account must match the `license` in `composer.json`. It cannot be changed after creation — a change needs a new extension with a new technical name and upload.

Manufacturer profile (Shopware Account > Extension Partner > Extension Partner profile): logo required; no iframes, tracking or external scripts; external sources over HTTPS; accurate EN and DE descriptions. Custom styles must not overwrite core Shopware styles.

Privacy and media: declare subprocessors and further subprocessors when processing personal data under Art. 28 DSGVO. Up to two YouTube videos may be embedded in the description. Do not advertise Shopware certificates — Shopware appends them automatically.

## Essential identifiers

- `plugin.png` at `src/Resources/config/plugin.png`
- `composer.json` `license`

## Gotchas

- The icon path is read from `composer.json` `extra.plugin-icon` when set; `src/Resources/config/plugin.png` is only the default.
- Inline styles in descriptions are stripped — use only the allowed tags for formatting.

## Code check (6.7.15.1)
- confirmed `plugin-icon` — `extra.plugin-icon` overrides the icon path, default `src/Resources/config/plugin.png` — vendor/shopware/core/Framework/Plugin/PluginService.php:80
- confirmed `license` — plugin license read from composer package info — vendor/shopware/core/Framework/Plugin/PluginService.php:79
- confirmed `previewMediaId` — theme preview image stored on the theme — vendor/shopware/storefront/Theme/ThemeLifecycleService.php:393
- unverified `84–256px` — icon size limit is a Store review rule, not enforced in core
- unverified `short description 150–185 characters` — Shopware Account/Store rule, outside the installed code
