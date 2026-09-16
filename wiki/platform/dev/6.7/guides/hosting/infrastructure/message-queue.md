---
id: platform/dev/6.7/guides/hosting/infrastructure/message-queue.md
title: Message Queue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/message-queue.html
sourceHash: 95c64d136b674a1badd7f7cec65ead729459f0fe
codeCheckedAgainst: "6.7.13.0"
keywords: ["messenger:consume", "admin_worker", "enable_admin_worker", "MESSENGER_TRANSPORT_DSN", "MESSENGER_TRANSPORT_LOW_PRIORITY_DSN", "MESSENGER_TRANSPORT_FAILURE_DSN", "routing_overwrite", "AsyncMessageInterface", "messenger.bus.default", "symfony messenger", "cli worker", "rabbitmq", "failed messages", "systemd"]
summary: Running the Shopware 6.7 message queue in production - CLI workers vs admin worker, transport DSN env vars, failed transport, routing and routing_overwrite.
lastBuilt: 2026-09-15
---
## What it is

Shopware processes background tasks through Symfony Messenger. Out of the box messages are stored in the database (Doctrine transport) and consumed by the admin worker — browser polling while someone is logged into the Administration. This page covers moving consumption to CLI workers, swapping transports, and routing.

## When to use

Setting up a production system (admin worker causes CPU load with many admin users and stops when nobody is logged in), switching to a broker such as RabbitMQ, sending mails asynchronously, or re-routing specific message classes.

## Key steps / config

1. Run one or more CLI workers, restarted by systemd/supervisor (or cron, which does not limit concurrent workers):
   - `bin/console messenger:consume async --time-limit=60 --memory-limit=128M`
   - consume several transports in priority order: `bin/console messenger:consume async low_priority`
   - systemd: template unit `/etc/systemd/system/shopware_consumer@.service` with `ExecStart=php …/bin/console messenger:consume --time-limit=60 --memory-limit=512M async low_priority`, a `shopware_consumer.target`, then `systemctl enable shopware_consumer@{1..3}.service`, `systemctl enable shopware_consumer.target`, `systemctl start shopware_consumer.target`.
2. Disable the admin worker once CLI workers run:

```yaml
# config/packages/shopware.yaml
shopware:
    admin_worker:
        enable_admin_worker: false
```

   If you keep the admin worker, `shopware.admin_worker` also has `poll_interval` (installed default `20` seconds, must stay below PHP `max_execution_time`) and `transports` (installed default `["webhook", "async", "low_priority"]`).
3. Transports (defined in core `framework.yaml`) via env vars:
   - `MESSENGER_TRANSPORT_DSN` → `async` (default `doctrine://default?auto_setup=false`)
   - `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN` → `low_priority`
   - `MESSENGER_TRANSPORT_FAILURE_DSN` → `failed` (`failure_transport: failed`)
   - a `webhook` transport (`shopware-webhook://default`, no retries) also exists.
4. Async mails: `framework.mailer.message_bus: 'messenger.default_bus'` in `config/packages/framework.yaml`. Core routing already sends `Symfony\Component\Mailer\Messenger\SendEmailMessage` to `async`.
5. Routing in `framework.messenger.routing` by class name, a list of transports, or `'*'` as fallback. Core default routes `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` → `async` and `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` → `low_priority`. To replace (not add to) a route:

```yaml
shopware:
  messenger:
    routing_overwrite:
      'Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage': entity_indexing
```

6. Messages handled inside Shopware must go through the bus `messenger.bus.default`; custom buses (`framework.messenger.buses`, `default_bus`) are for external systems.

## Essential identifiers

- `bin/console messenger:consume`
- `shopware.admin_worker.enable_admin_worker`, `poll_interval`, `transports`
- `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`
- `shopware.messenger.routing_overwrite`
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`, `LowPriorityMessageInterface`
- `messenger.bus.default`

## Gotchas

- Also run a worker for the failed queue, otherwise failed messages are never processed.
- `async`/`low_priority` retry 3 times (delay 1000 ms, multiplier 2) before a message ends up in `failed`.
- Worker count depends on message mix: product indexing is slow; route heavy types to their own transport to limit workers or avoid DB locks.
- Without a configured transport, messages are handled synchronously.

## Version notes

- `shopware.messenger.routing_overwrite` exists since 6.6.4.0 and 6.5.12.0.

## Code check (6.7.13.0)
- confirmed `enable_admin_worker` — default true in shipped config — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:386
- corrected `poll_interval` — docs example: 30; installed default 20 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:390
- corrected `transports` — docs: ["async", "low_priority"]; installed default adds webhook first — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:392
- confirmed `MESSENGER_TRANSPORT_DSN` — Doctrine default DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `MESSENGER_TRANSPORT_FAILURE_DSN` — used by failed transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:66
- confirmed `max_retries` — 3 retries on async — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:71
- corrected `messenger.bus.default` — docs: a service tag; it is the bus id in framework config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:88
- confirmed `AsyncMessageInterface` — routed to async by default — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:94
- confirmed `routing_overwrite` — config node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1465
- confirmed `EntityIndexingMessage` — implements AsyncMessageInterface — vendor/shopware/core/Framework/DataAbstractionLayer/Indexing/EntityIndexingMessage.php:12
