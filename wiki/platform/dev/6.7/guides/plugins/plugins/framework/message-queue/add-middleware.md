---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md
title: Add Middleware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-middleware.html
sourceHash: 860a78bbd5b6e26b1a3697fb3ee34685c5e42d4c
codeCheckedAgainst: "6.7.15.1"
keywords: ["MiddlewareInterface", "StackInterface", "Envelope", "messenger.bus.default", "framework.yaml", "QueuedTimeMiddleware", "send_message", "handle_message", "messenger middleware", "message bus", "message queue", "symfony messenger"]
summary: Add a custom Symfony Messenger middleware in a Shopware 6.7 plugin by implementing MiddlewareInterface and listing it under messenger.bus.default.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to add a custom middleware to Shopware's message bus. A middleware is called when the message bus dispatches a message and defines what happens on dispatch: for example the Symfony `send_message` middleware sends the message to its configured transport, and `handle_message` calls the handlers for the message.

## When to use

You need logic that runs around every message on the bus (adding stamps, logging, timing) rather than in a single handler. Builds on the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md); service registration is covered in [Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md).

## Key steps / config

1. Create a service implementing `Symfony\Component\Messenger\Middleware\MiddlewareInterface`. Its only method is `handle(Envelope $envelope, StackInterface $stack): Envelope`, which must always pass on to the next middleware.

```php
use Symfony\Component\Messenger\Envelope;
use Symfony\Component\Messenger\Middleware\MiddlewareInterface;
use Symfony\Component\Messenger\Middleware\StackInterface;

class ExampleMiddleware implements MiddlewareInterface
{
    public function handle(Envelope $envelope, StackInterface $stack): Envelope
    {
        // do something here
        return $stack->next()->handle($envelope, $stack);
    }
}
```

2. Add the middleware to the bus in `framework.yaml`, under the bus it should run on:

```yaml
framework:
    messenger:
        buses:
          messenger.bus.default:
            middleware:
              - 'Swag\BasicExample\MessageQueue\Middleware\ExampleMiddleware'
              - 'Swag\BasicExample\MessageQueue\Middleware\AnotherExampleMiddleware'
```

In 6.7.15.1 the core `framework.yaml` already lists `Shopware\Core\Framework\Adapter\Messenger\Middleware\QueuedTimeMiddleware` under `messenger.bus.default.middleware`; that class is a working reference implementation of the same pattern (it adds a `SentAtStamp` and then calls the next middleware on the stack).

## Essential identifiers

- `Symfony\Component\Messenger\Middleware\MiddlewareInterface`
- `Symfony\Component\Messenger\Middleware\StackInterface`, `Symfony\Component\Messenger\Envelope`
- `framework.messenger.buses.messenger.bus.default.middleware`
- `Shopware\Core\Framework\Adapter\Messenger\Middleware\QueuedTimeMiddleware`

## Gotchas

- Forgetting `return $stack->next()->handle($envelope, $stack);` stops the chain: later middleware (including sending and handling) never runs.
- The source labels the YAML with the core path `<platform root>/src/Core/Framework/Resources/config/packages/framework.yaml`; the snippet shows the bus/middleware structure to add to.

## Code check (6.7.15.1)
- confirmed `messenger.bus.default` — default bus defined in core messenger config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:90
- confirmed `messenger.bus.default.middleware` — middleware list key on the bus — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:91
- confirmed `QueuedTimeMiddleware` — core middleware registered on the default bus — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:92
- confirmed `MiddlewareInterface` — implemented by core middleware — vendor/shopware/core/Framework/Adapter/Messenger/Middleware/QueuedTimeMiddleware.php:14
- confirmed `QueuedTimeMiddleware::handle()` — signature handle(Envelope, StackInterface): Envelope — vendor/shopware/core/Framework/Adapter/Messenger/Middleware/QueuedTimeMiddleware.php:18
- confirmed `StackInterface` — Symfony stack type used by core middleware — vendor/shopware/core/Framework/Adapter/Messenger/Middleware/QueuedTimeMiddleware.php:10
- unverified `send_message` — Symfony Messenger built-in middleware, vendor/symfony out of scope
- unverified `handle_message` — Symfony Messenger built-in middleware, vendor/symfony out of scope
