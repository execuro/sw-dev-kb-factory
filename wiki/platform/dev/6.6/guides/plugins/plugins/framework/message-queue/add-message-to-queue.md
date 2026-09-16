---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md
sourceHash: 28769edbd6a976b28763a3605c3401267791817e
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.html
title: Add message to queue
version: "6.6"
versions:
  - "6.6"
keywords: ["message queue", "AsyncMessageInterface", "LowPriorityMessageInterface", "MessageBusInterface", "messenger.default_bus", "DelayStamp", "Envelope", "routing_overwrite", "low_priority queue", "Symfony Messenger", "Enqueue"]
summary: "How to define a message class and dispatch it via Symfony Messenger, including async and low-priority routing."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.md"]
---
## What it is
This guide shows how to create a message (a simple, serializable PHP object) and dispatch it over Shopware's message queue, which integrates the Symfony Messenger component and Enqueue.

## When to use
When a plugin needs to send work (e.g. an SMS notification) to be processed asynchronously in the background rather than synchronously in the request.

## Key steps / config
1. Create a message class in `<plugin root>/MessageQueue/Message`. By default messages are handled synchronously; implement `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` to make it asynchronous, or `LowPriorityMessageInterface` for async messages that should use lower priority.
```php
class SmsNotification implements AsyncMessageInterface
{
    private string $content;
    public function __construct(string $content) { $this->content = $content; }
    public function getContent(): string { return $this->content; }
}
```
2. Create a service that injects `Symfony\Component\Messenger\MessageBusInterface` (the bus is `messenger.default_bus`) and dispatches the message: `$this->bus->dispatch(new SmsNotification($message));`.
3. To add metadata, dispatch a `Symfony\Component\Messenger\Envelope` with stamps, e.g. `Symfony\Component\Messenger\Stamp\DelayStamp` to delay processing.
4. To route specific messages to the `low_priority` queue without implementing the interface, use `routing_overwrite`:
```yaml
# config/packages/shopware.yaml
shopware:
    messenger:
        routing_overwrite:
            'Your\Custom\Message': low_priority
```
5. To override the transport for a message that implements `LowPriorityMessageInterface` back to `async`, add its own `routing_overwrite` entry pointing to `async`.

## Essential identifiers
- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`
- `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface`
- `Symfony\Component\Messenger\MessageBusInterface`, bus `messenger.default_bus`
- `Symfony\Component\Messenger\Envelope`, `Symfony\Component\Messenger\Stamp\DelayStamp`
- Config key `shopware.messenger.routing_overwrite`
- `low_priority` queue

## Gotchas
- Parts of this guide refer to the `low_priority` queue and `LowPriorityMessageInterface`, available only from version 6.5.7.0 and above; configuring the messenger to consume this queue fails if it does not exist.
- All messages are synchronous by default — you must implement `AsyncMessageInterface` (or `LowPriorityMessageInterface`) to change that.

## Version notes
`low_priority` queue and `LowPriorityMessageInterface` require Shopware 6.5.7.0 or above.
