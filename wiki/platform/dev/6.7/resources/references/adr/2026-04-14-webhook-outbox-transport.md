---
id: platform/dev/6.7/resources/references/adr/2026-04-14-webhook-outbox-transport.md
title: Webhook outbox transport
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-14-webhook-outbox-transport.html
sourceHash: 570ff7e52e9b61ac894c06b71f19d5ff104a1132
codeCheckedAgainst: "6.7.13.0"
keywords: ["webhook outbox", "WEBHOOKS_REWORK", "shopware-webhook://default", "WebhookEventMessage", "WebhookTransport", "MySQLWebhookReceiver", "WebhookDeliveryService", "webhook_delivery", "webhook_stream", "X-Shopware-Event-Id", "X-Shopware-Sequence", "X-Shopware-Attempt", "webhook retry", "messenger:consume webhook", "fifo delivery"]
summary: "ADR: webhooks get a dedicated shopware-webhook:// Messenger transport with MySQL outbox, per-app FIFO, 5s-4h retries, behind WEBHOOKS_REWORK."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-04-14) moving webhook delivery off the shared `async` Symfony Messenger transport onto a dedicated transport `shopware-webhook://` backed by a MySQL application-level outbox with best-effort FIFO delivery per app. Phase 1 (transport foundation) ships behind the `WEBHOOKS_REWORK` feature flag; Phase 2 (endpoint health, error classification, custom partition keys) and Phase 3 (replay API, batching, external FIFO brokers) are roadmap only.

## When to use

- Operating a shop that enables `WEBHOOKS_REWORK` (worker invocation and rollback change).
- Building an app that consumes webhooks and must handle at-least-once, possibly out-of-order delivery.
- Debugging webhook retry timing or the `webhook_delivery` / `webhook_stream` tables.

## Key steps / config

Messenger config shipped in core (skeleton):

```yaml
framework:
  messenger:
    transports:
      webhook:
        dsn: 'shopware-webhook://default'
        retry_strategy:
          max_retries: 0
    routing:
      'Shopware\Core\Framework\Webhook\Message\WebhookEventMessage': webhook
```

1. `WebhookEventMessage` always routes to the `webhook` transport. `WebhookTransport::send()` persists the outbox entry first; with the flag off it also forwards the envelope to `async` (legacy behaviour), with the flag on the outbox is the queue and `MySQLWebhookReceiver` consumes it.
2. Enable `WEBHOOKS_REWORK` (default off, experimental) to let the outbox own the lifecycle.
3. With the flag on, add the transport to the worker: `messenger:consume webhook async`. There is no automatic bridge; a `ConsoleEvents::COMMAND` subscriber was rejected because `Command::run()` re-binds input after the event.
4. Both paths persist before HTTP: async writes `QUEUED` via `WebhookTransport::send`; sync (admin worker / app lifecycle) writes `RUNNING` via `recordInflightOutboxEntry`. Both converge on `handleResult` → `markSuccess` / `markPendingRetry` / `markFailed`.
5. Retry is owned by the outbox: failures move to `PENDING_RETRY` with `next_retry_at`, fixed schedule 5s → 30s → 5 min → 30 min → 4 h.
6. Workers lease a partition (`SKIP LOCKED` on `webhook_stream`), deliver in `webhook_delivery.id` order, then rotate; HTTP runs outside the lock. Stale `RUNNING` rows are reset to `PENDING_RETRY` by the next claim.

State machine: `QUEUED → RUNNING → SUCCESS | PENDING_RETRY | FAILED`; `PENDING_RETRY → RUNNING` when `next_retry_at ≤ NOW()`.

Schema: new tables `webhook_delivery` (hot queue; `id` auto-increment = global sequence; `webhook_event_log_id`, `partition_key`, `delivery_status`, `execution_count`, `next_retry_at`) and `webhook_stream` (`partition_key`, `locked_by`, `lock_expires_at`), plus a `sequence` column on `webhook_event_log`. Default partition key is `xxh128(app_name)`.

