---
id: platform/dev/6.7/resources/references/adr/2024-06-18-extended-event-system.md
title: Transition to an Event-Based Extension System
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-18-extended-event-system.html
sourceHash: c6abc0e031fdfd2abaca6a41b9647ae0025a9e99
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware\\Core\\Framework\\Extensions\\Extension", "ExtensionDispatcher", "ResolveListingExtension", "listing-loader.resolve.pre", "stopPropagation", "EventSubscriberInterface", "extension point", "event-based extension", "decoration alternative", "replace core logic", "product listing", "adr"]
summary: "ADR: extension points as Extension events (NAME.pre/.post/.error) replace decoration, adapter and factory patterns; example ResolveListingExtension."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2024-06-18): Shopware moves from PHP decoration, Adapter and Factory patterns to an event-based extension system as the primary way for third parties to extend and customize core processes. Core operations are wrapped in `Extension` event objects that subscribers can inspect, modify or replace.

## When to use

- You need to change or replace a core subprocess (e.g. product listing loading) that is published as an `Extension`, instead of decorating a service.
- You design a new extension point in core-style code.

## Key steps / config

Rationale given by the ADR: decoration/adapter/factory make backward and forward compatibility costly, cannot extend subprocesses without extracting them into new classes/interfaces, and cause interface/abstract-class proliferation. Events give granular extension points, simpler compatibility (as long as the event structure stays consistent) and one uniform mechanism. Costs: initial refactoring of existing extension points and a learning curve. Implementation plan: audit key extension points, define a standard event structure (naming, payload, handling), refactor gradually with backward compatibility, document.

An extension point is a final subclass of `Shopware\Core\Framework\Extensions\Extension` with a `NAME` constant and public readonly constructor properties (constructor is owned by Shopware, properties are public API):

```php
#[Package('inventory')]
final class ResolveListingExtension extends Extension
{
    public const NAME = 'listing-loader.resolve';
    public function __construct(
        public readonly Criteria $criteria,
        public readonly SalesChannelContext $context
    ) {}
}
```

Core publishes it through `ExtensionDispatcher::publish($name, $extension, $function)`, which dispatches three events:

1. `<NAME>.pre` — before the core operation. A subscriber may set `$event->result` and call `$event->stopPropagation()`, so the core function is not executed.
2. `<NAME>.error` — if the operation threw; `$event->exception` holds the throwable. Setting a `result` swallows it, otherwise it is rethrown.
3. `<NAME>.post` — after a result exists, to inspect or mutate `$event->result`.

Subscribing (Symfony `EventSubscriberInterface`) to replace the listing:

```php
public static function getSubscribedEvents(): array
{
    return [ResolveListingExtension::onPre() => 'replace']; // 'listing-loader.resolve.pre'
}
public function replace(ResolveListingExtension $event): void
{
    // build Criteria from your own source, then:
    $event->result = $this->repository->search($criteria, $event->context->getContext());
    $event->stopPropagation();
}
```

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension` — `$result`, `$exception`, `onPre()`, `onPost()`, `onError()`, `stopPropagation()`
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher::publish()`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension` (`NAME = 'listing-loader.resolve'`)
- Event names: `listing-loader.resolve.pre` / `.post` / `.error`

## Gotchas

- Without `stopPropagation()` in a `.pre` subscriber, the core function still runs and overwrites `result`.
- Propagation is reset before `.error` and `.post` are dispatched, so stopping in `.pre` does not suppress `.post`.

## Code check (6.7.15.1)
- confirmed `Shopware\Core\Framework\Extensions\Extension` — abstract class implementing `StoppableEventInterface` — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `Extension::$result` — public result property, null by default — vendor/shopware/core/Framework/Extensions/Extension.php:20
- confirmed `Extension::onPre()` — returns `NAME . '.pre'` via late static binding — vendor/shopware/core/Framework/Extensions/Extension.php:38
- confirmed `Extension::stopPropagation()` — short-circuits the core operation — vendor/shopware/core/Framework/Extensions/Extension.php:98
- confirmed `ExtensionDispatcher::publish()` — dispatches pre, runs function unless stopped, error on throw, then post — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `ExtensionDispatcher::error()` — `.error` suffix; rethrows unless a result is set — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:41
- confirmed `ResolveListingExtension` — final class extending Extension — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:18
- confirmed `ResolveListingExtension::NAME` — `listing-loader.resolve` — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:20
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
