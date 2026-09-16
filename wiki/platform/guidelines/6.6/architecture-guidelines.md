---
id: platform/guidelines/6.6/architecture-guidelines.md
title: Architecture guidelines
docType: guideline
version: "6.6"
summary: Shopware 6.6 architecture rules - extension points, decoration, domain boundaries, Store API and storefront controllers, caching, BC annotations
keywords: ["architecture", "extendability", "decoration", "getdecorated", "internal", "final", "deprecated", "backward compatibility", "store-api", "storefront controller", "route scope", "http cache", "events", "app system", "feature flag"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/extendability.html", hash: "fb6201855e3ed24346ca0c78fa7998bfc6dc0556f17b182b790bf6414d49e581"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html", hash: "331b8608cb07e3905257afb0e836a27850dd8033dbf7d1784a964504b90920fd"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/final-and-internal.html", hash: "4c49d8de5d81ea5438c0c698a7b31338b7ae7a9f1a9b668efa5c4b1bc3db2e5d"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/internal.html", hash: "7a3af96c2fbaee56956e1d12e124b894bb662fe83187e60b60353d8b8c35b725"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/backward-compatibility.html", hash: "e65328358f1a66f1cfba615277aae3d781cd45ccad09412b1b93735e5adeb30e"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/public-apis.html", hash: "a520fae119ef32130031e66e345e73897ccd9807e234b8c7b28b59e725ade440"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/platform-domains.html", hash: "a45a487e9ff909a03d5d75cb910804a80844715a7f7f26f07277fbee9417bb47"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/routing.html", hash: "78d2a6e2522bb6d2db02289c08e9cbe7ff9e5d067eb7f95cec82c2b465244310"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/store-api.html", hash: "01469736cbb0cc2454915436a13d68ee8837d2dc94cfbe2ea6e49e5622c024c2"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html", hash: "faedd30998c9049d5f592e49e74491151e8e0fda47282c4092f1db4f909dafa5"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/session-and-state.html", hash: "eea63b140a1e4ade43645dde59cfeb2c111c54146c82649a556588a156e13caa"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-25-decoration-pattern.html", hash: "cd4784ca7e8fe767f5527ceb9460434fc72989374b609a60a9d6381bc12b1596"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-06-creating-events.html", hash: "d04c0e62d4bbc98b12f3945f29a75bcb81fbcd31bbcd6b1e961276a46b8ea10f"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html", hash: "4d6f09b25b5cf28ac610236d0f06db9537129053fa4c867c6af84bc61f9080c5"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-10-21-app-scripting.html", hash: "3473b7abcd1913c3df7028676d44155c6e8110099aab77d67682eab547119118"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-09-increment-pattern.html", hash: "bdffe14dccf7c138421ea0d0e017b2dd3f6071889be42661be4226cd9c758471"}, {url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-cache-stampede-protection.html", hash: "63e85dbb2db858f01b0c895596db8e55034bb52d0260f7ee3144700b3f0b8662"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---

## Index

- [platform/guidelines/6.6/be-architecture-guidelines.md](platform/guidelines/6.6/be-architecture-guidelines.md) - DAL modelling, migrations, indexers, messaging, scheduled tasks, Rule/Flow Builder
- [platform/guidelines/6.6/fe-architecture-guidelines.md](platform/guidelines/6.6/fe-architecture-guidelines.md) - admin extension model, storefront theme/template inheritance

## extension approach

- Choose: app (small, cloud-compatible, no PHP on the shop server), plugin (large, can replace any area), bundle in a project template (project-local code).
- Apps run backend logic on their own server (webhooks, API), extend the Administration only via action buttons and custom modules, and use app scripts (sandboxed Twig hooks) for synchronous cart/rule/page logic.
- Never break an app manifest schema or outgoing app request format in a minor: only add or loosen.
- Extend via core patterns, not hardcoding: decoration, factory registries (`LineItemFactoryRegistry`), processor chains (cart processors), events/hooks, adapters as tagged services (e.g. `shopware.increment.gateway`).

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/extendability.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-10-21-app-scripting.html

## decoration pattern

- Define decoratable services as abstract classes, never interfaces; type-hint the abstract class.
- The abstract class declares `getDecorated()`; the core implementation throws `DecorationPatternException` from it (see `CategoryRoute`).
- A decorator extends the abstract class, gets the inner service injected, returns it from `getDecorated()` and delegates.
- Never mark the abstract class `@internal`/`@final`; never add extra public methods to an implementation; never make an implementation an event subscriber.
- Add new methods to the abstract class as non-abstract methods delegating to `$this->getDecorated()`.
- For a private cache/logging wrapper, skip `getDecorated()` and mark classes `@internal` or `@final`.

Enforced by: PHPStan

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-25-decoration-pattern.html

## public api and annotations

- Public/protected members are public API unless marked; mark services not meant for use or decoration `@internal` with a reason.
- `@internal` may change or vanish in any release: never depend on it from an extension. `@final`: use, never extend.
- Service constructors (DI) are not public API; constructors of DTOs like `CalculatedPrice` are.
- Mark obsolete public code `@deprecated tag:vX.Y.0 - <replacement>`; remove only in that major.
- Hide unreleased or breaking code behind a feature flag checked via `Feature::isActive()`.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/public-apis.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/final-and-internal.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/internal.html

## backward compatibility

- Never in a minor: change return types, namespaces, public constant values, static-ness or visibility; make code final; remove public/protected members, events or dispatches; add interface methods.
- Add method parameters only as optional, read via `func_get_args()`.
- Never remove or rename Twig blocks, template variables, CSS selectors, JS plugins/services, Vue slots, props, events or admin routes; deprecate instead.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/backward-compatibility.html

## domain boundaries and state

- `Core` depends on no other domain; `Administration`, `Storefront`, `Elasticsearch` depend on `Core` only.
- Never access the PHP session in `Core`; sessions belong to the Storefront.
- New events implement `ShopwareEvent`, or `ShopwareSalesChannelEvent` when a `SalesChannelContext` exists; pass IDs rather than entities.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/platform-domains.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/session-and-state.html
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-06-creating-events.html

## store api routes

- Headless first: every storefront feature also exists as a Store API route.
- Declare routes as services with `#[Route(defaults: ['_routeScope' => ['store-api']])]`; one purpose, one response object, a `StoreApiResponse` subclass.
- Give each core route a schema under `Framework/Api/ApiDefinition/Generator/Schema`.
- Do not add the routing guideline's `Since` annotation (absent in this codeVersion).

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/store-api.html
Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/routing.html

## storefront controllers

- Extend `StorefrontController` with `#[Route(defaults: ['_routeScope' => ['storefront']])]`; prefix route names with `frontend`; declare HTTP methods and return types.
- No business logic or repositories: read via Store API routes or page loaders, write by calling the Store API route, respond with `createActionResponse()`.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/storefront-controller.html

## caching

- Set `'_httpCache' => true` on storefront routes whose output is the same for all customers.
- Tag Store API responses with `AddCacheTagEvent`, invalidate with `CacheInvalidator::invalidate()`; do not build on `CachedCategoryRoute`-style decorators (deprecated for v6.7.0).
- Use `CacheInterface::get()` with a callback for stampede protection.

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-cache-stampede-protection.html
Read more: platform/dev/6.6/concepts/framework/http_cache.md

## Code check (6.6.10.24+87965325)

- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not present in this codeVersion
- confirmed `DecorationPatternException` — thrown by core `getDecorated()` — core/Framework/Plugin/Exception/DecorationPatternException.php:10
- confirmed `CachedCategoryRoute` — deprecated for v6.7.0 — core/Content/Category/SalesChannel/CachedCategoryRoute.php:28
- confirmed `_httpCache` — route attribute — core/PlatformRequest.php:50
- confirmed `createActionResponse` — storefront helper — storefront/Controller/StorefrontController.php:127