| Header | Use |
|---|---|
| `X-Shopware-Event-Id` | Sole dedupe key, stable across retries |
| `X-Shopware-Sequence` | Global monotonic counter for last-write-wins reordering |
| `X-Shopware-Attempt` | 0-indexed attempt; never part of the dedupe key |

## Essential identifiers

- `Shopware\Core\Framework\Webhook\Message\WebhookEventMessage`
- `Shopware\Core\Framework\Webhook\Transport\WebhookTransport`, `WebhookTransportFactory`, `MySQLWebhookReceiver`
- `Shopware\Core\Framework\Webhook\Service\WebhookDeliveryService` (`process()`, `deliver()`, `deliverBatch()`)
- `Shopware\Core\Framework\Webhook\Outbox\WebhookOutboxStore`, `StreamLockService`, `RetryDelayCalculator`
- `WebhookEventMessageHandler`, `RetryWebhookMessageFailedSubscriber`
- Feature flag `WEBHOOKS_REWORK`; tables `webhook_delivery`, `webhook_stream`, `webhook_event_log`

## Gotchas

- Sequence numbers are global across all webhooks; gaps are normal. Retries may arrive after newer messages, so ordering is best-effort.
- The outbox is application-level, not transactional: a crash strictly between the business commit and the outbox write loses the event.
- Legacy `disable_on_threshold` (disable after 10 cumulative errors, shared across related webhooks) is retained in Phase 1.
- Rollback: flip `WEBHOOKS_REWORK` off, then run `bin/console webhook:drain-to-async` to re-publish non-terminal `webhook_delivery` rows onto `async` (refuses to run while the flag is active; at-least-once on re-run). The command is marked `@deprecated tag:v6.8.0`.

## Version notes

- Phase 1 merged via shopware/shopware PR #16692; present in 6.7.13.0 as an experimental, major feature flag.
- Pre-rework paths in `WebhookManager`, `WebhookOutboxStore` and the drain command are deprecated for removal with the flag in 6.8.

## Code check (6.7.13.0)
- confirmed `webhook.dsn` — transport DSN `shopware-webhook://default` with `max_retries: 0` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:84
- confirmed `WebhookEventMessage` — routed to `webhook` transport unconditionally — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:93
- confirmed `WEBHOOKS_REWORK` — feature flag, default false, major true — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:104
- confirmed `WebhookTransport::send()` — persists outbox entry, forwards to async when flag off — vendor/shopware/core/Framework/Webhook/Transport/WebhookTransport.php:34
- confirmed `MySQLWebhookReceiver` — implements KeepaliveReceiverInterface — vendor/shopware/core/Framework/Webhook/Transport/MySQLWebhookReceiver.php:37
- confirmed `RetryDelayCalculator::RETRY_DELAYS_IN_SECONDS` — `[5, 30, 300, 1800, 14400]` — vendor/shopware/core/Framework/Webhook/Outbox/RetryDelayCalculator.php:17
- confirmed `WebhookDeliveryService::HEADER_EVENT_ID` — `X-Shopware-Event-Id`, plus sequence and attempt headers — vendor/shopware/core/Framework/Webhook/Service/WebhookDeliveryService.php:24
- confirmed `webhook_delivery` — created by Migration1775570251AddWebhookTransportTables — vendor/shopware/core/Migration/V6_7/Migration1775570251AddWebhookTransportTables.php:35
- confirmed `WebhookFailureStrategy::DisableOnThreshold` — `disable_on_threshold`, MAX_ERROR_COUNT 10 — vendor/shopware/core/Framework/Webhook/WebhookFailureStrategy.php:15
- deprecated `webhook:drain-to-async` — command class tagged `@deprecated tag:v6.8.0` — vendor/shopware/core/Framework/Webhook/Command/WebhookDrainToAsyncCommand.php:38
