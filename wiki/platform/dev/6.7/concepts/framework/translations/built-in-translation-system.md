---
id: platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md
title: Built-in Translation Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/built-in-translation-system.html
sourceHash: 49f96bf5ae450affca117f7d267114d2a3d9c174
codeCheckedAgainst: "6.7.15.1"
keywords: ["translation:install", "translation:update", "translation.yaml", "shopware.translation", "TranslationConfigLoader", "AbstractTranslationConfigLoader", "TranslationConfig", "crowdin-metadata.lock", "repository-url", "language pack", "community translations", "flysystem", "loading priority"]
summary: Built-in translation system (Language Pack replacement) - translation:install/update, translation.yaml fields, shopware.translation overrides, loading priority.
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/guides/upgrades-migrations/language-pack-migration.md
  - platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md
  - platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md
  - platform/dev/6.7/concepts/framework/translations/extension-points.md
---
## What it is

The built-in translation system downloads and installs translations not shipped with Shopware from the public `shopware/translations` GitHub repository (maintained via Crowdin). It provides the same translations as the **Language Pack** plugin and replaces it. The upstream chain is described in [Automated translation updates](platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md).

## When to use

Installing or updating community translations, migrating off the Language Pack plugin ([Migration guide](platform/dev/6.7/guides/upgrades-migrations/language-pack-migration.md)), or pointing the system at another repository / language set.

## Key steps / config

```bash
php bin/console translation:install [--all, --locales, --skip-activation]
php bin/console translation:install --locales=fr-FR,pl-PL --skip-activation
php bin/console translation:update
```

- Installed translations are activated by default (`active` flag in the `language` table); `--skip-activation` skips that. Reinstalling a locale overrides its translations.
- `translation:update` also runs daily via the `translation.update` scheduled task.
- Update detection: per-locale `updatedAt` in the repository's `crowdin-metadata.json` is compared against `crowdin-metadata.lock`, which install/update write to the translation filesystem.

Shipped config `src/Core/System/Resources/translation.yaml` (dash-separated keys):

```yaml
repository-url: https://raw.githubusercontent.com/shopware/translations/main/translations
metadata-url: https://raw.githubusercontent.com/shopware/translations/main/crowdin-metadata.json
plugins: ['PluginPublisher', 'SwagB2bPlatform', 'SwagCmsExtensions', ...]
excluded-locales: ['de-DE', 'en-GB']
plugin-mapping:
  - plugin: 'SwagPublisher'
    name: 'PluginPublisher'
languages:
  - name: 'Français'
    locale: 'fr-FR'
```

Override via Symfony config (snake_case keys), no PHP needed:

```yaml
# config/packages/translation.yaml
shopware:
    translation:
        repository_url: 'https://raw.githubusercontent.com/my-org/translations/main/translations'
        plugins:
            - 'MyCustomPlugin'
```

Unset options fall back to `translation.yaml`. List options (`plugins`, `excluded_locales`, `plugin_mapping`, `languages`) replace the default — give the full list, or `[]` to clear.

Loading priority: (1) database translations, (2) country-specific patch files (`en-GB`, `en-US`, `de-DE`), (3) country-agnostic files (`en`, `de`) — see [Fallback language selection](platform/dev/6.7/concepts/framework/translations/fallback-language-selection.md), (4) translations installed by the built-in system.

Storage goes through Flysystem — by default the `shopware.filesystem.private` adapter (local, S3, GCS, Azure, custom).

For runtime logic, decorate `Shopware\Core\System\Snippet\Service\AbstractTranslationConfigLoader` (abstract `getDecorated()` and `load()`); it yields the lazy `TranslationConfig` service and raises `SnippetException` on invalid config. See [Extension points](platform/dev/6.7/concepts/framework/translations/extension-points.md).

## Essential identifiers

- `translation:install`, `translation:update`
- `src/Core/System/Resources/translation.yaml`, `shopware.translation`
- `AbstractTranslationConfigLoader`, `TranslationConfigLoader`, `Shopware\Core\System\Snippet\Struct\TranslationConfig`
- `crowdin-metadata.lock`, `crowdin-metadata.json`

## Gotchas

- `de-DE`/`en-GB` are excluded by default (shipped with Shopware), also for plugins.
- The concrete `TranslationConfigLoader` is `@internal` and throws on `getDecorated()` — decorate the abstract ID.
- The docs place `TranslationConfig` under `Snippet/Service/`; in the code it is in `Snippet/Struct/`.

## Version notes

The Language Pack plugin is deprecated and removed with Shopware 6.8.0.0.

## Code check (6.7.15.1)
- confirmed `translation:install` — options `all`, `locales`, `skip-activation` (plus `offline`) — vendor/shopware/core/System/Snippet/Command/InstallTranslationCommand.php:26
- confirmed `translation:update` — command name — vendor/shopware/core/System/Snippet/Command/UpdateTranslationCommand.php:20
- confirmed `repository-url` — shipped default URL — vendor/shopware/core/System/Resources/translation.yaml:1
- confirmed `excluded-locales` — `['de-DE', 'en-GB']` — vendor/shopware/core/System/Resources/translation.yaml:19
- confirmed `repository_url` — `shopware.translation` override node; list nodes default null, no deep merge — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1776
- confirmed `TranslationConfigLoader::getDecorated()` — throws DecorationPatternException — vendor/shopware/core/System/Snippet/Service/TranslationConfigLoader.php:61
- confirmed `AbstractTranslationConfigLoader::load()` — abstract — vendor/shopware/core/System/Snippet/Service/AbstractTranslationConfigLoader.php:13
- corrected `TranslationConfig` — docs: src/Core/System/Snippet/Service/TranslationConfig.php — vendor/shopware/core/System/Snippet/Struct/TranslationConfig.php:14
- confirmed `crowdin-metadata.lock` — lock file name — vendor/shopware/core/System/Snippet/Service/TranslationMetadataStore.php:28
- confirmed `shopware.filesystem.private` — default translation filesystem — vendor/shopware/core/System/DependencyInjection/snippet.php:218
