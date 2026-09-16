---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md
sourceHash: 4364c79d5d21ed6b2ee5b13ad83ad08a39cf9825
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/automated-translation-updates.html
title: Automated translation updates
version: "6.7"
versions:
  - "6.7"
keywords: ["translation.update", "UpdateTranslationsTask", "UpdateTranslationsTaskHandler", "translation:update", "crowdin-metadata.lock", "crowdin-metadata.json", "crowdin", "shopware/translations", "scheduled task", "snippet updates", "shopware.filesystem.private", "language pack"]
summary: "How snippets flow from shopware/shopware via Crowdin to shopware/translations, and how the daily translation.update scheduled task refreshes installed locales."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md", "platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md", "platform/dev/6.7/guides/plugins/apps/administration/adding-snippets.md"]
---
## What it is

Translations are not part of a Shopware release. They are maintained in the Crowdin project `shopware6` (translate.shopware.com), published to the `shopware/translations` GitHub repository, and pulled into a shop by the built-in translation system ([Built-in translation handling](platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md)). Upstream, scheduled GitHub Actions move snippets between `shopware/shopware`, Crowdin and the translations repository; downstream, the `translation.update` scheduled task refreshes installed translations.

## When to use

- Changing or contributing a core/plugin snippet translation and wanting to know when it reaches shops.
- Operating a shop that should receive translation updates automatically, or deliberately should not.
- Debugging why a translation update did not arrive.

## Key steps / config

### Upstream delivery chain

| Step | Where | Schedule |
|---|---|---|
| Collect source snippets | `shopware/translations`, `update-translations.yml` | daily 18:00 UTC |
| Upload sources to Crowdin | `crowdin-upload.yml` | daily 20:00 UTC |
| Download translations | `crowdin-download.yml` (branch `i18n_crowdin_translations`, PR to `main`) | daily 22:00 UTC |
| Update installed translations | your shop, `translation.update` task | daily |

- English (source) and German are not edited in Crowdin; change the snippet file in the code repository:
  - Administration: `src/**/Resources/app/administration/src/**/{en,de}.json` → `translations/en-GB/Platform/Administration/administration.json`
  - Core: `src/Core/Framework/Resources/snippet/messages.{en,de}.base.json` → `translations/en-GB/Platform/Core/messages.json`
  - Storefront: `src/Storefront/Resources/snippet/storefront.{en,de}.json` → `translations/en-GB/Platform/Storefront/storefront.json`
- Official plugins land under `translations/<locale>/Plugins/<name>/`.
- After download, `scripts/update-metadata.mjs` rewrites `crowdin-metadata.json` with per-locale `updatedAt` and `progress`; shops compare against it. A maintainer reviews and merges the PR.
- Own extensions: see [plugin snippets](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md) and [app snippets](platform/dev/6.7/guides/plugins/apps/administration/adding-snippets.md).

### The scheduled task (installed code)

- Task `Shopware\Core\System\Snippet\ScheduledTask\UpdateTranslationsTask`, name `translation.update`, default interval `86400` s (`ScheduledTask::DAILY`), reschedules on failure.
- Handler `Shopware\Core\System\Snippet\ScheduledTask\UpdateTranslationsTaskHandler` calls `TranslationUpdater::updateInstalled()`:
  1. Read `crowdin-metadata.lock` (under `/translation` on `shopware.filesystem.private`). If no locale is installed, stop — no remote request.
  2. Fetch remote metadata from `metadata-url` for the installed locales and compare `updatedAt`.
  3. Download snippet files for every locale with a newer remote timestamp; skip current ones.
  4. Save the new lock file only after all downloads.

```bash
php bin/console scheduled-task:list
php bin/console scheduled-task:run-single translation.update
php bin/console translation:update
php bin/console scheduled-task:deactivate translation.update
```

Requirements: a running background worker ([Scheduled Task](platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md)); outbound HTTPS to `repository-url`/`metadata-url` (default `raw.githubusercontent.com`); write access to `shopware.filesystem.private`.

## Essential identifiers

- `translation.update`
- `Shopware\Core\System\Snippet\ScheduledTask\UpdateTranslationsTask`
- `Shopware\Core\System\Snippet\ScheduledTask\UpdateTranslationsTaskHandler`
- `Shopware\Core\System\Snippet\Service\TranslationUpdater`
- `crowdin-metadata.lock`, `crowdin-metadata.json`, `updatedAt`
- `translation:update`, `translation:install`, `translation:list`
- `shopware.filesystem.private`

## Gotchas

- Rewording an existing source string invalidates all its translations (`update_as_unapproved`); prefer a new snippet key.
- In PR review watch for snippets with HTML (Crowdin moves content out of tags, especially RTL languages) and for diffs in `de-DE`/`en-GB` — approve in Crowdin instead of editing the file.
- Expect one to two workdays from Crowdin approval to a shop.
- The task never installs new languages (use `translation:install`), never removes languages, and never overwrites database (Administration) snippet overrides. An existing language's `active` flag is not changed — the loader returns early for existing languages.
- On failure, the base handler logs with context `scheduledTask` = `translation.update` and reschedules; the previous lock file stays intact, so the next run retries.
- "Nothing changes": no newer `updatedAt`, or nothing installed — check `bin/console translation:list` (**Last update** column empty = not installed).
- The docs describe a per-language `translationAutoUpdate` flag that scopes the task; it does not exist in 6.7.13.0 — the task refreshes every installed locale, same scope as `translation:update`, though via a different code path (`TranslationUpdater` vs. the command's own loop).
- Deactivate the task when snippets are part of a reviewed deployment artifact and run `translation:update` during deployment instead.

## Version notes

- The `translation.update` scheduled task is available from 6.7.13.0; earlier versions update only via `translation:update`.
- The docs announce the `translationAutoUpdate` language flag for 6.7.14.0; not present in the installed 6.7.13.0.

## Code check (6.7.13.0)
- confirmed `UpdateTranslationsTask::getTaskName()` — returns `translation.update` — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:13
- confirmed `UpdateTranslationsTask::getDefaultInterval()` — `self::DAILY` — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:18
- confirmed `DAILY` — 86400 seconds — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:14
- confirmed `UpdateTranslationsTask::shouldRescheduleOnFailure()` — returns true — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTask.php:21
- confirmed `UpdateTranslationsTaskHandler::run()` — calls updateInstalled with CLI context — vendor/shopware/core/System/Snippet/ScheduledTask/UpdateTranslationsTaskHandler.php:34
- confirmed `TranslationUpdater::updateInstalled()` — no installed locale means no remote request — vendor/shopware/core/System/Snippet/Service/TranslationUpdater.php:49
- confirmed `crowdin-metadata.lock` — lock file under the translation dir — vendor/shopware/core/System/Snippet/Service/TranslationMetadataStore.php:26
- confirmed `shopware.filesystem.private` — injected into TranslationMetadataStore — vendor/shopware/core/System/DependencyInjection/snippet.xml:99
- confirmed `scheduledTask` — log context on rescheduled failure — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:200
- absent `translationAutoUpdate` — per-language flag not in 6.7.13.0; task updates all installed locales
