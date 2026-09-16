---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md
title: Add Message Handler
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-handler.html
sourceHash: a42c5b481c9c167381d488daaffafb976aa92b29
codeCheckedAgainst: "6.7.13.0"
keywords: ["message handler", "AsMessageHandler", "messenger.message_handler", "__invoke", "SmsHandler", "handle_message", "message queue", "symfony messenger", "consume message", "MessageHandlerCompilerPass", "low_priority"]
summary: "Message handler for a queued message - class with the AsMessageHandler attribute and __invoke(Message), tagged messenger.message_handler."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md", "platform/dev/6.7/guides/hosting/infrastructure/message-queue.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

How a plugin writes a message handler: the class that does the actual processing of a message once the bus's handling middleware calls it. Several handlers may handle the same message.

## When to use

You created a message (see platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md) and need code that processes it when dispatched or consumed from a queue.

## Key steps / config

1. Create the handler class, e.g. `<plugin root>/src/MessageQueue/Handler/SmsHandler.php`, mark it with the attribute `Symfony\Component\Messenger\Attribute\AsMessageHandler` and implement `__invoke` typed to the message class:

```php
#[AsMessageHandler]
class SmsHandler
{
    public function __invoke(SmsNotification $message)
    {
        // ... do the work, e.g. send the SMS
    }
}
```

2. Register the class as a service tagged `messenger.message_handler` (DI registration: platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md). Shopware's `Shopware\Core\Framework\MessageQueue\MessageHandlerCompilerPass` merges the `#[AsMessageHandler]` attribute arguments into that tag for tagged services.
3. Optionally add a custom middleware for the bus (platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md); queue/worker configuration is in platform/dev/6.7/guides/hosting/infrastructure/message-queue.md.

## Essential identifiers

- `Symfony\Component\Messenger\Attribute\AsMessageHandler`
- `__invoke(<Message> $message)`
- tag `messenger.message_handler`

## Gotchas

- Explicit tag attributes win over attribute arguments when merged: the compiler pass applies `array_merge($attribute->getArguments(), $tagAttributes)`.

## Version notes

- Parts of the related setup refer to the `low_priority` queue, available only from 6.5.7.0; configuring the messenger to consume it fails if it does not exist.

## Code check (6.7.13.0)
- confirmed `messenger.message_handler` — tag read by Shopware compiler pass — vendor/shopware/core/Framework/MessageQueue/MessageHandlerCompilerPass.php:18
- confirmed `AsMessageHandler` — attribute arguments merged into the tag — vendor/shopware/core/Framework/MessageQueue/MessageHandlerCompilerPass.php:28
- confirmed `MessageHandlerCompilerPass::process()` — merges attribute args with tag attributes taking precedence — vendor/shopware/core/Framework/MessageQueue/MessageHandlerCompilerPass.php:16
- confirmed `low_priority` — transport defined in core messenger config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:75
- unverified `handle_messages` — Symfony middleware name (Symfony calls it handle_message), vendor/symfony out of scope
