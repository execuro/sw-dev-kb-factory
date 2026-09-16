---
id: platform/dev/6.6/guides/hosting/infrastructure/message-queue.md
title: Message Queue
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/message-queue.html
sourceHash: febc5d06a1ea506844f777907f11ed5952a9e7db
keywords: ["message queue", "symfony messenger", "messenger:consume", "admin worker", "admin_worker", "enable_admin_worker", "MESSENGER_TRANSPORT_DSN", "MESSENGER_TRANSPORT_FAILURE_DSN", "messenger.bus.default", "AsyncMessageInterface", "routing_overwrite", "RabbitMQ"]
summary: "Covers CLI vs admin message queue workers, transports, failed-message handling, and shopware.messenger.routing_overwrite."
lastBuilt: 2026-09-15
---
## What it is
Explains how Shopware processes asynchronous tasks via the Symfony Messenger component, and how to move from the default browser-driven Administration worker to a CLI-based setup for production.

## When to use
Use it to configure message queue workers for production, to change the queue transport (e.g. to RabbitMQ), to route messages to specific transports, or to enable message-queued mail sending.

## Key steps / config
- By default, tasks are stored in the database and processed while a user is logged into the Administration (the "admin worker") — fine for development, not for production.
- Run CLI workers instead: `bin/console messenger:consume async --time-limit=60 --memory-limit=128M`, optionally targeting several transports for prioritization: `bin/console messenger:consume async low_priority`. Use a process manager (systemd/supervisor) or cron to keep workers running.
- Disable the admin worker once CLI workers are set up, in `config/packages/shopware.yaml`:
```yaml
shopware:
    admin_worker:
        enable_admin_worker: false
```
- If keeping the admin worker, configure it explicitly:
```yaml
shopware:
    admin_worker:
        enable_admin_worker: true
        poll_interval: 30
        transports: ["async", "low_priority"]
```
- Route mail sending through the queue in `config/packages/framework.yaml`:
```yaml
framework:
    mailer:
        message_bus: 'messenger.default_bus'
```
- Failed messages move to the failed transport (`MESSENGER_TRANSPORT_FAILURE_DSN`, Doctrine by default) and are retried automatically 3 times before being deleted.
- Transport env vars: `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`.
- All Shopware-handled messages must go through the `messenger.bus.default` service tag; custom buses can be configured in `framework.yaml` for external systems.
- Messages implementing `AsyncMessageInterface` route to the `async` transport by default; to overwrite (not just add to) that routing per message class, use `shopware.messenger.routing_overwrite` in `shopware.yaml` (added in Shopware 6.6.4.0 / 6.5.12.0).

## Essential identifiers
- `bin/console messenger:consume`
- `shopware.admin_worker.enable_admin_worker`, `poll_interval`, `transports`
- `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`
- `messenger.bus.default`
- `AsyncMessageInterface`
- `shopware.messenger.routing_overwrite`

## Gotchas
Cron-triggered workers don't enforce a maximum concurrent worker count the way supervisor does, risking too many workers running simultaneously when messages run long. Make sure the CLI worker also covers the failed queue, or failed messages are never retried.

## Version notes
`shopware.messenger.routing_overwrite` was added in Shopware 6.6.4.0 and 6.5.12.0.
