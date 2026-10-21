---
id: platform/dev/6.7/guides/development/extensions/architecture/extendability.md
title: Extendability
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/extendability.html
sourceHash: cb0760589b0291b82c70fdd39285edbc098136bc
codeCheckedAgainst: "6.7.15.1"
keywords: ["extendability", "design patterns", "decoration", "factory", "visitor", "mediator", "adapter", "AbstractCategoryRoute", "LineItemFactoryRegistry", "Processor", "checkout.order.placed", "ProductPageLoadedHook", "HoneypotCaptcha", "app scripts hooks"]
summary: "Core guideline on Shopware extendability: requirement types and the decoration, factory, visitor, mediator/event, hook and adapter patterns with core examples."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md"]
---
## What it is

A core coding guideline (mirrored from the Shopware repository) describing why and how Shopware is built to be extended: the technical and business requirements, and the design patterns third-party developers use to hook in.

## When to use

When deciding which extension mechanism fits a customization (replace a service, add a cart step, react to an event, plug in an alternative implementation), or when designing a core-style feature that others must be able to extend.

## Key steps / config

Technical requirements:

- **Functional extensibility** — add features to a feature (e.g. suggestions for enterprise search).
- **Functional modifiability** — rewrite parts (e.g. US tax calculation via tax providers).
- **Functional differentiation** — unlock paid parts of a feature.
- **Functional exchange market** — replace a feature by an external solution (e.g. external newsletter system).

Business requirements: marketplace extensions, adaptive technologies (e.g. listings read via Elasticsearch), environment specifications (e.g. assets via CDN across several app servers).

Patterns and core examples (6.7 class names):

| Pattern | Use | Example |
|---|---|---|
| Decoration | Replace/extend a service, esp. Store API routes | `Shopware\Core\Content\Category\SalesChannel\AbstractCategoryRoute` with `getDecorated()`, implemented by `CategoryRoute` |
| Factory | Interpret/validate/enrich user input | `Shopware\Core\Checkout\Cart\LineItemFactoryRegistry` dispatching to `ProductLineItemFactory` when a line item is added via Store API |
| Visitor | Process objects; third-party visitors run before/after core ones | `Shopware\Core\Checkout\Cart\Processor` calling cart processors such as `ProductCartProcessor` |
| Mediator | Events as entry points | `checkout.order.placed` (`CheckoutOrderPlacedEvent`), dispatched in `CartOrderRoute` once an order is created |
| Hooks | Entry points for [App scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md); the app equivalent of events | `ProductPageLoadedHook` (`product-page-loaded`), dispatched in the storefront `ProductController` |
| Adapter | Configurable, swappable implementations registered in a registry (events or tagged services) | Captcha: `HoneypotCaptcha` (`honeypot`) selected by the configured captcha type |

## Essential identifiers

- `AbstractCategoryRoute`, `CategoryRoute`, `getDecorated()`
- `LineItemFactoryRegistry`, `ProductLineItemFactory`
- `Processor`, `ProductCartProcessor`
- `checkout.order.placed`, `CheckoutOrderPlacedEvent`, `CartOrderRoute`
- `ProductPageLoadedHook`, `ProductController`
- `HoneypotCaptcha`

## Gotchas

- Best practice for new events: pass only the primary key (`private string $orderId;`) rather than the entity (`private OrderEntity $order;`) so listeners load data themselves and async processing is easier. `CheckoutOrderPlacedEvent` itself still carries the `OrderEntity` in 6.7.
- Apps cannot execute code on the server; hooks let them run business logic inside the request without calling their own app server over HTTP.
- The source's decoration example also links a `CachedCategoryRoute` cache decorator (6.4.12.0 links); that class does not exist in the installed 6.7 code.

## Version notes

All source links point to the v6.4.12.0 tag. In 6.7 the cache decorator for the category route is gone; the abstract route plus `getDecorated()` remains the decoration contract.

## Code check (6.7.15.1)
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract decoration contract — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- confirmed `CategoryRoute` — concrete route extends AbstractCategoryRoute — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:27
- absent `CachedCategoryRoute` — cache decorator not present anywhere in the installed code
- confirmed `LineItemFactoryRegistry` — line item factory registry class — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:24
- confirmed `ProductLineItemFactory` — implements LineItemFactoryInterface — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/ProductLineItemFactory.php:15
- confirmed `ProductCartProcessor` — implements CartProcessorInterface, CartDataCollectorInterface — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:40
- confirmed `CheckoutOrderPlacedEvent::EVENT_NAME` — value `checkout.order.placed` — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:34
- confirmed `CheckoutOrderPlacedEvent` — instantiated in CartOrderRoute after order creation — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:137
- confirmed `ProductPageLoadedHook` — dispatched via `$this->hook()` in ProductController — vendor/shopware/storefront/Controller/ProductController.php:66
- confirmed `HoneypotCaptcha::CAPTCHA_NAME` — value `honeypot`, extends AbstractCaptcha — vendor/shopware/storefront/Framework/Captcha/HoneypotCaptcha.php:17
