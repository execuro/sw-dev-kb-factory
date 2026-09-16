---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/extension-vs-events.md
title: Extension Points vs Events
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/extension-vs-events.html
sourceHash: a68010773a808d3258adaf8d7cc55c4089470164
codeCheckedAgainst: "6.7.13.0"
keywords: ["extension points vs events", "Extension", "ExtensionDispatcher", "ResolveListingExtension", "ProductPriceCalculationExtension", "ProductListingCriteriaEvent", "stopPropagation", "result", "service decoration", "event subscriber", "replace core logic", "side effects", "notification"]
summary: When to use Extension Points (replace/short-circuit core logic via result and stopPropagation) vs events (side effects) vs service decoration.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

A decision guide comparing Shopware's two extension mechanisms: **Extension Points** (result-oriented, can replace or short-circuit core logic) and **Events** (notifications about something that happened, side effects only), plus how extension points relate to service decoration.

## When to use

You need to decide whether to hook a subscriber onto an extension point, an ordinary event, or decorate a service.

## Key steps / config

**Use an extension point** to replace core functionality, modify data before processing, integrate an external system (e.g. pricing, listing loading), or apply conditional business logic. Subscribe to `<NAME>.pre`, set `$event->result`, call `$event->stopPropagation()`:

```php
public function onResolveListing(ResolveListingExtension $event): void
{
    $event->result = $this->customProductLoader->load($event->criteria, $event->context);
    $event->stopPropagation();
}
```

Error handling is built in: if the default implementation throws, the exception is stored on `$extension->exception`, the `<name>.error` event is dispatched, and the exception is rethrown only when no subscriber supplied a result.

**Use an event** to send notifications, log actions, sync external systems, or trigger follow-up work after the action completed. Handlers cannot return values or control flow; error handling is up to the developer.

**Migration**: listing logic previously adjusted through `ProductListingCriteriaEvent` (adding filters) plus post-processing loaded products can instead replace the whole listing resolution via `ResolveListingExtension`.

| Aspect | Extension Points | Events |
|---|---|---|
| Return values | Yes (`result` property) | No |
| Flow control | Yes (`stopPropagation()`) | No |
| Timing | Pre/during action | Post-action |
| Performance impact | Can be significant | Usually minimal |

**Extension points vs service decoration** (see `platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md`): extension points allow independent subscribers on the same logic; a misbehaving subscriber affects only itself; new parameters become new properties without breaking subscribers; they are discoverable by class and event name. Decorators form a chain where one broken link drops others, and signature changes force a plugin major per Shopware major. Prefer an extension point when one exists; decorate only when none does.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension` (`$result`, `$exception`, `stopPropagation()`)
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension` (`listing-loader.resolve`)
- `Shopware\Core\Content\Product\Extension\ProductPriceCalculationExtension` (`product.calculate-prices`)
- `ProductListingCriteriaEvent`

## Gotchas

- Many example class names in the source are illustrative and do not exist in core: `ProductCreatedEvent`, `ProductUpdatedEvent`, `ProductLoadedEvent`, `OrderPlacedEvent`, `OrderCompletedEvent`, `CustomerRegisteredEvent`, `ProductListingExtension`, `ProductSearchExtension`. Real counterparts include `CheckoutOrderPlacedEvent` and `CustomerRegisterEvent`, or the generic `product.written`/`product.loaded` entity events.
- Extension points are public API and can break core behaviour; use sparingly, test extensively, and provide fallbacks. Keep event handlers light and move heavy work to message queues.

## Code check (6.7.13.0)
- confirmed `ResolveListingExtension` — NAME `listing-loader.resolve`, props criteria/context — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:20
- confirmed `ProductPriceCalculationExtension` — NAME `product.calculate-prices`, prop products — vendor/shopware/core/Content/Product/Extension/ProductPriceCalculationExtension.php:22
- confirmed `ExtensionDispatcher::publish()` — error phase rethrows when result stays null — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `ProductListingCriteriaEvent` — class exists — vendor/shopware/core/Content/Product/Events/ProductListingCriteriaEvent.php:14
- corrected `CheckoutOrderPlacedEvent` — docs: OrderPlacedEvent — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27
- corrected `CustomerRegisterEvent` — docs: CustomerRegisteredEvent — vendor/shopware/core/Checkout/Customer/Event/CustomerRegisterEvent.php:21
- absent `ProductCreatedEvent` — illustrative example class
- absent `ProductUpdatedEvent` — illustrative example class
- absent `ProductListingExtension` — illustrative; no such extension point
- absent `ProductSearchExtension` — illustrative; no such extension point
