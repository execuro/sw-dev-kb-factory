---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/fetching-data-with-javascript.md
title: Fetching Data with JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/fetching-data-with-javascript.html
sourceHash: 5ded4397c2c7e2e15e91ab4a5becf365616e980b
codeCheckedAgainst: "6.7.13.0"
keywords: ["fetch", "fetch api", "PluginBaseClass", "window.PluginBaseClass", "/widgets/checkout/info", "frontend.checkout.info", "XMLHttpRequest", "ajax", "storefront javascript plugin", "http request", "Response.text", "load data"]
summary: Fetch data in a Storefront JS plugin with the native fetch API, e.g. from /widgets/checkout/info, inside a class extending window.PluginBaseClass.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a Storefront JavaScript plugin loads extra data from the shop at runtime. Shopware does not wrap this in a helper for this use case; the guide uses the browser's standard, promise-based `fetch` API (the modern replacement for `XMLHttpRequest`).

## When to use

You have a working plugin with a custom Storefront JavaScript plugin (see [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) and the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and it needs to request HTML or data from a Storefront route after page load.

## Key steps / config

1. Create the plugin file, e.g. `<plugin root>/src/Resources/app/storefront/src/example-plugin/example-plugin.plugin.js`.
2. Take the base class from the global object (`const { PluginBaseClass } = window;`) and extend it.
3. Call an `async` method from `init()` that awaits `fetch(url)` and then reads the body from the `Response` (`response.text()` for HTML, `response.json()` for JSON).

```javascript
const { PluginBaseClass } = window;

export default class ExamplePlugin extends PluginBaseClass {
    init() { this.fetchData(); }

    async fetchData() {
        const response = await fetch('/widgets/checkout/info');
        const data = await response.text();
    }
}
```

The example endpoint `/widgets/checkout/info` is the Storefront route `frontend.checkout.info` (GET, `XmlHttpRequest` default `true`) in `Shopware\Storefront\Controller\CheckoutController`.

## Essential identifiers

- `window.PluginBaseClass` / `PluginBaseClass`
- `fetch`, `Response.text()`
- `/widgets/checkout/info` (route name `frontend.checkout.info`)
- `example-plugin.plugin.js` under `src/Resources/app/storefront/src/`

## Gotchas

- `frontend.checkout.info` returns an empty `204 No Content` response when the cart has no line items, so `response.text()` yields an empty string; check `response.status` before using the body.
- The plugin file is only loaded when it is registered from the plugin's Storefront entry file (`main.js` or `main.ts`) and the Storefront is rebuilt.

## Code check (6.7.13.0)
- confirmed `PluginBaseClass` — exposed globally as `window.PluginBaseClass` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `/widgets/checkout/info` — Storefront route path — vendor/shopware/storefront/Controller/CheckoutController.php:256
- confirmed `frontend.checkout.info` — route name of that path — vendor/shopware/storefront/Controller/CheckoutController.php:257
- confirmed `XmlHttpRequest` — route default set to true — vendor/shopware/storefront/Controller/CheckoutController.php:258
- confirmed `HTTP_NO_CONTENT` — returned when the cart is empty — vendor/shopware/storefront/Controller/CheckoutController.php:265
- confirmed `app/storefront/src/main.js` — plugin Storefront entry file (main.ts preferred if present) — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:187
- unverified `fetch` — browser Web API, not part of the installed Shopware code
