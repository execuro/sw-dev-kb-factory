---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/_index.md
title: Message Queue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/
sourceHash: b92b71d1371d4ec4207bc7cdba32349d8a112b05
codeCheckedAgainst: "6.7.13.0"
keywords: ["message queue", "symfony messenger", "async processing", "background jobs", "message handler", "middleware", "AsyncMessageInterface", "LowPriorityMessageInterface", "messenger.bus.default", "low_priority", "async", "sitemap generation"]
summary: Overview of the Shopware message queue - asynchronous background tasks (mails, product indexing, sitemap) via messages, handlers and bus middleware.
lastBuilt: 2026-09-15
---
## What it is

Section overview for the Shopware message queue: asynchronous processing of tasks built from three parts — messages, message handlers and middleware — so background work runs reliably outside the request. Typical tasks are sending emails, indexing products and generating the sitemap.

## When to use

Start here when a plugin needs to move work into the background; the section's guides cover adding a message to the queue, writing a message handler, and adding bus middleware.

## Key steps / config

Core wires this through Symfony Messenger in its `framework.yaml` (installed 6.7):

```yaml
framework:
    messenger:
        transports: { failed: ..., async: ..., low_priority: ..., webhook: ... }
        buses:
            messenger.bus.default:
                middleware: [...]
        routing:
            'Shopware\Core\Framework\MessageQueue\AsyncMessageInterface': async
            'Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface': low_priority
```

A message implementing one of the two interfaces is routed to the matching transport; project-level overrides go under `shopware.messenger.routing_overwrite`.

## Essential identifiers

- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`
- `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface`
- bus `messenger.bus.default`; transports `async`, `low_priority`, `failed`
- `shopware.messenger.routing_overwrite`

## Code check (6.7.13.0)
- confirmed `AsyncMessageInterface` — core marker interface — vendor/shopware/core/Framework/MessageQueue/AsyncMessageInterface.php:8
- confirmed `LowPriorityMessageInterface` — core marker interface — vendor/shopware/core/Framework/MessageQueue/LowPriorityMessageInterface.php:8
- confirmed `failed` — failure transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:58
- confirmed `low_priority` — transport defined — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:75
- confirmed `messenger.bus.default` — default bus — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:88
- confirmed `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` — routed to async — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:94
- confirmed `routing_overwrite` — shopware.messenger config key — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:683
