---
id: platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.md
title: Add message handler
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.html"
sourceHash: "cbec6f7034ef4fad139e9411af85d035e7b70b6f"
relatedPages: ["platform/dev/6.6/guides/hosting/infrastructure/message-queue.md"]
keywords: ["message handler", "AsMessageHandler", "messenger.message_handler", "message queue", "Symfony Messenger", "handle_messages middleware", "__invoke", "SmsHandler", "low_priority queue", "dispatch message"]
summary: "Create a message handler with #[AsMessageHandler], tagged messenger.message_handler, to process a dispatched queue message."
lastBuilt: "2026-09-15"
---
## What it is

A guide on creating a message handler for Shopware's message queue, built on Symfony's
Messenger component. A handler gets called once a message is dispatched by the
`handle_messages` middleware, and it performs the actual processing of that message.

## When to use

Use this guide after a custom message has already been added to the queue (see "Adding a
message to queue") and a handler is needed to process it. Multiple handlers can be defined for
the same message. This guide assumes familiarity with registering classes to the DI container,
which is covered separately in the Dependency injection guide.

## Key steps / config

1. Create a new class for the handler (the example uses `SmsHandler`).
2. Mark it as a message handler with the PHP attribute `#[AsMessageHandler]`.
3. Implement the `__invoke` method, which receives the message instance and does the actual
   work.
4. Register the handler by tagging it with `messenger.message_handler` (the `#[AsMessageHandler]`
   attribute handles this tagging automatically for autoconfigured services).

```php
// <plugin root>/src/MessageQueue/Handler/SmsHandler.php
namespace Swag\BasicExample\MessageQueue\Handler;

use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Swag\BasicExample\MessageQueue\Message\SmsNotification;

#[AsMessageHandler]
class SmsHandler
{
    public function __invoke(SmsNotification $message)
    {
        // do some work - like sending an SMS message
    }
}
```

## Essential identifiers

- `#[AsMessageHandler]` — PHP attribute marking a class as a message handler.
- `__invoke` — the method a handler implements to process the message.
- `messenger.message_handler` — the DI tag a handler is registered with.
- `handle_messages` — the middleware that dispatches a message to its handler(s).

## Gotchas

Parts of the wider message-queue guides refer to the `low_priority` queue, which is only
available from version 6.5.7.0 and above; configuring the messenger to consume that queue on
an older version fails because the queue does not exist yet.
