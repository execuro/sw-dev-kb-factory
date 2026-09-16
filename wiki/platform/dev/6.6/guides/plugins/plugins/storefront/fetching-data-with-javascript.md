---
id: "platform/dev/6.6/guides/plugins/plugins/storefront/fetching-data-with-javascript.md"
title: "Fetching data with Javascript"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/fetching-data-with-javascript.html"
sourceHash: "16137ff8641b5f2609e76ca3837a4db1f2b0a495"
keywords: ["fetch API", "fetchData", "PluginBaseClass", "ExamplePlugin", "XMLHttpRequest", "widgets/checkout/info", "storefront javascript plugin", "async await", "Response object", "plugin data fetching", "javascript plugin", "ajax replacement"]
summary: "Shows how a storefront JS plugin fetches API data with the native fetch() API inside init(), replacing XMLHttpRequest."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to fetch additional data from the Shopware API inside a storefront JavaScript plugin, using the browser's native `fetch` API instead of the older `XMLHttpRequest` object.

## When to use
Use this approach when a plugin's JavaScript needs to retrieve extra data from an endpoint after the page has loaded, for example to populate a widget dynamically rather than rendering everything server-side up front.

## Key steps / config
The guide extends the storefront plugin base class and calls an async fetch inside the plugin's `init()` lifecycle hook:

```javascript
// <plugin root>/src/Resources/app/storefront/src/example-plugin/example-plugin.plugin.js
const { PluginBaseClass } = window;

export default class ExamplePlugin extends PluginBaseClass {
    init() {
        this.fetchData();
    }
    async fetchData() {
        const response = await fetch('/widgets/checkout/info');
        const data = await response.text();
    }
}
```

`fetch` is a promise-based API and a modern replacement for `XMLHttpRequest`; it lets the plugin make network requests similar to XHR but with `async`/`await` syntax instead of callbacks. The example calls the `/widgets/checkout/info` endpoint and awaits a `Response` object representing the response to the request, then reads the body with the `Response` object's `text()` method. Any endpoint reachable by the storefront, such as widget or other API routes, can be requested the same way; the `Response` object also exposes other body-reading methods, such as `json()`, for different content types, though the guide only demonstrates `text()`.

## Essential identifiers
- `fetch()` — native browser Fetch API used to make the request
- `PluginBaseClass` — storefront JS plugin base class that custom plugins extend
- `Response.text()` — reads the fetch response body as text
- `/widgets/checkout/info` — example endpoint requested in the guide
