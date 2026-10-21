---
id: platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md
title: Scheduled Task
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/scheduled-task.html
sourceHash: 9a1fbbf82ee8a9601d90362ad0d42516222e44dc
codeCheckedAgainst: "6.7.15.1"
keywords: ["scheduled task", "scheduled-task:run", "scheduled-task:list", "scheduled-task:schedule", "scheduled-task:deactivate", "--no-wait", "scheduler_shopware", "messenger:consume", "STATUS_INACTIVE", "scheduled_task table", "cron", "symfony scheduler", "background jobs"]
summary: Default Shopware scheduled tasks and intervals, scheduled-task:* CLI commands, cron with --no-wait, and the experimental symfony scheduler transport.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md", "platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md"]
---
## What it is

Scheduled tasks put messages on the message queue at fixed intervals. Shopware uses them for cleanup, update and other background jobs that are not time-critical. This page lists the default tasks and the CLI commands for listing, scheduling, deactivating and running them.

## When to use

When you set up a production host and need scheduled tasks to run, or need to check, schedule or deactivate a specific task.

## Key steps / config

Default tasks (name, run interval in seconds; intervals checked against 6.7.15.1 code):

| Name | Interval |
|---|---|
| `log_entry.cleanup`, `app_update`, `app_delete`, `version.cleanup`, `webhook_event_log.cleanup`, `sales_channel_context.cleanup`, `delete_newsletter_recipient_task`, `product_stream.mapping.update`, `import_export_file.cleanup`, `shopware.sitemap_generate`, `cart.cleanup`, `translation.update` | 86400 |
| `shopware.invalidate_cache` | 300 (code: `MINUTELY * 5`) |
| `product_keyword_dictionary.cleanup` | 604800 |
| `product_download.media.cleanup` | 2628000 |
| `product_export_generate_task` | 60 |
| `shopware.elasticsearch.create.alias` | 300 |

Commands:

- List: `bin/console scheduled-task:list`
- Schedule a task: `bin/console scheduled-task:schedule`
- Deactivate a task: `bin/console scheduled-task:deactivate`
- Run: set up a background worker for the [Message Queue](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md), then run `bin/console scheduled-task:run`. It queues due tasks and waits for the next one; it uses little CPU or memory.
- From cron, add `--no-wait` (queue due tasks once and exit); pick the cron interval from your task intervals:

```bash
*/5 * * * * /usr/bin/php /var/www/html/bin/console scheduled-task:run --no-wait
```

Symfony scheduler (experimental): run tasks inside a queue worker with

```bash
bin/console messenger:consume scheduler_shopware
```

On startup it reads `name`, `run_interval` and `status` from the `scheduled_task` table; a row is optional (the task's default interval applies otherwise). Restart the command after changing intervals. To deactivate a task, set its `status` to `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskDefinition::STATUS_INACTIVE` (`inactive`) and restart the `consume` command.

## Essential identifiers

- `scheduled-task:run` (`--no-wait`), `scheduled-task:list`, `scheduled-task:schedule`, `scheduled-task:deactivate`
- `messenger:consume scheduler_shopware`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskDefinition::STATUS_INACTIVE`
- `scheduled_task` database table

## Gotchas

- The docs list `shopware.invalidate_cache` at 20 seconds; the installed code returns `MINUTELY * 5` (300 seconds).
- `shopware.elasticsearch.create.alias` only runs when an Elasticsearch server is configured and enabled; `shopware.invalidate_cache` also runs only when necessary.
- `translation.update` only does work when at least one translation was installed through the [built-in translation handling](platform/dev/6.7/concepts/framework/translations/built-in-translation-system.md); see [Automated translation updates](platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md).
- With the symfony scheduler, interval changes in the database take effect only after restarting the consumer.

## Version notes

- `scheduled-task:list` and `--no-wait`: since 6.5.5.0.
- `scheduled-task:schedule` and `scheduled-task:deactivate`: since 6.7.2.0.
- Symfony scheduler support: since 6.6, still experimental (`ScheduleProvider` is marked `@experimental stableVersion:v6.8.0`).

## Code check (6.7.15.1)
- corrected `InvalidateCacheTask::getDefaultInterval()` — docs: 20 seconds; code returns `self::MINUTELY * 5` — vendor/shopware/core/Framework/Adapter/Cache/InvalidateCacheTask.php:20
- confirmed `scheduled-task:run` — console command name of ScheduledTaskRunner — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:20
- confirmed `no-wait` — option on scheduled-task:run — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:43
- confirmed `scheduled-task:list` — command exists — vendor/shopware/core/Framework/MessageQueue/Command/ListScheduledTaskCommand.php:17
- confirmed `scheduled-task:schedule` — command exists — vendor/shopware/core/Framework/MessageQueue/Command/ScheduleScheduledTaskCommand.php:18
- confirmed `scheduled-task:deactivate` — command exists — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:18
- confirmed `scheduler.schedule_provider` — ScheduleProvider tagged with name `shopware`, giving transport `scheduler_shopware` — vendor/shopware/core/Framework/DependencyInjection/scheduled-task.php:96
- confirmed `ScheduledTaskDefinition::STATUS_INACTIVE` — value `inactive`, skipped by ScheduleProvider — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskDefinition.php:34
- confirmed `CleanupUnusedDownloadMediaTask::getDefaultInterval()` — returns 2628000 — vendor/shopware/core/Content/Product/Cleanup/CleanupUnusedDownloadMediaTask.php:18
- unverified `shopware.elasticsearch.create.alias` — defined in the Elasticsearch package, outside the checked roots
