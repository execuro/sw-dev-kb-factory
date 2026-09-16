---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/finding-extensions.md
title: Finding Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/finding-extensions.html
sourceHash: 51b55dbc9e3d6e796b111a3c91290f1d35184799
codeCheckedAgainst: "6.7.13.0"
keywords: ["find extension points", "extends Extension", "ExtensionDispatcher", "ResolveListingExtension", "ProductPriceCalculationExtension", "ProductListingCriteriaExtension", "CheckoutPlaceOrderExtension", "CheckoutCartRuleLoaderExtension", "CmsSlotsDataEnrichExtension", "CmsSlotsDataResolveExtension", "listing-loader.resolve.pre", "kernel.event_subscriber", "symfony profiler"]
summary: Locating built-in extension points (extends Extension), their NAME event ids and properties, and subscribing to their .pre/.post/.error events.
lastBuilt: 2026-09-15
---
## What it is

How to discover the built-in Extension Points in the Shopware codebase, their event names and properties, and how to subscribe to them from a plugin.

## When to use

You want to replace or modify a core process and need to know whether an extension point exists for it and what it passes to subscribers.

## Key steps / config

1. **Search the source** for `extends Extension` (all extension classes), `Extension<` (typed result), and `ExtensionDispatcher` (services that publish them via `$this->extensionDispatcher->publish(SomeExtension::NAME, $extension, $defaultCallable)`). Typical locations: `src/Core/Content/*/Extension/`, `src/Core/Checkout/*/Extension/`.
2. **Read the `NAME` constant** — the dispatcher fires `{NAME}.pre` (before the default implementation), `{NAME}.post` (after it) and `{NAME}.error` (when it throws).
3. **Subscribe** with a normal event subscriber tagged `kernel.event_subscriber`:

```php
public static function getSubscribedEvents(): array
{
    return ['listing-loader.resolve.pre' => 'onResolveListing'];
}

public function onResolveListing(ResolveListingExtension $event): void
{
    $event->result = $this->customProductLoader->load($event->criteria, $event->context);
    $event->stopPropagation(); // skips the default implementation
}
```

Built-in extension points (installed code):

| Class | `NAME` | Properties / result |
|---|---|---|
| `ProductPriceCalculationExtension` | `product.calculate-prices` | `products`, `context`; `void` |
| `ResolveListingExtension` | `listing-loader.resolve` | `criteria`, `context`; `EntitySearchResult<ProductCollection>` |
| `ProductListingCriteriaExtension` | `product.listing.criteria` | |
| `CheckoutPlaceOrderExtension` | `checkout.place-order` | `cart`, `context`, `data`; `OrderPlaceResult` |
| `CheckoutCartRuleLoaderExtension` | `checkout.cart.rule-load` | |
| `CmsSlotsDataEnrichExtension` | `cms-slots-data.enrich` | `slots`, `criteriaList`, `identifierResult`, `criteriaResult`, `resolverContext`; `CmsSlotCollection` |
| `CmsSlotsDataResolveExtension` | `cms-slots-data.resolve` | |

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension`, `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension`
- `Shopware\Core\Checkout\Cart\Extension\CheckoutPlaceOrderExtension`
- `Shopware\Core\Content\Cms\Extension\CmsSlotsDataEnrichExtension`

## Gotchas

- Check `$event->result !== null` before overwriting — another subscriber may already have provided a result.
- Call `stopPropagation()` only for a complete replacement; otherwise the default implementation continues.
- The source gives `cms.slots.data-enrich` and only `slots`/`context` for the CMS enrich point, and only `cart`/`context` for place-order; the installed code differs (see table).
- Debugging: the Symfony profiler "Events" tab lists the dispatched `.pre`/`.post`/`.error` names; `isPropagationStopped()` shows whether a subscriber short-circuited.

## Code check (6.7.13.0)
- confirmed `ResolveListingExtension::NAME` — `listing-loader.resolve` — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:20
- confirmed `ProductPriceCalculationExtension::NAME` — `product.calculate-prices`, result void — vendor/shopware/core/Content/Product/Extension/ProductPriceCalculationExtension.php:24
- corrected `CheckoutPlaceOrderExtension::$data` — docs: only cart and context — vendor/shopware/core/Checkout/Cart/Extension/CheckoutPlaceOrderExtension.php:46
- corrected `CmsSlotsDataEnrichExtension::NAME` — docs: cms.slots.data-enrich — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataEnrichExtension.php:30
- corrected `CmsSlotsDataEnrichExtension::$resolverContext` — docs: SalesChannelContext $context — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataEnrichExtension.php:73
- confirmed `ProductListingCriteriaExtension::NAME` — `product.listing.criteria` — vendor/shopware/core/Content/Product/Extension/ProductListingCriteriaExtension.php:18
- confirmed `CheckoutCartRuleLoaderExtension::NAME` — `checkout.cart.rule-load` — vendor/shopware/core/Checkout/Cart/Extension/CheckoutCartRuleLoaderExtension.php:23
- confirmed `CmsSlotsDataResolveExtension::NAME` — `cms-slots-data.resolve` — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataResolveExtension.php:25
- confirmed `ExtensionDispatcher::pre()` — appends `.pre` — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:23
- confirmed `Extension::isPropagationStopped()` — public accessor — vendor/shopware/core/Framework/Extensions/Extension.php:86
