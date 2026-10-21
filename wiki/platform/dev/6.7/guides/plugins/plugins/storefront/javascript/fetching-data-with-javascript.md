---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/fetching-data-with-javascript.md
title: Fetching Data with JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/fetching-data-with-javascript.html
sourceHash: 5ded4397c2c7e2e15e91ab4a5becf365616e980b
codeCheckedAgainst: "6.7.15.1"
keywords: ["fetch", "fetch api", "XMLHttpRequest", "PluginBaseClass", "/widgets/checkout/info", "frontend.checkout.info", "async", "response.text()", "ajax", "storefront js plugin", "http request"]
summary: Fetch data inside a Storefront JS plugin with the native fetch API, e.g. GET /widgets/checkout/info, reading the response body as text.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md"]
---
## What it is

How a Storefront JavaScript plugin requests data from the server using the browser's standard promise-based `fetch` API (the modern replacement for `XMLHttpRequest`).

## When to use

Your Storefront plugin needs additional data at runtime. Prerequisites: a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and a custom JS plugin ([Add Custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md)).

## Key steps / config

In `<plugin root>/src/Resources/app/storefront/src/example-plugin/example-plugin.plugin.js`, call an async method from `init()`:

```javascript
const { PluginBaseClass } = window;

export default class ExamplePlugin extends PluginBaseClass {
    init() { this.fetchData(); }

    async fetchData() {
        const response = await fetch('/widgets/checkout/info');
        const data = await response.text();
        console.log(data);
    }
}
```

`fetch` resolves to a `Response`; `text()` returns the body as text.

## Essential identifiers

- `fetch`, `Response.text()`
- `/widgets/checkout/info` (route `frontend.checkout.info`)
- `PluginBaseClass`

## Gotchas

- `/widgets/checkout/info` is GET-only and marked as an XmlHttpRequest route; it returns HTML (the header cart widget), not JSON, and an empty 204 response when the cart has no line items.

## Code check (6.7.15.1)
- confirmed `/widgets/checkout/info` — Storefront route, GET only — vendor/shopware/storefront/Controller/CheckoutController.php:259
- confirmed `frontend.checkout.info` — route name, XmlHttpRequest default true — vendor/shopware/storefront/Controller/CheckoutController.php:260
- confirmed `HTTP_NO_CONTENT` — returned when the cart is empty; otherwise renders cart-widget.html.twig — vendor/shopware/storefront/Controller/CheckoutController.php:268
- confirmed `PluginBaseClass` — exposed as window.PluginBaseClass — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:972
- unverified `fetch` — browser API, outside the Shopware code
