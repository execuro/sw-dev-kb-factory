---
id: platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md
title: Automated translation updates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/automated-translation-updates.html
sourceHash: 4364c79d5d21ed6b2ee5b13ad83ad08a39cf9825
codeCheckedAgainst: "6.7.15.1"
keywords: ["translation.update", "UpdateTranslationsTask", "UpdateTranslationsTaskHandler", "translationAutoUpdate", "translation:update", "crowdin-metadata.lock", "crowdin-metadata.json", "shopware.translation.scheduled_task.enabled", "crowdin", "scheduled task", "language pack", "snippet updates", "community translations"]
summary: How snippets flow from shopware/shopware via Crowdin to shopware/translations, and how the translation.update scheduled task refreshes installed locales.
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md
  - platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md
  - platform/dev/6.7/guides/plugins/apps/administration/adding-snippets.md
  - platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md
---
## What it is

Translations are not part of a Shopware release. They are maintained in the Crowdin project `shopware6` (`translate.shopware.com`), published to the `shopware/translations` GitHub repository, and pulled into a shop by the built-in translation system (see [Built-in translation handling](platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md)). Upstream, scheduled GitHub Actions workflows move snippets between `shopware/shopware`, Crowdin and the translations repository; downstream, the `translation.update` scheduled task refreshes the installed translations in a shop.

## When to use

- You want to know why a translation approved in Crowdin is not yet in your shop.
- You need to control or disable automatic snippet updates (e.g. snippets are part of a reviewed deployment artifact).
- You want to change an English/German source string.

## Key steps / config

### Upstream delivery chain

| Step | Where | Schedule |
|---|---|---|
| Collect source snippets | `shopware/translations`, `update-translations.yml` | daily 18:00 UTC |
| Upload sources to Crowdin | `crowdin-upload.yml` | daily 20:00 UTC |
| Download translations | `crowdin-download.yml` (branch `i18n_crowdin_translations`, PR against `main`) | daily 22:00 UTC |
| Update installed translations | shop, `translation.update` task | daily by default |

The download job also runs `scripts/update-metadata.mjs` and commits `crowdin-metadata.json` with new `updatedAt`/`progress` per locale. Expect one to two workdays from Crowdin approval to shop.

Source strings (`en`, `de`) are edited in code, not in Crowdin:

| Bundle | Source file | Translations repo file |
|---|---|---|
| Administration | `src/**/Resources/app/administration/src/**/{en,de}.json` | `translations/en-GB/Platform/Administration/administration.json` |
| Core | `src/Core/Framework/Resources/snippet/messages.{en,de}.base.json` | `translations/en-GB/Platform/Core/messages.json` |
| Storefront | `src/Storefront/Resources/snippet/storefront.{en,de}.json` | `translations/en-GB/Platform/Storefront/storefront.json` |

Official plugins land under `translations/<locale>/Plugins/<name>/`.

### The `translation.update` task

- Task class `Shopware\Core\System\Snippet\ScheduledTask\UpdateTranslationsTask`, handler `Shopware\Core\System\Snippet\ScheduledTask\UpdateTranslationsTaskHandler`.
- Interval `86400` seconds (daily), reschedules on failure.
- Only runs when `shopware.translation.scheduled_task.enabled` is true (default `true`).

Per run, the handler collects locales of languages with `translationAutoUpdate = true` (default on); if none, it returns without any request. The updater then intersects them with the locales recorded in `crowdin-metadata.lock`, fetches remote metadata, downloads only locales with a newer `updatedAt`, and finally saves the new timestamps to `crowdin-metadata.lock`.

```yaml
# config/packages/shopware.yaml
shopware:
    translation:
        scheduled_task:
            enabled: false
```

```bash
php bin/console scheduled-task:list
php bin/console scheduled-task:run-single translation.update
php bin/console translation:update
php bin/console scheduled-task:deactivate translation.update
```

Requirements: a running background worker (see [Scheduled Task](platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md)), outbound HTTPS to `repository-url`/`metadata-url` (default `raw.githubusercontent.com`), and write access to the translation filesystem (by default the `shopware.filesystem.private` adapter).

## Essential identifiers

- `translation.update`, `UpdateTranslationsTask`, `UpdateTranslationsTaskHandler`
- `translationAutoUpdate` (language field)
- `shopware.translation.scheduled_task.enabled`
- `crowdin-metadata.lock`, `crowdin-metadata.json`, `updatedAt`
- `translation:update`, `translation:install`, `translation:list`

## Gotchas

- Changing an existing source string invalidates its translations (Crowdin uploads with `update_as_unapproved`); prefer adding a new key.
- `translation:update` is not scoped by `translationAutoUpdate`: it updates every installed translation, through a different code path than the task.
- The task never installs new languages, never changes a language's `active` flag, never overwrites database snippets (they keep top priority), and never removes languages.
- Failures are logged with `scheduledTask` context `translation.update`; the lock file is only written after all locales are loaded, so the next run retries.
- "Runs but nothing changes": no newer `updatedAt`, flag disabled, or nothing installed — check `bin/console translation:list` (locales without **Last update** are not installed).
- During PR review, diffs in `de-DE`/`en-GB` usually mean an unapproved source change; snippets with HTML (esp. RTL languages) often break.

## Version notes

- Scheduled task available from 6.7.13.0; before that, only `translation:update`.
- `translationAutoUpdate` per-language flag since 6.7.14.0; before, the task updated every installed translation.

## Code check (6.7.15.1)
- confirmed `UpdateTranslationsTask::getTaskName()` — returns `translation.update` — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:14
- confirmed `UpdateTranslationsTask::getDefaultInterval()` — `self::DAILY` = 86400 — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:42
- confirmed `UpdateTranslationsTask::shouldRescheduleOnFailure()` — returns true — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:27
- confirmed `shopware.translation.scheduled_task.enabled` — gates `shouldRun()`, not mentioned in docs — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:24
- confirmed `scheduled_task.enabled` — booleanNode default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1821
- confirmed `translationAutoUpdate` — handler filters on it — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTaskHandler.php:48
- confirmed `LanguageEntity::$translationAutoUpdate` — default true — vendor/shopware/core/System/Language/LanguageEntity.php:91
- confirmed `TranslationUpdater::updateInstalled()` — intersects with installed locales, no request when empty — vendor/shopware/core/System/Snippet/Service/TranslationUpdater.php:115
- confirmed `crowdin-metadata.lock` — lock file name — vendor/shopware/core/System/Snippet/Service/TranslationMetadataStore.php:28
- confirmed `translation:update` — unscoped, uses loader and metadata store directly — vendor/shopware/core/System/Snippet/Command/UpdateTranslationCommand.php:20
