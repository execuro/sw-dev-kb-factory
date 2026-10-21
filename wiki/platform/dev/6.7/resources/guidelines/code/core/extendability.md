---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/code/core/extendability.md
sourceHash: 9fb3aa0f95d36cbaf65fd8e76ac992f52702ffc5
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/extendability.html
title: Extendability
version: "6.7"
versions:
  - "6.7"
keywords: ["extendability", "extensibility", "design patterns", "decoration", "factory", "visitor", "mediator", "adapter", "LineItemFactoryRegistry", "ExtensionDispatcher", "ResolveListingExtension", "ProductPageLoadedHook", "checkout.order.placed", "app scripts hooks", "core guidelines"]
summary: "Shopware core extendability guideline: requirements, apps/plugins/templates, and decoration, factory, visitor, mediator, adapter patterns"
lastBuilt: 2026-10-21
---
## What it is

A core coding guideline (mirrored from the Shopware repository's `coding-guidelines/core/extendability.md`) describing why and how Shopware features must be built so third parties and Shopware itself can extend, modify, or replace them. It lists the technical and business requirements, the three extension approaches, and five design patterns with concrete core examples.

## When to use

When designing a new core feature or extension point and deciding which pattern (decorator, factory registry, processor/visitor, event/extension event/hook, adapter registry) third-party developers should use to customize it.

## Key steps / config

**Technical requirements** a feature must support:

- Functional extensibility — add features (e.g. a suggestion feature for enterprise search).
- Functional modifiability — rewrite parts (e.g. US tax calculation via tax providers).
- Functional differentiation — parts can be unlocked per paid edition.
- Functional exchange market — replace the feature with an external solution (e.g. an external newsletter system).

**Business requirements:** marketplace extensions (e.g. a CMS page publishing plugin), adaptive technologies (e.g. listings read via Elasticsearch), environment specifications (e.g. assets served via CDN across several app servers).

**Approaches:**

- Project templates — forks of the production template; local customizations are bundles, not plugins.
- Apps — minor extensions, designed for cloud products.
- Plugins — larger extensions, able to replace all areas of Shopware.

**Patterns and core examples:**

| Pattern | Serves | Core example |
|---|---|---|
| Decoration | functional exchange/replacement | replace or extend whole areas |
| Factory | functional extensibility (interpret/validate user input) | `LineItemFactoryRegistry` with handlers such as `ProductLineItemFactory`, used when adding items to the cart via Store API |
| Visitor | extensibility and modifiability | cart `Processor` calling line item processors like `ProductCartProcessor` |
| Mediator (+ Observer) | extensibility and modifiability | Symfony EventDispatcher events, e.g. `checkout.order.placed` (`CheckoutOrderPlacedEvent`) dispatched from `CartOrderRoute` |
| Adapter | functional exchange market | captcha types, e.g. `HoneypotCaptcha`, picked by configuration from a registry |

**Extension events:** `ExtensionDispatcher` lets plugins modify inputs and results or replace an operation via a typed extension event. `ProductListingLoader` publishes `ResolveListingExtension` around listing loading, so a plugin can adjust the criteria, enrich the result, or replace loading entirely.

**Hooks:** the app-script equivalent of events. Apps cannot execute server code directly; hooks run registered app scripts within the request instead of calling the app server via HTTP. `ProductPageLoadedHook` is instantiated and dispatched in the Storefront `ProductController` and lets apps load extra data on the product detail page.

**Adapters** are usually registered in a registry; third parties add new ones via events or tagged services.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\LineItemFactoryRegistry`
- `Shopware\Core\Checkout\Cart\LineItemFactoryHandler\ProductLineItemFactory`
- `Shopware\Core\Checkout\Cart\Processor`, `Shopware\Core\Content\Product\Cart\ProductCartProcessor`
- `Shopware\Core\Checkout\Cart\Event\CheckoutOrderPlacedEvent` (`checkout.order.placed`)
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Shopware\Core\Content\Product\Extension\ResolveListingExtension`
- `Shopware\Storefront\Page\Product\ProductPageLoadedHook`
- `Shopware\Storefront\Framework\Captcha\HoneypotCaptcha`

## Gotchas

- Events should carry only a primary key, not entities: an optimized `checkout.order.placed` would hold `private string $orderId;` instead of `private OrderEntity $order;`. Listeners then load data themselves, and asynchronous processing becomes easier. The current event still takes an `OrderEntity`.

## Code check (6.7.15.1)
- confirmed `LineItemFactoryRegistry` — class exists in the cart namespace — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:24
- confirmed `ProductLineItemFactory` — implements LineItemFactoryInterface — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/ProductLineItemFactory.php:15
- confirmed `Processor` — cart processor class — vendor/shopware/core/Checkout/Cart/Processor.php:14
- confirmed `ProductCartProcessor` — implements CartProcessorInterface and CartDataCollectorInterface — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:40
- confirmed `CheckoutOrderPlacedEvent::EVENT_NAME` — value checkout.order.placed; constructor still takes OrderEntity $order — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
- confirmed `CheckoutOrderPlacedEvent` — dispatched from CartOrderRoute — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:137
- confirmed `ExtensionDispatcher` — final readonly class — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:9
- confirmed `ResolveListingExtension::NAME` — listing-loader.resolve, published by ProductListingLoader — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:133
- confirmed `ProductPageLoadedHook` — dispatched in ProductController — vendor/shopware/storefront/Controller/ProductController.php:66
- confirmed `HoneypotCaptcha` — extends AbstractCaptcha — vendor/shopware/storefront/Framework/Captcha/HoneypotCaptcha.php:15
