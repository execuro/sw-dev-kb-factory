---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/upgrades-migrations/language-pack-migration.md
sourceHash: d8377110eec410c89628965a4953823f3f19d1b3
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/language-pack-migration.html
title: Language Pack Migration
version: "6.7"
versions:
  - "6.7"
keywords: ["translation:install", "--locales", "language pack plugin", "SwagLanguagePack", "integrated translation handling", "BASE snippet set", "snippet set", "language active flag", "translate.shopware.com", "sales channel domain", "translations", "uninstall language pack"]
summary: Replacing the Language Pack plugin (incompatible from 6.8.0.0) with built-in translation:install since 6.7.3.0, incl. BASE snippet sets and domain switch.
lastBuilt: 2026-10-21
---
## What it is

Migration guide from the Language Pack plugin to the translation handling built into Shopware. From 6.7.3.0 translations are installed by Shopware itself; from 6.8.0.0 the Language Pack plugin is no longer compatible.

## When to use

A shop uses (or is about to drop) the Language Pack plugin, or needs additional storefront/admin languages on 6.7.3.0+.

## Key steps / config

**Not using the Language Pack plugin:** nothing changes. Install extra languages with:

```bash
bin/console translation:install --locales <locale-code>
bin/console translation:install --locales it-IT,fr-FR
```

**Currently using the Language Pack plugin:**

1. Install every language the shop uses: `bin/console translation:install --locales <locale-code>,<locale-code>`. It uses the same source (translate.shopware.com) as the plugin, updated more frequently.
2. Make sure each needed language is **active** in Administration under `Settings → Languages`.
3. Base snippet sets: on 6.7.7.0+ created automatically (the installer creates a snippet set named `BASE <locale>`); on 6.7.6.0 or earlier create one per language manually, e.g. `BASE en-US`.
4. Switch every sales channel domain to the base snippet set: automatic with Language Pack 5.37.1+; with 5.37.0 or earlier change each domain's snippet set by hand, e.g. `LanguagePack en-US` → `BASE en-US`.
5. After `translation:install` succeeded for all locales, uninstall and remove the Language Pack plugin. Custom snippets from the snippet module stay — they are stored in the database.

**New installations:** select languages in the installer; they are downloaded and installed automatically, no language plugin needed.

## Essential identifiers

- `bin/console translation:install --locales <codes>` (installed options also include `--all`, `--skip-activation`, `--offline`)
- Language `active` flag (`Settings → Languages`)
- Snippet set naming `BASE <locale>` vs `LanguagePack <locale>`

## Gotchas

- Other translation plugins and theme snippets are unaffected and can be used alongside the integrated handling.
- Languages from other sources no longer need to register their locales in the admin.
- `translation:install` activates created languages unless `--skip-activation` is passed.
- Removing the Language Pack fails with a foreign key constraint on `sales_channel_domain`: update to Shopware >= 6.7.7.0 and Language Pack >= 5.37.1, remove the translation files created by the command, and run the command again.

## Version notes

- 6.7.3.0: integrated translation handling and `translation:install`; Language Pack still works but is not recommended.
- 6.7.7.0: base snippet sets created automatically; improved migration.
- 6.8.0.0: Language Pack plugin not compatible.

## Code check (6.7.15.1)
- confirmed `translation:install` — console command downloading/installing translations — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:26
- confirmed `locales` — comma-separated `--locales` option — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:42
- confirmed `skip-activation` — created languages are activated unless this is set — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:43
- confirmed `translation:install` — installer runs it with `--locales` for selected languages — vendor/shopware/core/Installer/Controller/TranslationController.php:64
- confirmed `active` — BoolField on the language entity — vendor/shopware/core/System/Language/LanguageDefinition.php:128
- confirmed `BASE {$language->locale}` — snippet set name created per installed language — vendor/shopware/core/System/Snippet/Service/TranslationLoader.php:339
- unverified `Language Pack 5.37.1` — plugin versions live outside the core code
