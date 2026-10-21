---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/extension-vs-events.md
title: Extension Points vs Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/extension-vs-events.html
sourceHash: a68010773a808d3258adaf8d7cc55c4089470164
codeCheckedAgainst: "6.7.15.1"
keywords: ["extension points vs events", "Extension", "ExtensionDispatcher", "ResolveListingExtension", "ProductPriceCalculationExtension", "ProductListingCriteriaEvent", "stopPropagation", "result", "service decoration", "side effects", "replace core logic", "event subscriber"]
summary: "When to use Extension Points (replace core logic, result + stopPropagation) vs events (side-effect notifications) vs service decoration in Shopware 6.7."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

A comparison of the two extension mechanisms: **Extension Points** (result-oriented, flow-controlling — "change how this works") and **Events** (notification, fire-and-forget — "know when this happens"), plus how extension points compare to service decoration.

## When to use

Deciding whether a plugin should subscribe to an extension point, listen to a regular event, or decorate a service.

## Key steps / config

**Use an Extension Point** to replace core functionality, modify data before processing, integrate an external system (e.g. external pricing/search), or add conditional business logic. Subscriber shape:

```php
public function onResolveListing(ResolveListingExtension $event): void
{
    $event->result = $this->customProductLoader->load($event->criteria, $event->context);
    $event->stopPropagation(); // skip the default implementation
}
```

Extension points run before/during the action. Errors in the default implementation are caught by `ExtensionDispatcher::publish()`: `$extension->exception` is set, `<name>.error` is dispatched, and the exception is rethrown only if no subscriber set `result`.

**Use an Event** to send notifications, log actions, update external systems, or trigger follow-ups. Events run after the action, cannot return values or control flow, and error handling is up to the listener.

**Comparison** (from the source): extension points return values via `result` and control flow via `stopPropagation()`; events do neither. Extension points have higher complexity and potentially significant performance impact; events are usually minimal.

**Extension points vs decoration** — see [adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md): multiple extensions are independent subscribers rather than a nested decorator chain; one misbehaving subscriber affects only itself; new parameters become new extension properties instead of signature changes in every decorator; extension classes and event names are discoverable. Prefer an extension point when one exists; decorate only when none does.

**Migration**: logic that used `ProductListingCriteriaEvent` to modify listing criteria can instead subscribe to `ResolveListingExtension` and replace the listing resolution.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension` (`listing-loader.resolve`)
- `ProductPriceCalculationExtension` (`product.calculate-prices`)
- `ProductListingCriteriaEvent`
- `$event->result`, `$event->stopPropagation()`

## Gotchas

- `ProductPriceCalculationExtension` is typed `Extension<void>`: the source's examples assigning a price list to `$event->result` do not match the declared result type.
- Many class names in the source are illustrative and do not exist in core: `ProductListingExtension`, `ProductSearchExtension`, `ProductCreatedEvent`, `ProductUpdatedEvent`, `ProductLoadedEvent`, `OrderPlacedEvent`, `OrderCompletedEvent`, `CustomerRegisteredEvent`.
- Extension points are part of the public API: test extensively, they can break core functionality. Event listeners should stay light and use message queues for heavy work.

## Code check (6.7.15.1)
- confirmed `ResolveListingExtension::NAME` — `'listing-loader.resolve'` — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:20
- confirmed `ExtensionDispatcher` — core service wrapping `event_dispatcher` — vendor/shopware/core/Framework/DependencyInjection/event.php:42
- corrected `ProductPriceCalculationExtension` — docs: result is a price list; code: `@extends Extension<void>` — vendor/shopware/core/Content/Product/Extension/ProductPriceCalculationExtension.php:19
- confirmed `ExtensionDispatcher::publish()` — catches throwable, dispatches error, rethrows if no result — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `Extension::stopPropagation()` — skips default implementation — vendor/shopware/core/Framework/Extensions/Extension.php:98
- confirmed `ProductListingCriteriaEvent` — existing listing criteria event — vendor/shopware/core/Content/Product/Events/ProductListingCriteriaEvent.php:17
- absent `ProductListingExtension` — illustrative, not in installed code
- absent `ProductSearchExtension` — illustrative, not in installed code
- absent `ProductCreatedEvent` — illustrative; `ProductUpdatedEvent`/`ProductLoadedEvent` likewise absent
- absent `OrderPlacedEvent` — illustrative; `OrderCompletedEvent`/`CustomerRegisteredEvent` likewise absent
