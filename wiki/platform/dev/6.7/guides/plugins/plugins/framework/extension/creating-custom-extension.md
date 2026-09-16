---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/creating-custom-extension.md
title: Creating Custom Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/creating-custom-extension.html
sourceHash: 9d8aef05342674cd479c1acf22ede4b11561a5b8
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom extension point", "Extension", "ExtensionDispatcher", "publish", "NAME constant", "onPre", "stopPropagation", ".pre .post .error", "getParams", "kernel.event_subscriber", "@extends Extension", "@public @description", "plugin extension point"]
summary: Define a custom Extension subclass with NAME and typed result, publish it via ExtensionDispatcher::publish() and handle its .pre/.post/.error events.
lastBuilt: 2026-09-15
---
## What it is

How a plugin defines its own extension point: an `Extension` subclass describing the input, a service that publishes it through `ExtensionDispatcher` around a default implementation, and subscribers that replace, enrich or recover the result.

## When to use

Your plugin exposes logic that other plugins should be able to replace or post-process, and no built-in extension point covers it.

## Key steps / config

1. **Extension class** — extend `Shopware\Core\Framework\Extensions\Extension`, declare the generic result type, a unique `NAME`, and the inputs as public readonly promoted properties documented with `@public` / `@description`:

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

2. **Publish it** — inject `Shopware\Core\Framework\Extensions\ExtensionDispatcher` and call `publish(CustomProductFilterExtension::NAME, $extension, $defaultCallable)`. The dispatcher invokes the default callable as `$function(...$extension->getParams())`, i.e. with the extension's public properties as **named arguments**. Core passes a method whose parameter names match the property names (e.g. `$this->_load(...)` with `Criteria $criteria, SalesChannelContext $context`); a callable must accept every property name.
3. **Subscribe** — listen to `<NAME>.pre` (e.g. `'my-plugin.product-filter.pre'`, or `CustomProductFilterExtension::onPre()`), set `$event->result`, and call `$event->stopPropagation()` to skip the default implementation.
4. **Register services** in `services.php`:

```php
$services->set(MyPlugin\Service\CustomProductService::class)
    ->args([service(Shopware\Core\Framework\Extensions\ExtensionDispatcher::class), service('product.repository')]);
$services->set(MyPlugin\Subscriber\CustomProductFilterSubscriber::class)
    ->tag('kernel.event_subscriber');
```

Lifecycle phases: `.pre` — validate/modify input or replace the implementation; `.post` — enrich `$event->result`, log, trigger follow-ups; `.error` — `$event->exception` is set, assign a fallback `$event->result` to swallow it.

Naming convention from the docs: `{plugin}.{domain}.{action}`, kebab-case.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension` — `$result`, `$exception`, `stopPropagation()`, `getParams()`, `onPre()`/`onPost()`/`onError()`
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher::publish()`
- `public const NAME`, `@extends Extension<ResultType>`
- `kernel.event_subscriber`

## Gotchas

- The source's closures `function() use ($criteria, $context) { ... }` take no parameters; since `publish()` spreads `getParams()` as named arguments, give the callable parameters named like the extension's properties instead.
- `publish()` resets propagation before `.post`, so `.post` subscribers run even when a `.pre` subscriber stopped propagation.
- In `.error`, the exception is rethrown if no subscriber sets `$event->result`.
- `Extension` uses `ExtendableTrait`, so `$event->addExtension()` (as in the multi-phase example) is available; it takes a `Struct`.
- The "complete plugin" example's `onGetRecommendations` handler and `ProductRecommendationExtension` are illustrative names, not Shopware code.

## Code check (6.7.13.0)
- absent `onGetRecommendations` — illustrative handler name from the docs example
- confirmed `Extension` — abstract base, uses ExtendableTrait — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `Extension::onPre()` — returns `NAME` plus `.pre` via late static binding — vendor/shopware/core/Framework/Extensions/Extension.php:38
- confirmed `Extension::getParams()` — object vars minus result/exception/extensions — vendor/shopware/core/Framework/Extensions/Extension.php:72
- confirmed `Extension::stopPropagation()` — skips default implementation — vendor/shopware/core/Framework/Extensions/Extension.php:98
- confirmed `Extension::resetPropagation()` — called by publish() before .post — vendor/shopware/core/Framework/Extensions/Extension.php:106
- corrected `ExtensionDispatcher::publish()` — docs: zero-arg closure as default; code calls it with getParams() spread as named args — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `ExtensionDispatcher` — service id registered in core DI — vendor/shopware/core/Framework/DependencyInjection/event.xml:29
- confirmed `ExtendableTrait::addExtension()` — requires a Struct argument — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `Criteria::setIds()` — used in the filter example — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:483
