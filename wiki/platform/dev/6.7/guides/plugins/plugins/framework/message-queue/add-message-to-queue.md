---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md
title: Add Message to Queue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-to-queue.html
sourceHash: 43e22d1a1d942171ea4e300c0a375e6473e9d5bc
codeCheckedAgainst: "6.7.15.1"
keywords: ["AsyncMessageInterface", "LowPriorityMessageInterface", "MessageBusInterface", "messenger.default_bus", "routing_overwrite", "low_priority", "async", "DelayStamp", "Envelope", "dispatch message", "message queue", "symfony messenger", "SmsNotification"]
summary: "Plugin messages: AsyncMessageInterface/LowPriorityMessageInterface, dispatch via MessageBusInterface, reroute with routing_overwrite."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to define a message class in a plugin and dispatch it on Shopware's Symfony Messenger bus, including async/low-priority routing and per-message transport overrides. A message is a plain, serializable PHP object carrying everything its handlers need; the bus wraps it in an `Envelope`.

## When to use

Offloading work (e.g. sending an SMS or email) from a request to a queue worker, delaying it, or sending it through the lower-priority queue.

## Key steps / config

1. Create the message class, e.g. `<plugin root>/src/MessageQueue/Message/SmsNotification.php`. By default messages are handled synchronously.
2. To handle it asynchronously, implement `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface` (routed to the `async` transport). For async with lower priority, implement `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface` (routed to `low_priority`). Both are empty marker interfaces.
3. In a service (e.g. `ExampleSender`), inject `Symfony\Component\Messenger\MessageBusInterface` (service `messenger.default_bus`) and call `$this->bus->dispatch(new SmsNotification($message))`.
4. To attach metadata, dispatch a `Symfony\Component\Messenger\Envelope` with stamps, e.g. `(new Envelope($message))->with(new DelayStamp(5000))` using `Symfony\Component\Messenger\Stamp\DelayStamp` to process later.
5. To route specific messages to another transport, use `shopware.messenger.routing_overwrite` (class or interface name => transport):

```yaml
# config/packages/shopware.yaml
shopware:
    messenger:
        routing_overwrite:
            'Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface': low_priority
            'Your\Custom\LowPriorityMessage': async
```

An exact class entry wins over an interface entry: here `Your\Custom\LowPriorityMessage` implements `LowPriorityMessageInterface` but goes to `async`.

## Essential identifiers

- `Shopware\Core\Framework\MessageQueue\AsyncMessageInterface`
- `Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface`
- `Symfony\Component\Messenger\MessageBusInterface`, `messenger.default_bus`
- `Symfony\Component\Messenger\Envelope`, `Symfony\Component\Messenger\Stamp\DelayStamp`
- `shopware.messenger.routing_overwrite`
- transports `async`, `low_priority`

## Gotchas

- `low_priority` queue and `LowPriorityMessageInterface` exist only from 6.5.7.0. A worker configured to consume a non-existent queue fails.
- The override is applied by core middleware `RoutingOverwriteMiddleware`: it is skipped when the envelope already carries a `TransportNamesStamp` or a `ReceivedStamp`. A class key matches exactly first; otherwise the first `instanceof` match in the map is used.
- Core defaults (installed code, not in the source): `shopware.messenger.message_max_kib_size` is 1024 and `enforce_message_size` is false.

## Version notes

- 6.5.7.0: `low_priority` transport and `LowPriorityMessageInterface` added.

## Code check (6.7.15.1)
- confirmed `AsyncMessageInterface` — marker interface — vendor/shopware/core/Framework/MessageQueue/AsyncMessageInterface.php:8
- confirmed `LowPriorityMessageInterface` — marker interface — vendor/shopware/core/Framework/MessageQueue/LowPriorityMessageInterface.php:8
- confirmed `'Shopware\Core\Framework\MessageQueue\AsyncMessageInterface': async` — default routing — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:96
- confirmed `'Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface': low_priority` — default routing — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:97
- confirmed `routing_overwrite` — config node under shopware.messenger — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1510
- confirmed `RoutingOverwriteMiddleware::handle()` — applies overrides as TransportNamesStamp — vendor/shopware/core/Framework/MessageQueue/Middleware/RoutingOverwriteMiddleware.php:25
- confirmed `messenger.default_bus` — service injected by core services — vendor/shopware/core/Framework/DependencyInjection/scheduled-task.php:74
- confirmed `message_max_kib_size` — default 1024 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1515
- unverified `DelayStamp` — Symfony Messenger class, vendor/symfony out of scope
