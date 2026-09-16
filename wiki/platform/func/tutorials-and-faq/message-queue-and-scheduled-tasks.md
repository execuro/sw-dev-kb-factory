---
id: platform/func/tutorials-and-faq/message-queue-and-scheduled-tasks.md
title: Message Queue And Scheduled Tasks
docType: functional
version: "6.5"
versions: ["6.5"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/message-queue-and-scheduled-tasks
sourceHash: 490375c5f969f38e32f26c6f8233013ef01f00e6bc23f2f540dac836168905b5
revision: {current: true, range: "6.5.0.0 - 6.5.6.1", swMax: "6.5.6.1", swMin: "6.5.0.0"}
keywords: ["message queue", "scheduled tasks", "admin worker", "CLI worker", "messenger:consume", "scheduled-task:run", "enable_admin_worker", "z-shopware.yaml", "cron job", "async processing", "log_entry.cleanup", "cart.cleanup"]
summary: "How Shopware's async message queue and scheduled tasks work, and how to disable the Admin Worker in favor of a server-side CLI worker."
lastBuilt: "2026-09-15"
---
## What it is
Explains asynchronous task processing in Shopware 6 via the message queue and scheduled tasks, and how to run these server-side via a CLI worker instead of the browser-based Admin Worker.

## When to use
When configuring background processing for production, disabling the Admin Worker to reduce CPU load, or diagnosing why scheduled/queued tasks are not running.

## Key steps / config
- Scheduled tasks add jobs to the message queue at fixed intervals (asynchronous processing). Examples: `log_entry.cleanup` (86400s), `shopware.invalidate_cache` (20s, on-demand), `app_update` (86400s), `app_delete` (86400s), `version.cleanup` (86400s), `webhook_event_log.cleanup` (86400s), `sales_channel_context.cleanup` (86400s), `product_keyword_dictionary.cleanup` (604800s), `product_download.media.cleanup` (2628000s), `delete_newsletter_recipient_task` (86400s), `product_stream.mapping.update` (86400s), `product_export_generate_task` (60s), `import_export_file.cleanup` (86400s), `shopware.sitemap_generate` (86400s), `cart.cleanup` (86400s, deletes carts older than `shopware.cart.expire_days`, default 120 days), `shopware.elasticsearch.create.alias` (300s, on-demand, only when Elasticsearch is configured).
- Admin Worker: processes queue tasks via the browser while logged into the Administration; simple but not recommended for production (requires the admin to stay open; many concurrent admin users can cause high CPU load).
- CLI Worker: a server-side service for background jobs, can be scheduled as cron jobs.
- To disable the Admin Worker, edit `config/packages/z-shopware.yaml` (create it if missing, for update-safety):
```yaml
# config/packages/shopware.yaml
shopware:
    admin_worker:
        enable_admin_worker: false
```
- Run the message queue via CLI: `bin/console messenger:consume async low_priority --time-limit=60` (the old `default` value no longer works as of Shopware 6.5).
- Run scheduled tasks via CLI: `bin/console scheduled-task:run --time-limit=60`. A `--memory-limit=512M` parameter can be used instead of or alongside the time limit.
- Set up either command as a recurring cron job or as a server-side service so the queue is processed continuously.

## Essential identifiers
Config key: `shopware.admin_worker.enable_admin_worker`. File: `config/packages/z-shopware.yaml`. Commands: `bin/console messenger:consume async low_priority --time-limit=60`, `bin/console scheduled-task:run --time-limit=60`.

## Gotchas
As of Shopware 6.5, the message-queue CLI command using the transport value `default` fails — use `async low_priority` instead.

## Version notes
This article's `messenger:consume`/`scheduled-task:run` guidance and the `default` transport deprecation apply from Shopware 6.5.0.0 through 6.5.6.1.
