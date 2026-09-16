---
id: platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-middleware.md
title: Add Middleware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-middleware.html
sourceHash: 860a78bbd5b6e26b1a3697fb3ee34685c5e42d4c
codeCheckedAgainst: "6.7.13.0"
keywords: ["message queue", "messenger middleware", "Symfony\\Component\\Messenger\\Middleware\\MiddlewareInterface", "StackInterface", "Envelope", "messenger.bus.default", "framework.yaml", "framework.messenger.buses", "send_message", "handle_message", "message bus", "symfony messenger"]
summary: "Custom Symfony Messenger middleware: handle(Envelope, StackInterface) calling the next middleware, registered under messenger.bus.default in framework.yaml."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

A middleware is called when the Symfony Messenger message bus dispatches a message and defines what happens during dispatch. Built-in examples: the `send_message` middleware sends the message to the configured transport, and `handle_message` calls the handlers for the message. This page covers writing a custom middleware and adding it to a bus.

## When to use

You need logic around every dispatched or consumed message (e.g. adding stamps, logging, conditional handling) on Shopware's message bus. For queue messages and handlers themselves see [Message Queue](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md) and [Message Handler](platform/dev/6.7/guides/plugins/plugins/framework/message-queue/add-message-handler.md).

## Key steps / config

1. Create a service class, e.g. `Swag\BasicExample\MessageQueue\Middleware\ExampleMiddleware`, implementing Symfony's `Symfony\Component\Messenger\Middleware\MiddlewareInterface`. Its one method is `handle`, which must pass the envelope on to the next middleware (imports `Symfony\Component\Messenger\Envelope`, `Symfony\Component\Messenger\Middleware\StackInterface`):

```php
public function handle(Envelope $envelope, StackInterface $stack): Envelope
{
    // do something here

    return $stack->next()->handle($envelope, $stack);
}
```

Shopware's own `QueuedTimeMiddleware` uses exactly this signature and call.

2. Register the class in the DI container (see [Dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)).
3. Add it to the bus's `middleware` list in `framework.yaml` (per bus under `framework.messenger.buses`):

```yaml
framework:
    messenger:
        buses:
            messenger.bus.default:
                middleware:
                    - 'Swag\BasicExample\MessageQueue\Middleware\ExampleMiddleware'
                    - 'Swag\BasicExample\MessageQueue\Middleware\AnotherExampleMiddleware'
```

## Essential identifiers

- `Symfony\Component\Messenger\Middleware\MiddlewareInterface` (`handle(Envelope $envelope, StackInterface $stack): Envelope`)
- `Symfony\Component\Messenger\Middleware\StackInterface`, `Symfony\Component\Messenger\Envelope`
- Bus id `messenger.bus.default`; config path `framework.messenger.buses.<bus>.middleware`

## Gotchas

- Always return `$stack->next()->handle($envelope, $stack)`; otherwise later middleware (including `send_message`/`handle_message`) never runs.
- Do not import the similarly named `Shopware\Core\Framework\Store\Services\MiddlewareInterface` — that one is for Store HTTP requests and requires `__invoke(callable $handler): callable`, not `handle`.
- The source's YAML comment points at the core file `src/Core/Framework/Resources/config/packages/framework.yaml`; in the installed core that file already lists `Shopware\Core\Framework\Adapter\Messenger\Middleware\QueuedTimeMiddleware` for `messenger.bus.default`. Add your entries in your own project/bundle config rather than editing core.
- A compiler pass in core always prepends `RoutingOverwriteMiddleware` to `messenger.bus.default`, so custom middleware runs after it.

## Code check (6.7.13.0)
- unverified `Symfony\Component\Messenger\Middleware\MiddlewareInterface` — vendor/symfony, out of scope
- confirmed `QueuedTimeMiddleware::handle()` — core middleware with handle(Envelope, StackInterface): Envelope calling the next stack item — vendor/shopware/core/Framework/Adapter/Messenger/Middleware/QueuedTimeMiddleware.php:18
- confirmed `messenger.bus.default` — bus defined in core framework.yaml — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:88
- confirmed `middleware` — per-bus middleware list, core registers QueuedTimeMiddleware — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:89
- confirmed `RoutingOverwriteMiddleware` — prepended to the default bus by compiler pass — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/MessengerMiddlewareCompilerPass.php:27
- confirmed `MiddlewareInterface::__invoke()` — the unrelated Store Services interface requires __invoke — vendor/shopware/core/Framework/Store/Services/MiddlewareInterface.php:13
