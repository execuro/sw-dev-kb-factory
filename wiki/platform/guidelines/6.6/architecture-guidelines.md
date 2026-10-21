---
id: platform/guidelines/6.6/architecture-guidelines.md
title: Architecture guidelines
docType: guideline
version: "6.6"
summary: Shopware 6.6 architecture rules - extension patterns, decoration, plugin vs app, Store API first, thin controllers, events, caching, BC annotations.
keywords: ["architecture", "decoration", "getdecorated", "extendability", "store-api", "storefront-controller", "backward-compatibility", "deprecated", "internal", "feature-flag", "app-system", "cache"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/extendability.html", hash: "fb6201855e3ed24346ca0c78fa7998bfc6dc0556f17b182b790bf6414d49e581"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html", hash: "331b8608cb07e3905257afb0e836a27850dd8033dbf7d1784a964504b90920fd"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/final-and-internal.html", hash: "4c49d8de5d81ea5438c0c698a7b31338b7ae7a9f1a9b668efa5c4b1bc3db2e5d"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/internal.html", hash: "7a3af96c2fbaee56956e1d12e124b894bb662fe83187e60b60353d8b8c35b725"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/backward-compatibility.html", hash: "e65328358f1a66f1cfba615277aae3d781cd45ccad09412b1b93735e5adeb30e"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/public-apis.html", hash: "a520fae119ef32130031e66e345e73897ccd9807e234b8c7b28b59e725ade440"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/platform-domains.html", hash: "a45a487e9ff909a03d5d75cb910804a80844715a7f7f26f07277fbee9417bb47"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/routing.html", hash: "78d2a6e2522bb6d2db02289c08e9cbe7ff9e5d067eb7f95cec82c2b465244310"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/store-api.html", hash: "01469736cbb0cc2454915436a13d68ee8837d2dc94cfbe2ea6e49e5622c024c2"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html", hash: "faedd30998c9049d5f592e49e74491151e8e0fda47282c4092f1db4f909dafa5"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/session-and-state.html", hash: "eea63b140a1e4ade43645dde59cfeb2c111c54146c82649a556588a156e13caa"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-25-decoration-pattern.html", hash: "cd4784ca7e8fe767f5527ceb9460434fc72989374b609a60a9d6381bc12b1596"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-06-creating-events.html", hash: "d04c0e62d4bbc98b12f3945f29a75bcb81fbcd31bbcd6b1e961276a46b8ea10f"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html", hash: "4d6f09b25b5cf28ac610236d0f06db9537129053fa4c867c6af84bc61f9080c5"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-10-21-app-scripting.html", hash: "3473b7abcd1913c3df7028676d44155c6e8110099aab77d67682eab547119118"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-09-increment-pattern.html", hash: "bdffe14dccf7c138421ea0d0e017b2dd3f6071889be42661be4226cd9c758471"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-cache-stampede-protection.html", hash: "63e85dbb2db858f01b0c895596db8e55034bb52d0260f7ee3144700b3f0b8662"}]
codeVersion: "6.6.10.29+c8b59f9d"
lastBuilt: 2026-10-21
---

## Index

- [platform/guidelines/6.6/be-architecture-guidelines.md](platform/guidelines/6.6/be-architecture-guidelines.md) — DAL modelling, migrations, Messenger, Rule/Flow Builder.
- [platform/guidelines/6.6/fe-architecture-guidelines.md](platform/guidelines/6.6/fe-architecture-guidelines.md) — admin extension model, theme/template inheritance.

## extension point ladder

- Use the least invasive pattern: event or app script hook first, then a tagged service in a registry (e.g. a `LineItemFactoryRegistry` handler, a cart processor, an `AbstractCaptcha` adapter), decoration only to change or replace behaviour.
- Put only primary keys in new events (`string $orderId`, not `OrderEntity $order`); listeners load their own data.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/extendability.html

## decoration pattern

- Decorate through the `Abstract*` class, never by extending the concrete core class or via an interface; type-hint the abstract class.
- The abstract class declares `getDecorated()`; the core implementation throws `DecorationPatternException`; your decorator returns the inner service.
- Never mark a decoratable abstract class `@internal` or `@final`; never add public methods the parent lacks; never implement `EventSubscriberInterface` in a decorator.
- Add new methods to a decoratable abstract class as concrete methods delegating to `$this->getDecorated()`, never as abstract ones.
- For a private cache/logging wrapper, inject the inner service without `getDecorated()` and mark it `@internal` or `@final`.

Enforced by: PHPStan

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-25-decoration-pattern.html

## plugin app or project bundle

- Choose an app for cloud compatibility: no PHP on the shop server; use webhooks, action buttons, custom modules, custom fields and app scripts (sandboxed Twig) for synchronous logic.
- Choose a plugin to replace or extend arbitrary areas with PHP and admin JS; use a bundle in project templates.
- Treat the manifest schema and outgoing app requests as public API: add, never remove or tighten, in a minor.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-10-21-app-scripting.html

## headless first and thin controllers

- Build each storefront feature on a Store API route; routes are services with `#[Route(defaults: ['_routeScope' => ['store-api']])]`, one purpose each, returning a `StoreApiResponse` with one object.
- Storefront controllers extend `StorefrontController`, use `_routeScope` `storefront`, prefix route names with `frontend`, declare HTTP methods and return types.
- Keep business logic and repositories out of controllers: read via routes or page loaders, write via the Store API route and answer with `createActionResponse()`.
- Ship OpenAPI schemas in the bundle's `Resources/Schema/StoreApi` or `Resources/Schema/AdminApi`.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/store-api.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/routing.html

## context and domain boundaries

- Give every new event `Context`; implement `ShopwareEvent`, or `ShopwareSalesChannelEvent` when a `SalesChannelContext` exists.
- Never access the PHP session in `Core`; it belongs to the Storefront.
- `Core` depends on no other domain; `Storefront`, `Administration` and `Elasticsearch` depend only on `Core`.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-06-creating-events.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/session-and-state.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/platform-domains.html

## http cache and caching

- Set the `_httpCache` route default on pages identical for all customers.
- Build cache layers on `Symfony\Contracts\Cache\CacheInterface::get()` with a callback (as `CachedRuleLoader` does) for stampede protection.
- Route high-frequency counters through `IncrementGatewayRegistry` pools, not the DAL.
- Do not build on `Cached*Route` decorators such as `CachedCategoryRoute`; they are deprecated for v6.7.0.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-cache-stampede-protection.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-09-increment-pattern.html

## public api and annotations

- Treat public/protected members as public API unless `@internal`; never use, extend or decorate `@internal` code. `@final` classes may be used, not extended.
- DI service constructors are not public API; DTO constructors (`CalculatedPrice`, `QuantityPriceDefinition`) are.
- Mark obsolete code `@deprecated tag:v<major> - <replacement>`; gate unreleased work with `Feature::isActive()` plus `@internal (flag:<FLAG>)`, `@feature-deprecated` or `@major-deprecated`.
- In a minor never change return types, public constants, namespaces, visibility or static state, nor remove events, Twig blocks, CSS selectors or JS plugins; add only optional arguments via `func_get_args()`.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/backward-compatibility.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/public-apis.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/final-and-internal.html

## Code check (6.6.10.29+c8b59f9d)

- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not present in this codeVersion; do not add it
- confirmed `DecorationPatternRule` — PHPStan rule — core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:32
- confirmed `DecorationPatternException` — core base throws it — core/Framework/Plugin/Exception/DecorationPatternException.php:10
- confirmed `StorefrontController` — controller base — storefront/Controller/StorefrontController.php:38
- confirmed `CachedRuleLoader` — CacheInterface layer — core/Checkout/Cart/CachedRuleLoader.php:14
- confirmed `Feature::isActive` — flag check — core/Framework/Feature.php:97
- deprecated `CachedCategoryRoute` — removal in v6.7.0 — core/Content/Category/SalesChannel/CachedCategoryRoute.php:25
