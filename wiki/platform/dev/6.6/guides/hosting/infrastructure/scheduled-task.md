---
id: platform/dev/6.6/guides/hosting/infrastructure/scheduled-task.md
title: Scheduled Task
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/scheduled-task.html
sourceHash: 5f77780cd378720ed9adf8a5c156b2b364feeb68
keywords: ["scheduled task", "scheduled-task:list", "scheduled-task:run", "no-wait", "messenger:consume scheduler_shopware", "ScheduledTaskDefinition", "STATUS_INACTIVE", "shopware.elasticsearch.create.alias", "shopware.invalidate_cache", "background jobs", "cron", "symfony scheduler"]
summary: "Documents default scheduled tasks, scheduled-task:list/run --no-wait, and the experimental Symfony Scheduler execution."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/guides/hosting/infrastructure/message-queue.md"]
---
## What it is
Documents Shopware's scheduled task system, which queues recurring background jobs (cleanup, updates, indexing) at defined intervals.

## When to use
Use it to list, run, or configure scheduled tasks in production, or to switch to the Symfony Scheduler-based execution model.

## Key steps / config
Default tasks include `log_entry.cleanup` (86400s), `shopware.invalidate_cache` (20s), `app_update`/`app_delete` (86400s), `version.cleanup` (86400s), `webhook_event_log.cleanup` (86400s), `sales_channel_context.cleanup` (86400s), `product_keyword_dictionary.cleanup` (604800s), `product_download.media.cleanup` (2628000s), `delete_newsletter_recipient_task` (86400s), `product_stream.mapping.update` (86400s), `product_export_generate_task` (60s), `import_export_file.cleanup` (86400s), `shopware.sitemap_generate` (86400s), `cart.cleanup` (86400s), and `shopware.elasticsearch.create.alias` (300s, only runs when Elasticsearch is configured).

- List all tasks: `bin/console scheduled-task:list`.
- Run tasks with a background [message queue](platform/dev/6.6/guides/hosting/infrastructure/message-queue.md) worker and `bin/console scheduled-task:run`, which schedules due tasks to the queue and waits. Use `--no-wait` (since Shopware 6.5.5.0) to run it once from a cron entry, e.g. every 5 minutes:
```bash
*/5 * * * * /usr/bin/php /var/www/html/bin/console scheduled-task:run --no-wait
```
- Alternative (experimental, since Shopware 6.6): run tasks as part of queue workers via the Symfony Scheduler:
```bash
bin/console messenger:consume scheduler_shopware
```
This command reads the `scheduled_task` table on startup and applies stored intervals; changing intervals in the database requires restarting the command. Deactivate a task by setting its status to `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskDefinition::STATUS_INACTIVE` and restarting the consumer.

## Essential identifiers
- `bin/console scheduled-task:list`
- `bin/console scheduled-task:run --no-wait`
- `bin/console messenger:consume scheduler_shopware`
- `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskDefinition::STATUS_INACTIVE`
- `shopware.elasticsearch.create.alias`, `shopware.invalidate_cache`

## Gotchas
`shopware.elasticsearch.create.alias` and `shopware.invalidate_cache` only run when actually necessary (the former only when Elasticsearch is configured and enabled).

## Version notes
`--no-wait` and related flags are available since Shopware 6.5.5.0. Running scheduled tasks via the Symfony Scheduler is available (experimentally) since Shopware 6.6.
