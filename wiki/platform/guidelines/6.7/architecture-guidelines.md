---
id: platform/guidelines/6.7/architecture-guidelines.md
title: Architecture guidelines
docType: guideline
version: "6.7"
summary: Extension-point choice, decoration rules, headless-first routes, context and cache rules, BC annotations and feature flags for Shopware 6.7
keywords: ["architecture", "extendability", "decoration", "plugin vs app", "store api", "storefront controller", "saleschannelcontext", "http cache", "backward compatibility", "internal", "feature flags", "bc-change attributes"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/extendability.html", hash: "7b05fe14e53b76460a11495cb7bff8b725df7ae26fb3e572b0f1d8354bb90635"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html", hash: "607e29339593bddc0352398d1727973b75d007f580dbd9b9f5f128fd9c60afd5"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/final-and-internal.html", hash: "4c49d8de5d81ea5438c0c698a7b31338b7ae7a9f1a9b668efa5c4b1bc3db2e5d"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/internal.html", hash: "152b17d268968b831dfda8c6e34a9f757d79bdeef81accd2d6b16cf122bc2802"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/feature-flags.html", hash: "56df93fdb0e048dcc16b9c3defe5fbc4343593e78575c04a22376d72b257ad54"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/backward-compatibility.html", hash: "9062d37615e66e912ec6f76dc83f504a02728dc2f83903d2ccf72b28176669de"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/public-apis.html", hash: "a520fae119ef32130031e66e345e73897ccd9807e234b8c7b28b59e725ade440"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/platform-domains.html", hash: "a45a487e9ff909a03d5d75cb910804a80844715a7f7f26f07277fbee9417bb47"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/routing.html", hash: "78d2a6e2522bb6d2db02289c08e9cbe7ff9e5d067eb7f95cec82c2b465244310"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/store-api.html", hash: "73f6f5b807ec9d226343a5cea7038333d46cbc184ced45f6746cc33b1db1d11f"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html", hash: "7124252319e62ddcdf76462708c0ca84470b5e717cdbd76b2978e4bdd2e87289"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/session-and-state.html", hash: "eea63b140a1e4ade43645dde59cfeb2c111c54146c82649a556588a156e13caa"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2020-11-25-decoration-pattern.html", hash: "cd4784ca7e8fe767f5527ceb9460434fc72989374b609a60a9d6381bc12b1596"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2020-11-06-creating-events.html", hash: "d04c0e62d4bbc98b12f3945f29a75bcb81fbcd31bbcd6b1e961276a46b8ea10f"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html", hash: "4d6f09b25b5cf28ac610236d0f06db9537129053fa4c867c6af84bc61f9080c5"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-10-21-app-scripting.html", hash: "3473b7abcd1913c3df7028676d44155c6e8110099aab77d67682eab547119118"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-11-09-increment-pattern.html", hash: "bdffe14dccf7c138421ea0d0e017b2dd3f6071889be42661be4226cd9c758471"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2022-03-25-cache-stampede-protection.html", hash: "63e85dbb2db858f01b0c895596db8e55034bb52d0260f7ee3144700b3f0b8662"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## Index

- [platform/guidelines/6.7/be-architecture-guidelines.md](platform/guidelines/6.7/be-architecture-guidelines.md) — DAL modelling, migrations/indexers, Messenger vs sync, scheduled tasks, Rule/Flow Builder.
- [platform/guidelines/6.7/fe-architecture-guidelines.md](platform/guidelines/6.7/fe-architecture-guidelines.md) — Administration modules, blocks, ACL; storefront theme and template inheritance.

## extension point ladder

Use the least invasive option, in this order:

1. Subscribe to an event. New events implement `ShopwareEvent`, or `ShopwareSalesChannelEvent` when a `SalesChannelContext` exists. Carry IDs (`string $orderId`), not entities.
2. Handle a typed extension event published via `ExtensionDispatcher` (e.g. `ResolveListingExtension`) to change inputs/results or replace the operation.
3. Register a tagged service in an existing registry (line item factories, cart processors, captcha adapters).
4. Decorate the service, only to replace or wrap behaviour.

Add data to structs with `addExtension()`, never by subclassing.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/extendability.html

## decoration rules

- Decorate the `Abstract*` class, never extend the concrete service; type-hint the abstract class.
- A decoratable abstract class declares `getDecorated()`; the core implementation throws `DecorationPatternException`; a decorator returns its inner service.
- Add new methods to it as concrete methods delegating to `$this->getDecorated()`, never as abstract ones.
- Never mark it `@internal`/`@final`, add extra public methods to an implementation, or make a decorator an event subscriber.
- Use abstract classes, not interfaces, for service contracts.
- Do not give new Store-API route classes the decorator pattern; expose extension events.
- For a private cache/log wrapper, inject the inner service without `getDecorated()` and mark it `@internal` or `@final`.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2020-11-25-decoration-pattern.html

## plugin app or theme

- Choose an app when it must run in cloud and self-hosted alike: no PHP on the shop server, logic on the app server via API/webhooks, admin UI via action buttons and iframe modules, storefront via templates, JS, CSS, theme config.
- Use App Scripts (sandboxed Twig hooks such as `ProductPageLoadedHook`) for synchronous app logic.
- Choose a plugin when you need PHP, DI decoration or replacement of whole areas; in a project template use a bundle.

Read more: https://developer.shopware.com/docs/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2021-10-21-app-scripting.html

## headless first and thin controllers

- Implement every operation as a Store API route first; each storefront feature must exist in the Store API.
- Store API routes use route scope `StoreApiRouteScope::ID`, have one purpose and return one object in a `StoreApiResponse`.
- Storefront controllers extend `StorefrontController`, use `StorefrontRouteScope::ID`, prefix route names with `frontend.`, and declare HTTP methods and return types.
- Never put business logic or repositories in a storefront controller; read via routes or page loaders, write through the Store API route and respond with `createActionResponse()`.
- `Core` depends on no other domain; `Storefront`, `Administration`, `Elasticsearch` depend on `Core` only.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/store-api.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/platform-domains.html

## context and session

- Pass the request's `Context` (and `SalesChannelContext` in sales-channel flows) through; never rebuild it.
- Never touch the PHP session in `Core`; sessions exist only for storefront requests.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/session-and-state.html

## caching

- Set `_httpCache` (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`) on pages identical for all customers.
- Build cache layers with `CacheInterface::get()` plus a callback, as `CachedRuleLoader` does, for stampede protection.
- Send high-frequency counters through `AbstractIncrementer` pools, not DAL writes.

Read more: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-cache-stampede-protection.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2021-11-09-increment-pattern.html

## public api and annotations

- Public/protected elements are public API; keep them compatible in minors, remove only in a major.
- `@internal`: never use, extend or decorate from extensions. Mark new compiler passes `@internal`; never combine with `@final`.
- `@final`: use, never extend. `@experimental feature:<FLAG>`: treat as `@internal`.
- `@deprecated tag:vX.Y.Z - <replacement>`: only when the symbol goes away.
- Announce changes to surviving symbols with `Shopware\Core\Framework\Deprecation\BCChange` attributes (`ReturnTypeNarrowing`, `NewRequiredParameter`, `BecomesFinal`, ...). `CallSiteCompatibilityChange` affects callers, `ExtenderCompatibilityChange` subclasses; apply the safe opt-in now.
- Service constructors are not public API; DTO constructors are.
- Deprecate before removing Twig blocks, JS plugins, admin components, props, slots or events.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/backward-compatibility.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/internal.html

## feature flags

- Use four-part IDs (`v6.8.0.0`) in `Feature` calls; `.env` form is `V6_8_0_0=1`.
- Plain truthy `FEATURE_ALL` enables non-major flags; `FEATURE_ALL=major` enables major flags; per-flag env values win.
- Branch with `Feature::isActive()`/`Feature::ifActive()`, old path inside the condition.
- Deprecate with `Feature::triggerDeprecationOrThrow()` (optional `silentUntil`); silence internal legacy calls with `Feature::silent()`.
- Tag a service `shopware.feature` with `flag` to drop it while the flag is inactive; never branch in service config.
- Unit tests: `#[DisabledFeatures([...])]`; integration tests: `Feature::skipTestIfActive()`/`skipTestIfInActive()`.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/feature-flags.html

## Code check (6.7.15.1+7d4303db)

- confirmed `DecorationPatternException` — core getDecorated() throws it — core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `ExtensionDispatcher` — publishes extension events — core/Framework/Extensions/ExtensionDispatcher.php:9
- confirmed `createActionResponse` — StorefrontController method — storefront/Controller/StorefrontController.php:126
- confirmed `Feature::triggerDeprecationOrThrow` — takes silentUntil — core/Framework/Feature.php:281
- confirmed `shopware.feature` — removes service if flag inactive — core/Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:22
- absent `shopware.inactiveFeature` — not in this codeVersion
- absent `Shopware\Core\Framework\Deprecation\BCChange\ClassMoved` — not in this codeVersion
- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not in this codeVersion
- absent `ifActiveCall` — not in this codeVersion
- absent `setRegisteredFeatures` — not in this codeVersion
- absent `ALIASES_TO_REMOVE` — not in this codeVersion
- absent `throwIfActive` — not in this codeVersion
- absent `addTestNamespace` — not in this codeVersion
