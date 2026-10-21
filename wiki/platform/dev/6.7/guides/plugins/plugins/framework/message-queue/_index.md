---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md
title: Message Queue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/
sourceHash: b92b71d1371d4ec4207bc7cdba32349d8a112b05
codeCheckedAgainst: "6.7.15.1"
keywords: ["message queue", "messenger", "symfony messenger", "async", "background jobs", "message handler", "middleware", "AsyncMessageInterface", "LowPriorityMessageInterface", "messenger.bus.default", "low_priority", "queue worker"]
summary: Section index for Shopware plugin message queue guides - async background tasks via messages, handlers and middleware on Symfony Messenger.
lastBuilt: 2026-10-21
---
## What it is

Section index for the plugin guides on the Shopware message queue. The message queue processes tasks asynchronously using three building blocks: a message (the task payload), a message handler (does the work), and middleware (runs around every dispatch on the bus). Typical background tasks named by the source are sending emails, indexing products, and generating the sitemap.

## When to use

Open this section when a plugin must move work out of the request cycle into a background worker, or needs to hook into how messages are dispatched. The sub-guides cover adding a message to the queue, writing a handler, and adding a custom middleware.

## Essential identifiers

Confirmed in the installed core (not named on this index page itself, but the anchors for the sub-guides):

- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` - marker interface; routed to the `async` transport.
- `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` - marker interface; routed to the `low_priority` transport.
- `messenger.bus.default` - the default bus defined in core `framework.yaml`.
- Core transports: `async`, `low_priority`, `failed`, `webhook`.

## Code check (6.7.15.1)
- confirmed `AsyncMessageInterface` — empty marker interface in core — vendor/shopware/core/Framework/MessageQueue/AsyncMessageInterface.php:8
- confirmed `LowPriorityMessageInterface` — empty marker interface in core — vendor/shopware/core/Framework/MessageQueue/LowPriorityMessageInterface.php:8
- confirmed `messenger.bus.default` — default bus with core middleware list — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:90
- confirmed `async` — transport using MESSENGER_TRANSPORT_DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:69
- confirmed `low_priority` — transport using MESSENGER_TRANSPORT_LOW_PRIORITY_DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:77
