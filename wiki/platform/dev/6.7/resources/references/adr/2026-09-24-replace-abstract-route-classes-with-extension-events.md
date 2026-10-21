---
id: platform/dev/6.7/resources/references/adr/2026-09-24-replace-abstract-route-classes-with-extension-events.md
title: Replace abstract route classes with the extension event system
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-09-24-replace-abstract-route-classes-with-extension-events.html
sourceHash: c3225896f9f570766fa7ae21b0e04eb25e41e0d6
codeCheckedAgainst: "6.7.15.1"
keywords: ["ExtensionDispatcher", "Extension", "AbstractProductSearchRoute", "getDecorated", "NoRouteOverrideInDecoratorsRule", "ResolvedCriteriaProductSearchRoute", "onPre", "store-api route", "route decoration", "extension event", "decorator pattern", "adr"]
summary: "ADR: store-api routes expose ExtensionDispatcher pre/post/error events as the preferred extension point instead of decorating abstract route classes"
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-09-24): Store API routes should use the existing extension event system (`Extension` + `ExtensionDispatcher`) as their preferred public extension point, instead of plugins subclassing an abstract route class, implementing `getDecorated()` and registering a service decoration.

## When to use

- Adding a new Store API route in core (must use extension events from the start, no abstract route class).
- Customizing an existing Store API route from a plugin: use its extension event where one exists; fall back to decoration where it does not.

## Key steps / config

Why decoration is being replaced: abstract classes duplicate route signatures (boilerplate, BC coupling on new parameters); copying a `#[Route]` attribute into a decorator can change route defaults or controller resolution (forbidden by `NoRouteOverrideInDecoratorsRule`); and input changes, result processing and error handling all require wrapping the whole method.

New route pattern:

1. The route keeps its public method and `#[Route]` attribute, and injects `Shopware\Core\Framework\Extensions\ExtensionDispatcher`.
2. The body moves into a private method passed to `ExtensionDispatcher::publish()`.
3. A dedicated `final` subclass of `Shopware\Core\Framework\Extensions\Extension` carries the input parameters as `public readonly` properties and declares a stable `public const NAME`. Its constructor is `@internal`; its properties are public API.

```php
public function load(Criteria $criteria, SalesChannelContext $context): CountryRouteResponse
{
    return $this->extensions->publish(
        name: <RouteExtension>::NAME,
        extension: new <RouteExtension>($criteria, $context),
        function: $this->_load(...),
    );
}
```

Listener hooks (event names `<NAME>.pre` / `.post` / `.error`, via `Extension::onPre()`, `onPost()`, `onError()`):

- **`.pre`** — mutate input objects (`Criteria`, `Request`); to replace the operation set `$extension->result` and call `stopPropagation()`, which skips the route body.
- **`.post`** — inspect or change `$extension->result`.
- **`.error`** — inspect `$extension->exception` and set a fallback result; without one the original exception is rethrown.

Plugin migration — before (decorator of `AbstractProductSearchRoute`, which requires `getDecorated()` and `load()`):

```php
final class FreeShippingSearchRoute extends AbstractProductSearchRoute
{
    public function __construct(private readonly AbstractProductSearchRoute $decorated) {}
    public function getDecorated(): AbstractProductSearchRoute { return $this->decorated; }
    public function load(Request $request, SalesChannelContext $context, Criteria $criteria): ProductSearchRouteResponse
    {
        $criteria->addFilter(new EqualsFilter('product.shippingFree', true));
        return $this->decorated->load($request, $context, $criteria);
    }
}
```

After: an `EventSubscriberInterface` subscribing `<RouteExtension>::onPre() => 'filter'`, whose `filter()` adds the same `EqualsFilter('product.shippingFree', true)` to `$extension->criteria`. Ordering between plugins is controlled by listener priorities.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension`, `Extension::onPre()`, `onPost()`, `onError()`, `$result`, `$exception`, `stopPropagation()`, `NAME`
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher::publish()`
- `Shopware\Core\Content\Product\SalesChannel\Search\AbstractProductSearchRoute`, `getDecorated()`
- `NoRouteOverrideInDecoratorsRule`, `ResolvedCriteriaProductSearchRoute`

## Gotchas

- The ADR's examples (`ActiveCountryRoute`, `Shopware\Core\System\Country\Extension\ActiveCountryRouteExtension` with `NAME = 'active-country-route.load'`, and `Shopware\Core\Content\Product\Extension\ProductSearchRouteExtension`) do not exist in 6.7.15.1. `ProductSearchRoute::load()` does not publish an extension event there, so product search is still extended by decoration.
- `ExtensionDispatcher::publish()` calls the function with `...$extension->getParams()` (named arguments from the public properties), so property names must match the private method's parameter names.
- On `.error`, the exception is rethrown when `$extension->result` is still `null`.
- Abstract route classes and `getDecorated()` stay supported; a route's abstract class is deprecated only when the route is changed anyway and a breaking change is needed. No global timeline.
- Core decorators such as `ResolvedCriteriaProductSearchRoute` may become subscribers or be merged into the route body, subject to BC.

## Version notes

Migration is step by step per route; a custom PHPStan rule is planned to enforce the pattern for new routes. The guides for adding and overriding Store API routes are to be updated to the event-based approach.

## Code check (6.7.15.1)
- absent `Shopware\Core\System\Country\Extension\ActiveCountryRouteExtension` — ADR example class, not in the installed code
- absent `Shopware\Core\System\Country\Extension` — namespace does not exist in the installed code
- absent `Shopware\Core\Content\Product\Extension\ProductSearchRouteExtension` — no search route extension event in the installed code
- confirmed `ExtensionDispatcher::publish()` — dispatches `.pre`, runs the function unless stopped, `.error`, `.post` — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `Extension::onPre()` — returns `NAME . '.pre'` via late static binding — vendor/shopware/core/Framework/Extensions/Extension.php:38
- confirmed `Extension::$result` — public mutable result property — vendor/shopware/core/Framework/Extensions/Extension.php:20
- confirmed `AbstractProductSearchRoute::getDecorated()` — abstract, alongside abstract `load()` — vendor/shopware/core/Content/Product/SalesChannel/Search/AbstractProductSearchRoute.php:16
- confirmed `ProductSearchRoute::load()` — still a plain decoratable route, no extension event published — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:45
- confirmed `NoRouteOverrideInDecoratorsRule` — PHPStan rule class — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/NoRouteOverrideInDecoratorsRule.php:22
- confirmed `ResolvedCriteriaProductSearchRoute` — core decorator extending `AbstractProductSearchRoute` — vendor/shopware/core/Content/Product/SalesChannel/Search/ResolvedCriteriaProductSearchRoute.php:17
