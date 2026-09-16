---
id: platform/dev/6.7/concepts/framework/messaging.md
title: Messaging
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/messaging.html
sourceHash: 6bbbe2e2dca8b6fd333db791ae79a57521848084
codeCheckedAgainst: "6.7.13.0"
keywords: ["messaging", "message queue", "symfony messenger", "messenger.default_bus", "AsMessageHandler", "MiddlewareInterface", "envelope", "stamps", "transport", "async", "api.action.message-queue.consume", "poll_interval", "worker"]
summary: Shopware messaging concept on Symfony Messenger - bus (messenger.default_bus), middleware, handlers, envelopes/stamps, transports, CLI and API consumers.
lastBuilt: 2026-09-15
---
## What it is

Concept page for asynchronous messaging in Shopware, built on the Symfony Messenger component: the message bus, middleware, handlers, messages, envelopes, stamps and transports, plus how messages are consumed.

## When to use

- You dispatch work to run asynchronously (or synchronously via the bus) inside Shopware.
- You write a message handler or custom middleware.
- You need to understand how the queue is consumed by CLI workers or the Administration's API-based worker.

## Key steps / config

Components:

- **Message bus** — dispatches messages through its middleware to handlers. Inside Shopware use the service `messenger.default_bus` (inject it via DI); this is mandatory if Shopware should handle the message. For messages to external systems you may define your own bus. Core configures `messenger.bus.default` with `Shopware\Core\Framework\Adapter\Messenger\Middleware\QueuedTimeMiddleware`.
- **Middleware** — runs on dispatch; e.g. `send_message` sends to the configured transport, `handle_message` calls handlers. Custom middleware implements `MiddlewareInterface` and is added to the bus via configuration.
- **Handler** — a PHP callable; recommended: a class with the `#[AsMessageHandler]` attribute and an `__invoke()` method type-hinted with the message class or interface.
- **Message** — a serializable PHP class carrying everything the handler needs.
- **Envelope** — wrapper the bus puts around a message.
- **Stamps** — metadata added to the envelope; add your own by wrapping the message in an envelope with stamps before dispatch, or via custom middleware.
- **Transport** — talks to the message broker; several can be configured and messages routed to them. Without a transport, messages are handled synchronously.

Core transports and routing (framework defaults):

```yaml
framework:
  messenger:
    transports:
      failed: "%env(MESSENGER_TRANSPORT_FAILURE_DSN)%"
      async: { dsn: "%env(MESSENGER_TRANSPORT_DSN)%" }
      low_priority: { dsn: "%env(MESSENGER_TRANSPORT_LOW_PRIORITY_DSN)%" }
      webhook: { dsn: 'shopware-webhook://default' }
    routing:
      'Shopware\Core\Framework\MessageQueue\AsyncMessageInterface': async
      'Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface': low_priority
```

Consuming:

- **CLI** — a console worker receives messages from the transport and dispatches them.
- **API** — `POST /api/_action/message-queue/consume` (route `api.action.message-queue.consume`) with a `receiver` parameter; runs a worker until the time limit `shopware.admin_worker.poll_interval` (default `20`) and returns `{"handledMessages": <count>}`.

## Essential identifiers

- `messenger.default_bus`, `messenger.bus.default`
- `AsMessageHandler`, `MiddlewareInterface`
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`, `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface`
- `MESSENGER_TRANSPORT_DSN`, `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`
- `api.action.message-queue.consume`, `shopware.admin_worker.poll_interval`

## Gotchas

- The docs call `messenger.default_bus` a service tag; it is a service id injected as an argument.
- The docs say the API consumes for 2 seconds; in 6.7.13.0 the limit is `shopware.admin_worker.poll_interval`, default 20 seconds (kept below PHP's `max_execution_time`).
- The docs mention Enqueue integration; no Enqueue references exist in the installed core — use Symfony Messenger transports.
- The API consumer takes a lock per receiver; a concurrent call for the same receiver fails with "worker is locked".
- The source mentions an optional message bus for sensitive data with encryption but names no identifier.

## Code check (6.7.13.0)
- confirmed `messenger.default_bus` — service id injected into ConsumeMessagesController — vendor/shopware/core/Framework/DependencyInjection/message-queue.xml:35
- confirmed `messenger.bus.default` — bus with QueuedTimeMiddleware — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:88
- confirmed `AsMessageHandler` — attribute read when registering handlers — vendor/shopware/core/Framework/MessageQueue/MessageHandlerCompilerPass.php:28
- confirmed `api.action.message-queue.consume` — POST consume endpoint — vendor/shopware/core/Framework/MessageQueue/Api/ConsumeMessagesController.php:50
- corrected `poll_interval` — docs: API consumes for 2 seconds; default is 20 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:390
- confirmed `handledMessages` — response key with handled count — vendor/shopware/core/Framework/MessageQueue/Api/ConsumeMessagesController.php:87
- confirmed `AsyncMessageInterface` — routed to async transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:94
- unverified `MiddlewareInterface` — vendor/symfony, out of scope
- unverified `handle_message` — Symfony Messenger middleware, out of scope
