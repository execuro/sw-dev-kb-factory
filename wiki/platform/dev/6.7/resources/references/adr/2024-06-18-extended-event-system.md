---
id: platform/dev/6.7/resources/references/adr/2024-06-18-extended-event-system.md
title: Transition to an Event-Based Extension System
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-18-extended-event-system.html
sourceHash: c6abc0e031fdfd2abaca6a41b9647ae0025a9e99
codeCheckedAgainst: "6.7.13.0"
keywords: ["Extension", "ResolveListingExtension", "ExtensionDispatcher", "listing-loader.resolve", "listing-loader.resolve.pre", "stopPropagation", "EventSubscriberInterface", "extension point", "event-based extension", "decoration alternative", "adr", "product listing"]
summary: "ADR: Shopware replaces decoration/adapter/factory extensibility with Extension events (name.pre/.post/.error), e.g. ResolveListingExtension for listings."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2024-06-18, area core) stating that Shopware moves from PHP decoration, Adapter and Factory patterns to an event-based extension system as the primary way for third parties to extend and customize processes. Extension points are classes extending `Shopware\Core\Framework\Extensions\Extension`, dispatched as events that subscribers can hook into, mutate, or short-circuit.

## When to use

- You want to replace or augment a core subprocess (e.g. product listing resolution) without decorating a service.
- You are deciding between decoration and subscribing to an `Extension` event for a customization.
- You need to understand why new core extension points are event classes rather than interfaces/abstract classes.

## Key steps / config

Rationale from the ADR: simpler backward/forward compatibility, more granular extension points, fewer interfaces/abstract classes, one unified mechanism. Consequences: refactoring effort and a learning curve.

1. An extension point is a `final` class extending `Shopware\Core\Framework\Extensions\Extension` with a `public const NAME` and public readonly constructor properties (constructor is `@internal`, properties are public API). Example in core: `Shopware\Core\Content\Product\Extension\ResolveListingExtension` (`NAME = 'listing-loader.resolve'`, properties `criteria` and `context`).
2. Core publishes it via `ExtensionDispatcher::publish()`; event names are derived as `<NAME>.pre`, `<NAME>.post` and `<NAME>.error`. The base class offers `onPre()`, `onPost()`, `onError()` helpers returning these names.
3. Subscribe with a Symfony `EventSubscriberInterface`:

```php
public static function getSubscribedEvents(): array
{
    return ['listing-loader.resolve.pre' => 'replace']; // or ResolveListingExtension::onPre()
}

public function replace(ResolveListingExtension $event): void
{
    $criteria = $event->criteria;          // mutate or read
    $event->result = $this->repository->search($newCriteria, $event->context->getContext());
    $event->stopPropagation();             // skip core implementation
}
```

4. Setting `$event->result` and calling `stopPropagation()` in the `.pre` listener replaces the core logic; `.post` listeners can inspect or mutate `$extension->result`; `.error` listeners see `$extension->exception` and may assign a fallback result.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension` (`$result`, `$exception`, `stopPropagation()`, `onPre()`, `onPost()`, `onError()`)
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension` / `listing-loader.resolve`
- `listing-loader.resolve.pre`

## Gotchas

- Without `stopPropagation()` the core function still runs after your `.pre` listener.
- The Extension's constructor is owned by Shopware (`@internal`); only its public properties are API — do not instantiate or subclass-construct it yourself.
- The ADR's `.post`/`.error` hooks and `onPre()` helpers come from the installed code, not the ADR text.

## Code check (6.7.13.0)
- confirmed `Extension` — abstract class implementing StoppableEventInterface — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `Extension::$result` — public mixed result, null by default — vendor/shopware/core/Framework/Extensions/Extension.php:20
- confirmed `Extension::onPre()` — returns the `.pre` event name via late static NAME — vendor/shopware/core/Framework/Extensions/Extension.php:38
- confirmed `Extension::stopPropagation()` — short-circuits further listeners — vendor/shopware/core/Framework/Extensions/Extension.php:98
- confirmed `ExtensionDispatcher::pre()` — appends `.pre` to the name — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:23
- confirmed `ExtensionDispatcher::publish()` — runs the core callable when no result was set — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `ResolveListingExtension` — final class extending Extension — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:18
- confirmed `ResolveListingExtension::NAME` — value `listing-loader.resolve` — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:20
- confirmed `ResolveListingExtension::$criteria` — public readonly Criteria — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:31
- confirmed `ResolveListingExtension::NAME` — published by ProductListingLoader — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:133
