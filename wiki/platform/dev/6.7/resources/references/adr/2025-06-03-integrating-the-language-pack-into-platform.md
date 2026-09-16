---
id: platform/dev/6.7/resources/references/adr/2025-06-03-integrating-the-language-pack-into-platform.md
title: Integrating the language pack into platform
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-06-03-integrating-the-language-pack-into-platform.html
sourceHash: b1a12a2592cb2827d00b8e9f649246eb845a0ef0
codeCheckedAgainst: "6.7.13.0"
keywords: ["translation:install", "translation:update", "translation:list", "SwagLanguagePack", "shopware/translations", "InstallTranslationCommand", "language pack", "translations", "crowdin", "snippets", "install languages", "locales"]
summary: "ADR: platform downloads Crowdin translations from the shopware/translations GitHub repo via translation:* console commands, replacing the Language Pack plugin."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-06-03, area discovery) moving translation distribution from the `SwagLanguagePack` plugin into the Shopware platform: a core service downloads translation JSON files directly from the `shopware/translations` GitHub repository and stores them on the local file system like other platform snippet files.

## When to use

- Installing or updating storefront/administration languages without the Language Pack plugin, e.g. when building a deployment image.
- Understanding why translation updates no longer depend on plugin release cycles.

## Key steps / config

Old workflow (steps 3–5 replaced): Crowdin → `shopware/translations` → `shopware/SwagLanguagePack` (JSON distribution) → store release → plugin update (OnPrem) or docker image dependency update (Cloud).

New workflow: Crowdin remains the single source of truth; `shopware/translations` stays the intermediary layer; translations are downloaded on demand by admin interaction or console command. In the administration, available translations are listed and installed with a single click.

Installed console commands (6.7.13):

```bash
bin/console translation:install --locales=de-DE,en-US   # or --all; --skip-activation
bin/console translation:update                          # update all installed translations
bin/console translation:list
```

- `translation:install` downloads and installs translations for the given or all configured locales; re-installing overwrites existing translations. Without `--all`/`--locales` it prompts interactively, and fails in non-interactive mode. Created languages are activated unless `--skip-activation` is set.
- `translation:update` only reloads locales whose metadata indicates an update.

## Essential identifiers

- `translation:install`, `translation:update`, `translation:list`
- `Shopware\Core\System\Snippet\Command\InstallTranslationCommand`
- `shopware/translations` (GitHub repository), `SwagLanguagePack`

## Gotchas

- The ADR's proposed command set (`install [translation] [--all, --locales]`, `activate`, `deactivate`, `uninstall`, `list`) is not what ships: no `translation:activate`, `translation:deactivate` or `translation:uninstall` command exists in the installed core; activation is controlled via `--skip-activation` on install.
- No impact on other extensions and their snippet files; the general translations workflow stays the same.
- Translation versions are mapped to platform version ranges.

## Version notes

- The Language Pack plugin is maintained only for Shopware versions below v6.8.0.

## Code check (6.7.13.0)
- corrected `translation:install` — docs: install [translation] [--all, --locales]; code has --all, --locales, --skip-activation — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:24
- confirmed `skip-activation` — install option to skip activating created languages — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:42
- confirmed `translation:update` — updates installed translations from GitHub repo — vendor/shopware/core/System/Snippet/Command/UpdateTranslationCommand.php:19
- confirmed `translation:list` — list command — vendor/shopware/core/System/Snippet/Command/ListTranslationsCommand.php:22
- absent `translation:activate` — no console command with this name in installed code
- absent `translation:deactivate` — no console command with this name in installed code
- absent `translation:uninstall` — no console command with this name in installed code
