---
id: platform/dev/6.7/guides/hosting/infrastructure/message-queue.md
title: Message Queue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/message-queue.html
sourceHash: 0906a43f5a6d3a65a9cf9815d3882f15169dcb83
codeCheckedAgainst: "6.7.15.1"
keywords: ["message queue", "messenger:consume", "admin_worker", "enable_admin_worker", "MESSENGER_TRANSPORT_DSN", "MESSENGER_TRANSPORT_LOW_PRIORITY_DSN", "MESSENGER_TRANSPORT_FAILURE_DSN", "routing_overwrite", "AsyncMessageInterface", "messenger.bus.default", "symfony messenger", "cli worker", "rabbitmq", "systemd consumer"]
summary: Running Shopware's Symfony Messenger queue in production - CLI workers, admin worker config, transport DSN env vars, routing and routing_overwrite.
lastBuilt: 2026-10-21
---
## What it is

Shopware processes asynchronous tasks through the Symfony Messenger component. By default messages are stored in the database (Doctrine transport) and consumed by the browser-based admin worker while someone is logged into the Administration. This page covers moving consumption to CLI workers, switching transports, routing messages and the related `shopware.yaml` options.

## When to use

- Preparing a production system: the admin worker causes high CPU load with several admin users and only runs while someone is logged in.
- Moving the queue off the database to a dedicated broker such as RabbitMQ.
- Routing specific message classes to their own transport (e.g. to limit workers for indexing or prioritise mails).

## Key steps / config

1. Run one or more CLI workers, kept alive by systemd or supervisor (a cron job cannot cap the number of running workers):
   - `bin/console messenger:consume async --time-limit=60 --memory-limit=128M`
   - Multiple transports in priority order: `bin/console messenger:consume async low_priority`
   - Options: `bin/console messenger:consume -h`
   - systemd: template unit `/etc/systemd/system/shopware_consumer@.service` (`ExecStart=php /var/www/html/bin/console messenger:consume --time-limit=60 --memory-limit=512M async low_priority`, `Restart=always`) plus `/etc/systemd/system/shopware_consumer.target`; then `systemctl enable shopware_consumer@{1..3}.service`, `systemctl enable shopware_consumer.target`, `systemctl start shopware_consumer.target`.
2. Disable the admin worker once CLI workers run:
   ```yaml
   # config/packages/shopware.yaml
   shopware:
       admin_worker:
           enable_admin_worker: false
   ```
   If you keep it, `poll_interval` (seconds, core default `20`, must stay below PHP `max_execution_time`) and `transports` (core default `["webhook", "async", "low_priority"]`) are configurable under `shopware.admin_worker`.
3. Send mails via the queue (core default is synchronous, `message_bus: false`):
   ```yaml
   # config/packages/framework.yaml
   framework:
       mailer:
           message_bus: 'messenger.default_bus'
   ```
4. Transports are set by env vars (core defaults are Doctrine DSNs with `auto_setup=false`):
   - `MESSENGER_TRANSPORT_DSN` → `async` transport
   - `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN` → `low_priority` (`queue_name=low_priority`)
   - `MESSENGER_TRANSPORT_FAILURE_DSN` → `failed` (`queue_name=failed`)
5. Route messages by class in `framework.messenger.routing` (`'*'` as fallback, a list sends to several transports). To replace, not extend, an existing route:
   ```yaml
   shopware:
     messenger:
       routing_overwrite:
         'Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage': entity_indexing
   ```

## Essential identifiers

- `bin/console messenger:consume`
- `shopware.admin_worker.enable_admin_worker`, `shopware.admin_worker.poll_interval`, `shopware.admin_worker.transports`
- `shopware.messenger.routing_overwrite`
- `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` (routed to `async`), `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` (routed to `low_priority`)
- `messenger.bus.default` — the bus Shopware handlers run on; mandatory for messages handled inside Shopware.

## Gotchas

- Run a CLI worker for the `failed` transport too, otherwise failed messages are never processed.
- `async` and `low_priority` retry 3 times (delay 1000 ms, multiplier 2) before a message goes to the failure transport.
- Cron-started workers can pile up when messages run past the time limit; a worker always finishes its current message first.
- Product indexing messages are slow; monitor the queue and size workers accordingly, or route them to their own transport.
- Without any transport configured, messages are handled synchronously.

## Version notes

- `shopware.messenger.routing_overwrite` exists since 6.6.4.0 and 6.5.12.0.

## Code check (6.7.15.1)
- confirmed `admin_worker.enable_admin_worker` — boolean, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:263
- confirmed `admin_worker.poll_interval` — integer, default 20 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:260
- corrected `admin_worker.transports` — docs: ["async", "low_priority"]; core default lists webhook first — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:422
- confirmed `messenger.routing_overwrite` — map of class to transport — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1510
- confirmed `MESSENGER_TRANSPORT_DSN` — default Doctrine DSN for async — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN` — low_priority transport DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:4
- confirmed `MESSENGER_TRANSPORT_FAILURE_DSN` — failed transport DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:5
- confirmed `AsyncMessageInterface` — routed to async by default — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:96
- confirmed `messenger.bus.default` — Shopware bus with QueuedTimeMiddleware — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:90
- confirmed `mailer.message_bus` — false by default, mails sent synchronously — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:36
