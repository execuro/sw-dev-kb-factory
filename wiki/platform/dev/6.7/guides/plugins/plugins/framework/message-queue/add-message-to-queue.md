---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md
title: Add Message to Queue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-to-queue.html
sourceHash: 43e22d1a1d942171ea4e300c0a375e6473e9d5bc
codeCheckedAgainst: "6.7.13.0"
keywords: ["message queue", "async message", "AsyncMessageInterface", "LowPriorityMessageInterface", "MessageBusInterface", "messenger.default_bus", "Envelope", "DelayStamp", "routing_overwrite", "low_priority", "symfony messenger", "dispatch message"]
summary: Create a message class (AsyncMessageInterface/LowPriorityMessageInterface), dispatch via MessageBusInterface, route with shopware.messenger.routing_overwrite.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md"]
---
## What it is

How a plugin defines a message (a serializable PHP object carrying everything its handlers need) and dispatches it over Shopware's Symfony Messenger integration; the bus wraps it in an envelope.

## When to use

You want work (sending an SMS, mail, indexing) processed asynchronously or with lower priority instead of inline in the request.

## Key steps / config

1. **Message class** (e.g. `<plugin root>/src/MessageQueue/Message/SmsNotification.php`). Messages are handled synchronously unless routed; implement `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` for the `async` transport, or `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` for the `low_priority` transport:

```php
class SmsNotification implements AsyncMessageInterface
{
    public function __construct(private string $content) {}
    public function getContent(): string { return $this->content; }
}
```

2. **Dispatch** from a service that gets `Symfony\Component\Messenger\MessageBusInterface` injected (service id `messenger.default_bus`): `$this->bus->dispatch(new SmsNotification($message));`
3. **Metadata**: dispatch a `Symfony\Component\Messenger\Envelope` with stamps instead, e.g. `(new Envelope($message))->with(new DelayStamp(5000))` using `Symfony\Component\Messenger\Stamp\DelayStamp` to process later.
4. **Route specific messages** in `config/packages/shopware.yaml`:

```yaml
shopware:
    messenger:
        routing_overwrite:
            'Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface': low_priority
            'Your\Custom\LowPriorityMessage': async
```

An entry for the exact message class overrides an entry matching an interface it implements, so the example above sends `LowPriorityMessage` to `async`.

Then write a handler: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md.

## Essential identifiers

- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`
- `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface`
- `Symfony\Component\Messenger\MessageBusInterface`, `messenger.default_bus`
- `Symfony\Component\Messenger\Envelope`, `Symfony\Component\Messenger\Stamp\DelayStamp`
- `shopware.messenger.routing_overwrite`; transports `async`, `low_priority`

## Gotchas

- Messages must be serializable (core transports use `messenger.transport.symfony_serializer` with JSON format).
- A message without either interface and without routing is handled synchronously.

## Version notes

- The `low_priority` queue and `LowPriorityMessageInterface` exist only from 6.5.7.0; consuming `low_priority` on older versions fails.
- The doc mentions Enqueue; in 6.7 only migrations referencing the old enqueue table remain (dropped in a 6.5 migration).

## Code check (6.7.13.0)
- confirmed `AsyncMessageInterface` — interface in core MessageQueue — vendor/shopware/core/Framework/MessageQueue/AsyncMessageInterface.php:8
- confirmed `LowPriorityMessageInterface` — interface in core MessageQueue — vendor/shopware/core/Framework/MessageQueue/LowPriorityMessageInterface.php:8
- confirmed `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` — routed to async — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:94
- confirmed `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` — routed to low_priority — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:95
- confirmed `low_priority` — transport defined — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:75
- confirmed `routing_overwrite` — shopware.messenger config key, empty default — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:683
- confirmed `RoutingOverwriteMiddleware` — exact class match checked before instanceof match — vendor/shopware/core/Framework/MessageQueue/Middleware/RoutingOverwriteMiddleware.php:16
- confirmed `messenger.default_bus` — used as bus service id by core services — vendor/shopware/core/Content/DependencyInjection/product.xml:448
- unverified `DelayStamp` — vendor/symfony, out of scope
- confirmed `Migration1669125399DropEnqueueTable` — enqueue table dropped — vendor/shopware/core/Migration/V6_5/Migration1669125399DropEnqueueTable.php:13
