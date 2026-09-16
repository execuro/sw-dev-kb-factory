---
id: platform/dev/6.7/guides/development/extensions/architecture/extendability.md
title: Extendability
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/extendability.html
sourceHash: cb0760589b0291b82c70fdd39285edbc098136bc
codeCheckedAgainst: "6.7.13.0"
keywords: ["extendability", "design patterns", "decoration", "AbstractCategoryRoute", "LineItemFactoryRegistry", "cart processor", "CheckoutOrderPlacedEvent", "checkout.order.placed", "ProductPageLoadedHook", "app scripts hooks", "HoneypotCaptcha", "adapter pattern", "visitor pattern", "mediator events"]
summary: Core coding guideline on extendability - requirement types and the decoration, factory, visitor, mediator/hook and adapter patterns with core examples.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md"]
---
## What it is

A core guideline (mirrored from `coding-guidelines/core/extendability.md` in the Shopware repository) describing why and how Shopware is built to be extended: the technical and business requirements, and the five design patterns that let third parties extend the software, each with a core example.

## When to use

- Choosing the right extension point for a customisation (decorate a service, add a factory, add a cart processor, listen to an event/hook, register an adapter).
- Designing your own extension or core contribution so that others can extend it the same way.

## Key steps / config

Technical requirements: functional **extensibility** (add features), **modifiability** (rewrite parts, e.g. tax providers), **differentiation** (paid unlockable parts), **exchange market** (replace entirely by an external solution). Business requirements: marketplace extensions, adaptive technologies (e.g. listings read via Elasticsearch), environment specifications (e.g. assets via CDN).

Patterns and the installed core examples:

1. **Decoration** — replace/extend areas, used heavily for Store API routes. Type against the abstract class, decorate the concrete one: `Shopware\Core\Content\Category\SalesChannel\AbstractCategoryRoute` (declares `abstract public function getDecorated(): AbstractCategoryRoute`) implemented by `CategoryRoute`, whose `getDecorated()` throws `DecorationPatternException`.
2. **Factory** — interpret/validate/enrich user input before it reaches the application: `Shopware\Core\Checkout\Cart\LineItemFactoryRegistry`, used when an item is added to the cart via the Store API, with handlers such as `ProductLineItemFactory` (implements `LineItemFactoryInterface`; such services carry the tag `shopware.cart.line_item.factory`).
3. **Visitor** — core and third-party visitors manipulate processed objects: `Shopware\Core\Checkout\Cart\Processor` runs cart processors such as `ProductCartProcessor` (implements `CartProcessorInterface` and `CartDataCollectorInterface`; tag `shopware.cart.processor`).
4. **Mediator** — events as entry points: `CheckoutOrderPlacedEvent` (`EVENT_NAME = 'checkout.order.placed'`), dispatched from `CartOrderRoute` when an order is created.
   - **Hooks** are the app equivalent of events, executing [App scripts](platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md) inside the request: `Shopware\Storefront\Page\Product\ProductPageLoadedHook` (`HOOK_NAME = 'product-page-loaded'`) is dispatched in `ProductController`.
5. **Adapter** — for the exchange-market case: adapters registered in a registry, added via events or tagged services. Example: captchas; the merchant configures a captcha type and the matching adapter is used, e.g. `Shopware\Storefront\Framework\Captcha\HoneypotCaptcha` (`CAPTCHA_NAME = 'honeypot'`, extends `AbstractCaptcha`). Captcha adapters are collected via the tag `shopware.storefront.captcha`.

## Essential identifiers

- `AbstractCategoryRoute::getDecorated()`, `CategoryRoute`
- `LineItemFactoryRegistry`, `ProductLineItemFactory`, `shopware.cart.line_item.factory`
- `Processor`, `ProductCartProcessor`, `shopware.cart.processor`
- `CheckoutOrderPlacedEvent`, `checkout.order.placed`, `CartOrderRoute`
- `ProductPageLoadedHook`, `product-page-loaded`
- `HoneypotCaptcha`, `AbstractCaptcha`, `shopware.storefront.captcha`

## Gotchas

- Best practice per the guideline: pass only primary keys in events (`private string $orderId;`) rather than entities, so listeners load data themselves and async processing is easier. The installed `CheckoutOrderPlacedEvent` still takes `OrderEntity $order` — the "optimized variant" is a recommendation, not the current code.
- The source links example classes at tag v6.4.12.0. The cache decorator `CachedCategoryRoute` it cites no longer exists in 6.7.13.0; `CategoryRoute` receives a `CacheTagCollector` instead.

## Code check (6.7.13.0)
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract decoration method — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- absent `CachedCategoryRoute` — docs cite it as cache decorator; not found anywhere in installed code
- confirmed `LineItemFactoryRegistry` — registry class — vendor/shopware/core/Checkout/Cart/LineItemFactoryRegistry.php:24
- confirmed `ProductLineItemFactory` — implements LineItemFactoryInterface — vendor/shopware/core/Checkout/Cart/LineItemFactoryHandler/ProductLineItemFactory.php:15
- confirmed `ProductCartProcessor` — implements CartProcessorInterface — vendor/shopware/core/Content/Product/Cart/ProductCartProcessor.php:40
- confirmed `shopware.cart.processor` — autoconfigured tag — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:82
- confirmed `CheckoutOrderPlacedEvent::EVENT_NAME` — 'checkout.order.placed', still takes OrderEntity — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:29
- confirmed `CheckoutOrderPlacedEvent` — dispatched in CartOrderRoute — vendor/shopware/core/Checkout/Cart/SalesChannel/CartOrderRoute.php:133
- confirmed `ProductPageLoadedHook` — dispatched in ProductController — vendor/shopware/storefront/Controller/ProductController.php:65
- confirmed `HoneypotCaptcha::CAPTCHA_NAME` — 'honeypot', extends AbstractCaptcha — vendor/shopware/storefront/Framework/Captcha/HoneypotCaptcha.php:15
