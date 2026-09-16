---
id: platform/dev/6.7/guides/hosting/infrastructure/scheduled-task.md
title: Scheduled Task
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/scheduled-task.html
sourceHash: 9a1fbbf82ee8a9601d90362ad0d42516222e44dc
codeCheckedAgainst: "6.7.13.0"
keywords: ["scheduled task", "scheduled-task:run", "scheduled-task:list", "scheduled-task:schedule", "scheduled-task:deactivate", "--no-wait", "cron", "scheduler_shopware", "symfony scheduler", "ScheduledTaskDefinition::STATUS_INACTIVE", "scheduled_task table", "background jobs", "shopware.invalidate_cache"]
summary: Default Shopware scheduled tasks and intervals, and running them via scheduled-task:run (cron --no-wait) or the symfony scheduler transport scheduler_shopware.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md", "platform/dev/6.7/guides/hosting/infrastructure/message-queue.md"]
---
## What it is

Hosting guide for scheduled tasks: messages that Shopware puts on the message queue at fixed intervals for cleanup, update and other non-time-critical background work. Covers the default tasks, the CLI commands to inspect and control them, and the two ways to run them.

## When to use

Setting up workers/cron on a server, checking why cleanup or cache invalidation does not run, or disabling a specific default task.

## Key steps / config

Default tasks (interval in seconds):

| Name | Interval |
|---|---|
| `log_entry.cleanup`, `app_update`, `app_delete`, `version.cleanup`, `webhook_event_log.cleanup`, `sales_channel_context.cleanup`, `delete_newsletter_recipient_task`, `product_stream.mapping.update`, `import_export_file.cleanup`, `shopware.sitemap_generate`, `cart.cleanup`, `translation.update` | 86400 |
| `shopware.invalidate_cache` | 300 (installed code) |
| `product_keyword_dictionary.cleanup` | 604800 |
| `product_download.media.cleanup` | 2628000 |
| `product_export_generate_task` | 60 |
| `shopware.elasticsearch.create.alias` | 300 |

`shopware.elasticsearch.create.alias` only runs when Elasticsearch is configured and enabled; `translation.update` only works when a translation was installed via the built-in translation handling (see [Automated translation updates](platform/dev/6.7/concepts/framework/translations/automated-translation-updates.md)).

Commands:
- `bin/console scheduled-task:list` — list all tasks (since 6.5.5.0).
- `bin/console scheduled-task:schedule` — schedule a task (since 6.7.2.0).
- `bin/console scheduled-task:deactivate` — deactivate a task (since 6.7.2.0).
- `bin/console scheduled-task:run` — puts due tasks on the queue and waits for the next one; low CPU/memory. Requires a background worker consuming the [Message Queue](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md).

Cron variant with `--no-wait` (queue due tasks once and exit):

```bash
*/5 * * * * /usr/bin/php /var/www/html/bin/console scheduled-task:run --no-wait
```

Symfony scheduler variant (since 6.6, experimental) — run tasks inside a queue worker:

```bash
bin/console messenger:consume scheduler_shopware
```

On startup it reads intervals from the `scheduled_task` table (a row is optional). Restart the command after changing intervals. To deactivate a task here, set its status to `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskDefinition::STATUS_INACTIVE` (`'inactive'`) and restart the consumer.

## Essential identifiers

- `scheduled-task:run` (`--no-wait`), `scheduled-task:list`, `scheduled-task:schedule`, `scheduled-task:deactivate`
- `messenger:consume scheduler_shopware`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskDefinition::STATUS_INACTIVE`
- `scheduled_task` database table

## Gotchas

- Without a message queue worker, `scheduled-task:run` only enqueues; nothing executes.
- The symfony scheduler only picks up interval/status changes after the `consume` command restarts.
- The docs list `shopware.invalidate_cache` at 20 seconds; the installed `InvalidateCacheTask` default is 5 minutes.

## Version notes

- 6.5.5.0: `scheduled-task:list` and `--no-wait` available.
- 6.6: symfony scheduler (`scheduler_shopware`) support, experimental.
- 6.7.2.0: `scheduled-task:schedule` and `scheduled-task:deactivate` added.

## Code check (6.7.13.0)
- confirmed `scheduled-task:run` — runner command — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:19
- confirmed `--no-wait` — option "Do not wait for next cycle of scheduled tasks" — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:43
- confirmed `scheduled-task:list` — command exists — vendor/shopware/core/Framework/MessageQueue/Command/ListScheduledTaskCommand.php:16
- confirmed `scheduled-task:schedule` — command exists — vendor/shopware/core/Framework/MessageQueue/Command/ScheduleScheduledTaskCommand.php:17
- confirmed `scheduled-task:deactivate` — command exists — vendor/shopware/core/Framework/MessageQueue/Command/DeactivateScheduledTaskCommand.php:17
- confirmed `ScheduledTaskDefinition::STATUS_INACTIVE` — value 'inactive' — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTaskDefinition.php:31
- confirmed `scheduler.schedule_provider` — ScheduleProvider tagged with name `shopware` (transport `scheduler_shopware`) — vendor/shopware/core/Framework/DependencyInjection/scheduled-task.xml:40
- corrected `shopware.invalidate_cache` — docs: interval 20; code returns `self::MINUTELY * 5` — vendor/shopware/core/Framework/Adapter/Cache/InvalidateCacheTask.php:20
- confirmed `product_download.media.cleanup` — default interval 2628000 — vendor/shopware/core/Content/Product/Cleanup/CleanupUnusedDownloadMediaTask.php:13
- unverified `shopware.elasticsearch.create.alias` — task lives in the elasticsearch package, outside checked roots
