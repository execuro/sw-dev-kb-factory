---
id: platform/dev/6.7/resources/references/adr/2026-04-14-webhook-outbox-transport.md
title: Webhook outbox transport
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-14-webhook-outbox-transport.html
sourceHash: 570ff7e52e9b61ac894c06b71f19d5ff104a1132
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-webhook://default", "WEBHOOKS_REWORK", "WebhookEventMessage", "WebhookTransport", "MySQLWebhookReceiver", "WebhookDeliveryService", "X-Shopware-Event-Id", "X-Shopware-Sequence", "X-Shopware-Attempt", "webhook_delivery", "webhook_stream", "outbox", "webhook retry", "messenger:consume webhook"]
summary: "ADR: dedicated shopware-webhook:// Messenger transport with MySQL outbox, per-app best-effort FIFO, 5s-4h retries; behind WEBHOOKS_REWORK flag."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-04-14, area framework) moving webhook delivery off the shared `async` Messenger transport onto a dedicated transport `shopware-webhook://` backed by a MySQL application-level outbox. Phase 1 (this ADR, implemented via shopware/shopware#16692) ships the transport, Shopware-owned retries, per-app best-effort FIFO and consumer headers. Phases 2 and 3 are roadmap only.

## When to use

- Operating a shop that enables the `WEBHOOKS_REWORK` feature flag (worker command, rollback).
- Building an app backend that consumes Shopware webhooks and must handle duplicates and out-of-order retries.
- Understanding webhook retry timing and why it no longer depends on the configured Messenger backend.

## Key steps / config

Before: webhooks shared `async` with imports, mail and indexing (no ordering, workers race), and retry was Messenger's `max_retries: 3`, `delay: 1000`, `multiplier: 2` (1s -> 2s -> 4s), varying by backend (Doctrine, Redis, AMQP, SQS).

Installed Messenger config (`framework.yaml`):

```yaml
transports:
    webhook:
        dsn: 'shopware-webhook://default'
        retry_strategy:
            max_retries: 0
routing:
    'Shopware\Core\Framework\Webhook\Message\WebhookEventMessage': webhook
```

Behaviour:

- Both paths persist before HTTP: async writes `QUEUED` via `WebhookTransport::send`; the sync path (admin worker / app lifecycle) writes `RUNNING`, then sends the batch. Both converge on `handleResult` -> `markSuccess` / `markPendingRetry` / `markFailed`.
- `MySQLWebhookReceiver` claims a partition lease on `webhook_stream` with `SKIP LOCKED`, delivers in `webhook_delivery.id` order, then rotates. HTTP runs outside the lock; leases are heartbeated.
- A failure moves to `PENDING_RETRY` with `next_retry_at`; the partition keeps progressing. Stale `RUNNING` rows are reset by the next claim.
- Retry schedule, owned by the outbox: 5s -> 30s -> 5min -> 30min -> 4h, then `FAILED`. No dead-letter queue, no Messenger retry stamps.
- Default partition key `xxh128(app_name)`, one stream per app.

Enabling the flag: add `webhook` to the worker command, e.g. `bin/console messenger:consume webhook async`. There is no automatic bridge. With the flag off, `WebhookTransport` still records the outbox entry and forwards the envelope to `async`.

Schema: `webhook_delivery` (hot queue; `id` = global `AUTO_INCREMENT` sequence; `webhook_event_log_id`, `partition_key`, `delivery_status`, `execution_count`, `next_retry_at`), `webhook_stream` (lease: `partition_key`, `locked_by`, `lock_expires_at`), plus `sequence` on `webhook_event_log` (audit trail).

Consumer headers:

| Header | Meaning |
|---|---|
| `X-Shopware-Event-Id` | Stable across retries; the only idempotency key |
| `X-Shopware-Sequence` | Global monotonic counter for last-write-wins; gaps are normal |
| `X-Shopware-Attempt` | 0-indexed attempt; never part of the dedupe key |

During transition `WebhookEventMessageHandler` serves both `async` and `webhook`; legacy rows without an outbox entry run in legacy mode.

## Essential identifiers

- DSN `shopware-webhook://default`, transport `webhook`, flag `WEBHOOKS_REWORK`
- `WebhookEventMessage`, `WebhookEventMessageHandler`
- `WebhookTransport`, `WebhookTransportFactory`, `MySQLWebhookReceiver`
- `WebhookOutboxStore`, `StreamLockService`, `RetryDelayCalculator`
- `WebhookDeliveryService::process()`, `WebhookDeliveryService::deliver()`
- Tables `webhook_delivery`, `webhook_stream`, `webhook_event_log`

## Gotchas

- Delivery is at-least-once and only best-effort FIFO: a retry may arrive after newer messages. Deduplicate by `X-Shopware-Event-Id`, reorder by `X-Shopware-Sequence`.
- The outbox is application-level, not transactional: a crash between business commit and outbox write loses the event.
- Multi-writer MySQL (Galera, Aurora Multi-Master) yields sequences not monotonic in wall-clock order.
- Legacy `disable_on_threshold` (shared `error_count` in `RetryWebhookMessageFailedSubscriber`) stays as a Phase 1 stopgap.
- Rollback: turn `WEBHOOKS_REWORK` off, then run `bin/console webhook:drain-to-async` to requeue non-terminal `webhook_delivery` rows on `async`; it refuses to run while the flag is on. In 6.7.15.1 this command is deprecated and is removed with the flag in v6.8.0.
- The pre-rework sync path `callWebhooksSynchronous()` (fire-and-forget Guzzle pool) is deprecated for v6.8.0.

## Version notes

`WEBHOOKS_REWORK` defaults to `false` in 6.7.15.1. Phase 2 (roadmap): endpoint health states HEALTHY/DEGRADED/SUSPENDED/DISABLED, `ErrorClassifier`, custom partition keys via `PartitionAwareHookable`. Phase 3: replay API, parallel delivery, external FIFO broker.

## Code check (6.7.15.1)
- confirmed `shopware-webhook://default` — webhook transport DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:86
- confirmed `Shopware\Core\Framework\Webhook\Message\WebhookEventMessage` — routed to the webhook transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:95
- confirmed `WEBHOOKS_REWORK` — feature flag, default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:104
- confirmed `RetryDelayCalculator::RETRY_DELAYS_IN_SECONDS` — 5, 30, 300, 1800, 14400 — vendor/shopware/core/Framework/Webhook/Outbox/RetryDelayCalculator.php:17
- confirmed `WebhookDeliveryService::HEADER_EVENT_ID` — X-Shopware-Event-Id, plus sequence and attempt headers — vendor/shopware/core/Framework/Webhook/Service/WebhookDeliveryService.php:26
- confirmed `WebhookTransport::send()` — persists outbox entry, forwards to async when flag is off — vendor/shopware/core/Framework/Webhook/Transport/WebhookTransport.php:34
- confirmed `MySQLWebhookReceiver` — partition claim via SKIP LOCKED — vendor/shopware/core/Framework/Webhook/Transport/MySQLWebhookReceiver.php:37
- confirmed `webhook_delivery` — created by transport tables migration — vendor/shopware/core/Migration/V6_7/Migration1775570251AddWebhookTransportTables.php:35
- deprecated `webhook:drain-to-async` — removed with WEBHOOKS_REWORK in v6.8.0 — vendor/shopware/core/Framework/Webhook/Command/WebhookDrainToAsyncCommand.php:74
- deprecated `WebhookManager::callWebhooksSynchronous()` — pre-rework path, removed in v6.8.0 — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:181
