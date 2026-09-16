---
id: platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md
title: Built-in Translation Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/built-in-translation-system.html
sourceHash: 49f96bf5ae450affca117f7d267114d2a3d9c174
codeCheckedAgainst: "6.7.13.0"
keywords: ["translation:install", "translation:update", "translation.yaml", "TranslationConfigLoader", "AbstractTranslationConfigLoader", "TranslationConfig", "crowdin-metadata.lock", "translation.update", "language pack", "crowdin", "community translations", "flysystem", "loading priority"]
summary: "translation:install/update commands, translation.yaml fields, loading priority and TranslationConfigLoader for community translations in Shopware 6.7."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.7/guides/upgrades-migrations/language-pack-migration.md
  - platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md
  - platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md
  - platform/dev/6.7/concepts/framework/translations/extension-points.md
---
## What it is

The built-in translation system downloads and installs translations not shipped with Shopware, from the public GitHub repository `shopware/translations` (synced daily with Crowdin). It provides the same translations as the **Language Pack** plugin, which is deprecated and removed in 6.8.0.0 (see [migration guide](platform/dev/6.7/guides/upgrades-migrations/language-pack-migration.md)).

## When to use

Installing extra storefront/admin languages (e.g. `fr-FR`, `pl-PL`) for core and supported official plugins, keeping them current, or customising where translations come from.

## Key steps / config

1. Install locales (re-installing overrides existing translations):
   ```bash
   php bin/console translation:install [--all, --locales, --skip-activation]
   php bin/console translation:install --locales=fr-FR,pl-PL --skip-activation
   ```
   Installed languages are activated by default (`active` flag in the `language` table); `--skip-activation` leaves them inactive, so they are not selectable in the storefront.
2. Update installed locales: `php bin/console translation:update`. The same runs daily via the `translation.update` scheduled task ([Automated translation updates](platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md)).
3. Update detection: the repository's `crowdin-metadata.json` carries `updatedAt` per locale; install/update writes `crowdin-metadata.lock` to the private filesystem and compares timestamps.
4. Configuration lives in the shipped `translation.yaml` (docs path `src/Core/System/Resources/translation.yaml`; installed at `vendor/shopware/core/System/Resources/translation.yaml`), read only from that file by `TranslationConfigLoader`:
   ```yaml
   repository-url: https://raw.githubusercontent.com/shopware/translations/main/translations
   metadata-url: https://raw.githubusercontent.com/shopware/translations/main/crowdin-metadata.json
   plugins: ['PluginPublisher', 'SwagB2bPlatform', ...]
   excluded-locales: ['de-DE', 'en-GB']
   plugin-mapping:
     - plugin: 'SwagPublisher'
       name: 'PluginPublisher'
   languages:
     - name: 'Français'
       locale: 'fr-FR'
   ```
   `excluded-locales` also applies to plugins; `plugin-mapping` maps internal plugin names to repository names.
5. To change the configuration at runtime, decorate the loader. It must implement `getDecorated()` and `load(): TranslationConfig`. In the shop container the loader is registered under the concrete ID `Shopware\Core\System\Snippet\Service\TranslationConfigLoader`, and the lazy `Shopware\Core\System\Snippet\Struct\TranslationConfig` service is built from it; that concrete class is `@internal` and its own `getDecorated()` throws `DecorationPatternException`. Invalid config raises `SnippetException`.

## Essential identifiers

- `translation:install` (`--all`, `--locales`, `--skip-activation`), `translation:update`
- `translation.update` scheduled task
- `translation.yaml` fields: `repository-url`, `metadata-url`, `plugins`, `excluded-locales`, `plugin-mapping`, `languages`
- `crowdin-metadata.lock`
- `Shopware\Core\System\Snippet\Service\TranslationConfigLoader`, `Shopware\Core\System\Snippet\Struct\TranslationConfig`

## Gotchas

- Loading priority: database translations > country-specific (`en-GB`, `de-DE`) > country-agnostic (`en`, `de`) > built-in translation system (lowest). See [fallback languages](platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md).
- Storage uses Flysystem (local by default; S3, GCS, Azure or custom adapters possible).
- The docs describe decorating the `AbstractTranslationConfigLoader` service ID; in 6.7.13.0 that alias exists only in the installer container, not the shop container.
- The docs describe a `shopware.translation` Symfony config section with snake_case keys (`repository_url`, `excluded_locales`, `plugin_mapping`; list options replace defaults). No such config tree exists in 6.7.13.0.

## Version notes

- Language Pack plugin deprecated, removed with 6.8.0.0.
- The `shopware.translation` config override documented upstream is not present in the installed 6.7.13.0 core.

## Code check (6.7.13.0)
- confirmed `translation:install` — console command — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:24
- confirmed `skip-activation` — option next to `all` and `locales` — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:42
- confirmed `translation:update` — console command — vendor/shopware/core/System/Snippet/Command/UpdateTranslationCommand.php:19
- confirmed `translation.update` — daily scheduled task name — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:13
- confirmed `crowdin-metadata.lock` — metadata lock file name — vendor/shopware/core/System/Snippet/Service/TranslationMetadataStore.php:26
- confirmed `excluded-locales` — shipped default de-DE, en-GB — vendor/shopware/core/System/Resources/translation.yaml:16
- confirmed `DecorationPatternException` — thrown by concrete loader getDecorated() — vendor/shopware/core/System/Snippet/Service/TranslationConfigLoader.php:37
- corrected `TranslationConfig` — docs: src/Core/System/Snippet/Service/TranslationConfig.php; actual namespace Struct — vendor/shopware/core/System/Snippet/Struct/TranslationConfig.php:14
- corrected `AbstractTranslationConfigLoader` — docs: decorate this ID; alias only defined in the installer container — vendor/shopware/core/Installer/DependencyInjection/services.xml:171
- absent `repository_url` — no shopware.translation config tree; loader reads translation.yaml only
