---
id: platform/guidelines/6.7/architecture-guidelines.md
title: Architecture guidelines
docType: guideline
version: "6.7"
summary: Extension points, decoration, domain boundaries, Store API and storefront controllers, HTTP cache, BC annotations and feature flags for Shopware 6.7
keywords: ["architecture", "extendability", "decoration", "internal", "final", "backward compatibility", "deprecation", "feature flags", "store api", "storefront controller", "http cache", "app system", "events"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/extendability.html", hash: "fb6201855e3ed24346ca0c78fa7998bfc6dc0556f17b182b790bf6414d49e581"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html", hash: "331b8608cb07e3905257afb0e836a27850dd8033dbf7d1784a964504b90920fd"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/final-and-internal.html", hash: "4c49d8de5d81ea5438c0c698a7b31338b7ae7a9f1a9b668efa5c4b1bc3db2e5d"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/internal.html", hash: "bed43cd2b187b79d0f015f85c9cdbc330bccd79187f6019c653aea7f19437ee6"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/core/feature-flags.html", hash: "d82729c674bf64852660dd89f987251a1f2542d26300d4b252171cc951532d3f"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/backward-compatibility.html", hash: "f29ed7a0e6eb6c464c40dea7e6a2356ae1575a02df5abe8e3422754adf0e698b"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/public-apis.html", hash: "a520fae119ef32130031e66e345e73897ccd9807e234b8c7b28b59e725ade440"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/platform-domains.html", hash: "a45a487e9ff909a03d5d75cb910804a80844715a7f7f26f07277fbee9417bb47"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/routing.html", hash: "78d2a6e2522bb6d2db02289c08e9cbe7ff9e5d067eb7f95cec82c2b465244310"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/store-api.html", hash: "73f6f5b807ec9d226343a5cea7038333d46cbc184ced45f6746cc33b1db1d11f"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html", hash: "7124252319e62ddcdf76462708c0ca84470b5e717cdbd76b2978e4bdd2e87289"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/session-and-state.html", hash: "eea63b140a1e4ade43645dde59cfeb2c111c54146c82649a556588a156e13caa"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2020-11-25-decoration-pattern.html", hash: "cd4784ca7e8fe767f5527ceb9460434fc72989374b609a60a9d6381bc12b1596"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2020-11-06-creating-events.html", hash: "d04c0e62d4bbc98b12f3945f29a75bcb81fbcd31bbcd6b1e961276a46b8ea10f"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html", hash: "4d6f09b25b5cf28ac610236d0f06db9537129053fa4c867c6af84bc61f9080c5"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-10-21-app-scripting.html", hash: "3473b7abcd1913c3df7028676d44155c6e8110099aab77d67682eab547119118"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-11-09-increment-pattern.html", hash: "bdffe14dccf7c138421ea0d0e017b2dd3f6071889be42661be4226cd9c758471"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2022-03-25-cache-stampede-protection.html", hash: "63e85dbb2db858f01b0c895596db8e55034bb52d0260f7ee3144700b3f0b8662"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## Index

- [platform/guidelines/6.7/be-architecture-guidelines.md](platform/guidelines/6.7/be-architecture-guidelines.md) — DAL modelling, migrations/indexers, Messenger vs sync, scheduled tasks, Rule/Flow Builder
- [platform/guidelines/6.7/fe-architecture-guidelines.md](platform/guidelines/6.7/fe-architecture-guidelines.md) — admin extension model (modules, blocks, ACL), storefront theme/template inheritance

## extension point ladder

- Use the least invasive point: event subscriber, then a tagged service in a registry/adapter (e.g. `LineItemFactoryRegistry`, cart processors), then decoration.
- Never extend a concrete core service; decorate its abstract contract or compose.
- New events implement `ShopwareEvent` (carries `Context`), or `ShopwareSalesChannelEvent` when a `SalesChannelContext` exists; pass IDs, not entities, so listeners can load data or go async.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/extendability.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2020-11-06-creating-events.html

## decoration pattern

- Type-hint and extend the `Abstract*` class, never an interface.
- The abstract class declares `abstract public function getDecorated()`; the core implementation throws `DecorationPatternException` there; your decorator returns the injected inner service and delegates.
- Never mark a decoratable abstract class `@internal`/`@final`; never add public methods the abstract class lacks; never make a decorator an event subscriber.
- Add new methods to the abstract class as non-abstract, delegating to `$this->getDecorated()`, so older decorators keep working.
- For a private cache/log layer, inject the inner service without `getDecorated()` and mark it `@internal` or `@final`.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2020-11-25-decoration-pattern.html

## plugin app or theme

- Use an app when it must run in cloud and on-premise: no PHP on the shop server (logic on the app server via API/webhooks), admin UI only via action buttons and iframe custom modules, plus custom fields and storefront customizations.
- Use a plugin when PHP, decoration or admin JS is needed; use a bundle for project-local code in a project template.
- For synchronous app logic use Twig-sandboxed app scripts on hooks such as `ProductPageLoadedHook`.
- Treat the app manifest schema and outgoing app request payloads as BC-bound: only add or loosen in a minor.

Read more: https://developer.shopware.com/docs/resources/references/adr/2020-08-12-implement-app-system-inside-platform.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2021-10-21-app-scripting.html

## domain boundaries and state

- `Core` never depends on `Storefront`, `Administration` or `Elasticsearch`; those three depend only on `Core`, never on each other.
- Never touch the PHP session in `Core`; session handling belongs to `Storefront`. Pass state via `Context`/`SalesChannelContext`.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/platform-domains.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/session-and-state.html

## headless first apis and thin controllers

- Build each storefront feature on a Store API route first; controllers and page loaders only call routes.
- Store API controllers are services with `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]`; one purpose per route, returning a `StoreApiResponse` with one object.
- Storefront controllers extend `StorefrontController`, use `StorefrontRouteScope::ID`, name routes `frontend.*`, restrict HTTP methods and declare return types.
- No business logic or repositories in storefront controllers: read via route/page loader, write via a Store API route, respond with `createActionResponse()`, report errors via flash bags.
- Inject dependencies via constructor into private properties.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/store-api.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/storefront-controller.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/routing.html

## http cache and invalidation

- Mark customer-independent pages cacheable with `PlatformRequest::ATTRIBUTE_HTTP_CACHE` (`_httpCache`) in route defaults.
- Invalidate by tag with `CacheInvalidator::invalidate()` when data changes.
- Wrap expensive loads in Symfony `CacheInterface::get()` with a callback (see `CachedRuleLoader`) for stampede protection.
- For high-frequency counters use `AbstractIncrementer` via `IncrementGatewayRegistry`, not DAL writes.

Read more: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-cache-stampede-protection.html
Read more: https://developer.shopware.com/docs/resources/references/adr/2021-11-09-increment-pattern.html

## public api and annotations

- Every public/protected member is public API unless marked. Never use, extend or decorate core `@internal` classes.
- Mark implementation details `@internal` with a reason; never combine with `@final`. Use native `final class` for DTOs, structs and subscribers; `@final` for services callers may use but not extend.
- DI service constructors are not public API; constructors of DTOs you instantiate (`CalculatedPrice`, `QuantityPriceDefinition`) are.
- Mark unreleased code `@experimental stableVersion:vX.Y.Z feature:FLAG`; treat it as `@internal`.
- Mark removed/replaced code `@deprecated tag:vX.Y.0 - <replacement>`; remove only in a major.
- In 6.7, announce a change to a symbol that stays (type, name, visibility, becoming final) as `@deprecated tag:v6.8.0 - reason:<kind> - <text>`; the attribute form in current docs is not in this codeVersion.
- Add parameters only as optional via `func_get_args()` and call `Feature::triggerDeprecationOrThrow()` for legacy calls. In a minor never add interface methods, change namespaces or public constant values, or remove Twig blocks, JS plugins or events.

Enforced by: PHPStan
Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/internal.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/public-apis.html
Read more: https://developer.shopware.com/docs/resources/guidelines/code/backward-compatibility.html

## feature flags

- Hide breaking or unfinished code behind a flag in `feature.yaml`; toggle in `.env` with underscores (`V6_8_0_0=1`); `FEATURE_ALL` enables groups, a per-flag value wins.
- In PHP use `Feature::isActive()` (old behaviour inside the negated branch), `Feature::ifActive()` or `Feature::triggerDeprecationOrThrow()`; in Twig `feature('...')`.
- Unit tests: `#[DisabledFeatures([...])]` instead of `Feature::fake()`. Integration tests: `Feature::skipTestIfActive()` / `Feature::skipTestIfInActive()`.
- Flag names are BC-bound; behaviour behind them is not.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/feature-flags.html

## Code check (6.7.13.0+8da531fe)

- absent `Shopware\Core\Framework\Deprecation\BCChange` — namespace not present in this codeVersion
- absent `Shopware\Core\Framework\Deprecation\BCChange\ReturnTypeNarrowing` — not present in this codeVersion
- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not present in this codeVersion
- absent `ifActiveCall` — not a `Feature` method in this codeVersion
- absent `setRegisteredFeatures` — not a `Feature` method in this codeVersion
- absent `addTestNamespace` — flagged by the scan; not relied on here
- confirmed `DecorationPatternRule` — PHPStan decoration check — core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:31
- confirmed `reason:return-type-change` — 6.7 planned-change marker — core/Checkout/Cart/CartException.php:455
- confirmed `createActionResponse` — storefront write response — storefront/Controller/StorefrontController.php:125
- confirmed `ATTRIBUTE_HTTP_CACHE` — route default `_httpCache` — core/PlatformRequest.php:80
- confirmed `Feature::triggerDeprecationOrThrow` — runtime signal — core/Framework/Feature.php:267
