---
docType: developer
id: platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-middleware.md
sourceHash: 3292842cddc44b3fc3884ca4fd773740e064f3a4
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/message-queue/add-middleware.html
title: Add middleware
version: "6.6"
versions:
  - "6.6"
keywords: ["middleware", "MiddlewareInterface", "message bus", "send_message middleware", "handle_message middleware", "messenger.bus.default", "framework.yaml", "Symfony Messenger"]
summary: "How to write and register a Symfony Messenger middleware class for a Shopware message bus."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-to-queue.md", "platform/dev/6.6/guides/plugins/plugins/framework/message-queue/add-message-handler.md"]
---
## What it is
This guide explains how to add a custom middleware, which is called when the message bus dispatches a message and defines what happens during dispatch.

## When to use
When you need custom logic executed on every message dispatched through a given bus, e.g. logging, before the built-in `send_message` (sends to the transport) or `handle_message` (calls handlers) middleware run.

## Key steps / config
1. Create a service implementing `Symfony\Component\Messenger\Middleware\MiddlewareInterface`, with a `handle` method that must call the next middleware:
```php
class ExampleMiddleware implements MiddlewareInterface
{
    public function handle(Envelope $envelope, StackInterface $stack): Envelope
    {
        // do something here
        return $stack->next()->handle($envelope, $stack);
    }
}
```
2. Add the middleware to a bus in configuration, e.g. `framework.yaml`:
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
- `Symfony\Component\Messenger\Middleware\MiddlewareInterface`
- `handle(Envelope $envelope, StackInterface $stack): Envelope`
- `send_message` middleware, `handle_message` middleware
- Config key `framework.messenger.buses.messenger.bus.default.middleware`

## Gotchas
- The middleware's `handle` method must call `$stack->next()->handle($envelope, $stack)` or the chain (including the actual handler) never runs.
