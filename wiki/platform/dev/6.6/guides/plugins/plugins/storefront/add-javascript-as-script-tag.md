---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-javascript-as-script-tag.md
title: Add Javascript as script tag
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-javascript-as-script-tag.html
sourceHash: 298c245dd1bb288190a33a57fc50cfe0cd2c62ec
keywords: ["script tag", "main.js", "layout_head_javascript_hmr_mode", "base_body_script", "defer", "async", "script order", "conditional scripts", "storefront javascript", "base.html.twig"]
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md
summary: How to add JavaScript as a separate script tag in the Storefront, and how load order and defer/async affect it.
lastBuilt: 2026-09-15
---
## What it is

Describes adding JavaScript to the Storefront as a standalone `script` element (as opposed to bundling it into the plugin's `main.js` entry point), and how ordering relative to the core Storefront JavaScript works.

## When to use

When a script must be added outside the normal `main.js` compilation pipeline, e.g. a third-party library with specific loading requirements, or a script that must run only under certain conditions.

## Key steps / config

The normal entry point is `<plugin root>/src/Resources/app/storefront/src/main.js`, compiled with the Storefront JavaScript. To add a script tag directly instead, extend the relevant head/body Twig block and always call `{{ parent() }}` when overriding block `layout_head_javascript_hmr_mode`, or the core Storefront JS will stop working. An alternative location near the body is block `base_body_script` in `src/Storefront/Resources/views/storefront/base.html.twig`; a script element can be added at any location the Twig blocks offer.

Ordering rule: a script placed **before** the Storefront JavaScript can be read by it; a script placed **after** cannot access the Storefront JS but doesn't delay its execution.

## Essential identifiers

- `main.js` entry point
- `layout_head_javascript_hmr_mode` block
- `base_body_script` block
- `src/Storefront/Resources/views/storefront/base.html.twig`

## Gotchas

Extending `layout_head_javascript_hmr_mode` without calling `{{ parent() }}` overwrites core Storefront JS functionality and should only be done deliberately. A non-async external script placed before the Storefront JavaScript postpones its execution; too many such scripts hurt shop performance. Prefer the `defer` attribute (or `async`, per the library's own docs) for externally loaded scripts; omitting both blocks page rendering until the script executes. Alternative script locations should only be used when there is a technical reason (e.g. a library documentation requiring a specific placement).
