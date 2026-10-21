---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/finding-extensions.md
title: Finding Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/finding-extensions.html
sourceHash: 51b55dbc9e3d6e796b111a3c91290f1d35184799
codeCheckedAgainst: "6.7.15.1"
keywords: ["finding extension points", "extends Extension", "ExtensionDispatcher", "ResolveListingExtension", "ProductPriceCalculationExtension", "CheckoutPlaceOrderExtension", "CmsSlotsDataEnrichExtension", "listing-loader.resolve", "cms-slots-data.enrich", "checkout.place-order", "event lifecycle", "symfony profiler"]
summary: "Locating built-in Shopware extension points, their NAME event names and result types, and subscribing to their .pre/.post/.error events."
lastBuilt: 2026-10-21
---
## What it is

How to locate the built-in extension points in the Shopware source and subscribe to them from a plugin: classes extending `Shopware\Core\Framework\Extensions\Extension`, dispatched via `Shopware\Core\Framework\Extensions\ExtensionDispatcher`.

## When to use

You want to replace or extend a core process and need to know whether an extension point exists, its event name, and its input properties.

## Key steps / config

1. **Search** the source for `extends Extension`, `Extension<` (typed result) and `ExtensionDispatcher` (publishing sites). Classes sit in `Extension/` directories, e.g. `src/Core/Content/Product/Extension/`, `src/Core/Checkout/Cart/Extension/`, `src/Core/Content/Cms/Extension/`.
2. **Read the `NAME` constant** — it is the base event name; subscribe to `{name}.pre`, `{name}.post` or `{name}.error` (or use `SomeExtension::onPre()` / `onPost()` / `onError()`).
3. **Subscribe and register**:

```php
public static function getSubscribedEvents(): array
{
    return ['listing-loader.resolve.pre' => 'onResolveListing'];
}

public function onResolveListing(ResolveListingExtension $event): void
{
    $event->result = $this->customProductLoader->load($event->criteria, $event->context);
    $event->stopPropagation();
}
```

Register with `$services->set(MyPlugin\Subscriber\ProductListingSubscriber::class)->tag('kernel.event_subscriber');`.

**Installed extension points** (selection):

| Class | `NAME` | Result |
|---|---|---|
| `ProductPriceCalculationExtension` | `product.calculate-prices` | `void` |
| `ResolveListingExtension` | `listing-loader.resolve` | `EntitySearchResult<ProductCollection>` |
| `ProductListingCriteriaExtension` | `product.listing.criteria` | `Criteria` |
| `CheckoutPlaceOrderExtension` | `checkout.place-order` | `OrderPlaceResult` |
| `CheckoutCartRuleLoaderExtension` | `checkout.cart.rule-load` | `RuleLoaderResult` |
| `CmsSlotsDataEnrichExtension` | `cms-slots-data.enrich` | `CmsSlotCollection` |
| `CmsSlotsDataResolveExtension` | `cms-slots-data.resolve` | `CmsSlotCollection` |

Lifecycle: `.pre` → default implementation (skipped if a pre subscriber called `stopPropagation()`) → `.error` only if the default threw → `.post`.

Practices from the source: check `$event->result !== null` before overwriting another subscriber's result; stop propagation only when supplying a complete replacement. The Symfony profiler's "Events" tab lists dispatched extension events by their `.pre`/`.post`/`.error` suffixes.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension`, `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension`
- `CheckoutPlaceOrderExtension`, `CmsSlotsDataEnrichExtension`, `ProductPriceCalculationExtension`
- `kernel.event_subscriber`

## Gotchas

- The source gives `cms.slots.data-enrich` for `CmsSlotsDataEnrichExtension`; the installed `NAME` is `cms-slots-data.enrich`, and its constructor takes `slots`, `criteriaList`, `identifierResult`, `criteriaResult`, `resolverContext` (no `context`).
- `CheckoutPlaceOrderExtension` also carries a `RequestDataBag $data` property besides `cart` and `context`.
- `.post` runs even after a pre subscriber stopped propagation.

## Code check (6.7.15.1)
- confirmed `ResolveListingExtension::NAME` — `'listing-loader.resolve'` — vendor/shopware/core/Content/Product/Extension/ResolveListingExtension.php:20
- confirmed `ProductPriceCalculationExtension::NAME` — `'product.calculate-prices'`, `Extension<void>` — vendor/shopware/core/Content/Product/Extension/ProductPriceCalculationExtension.php:24
- confirmed `ProductListingCriteriaExtension::NAME` — `'product.listing.criteria'` — vendor/shopware/core/Content/Product/Extension/ProductListingCriteriaExtension.php:18
- confirmed `CheckoutPlaceOrderExtension::NAME` — `'checkout.place-order'` — vendor/shopware/core/Checkout/Cart/Extension/CheckoutPlaceOrderExtension.php:23
- corrected `CheckoutPlaceOrderExtension::$data` — docs: only cart and context — vendor/shopware/core/Checkout/Cart/Extension/CheckoutPlaceOrderExtension.php:46
- confirmed `CheckoutCartRuleLoaderExtension::NAME` — `'checkout.cart.rule-load'` — vendor/shopware/core/Checkout/Cart/Extension/CheckoutCartRuleLoaderExtension.php:23
- corrected `CmsSlotsDataEnrichExtension::NAME` — docs: `cms.slots.data-enrich`; code: `cms-slots-data.enrich` — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataEnrichExtension.php:30
- corrected `CmsSlotsDataEnrichExtension::$resolverContext` — docs: `SalesChannelContext $context` — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataEnrichExtension.php:73
- confirmed `CmsSlotsDataResolveExtension::NAME` — `'cms-slots-data.resolve'` — vendor/shopware/core/Content/Cms/Extension/CmsSlotsDataResolveExtension.php:25
- confirmed `ExtensionDispatcher::publish()` — dispatches pre, default, error, post — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
