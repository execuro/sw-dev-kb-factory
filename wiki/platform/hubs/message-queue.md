---
id: platform/hubs/message-queue.md
title: "Message queue"
summary: "Shopware message queue on Symfony Messenger: workers, transports, plugin handlers and middleware, PaaS RabbitMQ, scheduled tasks."
keywords: ["message queue", "symfony messenger", "messenger:consume", "admin worker", "routing_overwrite", "AsyncMessageInterface", "message handler", "middleware", "rabbitmq", "scheduled tasks", "MESSENGER_TRANSPORT_DSN", "low_priority"]
members: ["platform/dev/6.6/guides/hosting/infrastructure/_index.md", "platform/dev/6.6/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.6/guides/hosting/performance/performance-tweaks.md", "platform/dev/6.6/guides/plugins/plugins/framework/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/message-queue/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.6/products/paas/shopware-paas/rabbitmq.md", "platform/dev/6.7/concepts/framework/architecture/_index.md", "platform/dev/6.7/concepts/framework/messaging.md", "platform/dev/6.7/guides/development/testing/store/functionality-integration.md", "platform/dev/6.7/guides/hosting/infrastructure/_index.md", "platform/dev/6.7/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/execution/_index.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md", "platform/dev/6.7/products/paas/shopware-paas/rabbitmq.md", "platform/dev/6.7/products/paas/shopware/guides/message-queues.md", "platform/dev/6.7/products/paas/shopware/known-issues.md", "platform/dev/6.7/snippets/guide/debugging_scheduled_tasks.md", "platform/func/settings/storefront-configuration.md", "platform/func/tutorials-and-faq/message-queue-and-scheduled-tasks.md", "platform/func/tutorials-and-faq/migration-tips.md"]
lastBuilt: 2026-10-21
---

# Message queue

Shopware runs asynchronous work (mail sending, indexing, sitemap generation, imports, scheduled tasks) through Symfony Messenger. This hub covers the three sides of that: running workers and configuring transports in hosting, writing messages, handlers and middleware in plugins, and platform-specific setups such as RabbitMQ on PaaS. Come here when you need to know how a message gets dispatched, routed (`routing_overwrite`) and consumed (`messenger:consume`, admin worker) without grepping several guides.

## Developer 6.6

- [Infrastructure](platform/dev/6.6/guides/hosting/infrastructure/_index.md) — index of hosting components, including the queue.
- [Message Queue](platform/dev/6.6/guides/hosting/infrastructure/message-queue.md) — CLI vs admin workers, transports, failed messages, `shopware.messenger.routing_overwrite`.
- [Performance Tweaks](platform/dev/6.6/guides/hosting/performance/performance-tweaks.md) — production tuning keys and env vars; queue is one of several topics.
- [Framework](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) — landing page for plugin framework guides.
- [Message Queue](platform/dev/6.6/guides/plugins/plugins/framework/message-queue/_index.md) — overview of handlers, queue and middleware.
- [Add message handler](platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.md) — `#[AsMessageHandler]` handler.
- [Add message to queue](platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md) — message class and dispatch, async and low-priority routing.
- [RabbitMQ](platform/dev/6.6/products/paas/shopware-paas/rabbitmq.md) — RabbitMQ on Shopware PaaS, disabling for an SQL-backed queue.

## Developer 6.7

Concepts and testing:

- [Architecture](platform/dev/6.7/concepts/framework/architecture/_index.md) — architecture overview; queues and scheduled tasks as one part.
- [Messaging](platform/dev/6.7/concepts/framework/messaging.md) — `messenger.default_bus`, middleware, handlers, envelopes, stamps, transports, consuming.
- [Functionality and integration](platform/dev/6.7/guides/development/testing/store/functionality-integration.md) — store review rules incl. the 256 KB queue message limit.

Hosting:

- [Infrastructure](platform/dev/6.7/guides/hosting/infrastructure/_index.md) — hosting infrastructure overview.
- [Message Queue](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md) — production workers, admin worker config, transport DSN env vars, `routing_overwrite`.
- [Debugging Scheduled Tasks](platform/dev/6.7/snippets/guide/debugging_scheduled_tasks.md) — `scheduled-task:run-single` and related commands.

Plugins:

- [Framework](platform/dev/6.7/guides/plugins/plugins/framework/_index.md) — framework guide index.
- [Message Queue](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md) — section index.
- [Add Message Handler](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md) — handler with `AsMessageHandler` and `__invoke`.
- [Add Message to Queue](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md) — `AsyncMessageInterface`, `LowPriorityMessageInterface`, dispatch via `MessageBusInterface`.
- [Add Middleware](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md) — custom `MiddlewareInterface` under `messenger.bus.default`.

PaaS and extensions:

- [RabbitMQ](platform/dev/6.7/products/paas/shopware-paas/rabbitmq.md) — disabling the default RabbitMQ service on PaaS.
- [Split message queues](platform/dev/6.7/products/paas/shopware/guides/message-queues.md) — extra transports on PaaS Native in `paas_messenger.yaml`.
- [Known issues](platform/dev/6.7/products/paas/shopware/known-issues.md) — PaaS Native queue size limit and other issues.
- [Concept](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md) — B2B Suite migration processed through the queue.
- [Execution](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/_index.md) — running that migration with a queue worker.
- [Prerequisites](platform/dev/6.7/products/extensions/b2b-suite-migration/execution/prerequisites.md) — backup, worker and version requirements.

The 6.6 and 6.7 hosting and plugin pages cover the same topics; 6.7 adds the `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN` variable and the middleware guide.

## Merchant and functional docs

- [Storefront Configuration](platform/func/settings/storefront-configuration.md) — background theme compilation and other performance toggles.
- [Message Queue And Scheduled Tasks](platform/func/tutorials-and-faq/message-queue-and-scheduled-tasks.md) — how the queue and scheduled tasks work, switching from admin worker to CLI worker.
- [Migration Tips](platform/func/tutorials-and-faq/migration-tips.md) — migration troubleshooting incl. message queue reset.
