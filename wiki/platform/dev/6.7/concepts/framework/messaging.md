---
id: platform/dev/6.7/concepts/framework/messaging.md
title: Messaging
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/messaging.html
sourceHash: 6bbbe2e2dca8b6fd333db791ae79a57521848084
codeCheckedAgainst: "6.7.15.1"
keywords: ["messaging", "message queue", "symfony messenger", "enqueue", "messenger.default_bus", "MiddlewareInterface", "AsMessageHandler", "AsyncMessageInterface", "envelope", "stamps", "transport", "api.action.message-queue.consume", "async messages", "worker"]
summary: "Shopware messaging on Symfony Messenger: messenger.default_bus, middleware, handlers, envelopes, stamps, transports, consuming via CLI/API."
lastBuilt: 2026-10-21
---
## What it is

Shopware integrates the Symfony Messenger component and Enqueue so that messages can be sent and handled asynchronously. This page explains the building blocks — message bus, middleware, handler, message, envelope, stamps and transport — and how messages are sent and consumed in Shopware.

## When to use

- Moving work out of the HTTP request into background processing.
- Writing a message handler or a custom middleware for Shopware's bus.
- Sending messages to an external system through a separate bus.
- Deciding how messages are consumed: CLI worker or Admin API endpoint.

## Key steps / config

- **Message bus** — dispatches messages to the registered handlers and, while doing so, loops through the middleware configured for that bus. Use the service `messenger.default_bus` (inject it via DI). Messages that should be handled inside Shopware must go through this bus; define a custom bus only when you send messages to external systems. In the core Messenger config the bus `messenger.bus.default` additionally runs Shopware's `QueuedTimeMiddleware`.
- **Middleware** — called whenever the bus dispatches a message and defines what happens on dispatch: `send_message` sends the message to the configured transport, `handle_message` calls the handlers for it. Add your own by implementing Symfony's `MiddlewareInterface` and adding it to the bus through configuration.
- **Handler** — a PHP callable invoked by the handle middleware. Recommended form: a class carrying the `AsMessageHandler` attribute with an `__invoke()` method type-hinted with the message class (or a message interface).
- **Message** — a plain PHP class you dispatch over the queue. It must be serializable and should carry all information the handler needs. In the core routing, messages implementing `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` go to the `async` transport and `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` to `low_priority`.
- **Envelope / Stamps** — the bus wraps every message in an envelope and, while passing it through the middleware, adds stamps with metadata. To attach your own metadata or configuration, wrap the message in an envelope with the stamps before dispatching, or write a custom middleware.
- **Transport** — communicates with the third-party message broker. Several transports can be configured and messages routed to one or more of them; every transport supported by Symfony or Enqueue works. Without a configured transport, messages are processed synchronously, like Symfony events.
- **Sending** — inject the Shopware bus via DI and dispatch, optionally adding metadata.
- **Consuming** — run the CLI worker, which receives incoming messages from the transport and dispatches them, or call `POST /api/_action/message-queue/consume` (ACL `system:queue:process`) with a `receiver` transport name. The endpoint consumes for a limited time and responds with the number of handled messages:

```json
{ "handledMessages": 0 }
```

## Essential identifiers

- `messenger.default_bus`, `messenger.bus.default`
- `MiddlewareInterface`, `AsMessageHandler` (Symfony)
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`
- `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface`
- `api.action.message-queue.consume` (`/api/_action/message-queue/consume`)

## Gotchas

- The docs call `messenger.default_bus` a service tag; in code it is a service id that core services inject.
- The docs say the API consumes for 2 seconds; the API worker stops after `shopware.admin_worker.poll_interval`, which defaults to 20 seconds.
- The docs mention an optional bus for sensitive data with encryption; no such bus was found in the core MessageQueue code.

## Code check (6.7.15.1)
- corrected `messenger.default_bus` — docs: service tag; it is a service id injected by core services — vendor/shopware/core/Framework/DependencyInjection/message-queue.php:75
- confirmed `messenger.bus.default` — bus configured with `QueuedTimeMiddleware` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:90
- confirmed `AsyncMessageInterface` — routed to `async` transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:96
- confirmed `LowPriorityMessageInterface` — routed to `low_priority` transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:97
- confirmed `api.action.message-queue.consume` — POST route, ACL `system:queue:process` — vendor/shopware/core/Framework/MessageQueue/Api/ConsumeMessagesController.php:50
- confirmed `ConsumeMessagesController::consumeMessages()` — reads the `receiver` parameter — vendor/shopware/core/Framework/MessageQueue/Api/ConsumeMessagesController.php:51
- corrected `poll_interval` — docs: consumes for 2 seconds; default is 20 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:420
- unverified `MiddlewareInterface` — Symfony Messenger, vendor/symfony out of scope
- unverified `AsMessageHandler` — Symfony Messenger, vendor/symfony out of scope
