---
id: platform/func/extensions/language-pack.md
docType: functional
title: Language Pack
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/language-pack
sourceHash: b34e64854d27ccf95ed570e9ef2db3d81d5874b2e746a73d4e54d554a7962d82
revision:
  current: true
  range: "1.1.0 - 1.1.0"
  swMax: "1.1.0"
  swMin: "1.1.0"
keywords: ["Language Pack", "additional languages", "administration translation", "storefront translation", "sales channel languages", "profile settings language", "Crowdin", "Extensions > My Extensions", "individual language extensions", "language pack migration", "native language handling"]
summary: "Language Pack adds many admin/storefront languages; deprecated from Shopware 6.8, replaced by native language handling from 6.7.3.0."
lastBuilt: "2026-09-15"
---
## What it is

The Language Pack extension adds numerous additional languages for use in the Administration and Storefront, including Bosnian, Bulgarian, Croatian, Czech, Danish, Dutch, Finnish, French, Greek, Hindi, Hungarian, Indonesian, Italian, Korean, Latvian, Norwegian, Polish, Portuguese, Romanian, Russian, Serbian (Latin), Slovak, Slovenian, Swedish, Spanish, Turkish, Ukrainian and Vietnamese.

## When to use

Use it to offer the admin interface or storefront in one of the supported additional languages, before the native language handling introduced in 6.7.3.0 is available.

## Key steps / config

- Install during the initial Shopware setup wizard, or license it free of charge in the Shopware Store at `store.shopware.com` and install it under **Extensions > My Extensions**.
- If switching from the old single-language extensions (no longer developed since Shopware 6.4.0.0), uninstall all individual language packages first via **Extensions > My Extensions > Apps > "..."** menu; you can choose whether to retain their existing text-module data.
- Administration languages: activated languages become selectable in each admin user's profile settings; deactivate a language there to hide it from selection.
- Storefront languages: activate a language via the button in the sales channels section (not enabled automatically on install), then select it in the sales channel settings.
- Available languages are maintained on the `Crowdin` platform; once a language is fully translated there, it is shipped via an extension update.

## Essential identifiers

- Admin path: **Extensions > My Extensions**
- Admin path: sales channel settings (storefront languages)
- Admin path: profile settings (administration languages)

## Gotchas

Starting with Shopware 6.8, the Language Pack plugin will no longer be supported; it can already be replaced with the native language handling from version 6.7.3.0 onward.

## Version notes

From 6.7.3.0, native language handling can replace this plugin; from Shopware 6.8, the Language Pack plugin is unsupported.
