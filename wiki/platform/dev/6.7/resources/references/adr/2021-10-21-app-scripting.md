---
id: platform/dev/6.7/resources/references/adr/2021-10-21-app-scripting.md
title: App scripts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-10-21-app-scripting.html
sourceHash: 90310ee8ab18857a10c57a8c4c99dfc6299199f9
codeCheckedAgainst: "6.7.15.1"
keywords: ["app scripts", "app scripting", "ScriptExecutor", "ScriptLoader", "ScriptEnvironmentFactory", "Hook", "PageLoadedHook", "ProductPageLoadedHook", "CartFacadeHookFactory", "twig sandbox", "facade", "hook points", "adr"]
summary: "ADR (2021-10-21): apps run sandboxed Twig scripts stored in the DB and bound to named hooks; services exposed via facades, pages via PageLoadedHook classes."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record introducing app scripts: synchronous, sandboxed code that apps can run at defined places in Shopware (rules, cart, storefront page loading, shipping method calculation, flow builder extensions). Twig was chosen because it provides a secure PHP sandbox and allows direct interaction with objects. Scripts have no direct database or filesystem access and are not stored as code on the server; they are saved in the database and mapped to a named hook ("scripting event"). An app subscribes to a hook by placing scripts in the correspondingly named folder.

## When to use

Read this when you need the rationale behind the app scripting design: why data passed to scripts is wrapped in facades, how scripts are loaded and cached, why there is one hook class per storefront page, and why there are no criteria-event hooks.

## Key steps / config

How the installed code implements the decision:

1. A caller builds a `Hook` object and passes it to `ScriptExecutor::execute(Hook $hook)`. Storefront controllers do this for page loads, e.g. `ProductController` calls `$this->hook(new ProductPageLoadedHook($page, $context))`.
2. `ScriptLoader::get($hookName)` returns the scripts for that hook. Scripts are read from the `script` table (joined with `app`), cached in the object cache under `shopware-executable-app-scripts`, and the cache is invalidated on `script.written` / `app.written`.
3. Compiled Twig is cached on the filesystem under `<cacheDir>/scripts/<hash of appName + appVersion>`, i.e. per app and per app version. In debug mode no Twig cache is used, `debug` is enabled, and scripts are refreshed from the app filesystem before loading (development mode).
4. `ScriptEnvironmentFactory::initEnv()` creates a dedicated `TwigEnvironment` per script with the registered script Twig extensions, and adds a `shopware.version` global so scripts can detect the Shopware version.
5. During rendering the executor adds a `services` global (facades built by `HookServiceFactory` implementations) and renders the script with `hook` as its context. Any exception is rethrown as a script execution failure.

Injection rule from the ADR: plain `Struct` data containers (DAL entities, storefront page classes) may be passed directly; `Struct`s with business logic (e.g. the cart) and services with side effects must be wrapped in a facade. The cart facade is registered under the service name `cart`:

```twig
{% if services.cart.price.total > 500 %}
    {% do services.cart.discount('my-discount', 'percentage', 10, 'my_discount_snippet') %}
{% endif %}
```

## Essential identifiers

- `Shopware\Core\Framework\Script\Execution\ScriptExecutor`
- `Shopware\Core\Framework\Script\Execution\ScriptLoader`
- `Shopware\Core\Framework\Script\Execution\ScriptEnvironmentFactory`
- `Shopware\Core\Framework\Script\Execution\Hook`
- `Shopware\Storefront\Page\PageLoadedHook`, `Shopware\Storefront\Page\Product\ProductPageLoadedHook`
- `Shopware\Core\Checkout\Cart\Facade\CartFacadeHookFactory`
- `Shopware\Core\Framework\Script\Exception\ScriptExecutionFailedException`

## Gotchas

- The ADR's `ScriptEventRegistry` class and the global `dal_search` function are pseudo-code only; neither exists in the installed code. Data access goes through the `services` facades instead.
- The ADR's `cart.discount('percentage', 10, ...)` call order does not match the installed facade, which takes `(key, type, value, label)`.
- The ADR's `cart.block(...)` example has no matching facade method; blocking is expressed by adding cart errors (`ErrorsFacade::error()`).
- The ADR says standalone (non-app) scripts should be possible, but `ScriptLoader` skips scripts without an `app_id`.
- Script events and their arguments are public API of app scripts: breaking changes follow the general breaking change policy, and hooks must be supported for a long time.
- Criteria-event hooks were explicitly rejected.

## Code check (6.7.15.1)
- confirmed `ScriptExecutor::execute()` — runs all scripts for a hook, wraps failures — vendor/shopware/core/Framework/Script/Execution/ScriptExecutor.php:46
- confirmed `ScriptLoader::CACHE_KEY` — object cache key for loaded scripts — vendor/shopware/core/Framework/Script/Execution/ScriptLoader.php:24
- confirmed `FilesystemCache` — per app/version Twig cache dir, off in debug — vendor/shopware/core/Framework/Script/Execution/ScriptLoader.php:64
- confirmed `app_id` — scripts without an app id are skipped — vendor/shopware/core/Framework/Script/Execution/ScriptLoader.php:145
- confirmed `ScriptEnvironmentFactory::initEnv()` — one TwigEnvironment per script — vendor/shopware/core/Framework/Script/Execution/ScriptEnvironmentFactory.php:38
- confirmed `ProductPageLoadedHook` — page hook passed from the controller — vendor/shopware/storefront/Controller/ProductController.php:66
- confirmed `cart` — service name of the cart facade factory — vendor/shopware/core/Checkout/Cart/Facade/CartFacadeHookFactory.php:43
- corrected `DiscountTrait::discount()` — docs: discount(type, value, label, lineItems); code: discount(key, type, value, label) — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:36
- absent `ScriptEventRegistry` — ADR pseudo-code; the executor is ScriptExecutor
- absent `dal_search` — no such Twig function; data access via services facades
