---
id: platform/dev/6.7/guides/upgrades-migrations/language-pack-migration.md
title: Language Pack Migration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/language-pack-migration.html
sourceHash: d8377110eec410c89628965a4953823f3f19d1b3
codeCheckedAgainst: "6.7.13.0"
keywords: ["translation:install", "--locales", "language pack plugin", "SwagLanguagePack", "integrated translation handling", "BASE snippet set", "snippet set", "sales channel domain", "translate.shopware.com", "languages active flag", "language migration", "install translations"]
summary: "Replacing the Language Pack plugin with built-in translation:install (6.7.3+); the plugin is incompatible from 6.8."
lastBuilt: 2026-09-15
---
## What it is

Migration guide from the Language Pack plugin to Shopware's integrated translation handling. From 6.7.3.0 translations are installed by Shopware itself; from 6.8.0.0 the Language Pack plugin is no longer compatible.

## When to use

- A shop uses the Language Pack plugin and is heading for 6.8.
- Additional languages must be installed on 6.7.3.0+.
- Removing the Language Pack fails with a foreign key error on `sales_channel_domain`.

## Key steps / config

Install translations (same source as the plugin, translate.shopware.com, updated more often):

```bash
bin/console translation:install --locales it-IT,fr-FR
bin/console translation:install --all
```

`--locales` takes comma-separated locale codes that must be configured; without `--locales`/`--all` the command asks interactively or fails in non-interactive mode. Created languages are activated unless `--skip-activation` is passed. Re-installing overwrites existing translations.

**Not using the Language Pack:** nothing changes; use `translation:install` for extra languages.

**Using the Language Pack:**

1. Run `translation:install --locales <locale-code>,<locale-code>` for every language in use.
2. Ensure the languages are active under `Settings → Languages`.
3. Base snippet sets: automatic on 6.7.7.0+ (`BASE <locale>`, e.g. `BASE en-US`); on 6.7.6.0 or earlier create them manually.
4. Switch sales channel domains to the base snippet sets: automatic with Language Pack 5.37.1+; on 5.37.0 or earlier change each domain from e.g. `LanguagePack en-US` to `BASE en-US`.
5. Uninstall and remove the Language Pack plugin after `translation:install` succeeded for all locales. Custom snippets from the snippet module stay (stored in the database).

**New installations:** languages are chosen in the installer and downloaded automatically.

## Essential identifiers

- `bin/console translation:install` (`--locales`, `--all`, `--skip-activation`)
- Snippet set names `BASE <locale>` vs. `LanguagePack <locale>`
- Admin path `Settings → Languages`

## Gotchas

- Other translation plugins and theme snippets are unaffected and can be used alongside.
- Languages from other sources no longer need to register their locales in the Administration; languages now have an active flag.
- Foreign key failure on `sales_channel_domain` when removing the plugin: update Shopware to >= 6.7.7.0 and Language Pack to >= 5.37.1, remove the translation files created by the command, and run it again.

## Version notes

- 6.7.3.0: integrated translation handling and `translation:install`; Language Pack still works but is not recommended.
- 6.7.7.0: base snippet sets created automatically.
- 6.8.0.0: Language Pack plugin incompatible.

## Code check (6.7.13.0)
- confirmed `translation:install` — downloads and installs translations for given or all locales — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:24
- confirmed `--all` — fetch all available translations — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:40
- confirmed `--locales` — comma-separated locale codes — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:41
- confirmed `--skip-activation` — skips activation of created languages — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:42
- confirmed `InstallTranslationCommand::getLocales()` — prompts interactively or throws when no locales given — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:88
- confirmed `TranslationLoader::createSnippetSet()` — creates a snippet set named `BASE <locale>` — vendor/shopware/core/System/Snippet/Service/TranslationLoader.php:245
- confirmed `--locales=` — installer runs translation:install for the selected languages — vendor/shopware/core/Installer/Controller/TranslationController.php:64
- unverified `LanguagePack` — plugin not installed; 5.37.x domain migration cannot be checked
