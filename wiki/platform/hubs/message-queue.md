---
id: platform/hubs/message-queue.md
title: message queue
summary: "How Shopware queues and processes async work: Messenger handlers/middleware, hosting/PaaS RabbitMQ, tuning, and scheduled tasks."
keywords: ["message queue", "symfony messenger", "message handler", "messenger middleware", "async processing", "scheduled tasks", "admin worker", "rabbitmq", "hosting infrastructure", "performance tuning", "migration", "paas"]
members: ["platform/dev/6.6/guides/hosting/infrastructure/_index.md", "platform/dev/6.6/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.6/guides/hosting/performance/performance-tweaks.md", "platform/dev/6.6/guides/plugins/plugins/framework/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/message-queue/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.6/products/paas/shopware-paas/rabbitmq.md", "platform/dev/6.7/concepts/framework/architecture/_index.md", "platform/dev/6.7/concepts/framework/messaging.md", "platform/dev/6.7/guides/hosting/infrastructure/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md", "platform/dev/6.7/products/extensions/migration-assistant/concept/migration-process.md", "platform/dev/6.7/products/paas/shopware-paas/rabbitmq.md", "platform/dev/6.7/snippets/guide/debugging_scheduled_tasks.md", "platform/func/settings/storefront-configuration.md", "platform/func/tutorials-and-faq/message-queue-and-scheduled-tasks.md", "platform/func/tutorials-and-faq/migration-tips.md"]
lastBuilt: 2026-09-15
---

Shopware runs background work — sending mail, indexing products, generating sitemaps, and running third-party migrations — through an asynchronous message queue built on Symfony Messenger. Come to this hub instead of grepping directly when you need to decide between the CLI worker and the Admin Worker, write a message class and handler, add custom middleware, size/tune the queue for production, or trace how a specific feature (scheduled tasks, PaaS RabbitMQ, migrations) uses the queue.

Concepts and architecture:
- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) — where the message queue and scheduled tasks fit in Shopware's Core/Storefront/Administration, API-first architecture.
- [Messaging](platform/dev/6.7/concepts/framework/messaging.md) — the messenger.default_bus concept: middleware, handlers, envelopes/stamps, transports, CLI and API consumers.

Hosting infrastructure (near-duplicate pages per version, kept separate since each targets its own release):
- [Infrastructure (6.6)](platform/dev/6.6/guides/hosting/infrastructure/_index.md) / [Infrastructure (6.7)](platform/dev/6.7/guides/hosting/infrastructure/_index.md) — index of hosting components including the queue, search, database, filesystem, rate limiter, proxy.
- [Message Queue (6.6)](platform/dev/6.6/guides/hosting/infrastructure/message-queue.md) — CLI vs admin workers, transports, failed-message handling, shopware.messenger.routing_overwrite.
- [Performance Tweaks (6.6)](platform/dev/6.6/guides/hosting/performance/performance-tweaks.md) — config keys/env vars touching the queue alongside HTTP cache, DB, mail, locks, opcache.

Plugin framework guide to the queue (6.6 and 6.7 versions of the same guide set — same steps, versioned separately):
- [Framework (6.6)](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) / [Framework (6.7)](platform/dev/6.7/guides/plugins/plugins/framework/_index.md) — landing pages for the framework extension points, including message queue.
- [Message Queue overview (6.6)](platform/dev/6.6/guides/plugins/plugins/framework/message-queue/_index.md) / [(6.7)](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md) — message handlers, the queue, and middleware, for async background tasks.
- [Add message handler (6.6)](platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.md) / [(6.7)](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md) — class with `#[AsMessageHandler]`, tagged `messenger.message_handler`, `__invoke`.
- [Add message to queue (6.6)](platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md) / [(6.7)](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md) — message class implementing `AsyncMessageInterface`/`LowPriorityMessageInterface`, dispatch via `MessageBusInterface`.
- [Add middleware (6.7 only)](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md) — custom `MiddlewareInterface`, registered under `messenger.bus.default` in `framework.yaml`.

PaaS/hosting backend (near-duplicate pages per version):
- [RabbitMQ (6.6)](platform/dev/6.6/products/paas/shopware-paas/rabbitmq.md) / [RabbitMQ (6.7)](platform/dev/6.7/products/paas/shopware-paas/rabbitmq.md) — RabbitMQ ships enabled by default on Shopware PaaS; disable it in `.platform/services.yaml`/`.platform.app.yaml` to fall back to an SQL-backed queue.

Migrations that run over the queue (6.7):
- [B2B Suite migration concept](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md) — sequential, message-queue-driven migration with tracking tables and XML field mappings.
- [Running Migration](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/running-migration.md) — `b2b:migrate:commercial`/`b2b:migrate:progress` commands, `--batch-size`, `--watch`.
- [Migration Process](platform/dev/6.7/products/extensions/migration-assistant/concept/migration-process.md) — SwagMigrationAssistant's `MigrationProcessMessage` run flow and `swag_migration_*` tables.
- [Debugging Scheduled Tasks](platform/dev/6.7/snippets/guide/debugging_scheduled_tasks.md) — running a scheduled task without the queue via `scheduled-task:run-single`, or scheduling/deactivating one.

Merchant/operations docs:
- [Storefront Configuration](platform/func/settings/storefront-configuration.md) — Settings > System > Storefront toggles including background theme compilation, which is queued.
- [Message Queue And Scheduled Tasks](platform/func/tutorials-and-faq/message-queue-and-scheduled-tasks.md) — how the Admin Worker and CLI worker relate, and how to disable the Admin Worker.
- [Migration Tips](platform/func/tutorials-and-faq/migration-tips.md) — troubleshooting stuck indexing/migration via `dead_message`, `message_queue_stats`, and re-transferring entities.
