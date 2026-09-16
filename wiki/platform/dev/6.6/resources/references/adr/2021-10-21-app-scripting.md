---
id: platform/dev/6.6/resources/references/adr/2021-10-21-app-scripting.md
title: App scripts
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-10-21-app-scripting.html
sourceHash: 90310ee8ab18857a10c57a8c4c99dfc6299199f9
keywords: ["app scripts", "scripting events", "Twig sandbox", "dal_search", "ScriptEventRegistry", "hook", "PageLoaded hooks", "HookExecutor", "app system", "cart.discount", "cart.block", "Struct facade"]
summary: ADR introducing Twig-based App Scripting — sandboxed hooks for rules, cart, page loading and shipping, with data wrapped in facades.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing a Twig-based scripting feature that lets apps execute sandboxed code synchronously at defined hook points (rules, cart, storefront page loading, shipping calculation, flow builder extensions) without direct database or filesystem access.

## When to use
Relevant when an app needs to run custom logic at an existing Shopware extension point instead of shipping compiled PHP, e.g. adjusting cart pricing or reacting to page loads.

## Key steps / config
- Scripts are written in Twig (a secure PHP sandbox), saved in the database, and mapped to named scripting events; apps subscribe by placing scripts into correspondingly named folders.
- Data passed to a script must always be an object so Twig manipulation can affect it; "dumb" `Struct` classes (DAL entities, storefront page classes) may be injected directly, but `Struct`s with business logic (e.g. the Cart struct) and all `Service`s must be wrapped in a facade.
- A global Twig function `dal_search` is available to all events to fetch additional data.
- Each script gets its own Twig environment; compiled scripts are cached on the filesystem per app and per app version, with a filesystem fallback for development.
- Failures throw a dedicated exception, e.g. `ScriptExecutionFailed`.

Example pseudo-code of the event registry:

```php
class ScriptEventRegistry
{
    public const EVENT_PRODUCT_PAGE_LOADED = 'product-page-loaded';
    public function execute(string $hook, array $context) { /* ... */ }
    private function executeScript(array $script, array $context) { /* ... */ }
    private function initEnv(array $script) { /* ... */ }
}
```

Example script hooks:

```twig
{% if cart.price.totalPrice > 500 %}
    {% do cart.discount('percentage', 10, 'my_discount_snippet', cart.lineItems) %}
{% endif %}
```

For storefront data, dedicated `PageLoaded`-Hooks classes are created per page type/event (not one generic class), instantiated and passed to a `HookExecutor` from the controllers loading the pages; `CriteriaEvent`-Hooks are explicitly not provided.

## Essential identifiers
- `dal_search` (global Twig function)
- `ScriptEventRegistry` / `ScriptExecutionFailed`
- `cart.discount()` / `cart.block()` (script-facing Cart API)
- `HookExecutor`

## Gotchas
- Once shipped, script events and their passed arguments must be supported for a long time; breaking changes to the domain-specific script API must follow the general breaking-change policy.
- The Shopware version must be injected into the script context so scripts can detect it and adapt to new features without breaking compatibility.
