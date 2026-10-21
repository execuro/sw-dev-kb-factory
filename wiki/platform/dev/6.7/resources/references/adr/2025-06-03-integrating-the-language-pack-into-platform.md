---
id: platform/dev/6.7/resources/references/adr/2025-06-03-integrating-the-language-pack-into-platform.md
title: Integrating the language pack into platform
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-06-03-integrating-the-language-pack-into-platform.html
sourceHash: b1a12a2592cb2827d00b8e9f649246eb845a0ef0
codeCheckedAgainst: "6.7.15.1"
keywords: ["language pack", "SwagLanguagePack", "shopware/translations", "translation:install", "translation:update", "translation:list", "translation:download", "InstallTranslationCommand", "crowdin", "translations", "snippets", "install languages"]
summary: "ADR: translations download from the shopware/translations GitHub repo via translation:* commands, replacing SwagLanguagePack."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (area: discovery, 2025-06-03) that moves translation distribution from the Shopware Language Pack plugin (`shopware/SwagLanguagePack`) into the platform itself. A platform service downloads translations as JSON files directly from the `shopware/translations` GitHub repository and stores them on the local file system like other platform snippet files, without any extension.

## When to use

- Installing or updating storefront/administration translations on an installation without the Language Pack plugin.
- Preparing languages at image build time for a deployment.
- Understanding why the Language Pack plugin is phased out and how translations flow from Crowdin.

## Key steps / config

Previous flow, in place for about six years and shaped by the former GitLab-based workflow:

1. Translations are updated in Crowdin (single source of truth; the Shopware team and community contribute there).
2. Crowdin changes are merged into `shopware/translations` (automated, manually reviewed). This repository stays as an intermediary layer decoupling core repositories from Crowdin.
3. Changes are merged into `shopware/SwagLanguagePack`, which mainly distributes JSON files.
4. Language Pack releases are published to the store.
5. The installation is updated: OnPrem by updating the plugin manually, Cloud by updating the docker image dependency.

The decision replaces steps 3–5 with a single step in `shopware/shopware`: translations are downloaded via admin user interaction or a console command. The installed code (6.7.15.1) registers these commands:

```bash
bin/console translation:install --locales=es-ES,en-US   # or --all; also --skip-activation, --offline
bin/console translation:update                           # update all installed translations
bin/console translation:list
bin/console translation:download
bin/console translation:validate
bin/console translation:lint-filenames
```

`translation:install` without `--all`/`--locales` asks interactively and fails in non-interactive mode. Languages are activated on install unless `--skip-activation` is set; `--offline` installs from files already on the file system without contacting the repository.

## Essential identifiers

- `translation:install` (`Shopware\Core\System\Snippet\Command\InstallTranslationCommand`)
- `translation:update` (`UpdateTranslationCommand`), `translation:list` (`ListTranslationsCommand`), `translation:download` (`DownloadTranslationCommand`)
- `shopware/translations`, `shopware/SwagLanguagePack`, Crowdin

## Gotchas

- The ADR sketches a `translation` command namespace with `install`, `activate`, `deactivate`, `uninstall` and `list`. The installed code has no activate/deactivate/uninstall translation commands; activation happens as part of `translation:install`, and updating is a separate `translation:update` command.
- The general translation workflow does not change for extensions; their own snippet files are unaffected.
- Translation versions are mapped to platform version ranges, so translations can be installed or updated on demand, independent of platform or plugin release cycles.

## Version notes

- The Language Pack plugin is maintained only for Shopware versions below 6.8.0.
- In the Administration, available translations are listed and can be installed with a single click.

## Code check (6.7.15.1)
- confirmed `translation:install` — options `--all`, `--locales`, `--skip-activation`, `--offline` — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:26
- confirmed `InstallTranslationCommand` — downloads from the translations GitHub repository — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:29
- confirmed `translation:update` — updates all installed translations — vendor/shopware/core/System/Snippet/Command/UpdateTranslationCommand.php:20
- confirmed `translation:list` — lists translations — vendor/shopware/core/System/Snippet/Command/ListTranslationsCommand.php:23
- confirmed `translation:download` — download command — vendor/shopware/core/System/Snippet/Command/DownloadTranslationCommand.php:19
- confirmed `translation:validate` — snippet validation command — vendor/shopware/core/System/Snippet/Command/ValidateSnippetsCommand.php:26
- confirmed `translation:lint-filenames` — file name lint command — vendor/shopware/core/System/Snippet/Command/LintTranslationFilesCommand.php:22
- unverified `translation:activate` — no such command name found in the installed console commands; ADR sketch only
