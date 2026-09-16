---
id: platform/dev/6.6/concepts/framework/messaging.md
title: Messaging
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/messaging.html
sourceHash: 6bbbe2e2dca8b6fd333db791ae79a57521848084
keywords: ["messaging", "symfony messenger", "enqueue", "message bus", "messenger.default_bus", "middleware", "middlewareinterface", "handler", "asmessagehandler", "envelope", "stamps", "transport", "async message"]
summary: "Explains Shopware's async messaging built on Symfony Messenger and Enqueue: bus, middleware, handlers, envelopes, transports."
lastBuilt: "2026-09-15"
---
## What it is

Shopware integrates with the Symfony Messenger component and Enqueue to send and handle asynchronous messages.

## When to use

Relevant when dispatching async work (e.g. background jobs, external system notifications) or configuring custom message transports/middleware in Shopware.

## Key steps / config

Components:
- **Message Bus** — dispatches messages to registered handlers, looping through configured middleware; Shopware's internal bus is tagged `messenger.default_bus` and is mandatory for messages handled inside Shopware; a custom bus can be defined for external systems.
- **Middleware** — runs on every dispatch, e.g. `send_message` (sends to the configured Transport) and `handle_message` (calls handlers); implement `MiddlewareInterface` and register it on the bus via configuration to add custom middleware.
- **Handler** — a PHP callable called by the `handle_messages` middleware once dispatched; recommended as a class with the `AsMessageHandler` attribute and an `__invoke()` method type-hinted with the message class/interface.
- **Message** — a simple, serializable PHP class dispatched over the queue, containing everything a handler needs.
- **Envelope** — wraps a message when the bus dispatches it.
- **Stamps** — metadata added to the envelope by middleware as the message is processed; custom metadata can be added via a custom envelope/stamp or custom middleware.
- **Transport** — communicates with a 3rd-party message broker; multiple transports can be configured and routed to; supports any Symfony or Enqueue transport; without a configured transport, messages process synchronously.

Sending: inject the Shopware messenger bus via DI and populate it with metadata; a separate encrypted bus exists for sensitive data.

Consuming: via a console worker command or a POST API endpoint that consumes messages for 2 seconds and returns the handled-message count.

## Essential identifiers

- `messenger.default_bus` — the mandatory internal message bus service tag
- `send_message`, `handle_message` — built-in middleware names
- `MiddlewareInterface` — interface for custom middleware
- `AsMessageHandler` — attribute marking a message handler class
