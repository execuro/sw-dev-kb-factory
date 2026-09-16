---
id: platform/dev/6.6/guides/plugins/apps/administration/add-custom-modules.md
title: Add custom module
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/administration/add-custom-modules.html
sourceHash: 2a84c75527ed24354235d5c4897e38bcad4994c4
keywords: ["module", "manifest.xml", "app modules", "iframe", "main-module", "shop-id", "shop-url", "shopware-shop-signature", "sw-app-loaded", "admin menu", "app-<appName>-<moduleName>", "APP_URL"]
summary: "Adding custom admin modules for apps via <module> elements in manifest.xml, loaded as iframes with signed query parameters."
lastBuilt: "2026-09-15"
---
## What it is

Describes how apps add their own modules to the Administration; modules load an iframe pointing at the app's server inside the Administration UI.

## Key steps / config

Define `<module>` elements inside `<admin>` in `manifest.xml`:

```xml
<admin>
    <module name="exampleModule"
            source="https://example.com/promotion/view/promotion-module"
            parent="sw-marketing"
            position="50">
        <label>Example module</label>
        <label lang="de-DE">Beispiel Modul</label>
    </module>
</admin>
```

Attributes:
- `name` (required) — technical name the module is referenced by.
- `parent` (required/optional depending on nesting) — Administration navigation id of the parent menu item; if omitted, the module is listed under "My apps" (this will become required in future versions, as "My Apps" is planned for removal).
- `source` (optional) — URL the module is served from; can be omitted for a module that is only a parent for other modules.
- `position` (optional) — numeric ordering among siblings.

When opened, the app receives a request to `source` with query parameters `shop-id`, `shop-url`, `timestamp`, and `shopware-shop-signature` (SHA256 HMAC of the rest of the query string, signed with the shop secret).

To leave the loading spinner state, the iframe must signal readiness:

```javascript
window.parent.postMessage('sw-app-loaded', '*');
```

If not signaled within 5 seconds, loading is aborted.

Navigation ids for modules follow the pattern `app-<appName>-<moduleName>`, so a module's `parent` can reference another module just created in the same manifest.

A main module (opened from the app list/detail page) is defined with `<main-module source="...">` inside `<admin>`; its only required attribute is `source`. This feature is not compatible with themes.

## Essential identifiers

- `<module name="" parent="" source="" position="">`, `<main-module source="">`
- `shop-id`, `shop-url`, `timestamp`, `shopware-shop-signature`
- `sw-app-loaded` (postMessage), `sw-version` (query param used to select matching Administration stylesheets)

## Gotchas

Modules used only as parents for other modules do not need `source`, though it can still be set. Iframe modules cannot use Administration stylesheets/JS directly; the compiled Administration stylesheets for each version are found in the tagged releases of `shopware/administration` under `Resources/public/static`.

## Version notes

- Shopware 6.4.0.0 added a third level in the admin menu structure (module grouping) and the ability to define a main module.
