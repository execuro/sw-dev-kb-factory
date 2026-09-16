---
id: platform/dev/6.7/resources/guidelines/code/core/extendability.md
title: Extendability
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/extendability.html
sourceHash: d2c1ae6a0fea1d2f72acab33ab90b730525d4257
codeCheckedAgainst: "6.7.13.0"
keywords: ["extendability", "extensibility", "design patterns", "decoration", "AbstractCategoryRoute", "getDecorated", "factory", "LineItemFactoryRegistry", "visitor", "Processor", "mediator", "checkout.order.placed", "ProductPageLoadedHook", "adapter", "HoneypotCaptcha"]
summary: "Core extendability guideline: technical/business requirements, project templates, apps, plugins, and decoration/factory/visitor/mediator/adapter patterns."
lastBuilt: 2026-09-15
---
## What it is

A core coding guideline (mirrored from `coding-guidelines/core/extendability.md` in the Shopware repository) describing which extension use cases the core architecture must support and which design patterns realise them, with a reference class for each pattern.

## When to use

When designing a new core feature or plugin-facing API and deciding how third parties should extend, modify, or replace it; or when looking for the canonical example of a Shopware extension pattern.

## Key steps / config

**Technical requirements** (how the software must be designed):
- Functional extensibility: add features to a feature (e.g. suggestions for enterprise search).
- Functional modifiability: rewrite parts of a feature (e.g. US tax calculation via tax providers).
- Functional differentiation: parts of a feature can be unlocked by a paid edition.
- Functional exchange market: replace a feature entirely by an external solution (e.g. external newsletter system).

**Business requirements**: marketplace extensions, adaptive technologies (e.g. listings read via Elasticsearch), environment specifications (e.g. assets via CDN with several app servers).

**Approaches**:
- Project templates: large customers deploy a fork of the production template; local customisations are bundles, not plugins.
- Apps: minor extensions, designed for cloud products.
- Plugins: larger extensions, able to replace any area of Shopware.

**Patterns and their reference implementations (verified in 6.7.13.0)**:
- Decoration: Store API routes. `Shopware\Core\Content\Category\SalesChannel\AbstractCategoryRoute` declares `abstract public function getDecorated(): AbstractCategoryRoute`; `CategoryRoute` extends it. Decorators extend the abstract class and delegate to `getDecorated()`.
- Factory: `Shopware\Core\Checkout\Cart\LineItemFactoryRegistry` (marked `@final`) receives handlers tagged `shopware.cart.line_item.factory`; `ProductLineItemFactory` implements `LineItemFactoryInterface` and instantiates/enriches the line item when adding to the cart via Store API.
- Visitor: `Shopware\Core\Checkout\Cart\Processor` calls all cart processors such as `ProductCartProcessor` (implements `CartProcessorInterface`, `CartDataCollectorInterface`), which transfer line items from the previous cart to the calculated one.
- Mediator: events, e.g. `CheckoutOrderPlacedEvent` with `EVENT_NAME = 'checkout.order.placed'`, dispatched when an order is created.
- Hooks (observer, for App Scripts): `Shopware\Storefront\Page\Product\ProductPageLoadedHook`, instantiated in `ProductController` via `$this->hook(new ProductPageLoadedHook($page, $context))`; every app script registered to the hook runs.
- Adapter: registries of selectable adapters, extended via events or tagged services. Example: captcha — `HoneypotCaptcha` extends `AbstractCaptcha`; captchas are tagged `shopware.storefront.captcha`.

## Essential identifiers

- `AbstractCategoryRoute`, `CategoryRoute`, `getDecorated()`
- `LineItemFactoryRegistry`, `ProductLineItemFactory`, `LineItemFactoryInterface`, tag `shopware.cart.line_item.factory`
- `Processor`, `ProductCartProcessor`
- `CheckoutOrderPlacedEvent`, `checkout.order.placed`
- `ProductPageLoadedHook`
- `HoneypotCaptcha`, `AbstractCaptcha`, tag `shopware.storefront.captcha`

## Gotchas

- Best practice for new events: pass only the primary key (`private string $orderId;`), not the entity (`private OrderEntity $order;`), so listeners load data themselves and async processing is easier. The existing `CheckoutOrderPlacedEvent` still carries the full `OrderEntity` in 6.7.13.0 (it also offers `getOrderId()`).
- Apps cannot run server code; hooks are their equivalent of events.

## Version notes

- The source's example links point to v6.4.12.0, including a `CachedCategoryRoute` cache decorator. That class no longer exists in the installed 6.7.13.0 code; the decoration chain for the category route is `AbstractCategoryRoute` / `CategoryRoute` only.

## Code check (6.7.13.0)
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract decoration contract — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- confirmed `CategoryRoute` — concrete route extends the abstract class — vendor/shopware/core/Content/Category/SalesChannel/CategoryRoute.php:27
- absent `CachedCategoryRoute` — cache decorator from the v6.4 docs link is not in the installed code
- confirmed `LineItemFactoryRegistry` — marked @final, collects tagged factories — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:24
- confirmed `shopware.cart.line_item.factory` — tagged iterator for the registry — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:429
- confirmed `ProductLineItemFactory` — implements LineItemFactoryInterface — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/ProductLineItemFactory.php:15
- confirmed `ProductCartProcessor` — cart processor and data collector — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:40
- confirmed `CheckoutOrderPlacedEvent::$order` — installed event still holds the full OrderEntity — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:33
- confirmed `ProductPageLoadedHook` — dispatched from ProductController — vendor/shopware/storefront/Controller/ProductController.php:65
- confirmed `HoneypotCaptcha` — extends AbstractCaptcha — vendor/shopware/storefront/Framework/Captcha/HoneypotCaptcha.php:13
