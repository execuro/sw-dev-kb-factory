---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/references/adr/2021-10-21-app-scripting.md
sourceHash: 90310ee8ab18857a10c57a8c4c99dfc6299199f9
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-10-21-app-scripting.html
title: App scripts
version: "6.7"
versions:
  - "6.7"
keywords: ["app scripts", "app scripting", "twig sandbox", "hooks", "Hook", "ScriptExecutor", "ScriptLoader", "PageLoadedHook", "product-page-loaded", "Resources/scripts", "facade", "CartFacade", "StorefrontController::hook", "app system", "adr"]
summary: "ADR: app scripts run as sandboxed Twig stored in the DB and bound to hooks; data objects are wrapped in facades, page-loaded hooks, compiled-script cache."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2021-10-21, area core) introducing app scripts: synchronously executed, sandboxed code that apps (and standalone scripts) can hook into places such as rules, cart, storefront page loading, shipping method calculation and flow builder extensions — without direct database or filesystem access and without saving code files on the server.

## When to use

- You need the design rationale behind app scripts, hooks and script facades.
- You decide whether an object passed to a hook can be exposed directly or must be wrapped in a facade.
- You look for how scripts are loaded, cached and executed.

## Key steps / config

1. **Language**: Twig, for its secure PHP sandbox and direct object interaction. Scripts are stored in the database and mapped to a hook (scripting event).
2. **Placement**: apps subscribe to a hook by putting scripts into the correspondingly named folder; the installed app lifecycle reads them from `Resources/scripts`.
3. **Data passed to scripts** is always an object so Twig manipulation affects it. "Dumb" `Struct` data containers (DAL entities, storefront page classes) may be injected directly; structs with business logic (e.g. the cart) and services with side effects must be wrapped in a facade.
4. **Execution**: each script gets its own reduced Twig environment (blocks and many template features disabled); failures throw a Shopware exception. In the installed code, `ScriptExecutor::execute(Hook $hook)` loads the hook's scripts, renders each with the hook as `hook` and the hook's services as the `services` global, and wraps errors in a script-execution-failed exception.
5. **Loading and caching**: `ScriptLoader` loads scripts from the object cache and falls back to the database; compiled scripts are cached on the filesystem in a folder per app name + app version (hashed). In debug mode scripts are refreshed from the filesystem and the compile cache is not used.
6. **Data loading**: one hook class per storefront page type / PageLoadedEvent (e.g. `ProductPageLoadedHook`, name `product-page-loaded`), instantiated in the controllers — installed as `StorefrontController::hook()`. No CriteriaEvent hooks.
7. **Documentation** of hooks and services is generated from the code.

Twig pseudo-code from the ADR (cart manipulation idea):

```twig
{% if cart.price.totalPrice > 500 %}
    {% do cart.discount(...) %}
{% endif %}
```

## Essential identifiers

- `Hook` (abstract base class), `PageLoadedHook`, `ProductPageLoadedHook`
- `ScriptExecutor::execute()`
- `ScriptLoader`
- `StorefrontController::hook()`
- `CartFacade`
- `Resources/scripts`

## Gotchas

- Script events and their arguments must be supported for a long time; the facade layer is the app scripts' public API and follows the breaking change policy.
- The Shopware version must be available in the script context so scripts can detect features.
- The ADR's `ScriptEventRegistry`, `HookExecutor` and `dal_search` are design-time names; the installed code uses `ScriptExecutor`, controller `hook()` calls and the `services` global instead.
- The ADR example `cart.discount('percentage', 10, 'my_discount_snippet', cart.lineItems)` is pseudo-code; the installed facade trait signature is `discount(string $key, string $type, float|PriceCollection $value, string $label)`.

## Code check (6.7.13.0)
- confirmed `Hook` — abstract base class of all hooks — vendor/shopware/core/Framework/Script/Execution/Hook.php:12
- confirmed `ScriptExecutor::execute()` — executes all scripts of a hook — vendor/shopware/core/Framework/Script/Execution/ScriptExecutor.php:46
- confirmed `ScriptLoader::get()` — object cache first, then database; per-app/version compile cache — vendor/shopware/core/Framework/Script/Execution/ScriptLoader.php:48
- confirmed `ProductPageLoadedHook::HOOK_NAME` — value product-page-loaded — vendor/shopware/storefront/Page/Product/ProductPageLoadedHook.php:24
- confirmed `StorefrontController::hook()` — controllers pass hooks for execution — vendor/shopware/storefront/Controller/StorefrontController.php:321
- confirmed `Resources/scripts` — script directory read by the app lifecycle — vendor/shopware/core/Framework/App/Lifecycle/ScriptFileReader.php:18
- corrected `DiscountTrait::discount()` — docs: discount(type, value, snippet, lineItems) — vendor/shopware/core/Checkout/Cart/Facade/Traits/DiscountTrait.php:36
- absent `ScriptEventRegistry` — pseudo-code class, not in installed code
- absent `dal_search` — no such global Twig function in installed code
- unverified `HookExecutor` — only an unrelated deployment-helper class of that name, outside the checked roots
