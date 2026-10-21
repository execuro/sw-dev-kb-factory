---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/creating-custom-extension.md
title: Creating Custom Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/creating-custom-extension.html
sourceHash: 9d8aef05342674cd479c1acf22ede4b11561a5b8
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom extension point", "Extension", "ExtensionDispatcher", "publish", "NAME constant", "@extends Extension", "stopPropagation", "kernel.event_subscriber", ".pre", ".post", ".error", "CustomProductFilterExtension", "plugin extension point"]
summary: "Defining a plugin's own Extension subclass with a NAME constant and publishing it via ExtensionDispatcher::publish() with .pre/.post/.error phases."
lastBuilt: 2026-10-21
---
## What it is

Guide to defining your own extension point in a plugin: a final class extending `Shopware\Core\Framework\Extensions\Extension`, published from a plugin service through `Shopware\Core\Framework\Extensions\ExtensionDispatcher`, so other code can replace, enrich or recover the plugin's logic via subscribers.

## When to use

When your plugin exposes a process (e.g. a custom product filter) that other plugins should be able to replace or post-process without decorating your service.

## Key steps / config

1. **Extension class** — extends `Extension`, declares the result type with `@extends Extension<ResultType>`, a unique `public const NAME` (required: the base resolves `static::NAME`), and input as `public readonly` constructor properties documented with `@public` / `@description`:

```php
/** @extends Extension<EntitySearchResult<ProductCollection>> */
#[Package('my-plugin')]
final class CustomProductFilterExtension extends Extension
{
    public const NAME = 'my-plugin.product-filter';

    public function __construct(
        public readonly Criteria $criteria,
        public readonly SalesChannelContext $context,
        public readonly array $filterParams
    ) {}
}
```

2. **Publish it** from your service (inject `ExtensionDispatcher`):
   `$this->extensionDispatcher->publish(CustomProductFilterExtension::NAME, $extension, $default)`. The installed dispatcher calls `$default(...$extension->getParams())`, i.e. with the public properties as **named arguments** — give the default callable parameters named after them (core passes e.g. `_load(Criteria $criteria, SalesChannelContext $context)`).
3. **Subscribe** with an `EventSubscriberInterface` listening to `'my-plugin.product-filter.pre'` (or `CustomProductFilterExtension::onPre()`); set `$event->result` and call `$event->stopPropagation()` to replace the default.
4. **Register** the service with `service(Shopware\Core\Framework\Extensions\ExtensionDispatcher::class)` and `service('product.repository')`, and tag the subscriber `kernel.event_subscriber`.

Phases: `.pre` — validate input, modify parameters, replace the default; `.post` — enrich results, log, trigger follow-ups; `.error` — `$event->exception` is set, provide a fallback `result`.

Best practices from the source: names follow `{plugin}.{domain}.{action}` in kebab-case; always declare the generic type; avoid expensive work in subscribers; unit-test extension classes and subscribers.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension`
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher::publish()`
- `Extension::onPre()` / `onPost()` / `onError()`
- `$event->result`, `$event->exception`, `$event->stopPropagation()`
- `kernel.event_subscriber`

## Gotchas

- The source's service examples pass a default closure with no parameters (`function() use ($criteria, $context)`); the installed dispatcher spreads the extension's public properties into the callable as named arguments, so declare matching parameter names instead.
- `.post` is dispatched even when a `.pre` subscriber stopped propagation; check `$event->result !== null` there.
- If the default throws and no `.error` subscriber sets `result`, the original exception is rethrown.
- The source's complete example names a subscriber method `onGetRecommendations`; it is an illustrative plugin method, not a Shopware API.

## Code check (6.7.15.1)
- confirmed `Extension` — abstract base, generic `TResultType` — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `Extension::NAME` — subclasses must declare it; read via late static binding — vendor/shopware/core/Framework/Extensions/Extension.php:114
- confirmed `Extension::onPre()` — returns `NAME . '.pre'` — vendor/shopware/core/Framework/Extensions/Extension.php:38
- confirmed `Extension::getParams()` — public properties minus result/exception/extensions — vendor/shopware/core/Framework/Extensions/Extension.php:72
- corrected `ExtensionDispatcher::publish()` — docs: parameterless default closure; code spreads `getParams()` into it as named args — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `ExtensionDispatcher::post()` — `.post` dispatched after default or replacement — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:76
- confirmed `ExtensionDispatcher::error()` — `.error` dispatched with `exception` set — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:65
- confirmed `ExtensionDispatcher` — registered as a service with `event_dispatcher` — vendor/shopware/core/Framework/DependencyInjection/event.php:42
- confirmed `ResolveListingExtension::NAME` — core default callable `_load()` uses named params — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingLoader.php:133
- absent `onGetRecommendations` — illustrative subscriber method from the docs, not in the installed code
