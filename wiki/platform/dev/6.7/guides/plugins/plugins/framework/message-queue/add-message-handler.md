---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md
title: Add Message Handler
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-handler.html
sourceHash: a42c5b481c9c167381d488daaffafb976aa92b29
codeCheckedAgainst: "6.7.15.1"
keywords: ["AsMessageHandler", "__invoke", "messenger.message_handler", "SmsHandler", "SmsNotification", "handle_messages", "low_priority", "message handler", "message queue", "symfony messenger", "async worker", "consumer"]
summary: "Create a Symfony Messenger handler in a Shopware 6.7 plugin using the AsMessageHandler attribute and __invoke, tagged messenger.message_handler."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/hosting/infrastructure/message-queue.md"]
---
## What it is

How to write a message handler in a Shopware plugin. A handler is the class Symfony Messenger calls once a message has been dispatched and passed through the `handle_messages` middleware; the handler does the actual processing of the message. Shopware's message queue is plain Symfony Messenger, so the handler is a standard Messenger handler.

## When to use

You have a message class (for example one you created via [Adding a message to queue](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md)) and need code that runs when that message is consumed, either synchronously or by a queue worker. The guide builds on the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md); service registration itself is covered in [Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md).

## Key steps / config

1. Create a handler class, e.g. `<plugin root>/src/MessageQueue/Handler/SmsHandler.php`.
2. Mark it with the PHP attribute `#[AsMessageHandler]` (`Symfony\Component\Messenger\Attribute\AsMessageHandler`) and implement `__invoke()` with the message class as the typed parameter. The parameter type decides which message the handler receives; core handlers also use the explicit form `#[AsMessageHandler(handles: SomeTask::class)]`.
3. Register the class as a service tagged `messenger.message_handler` (core service definitions do exactly this, e.g. `->tag('messenger.message_handler')`). Several handlers may handle the same message.

```php
namespace Swag\BasicExample\MessageQueue\Handler;

use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Swag\BasicExample\MessageQueue\Message\SmsNotification;

#[AsMessageHandler]
class SmsHandler
{
    public function __invoke(SmsNotification $message)
    {
        // process the message
    }
}
```

Which transport the message lands on is decided by the core routing in `framework.yaml`: messages implementing `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` go to `async`, those implementing `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` go to `low_priority`. Worker and transport configuration is described in the [Message queue hosting guide](platform/dev/6.7/guides/hosting/infrastructure/message-queue.md); custom bus middleware is in [Add middleware](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md).

## Essential identifiers

- `#[AsMessageHandler]` / `Symfony\Component\Messenger\Attribute\AsMessageHandler`
- `__invoke(<MessageClass> $message)`
- service tag `messenger.message_handler`
- transports `async`, `low_priority`
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`, `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface`

## Gotchas

- Parts of the guide refer to the `low_priority` queue. It only exists from 6.5.7.0 on; configuring the messenger to consume it fails if it does not exist.

## Version notes

- `low_priority` transport: available since 6.5.7.0; in 6.7.15.1 it is defined in core `framework.yaml` with DSN env `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`.

## Code check (6.7.15.1)
- confirmed `AsMessageHandler` — core handlers use the attribute, optionally with `handles:` — vendor/shopware/core/Checkout/Customer/DeleteUnusedGuestCustomerHandler.php:17
- confirmed `messenger.message_handler` — tag used on handler service definitions — vendor/shopware/core/System/DependencyInjection/snippet.php:214
- confirmed `low_priority` — transport defined in core messenger config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:77
- confirmed `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN` — env default for the low_priority DSN — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:4
- confirmed `LowPriorityMessageInterface` — routed to low_priority — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:97
- confirmed `AsyncMessageInterface` — routed to async — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:96
- unverified `handle_messages` — Symfony Messenger middleware, vendor/symfony out of scope
