---
id: platform/dev/6.7/products/paas/shopware/guides/message-queues.md
title: Split message queues
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/message-queues.html
sourceHash: 320ed3e458bbb1fb947963bdca8a376197adecfa
codeCheckedAgainst: "6.7.15.1"
keywords: ["framework.messenger.transports", "framework.messenger.routing", "shopware.messenger.routing_overwrite", "AsyncMessageInterface", "SendEmailMessage", "ImportExportMessage", "MESSENGER_TRANSPORT_DSN", "MESSENGER_CONSUMER_NAME", "operator.yaml", "paas_messenger.yaml", "messenger:stats", "message queue", "transport", "valkey stream"]
summary: Add extra messenger transports on PaaS Native in paas_messenger.yaml (not operator.yaml); routing vs routing_overwrite.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md", "platform/dev/6.7/guides/hosting/infrastructure/message-queue.md"]
---
## What it is

In Shopware PaaS Native every message goes to the single `async` transport defined in `config/packages/operator.yaml` by default. Long-running messages such as indexing can then delay time-critical ones such as order confirmation mails. This page shows how to add transports and route selected messages to them so they are processed independently.

## When to use

You want mail, import/export or other messages handled in their own queue on PaaS Native, without long-running work blocking them.

## Key steps / config

1. Do not edit `operator.yaml`: it comes from the [`shopware/k8s-meta`](platform/dev/6.7/products/paas/shopware/fundamentals/k8s-meta.md) package's Symfony Flex recipe and is overwritten on recipe updates. Create `config/packages/paas_messenger.yaml` instead; Symfony merges all files in `config/packages/`, so new transports sit next to `async`.
2. Add a transport per queue, reusing the platform env vars and giving each a unique `stream`:

```yaml
framework:
    messenger:
        transports:
            mail:
                dsn: "%env(MESSENGER_TRANSPORT_DSN)%"
                options:
                    stream: messages_mail
                    consumer: "%env(MESSENGER_CONSUMER_NAME)%"
        routing:
            'Symfony\Component\Mailer\Messenger\SendEmailMessage': mail
shopware:
    messenger:
        routing_overwrite:
            'Shopware\Core\Content\ImportExport\Message\ImportExportMessage': export
```

   (`export` is a second transport defined like `mail` with `stream: messages_export`.) `MESSENGER_TRANSPORT_DSN` points to the same Valkey instance as `async`; `MESSENGER_CONSUMER_NAME` is set by the platform per worker so each replica gets a unique consumer name.
3. Choose the routing mechanism by how core routes the message:
   - **Routed by class name** (`SendEmailMessage` → `async` in core): a `framework.messenger.routing` entry for the same class replaces that route.
   - **Routed by interface** (every `AsyncMessageInterface` implementation → `async`, e.g. `ImportExportMessage`): a `framework.messenger.routing` entry is added to the interface route, so the message goes to both transports and is processed twice. Use `shopware.messenger.routing_overwrite` instead — see [Routing overwrites](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md).
4. Verify locally with `bin/console debug:config framework messenger` and `bin/console debug:config shopware messenger`; after deployment run `bin/console messenger:stats` in an exec session to see pending messages per transport.

## Essential identifiers

- `config/packages/operator.yaml`, `config/packages/paas_messenger.yaml`
- `framework.messenger.transports.<name>.options.stream` / `.consumer`
- `framework.messenger.routing`, `shopware.messenger.routing_overwrite`
- `Symfony\Component\Mailer\Messenger\SendEmailMessage`
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`
- `Shopware\Core\Content\ImportExport\Message\ImportExportMessage`
- `MESSENGER_TRANSPORT_DSN`, `MESSENGER_CONSUMER_NAME`

## Gotchas

- Without a `stream` option the transport falls back to `messages` and shares the stream with `async` — always set a new, unique stream name.
- Using `framework.messenger.routing` for an `AsyncMessageInterface` message causes double processing.
- Core's default routing also sends `LowPriorityMessageInterface` messages to a `low_priority` transport and `WebhookEventMessage` to `webhook` (not mentioned by the source; from the installed `framework.yaml`).

## Code check (6.7.15.1)
- confirmed `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` — core routes the interface to `async` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:96
- confirmed `Symfony\Component\Mailer\Messenger\SendEmailMessage` — core routes this class to `async` by class name — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:98
- confirmed `ImportExportMessage` — implements `AsyncMessageInterface` — vendor/shopware/core/Content/ImportExport/Message/ImportExportMessage.php:10
- confirmed `shopware.messenger.routing_overwrite` — config key, empty by default — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:725
- confirmed `routing_overwrite` — defined in the bundle configuration tree — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1510
- confirmed `AsyncMessageInterface` — interface declaration — vendor/shopware/core/Framework/MessageQueue/AsyncMessageInterface.php:8
- unverified `operator.yaml` — provided by shopware/k8s-meta, outside the Shopware code roots
- unverified `messenger:stats` — Symfony Messenger command, vendor/symfony out of scope
