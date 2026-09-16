---
id: "platform/dev/6.6/resources/references/adr/2021-07-22-move-storefront-scripts-to-head.md"
title: "Move storefront script to head with defer"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-07-22-move-storefront-scripts-to-head.html"
sourceHash: "d38442ee73ed80b282a20850209be3fa9762be4e"
keywords: ["base_body_script", "defer attribute", "async attribute", "DOMContentLoaded", "document.readystatechange", "all.js", "script loading", "meta.html.twig", "storefront performance", "script element order"]
summary: "ADR: storefront script elements move to the document head with defer instead of async, and plugins init on DOMContentLoaded."
lastBuilt: "2026-09-15"
---
## What it is

This ADR moves the storefront's default script elements (inline scripts and `all.js`) from the bottom of the page to the document head, using the `defer` attribute instead of `async`, to improve script loading behavior.

## When to use

Relevant when working on storefront script loading order, plugin initialization timing, or extending the `base_body_script` twig blocks.

## Key steps / config

- Previously, main storefront script elements sat near the closing body tag; `all.js` used the `async` attribute, which is unsuitable because storefront JavaScript plugins depend on DOM elements and must wait for the document to finish loading anyway.
- `DOMContentLoaded` is not compatible with an `async`-loaded script element, because such elements can execute before that event fires; the codebase previously relied on `document.readystatechange` reaching the `complete` state instead, meaning plugins only initialized after the entire document — including all images and other resources — had fully loaded.
- Decision: move all default script elements to the document head and give them the `defer` attribute instead of `async`.
- Plugin initialization now listens for `DOMContentLoaded` instead of the `document.readystatechange` to `complete` transition, so plugins only wait for the document itself, not for additional resources like images.
- Placing script elements in the head lets the browser start downloading them as soon as the head is parsed; `defer` delays execution until the document is parsed (right before `DOMContentLoaded`) and guarantees deferred script elements execute in the order they are declared.
- All app/plugin script elements that extended one of the `base_body_script` child blocks must be moved to `Resources/views/storefront/layout/meta.html.twig`.

## Essential identifiers

- `base_body_script` twig block
- `Resources/views/storefront/layout/meta.html.twig`
- `defer` attribute
- `DOMContentLoaded`

## Gotchas

Any extension relying on the old `base_body_script` child blocks near the body end must relocate its script elements into `meta.html.twig`, or the script will no longer load in the intended position/order.
