---
id: platform/dev/6.7/guides/development/testing/store/content-and-translations.md
title: Content and Translations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/content-and-translations.html
sourceHash: 3401f26b7e001e008b2df9c01eb0217677358eeb
codeCheckedAgainst: "6.7.13.0"
keywords: ["store listing", "short description", "long description", "translations", "plugin.png", "plugin-icon", "favicon", "screenshots", "manufacturer profile", "composer.json license", "allowed html tags", "extension manager", "fallback language"]
summary: "Store listing rules: description lengths, allowed HTML, screenshots, plugin.png icon, EN/DE translations, admin fallback language, license match, profile."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/development/testing/store/store-review-errors.md", "platform/dev/6.7/guides/development/testing/store/faq.md", "platform/dev/6.7/guides/plugins/themes/_index.md"]
---
## What it is

Store review requirements for listing text, translations, preview images, the extension icon, license master data and the manufacturer profile. HTML and packaging problems are covered in [Common Store review errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md).

## When to use

When preparing the Store listing, media and Administration translations for an extension before submission.

## Key steps / config

**Store listing**

- Publish in the international Store; the German Store is optional but requires a 1:1 English/German translation.
- Short description: 150–185 characters (teaser, "Customers also bought/viewed", meta description).
- Long description: at least 200 characters, 1:1 between English and German where both are used.
- Accurate descriptions of function and use cases; complete setup/configuration instructions.
- Avoid "plugin" and "shopware" in the display name; no blank spaces as filler.
- Clean HTML; inline styles are stripped. Allowed tags:

```markdown
<a> <p> <br> <b> <strong> <i> <ul> <ol> <li> <h2> <h3> <h4> <h5>
```

- No advertising of own services or contact info (support emails, backlinks) in Administration, description or images.

**Images and screenshots**

- English-only screenshots for the English listing; no mixed languages in one image; only images showing the extension's function; no advertising of other extensions.
- Show Storefront and Administration usage including configuration; at least one Storefront and one Admin screenshot of main features; mobile and desktop preferred.
- Icon: `plugin.png`, 84–256px in both dimensions, under `src/Resources/config/`, shown in Administration > Extension Manager. The installed code reads this default path unless `composer.json` `extra.plugin-icon` points elsewhere.
- [Themes](platform/dev/6.7/guides/plugins/themes/_index.md) need a Theme Manager preview image; [Shopping Experiences CMS elements](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) need an element icon. Preview requirements: [FAQ](platform/dev/6.7/guides/development/testing/store/faq.md).

**Admin translations**

- The extension must work regardless of system language; missing translations fall back (usually to English). English must always exist for settings and error messages.
- Declare available languages in the Shopware Account ("Description & images").

**License** — the license in the Shopware Account must match `license` in `composer.json`; it cannot be changed later (new extension with new technical name required).

**Manufacturer profile** (Shopware Account > Extension Partner) — logo required; no iframes, tracking or external scripts; HTTPS for external sources; accurate English and German descriptions; custom styles must not overwrite core styles.

## Essential identifiers

- `src/Resources/config/plugin.png`
- `composer.json` `license` and `extra.plugin-icon`
- Allowed description HTML tags (above)

## Gotchas

- Shopware certificates must not be advertised in descriptions, images or the profile; Shopware appends them automatically.
- Not allowed in listings/profiles: inline styles, embedded certificates, iframes, tracking pixels, external scripts. Allowed: up to two embedded YouTube videos.
- If personal data is processed under Art. 28 DSGVO, declare subprocessors and further subprocessors in the account.

## Code check (6.7.13.0)
- confirmed `src/Resources/config/plugin.png` — default plugin icon path, overridable via composer `extra.plugin-icon` — vendor/shopware/core/Framework/Plugin/PluginService.php:80
- confirmed `license` — plugin license is read from composer.json — vendor/shopware/core/Framework/Plugin/PluginService.php:79
- unverified `plugin.png` dimensions — 84–256px limit is a Store review rule, not checked in installed code
- unverified `Short description` — Store listing length rules live in the Shopware Account, outside vendor/shopware
