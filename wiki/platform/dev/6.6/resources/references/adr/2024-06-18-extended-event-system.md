---
id: platform/dev/6.6/resources/references/adr/2024-06-18-extended-event-system.md
title: Transition to an Event-Based Extension System
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-18-extended-event-system.html"
sourceHash: c6abc0e031fdfd2abaca6a41b9647ae0025a9e99
keywords: ["Extension", "ResolveListingExtension", "listing-loader.resolve", "getSubscribedEvents", "EventSubscriberInterface", "event-based extension", "decoration pattern", "Adapter pattern", "Factory pattern", "stopPropagation", "extension point"]
summary: "ADR: Shopware moves from decoration/Adapter/Factory patterns to an event-based extension system, exemplified by `Extension`-derived classes."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record announcing a strategic shift from PHP decoration, Adapter and Factory patterns to an event-based extension system as the primary way third-party developers extend and customize Shopware.

## When to use
Relevant when deciding how to make a new subprocess extensible, or when writing a subscriber for one of the new `Extension`-derived event classes.

## Key steps / config
- Extension points are implemented as classes extending `Shopware\Core\Framework\Extensions\Extension`, carrying public readonly properties (documented `@public`) that represent inputs, and a mutable result the subscriber can set.

```php
#[Package('inventory')]
final class ResolveListingExtension extends Extension
{
    public const NAME = 'listing-loader.resolve';

    public function __construct(
        public readonly Criteria $criteria,
        public readonly SalesChannelContext $context
    ) {
    }
}
```

- Subscribers implement `EventSubscriberInterface` and listen to the `.pre` event name (e.g. `listing-loader.resolve.pre`), read the extension's public properties, set `$event->result`, and can call `$event->stopPropagation()` to prevent the core implementation from running.

## Essential identifiers
- `Shopware\Core\Framework\Extensions\Extension`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension`
- `listing-loader.resolve` / `listing-loader.resolve.pre`
- `Extension::$result`, `Extension::stopPropagation()`

## Gotchas
Migrating to the event-based system requires an initial refactoring effort to identify current extension points and replace them with events, plus documentation/training for developers used to the old decoration/Adapter/Factory patterns.
