---
id: platform/dev/6.7/resources/references/adr/2021-07-22-move-storefront-scripts-to-head.md
title: Move storefront script to head with defer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-07-22-move-storefront-scripts-to-head.html
sourceHash: d38442ee73ed80b282a20850209be3fa9762be4e
codeCheckedAgainst: "6.7.15.1"
keywords: ["defer", "async", "DOMContentLoaded", "base_body_script", "meta.html.twig", "layout_head_javascript_assets", "theme_scripts", "PluginManager.initializePlugins", "storefront javascript", "script loading", "head", "js plugin initialization", "adr"]
summary: "ADR 2021-07-22: Storefront script tags live in the head with defer; JS plugins init on DOMContentLoaded; extend meta.html.twig, not base_body_script."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: storefront, 2021-07-22) that moved the Storefront's default script tags (inline scripts and the main theme bundle, then `all.js`) from the end of the body into the document `<head>`, loaded with the `defer` attribute instead of `async`, and switched JavaScript plugin initialization to the `DOMContentLoaded` event.

## When to use

When an app, plugin or theme adds JavaScript to the Storefront and you need to know which Twig template and block to extend, or why JS plugins initialize before images have finished loading.

## Key steps / config

- Add custom script tags in `Resources/views/storefront/layout/meta.html.twig` (extend `@Storefront/storefront/layout/meta.html.twig`), inside the head's JavaScript blocks — not in `base_body_script` in `base.html.twig`.
- In 6.7 the theme bundles are emitted by the `layout_head_javascript_assets` block, which loops over `theme_scripts()` and renders each file as a script tag with `type="text/javascript"` and `defer` (sub-block `layout_head_javascript_prod`).
- Further head blocks for inline data exist, e.g. `layout_head_javascript_feature`, `layout_head_javascript_router`, `layout_head_javascript_breakpoints`, `layout_head_javascript_token`, `layout_head_javascript_jquery`.
- The Storefront entry (`main.js`) calls `PluginManager.initializePlugins()` inside a `document.addEventListener('DOMContentLoaded', ...)` listener.

```twig
{% sw_extends '@Storefront/storefront/layout/meta.html.twig' %}
{% block layout_head_javascript_assets %}
    {{ parent() }}
    {# your deferred script tag here #}
{% endblock %}
```

## Essential identifiers

- `meta.html.twig` (`Resources/views/storefront/layout/meta.html.twig`)
- `layout_head_javascript_assets`, `layout_head_javascript_prod`
- `theme_scripts()`
- `defer`, `DOMContentLoaded`
- `PluginManager.initializePlugins()`

## Gotchas

- Why not `async`: Storefront JS plugins depend on DOM elements, and async scripts may run before `DOMContentLoaded`. The old workaround, waiting for `document.readystatechange` to reach `complete`, delayed every plugin until all resources including images had loaded.
- `defer` lets the browser fetch scripts as soon as the head is parsed, delays execution until the document is parsed (just before `DOMContentLoaded`), and keeps scripts executing in declaration order.
- Consequence stated by the ADR: app/plugin script tags that extended one of the `base_body_script` child blocks must be moved to `meta.html.twig`. The `base_body_script` block still exists in `base.html.twig` but is empty.

## Version notes

In 6.7.15.1 the HMR wrapper block `layout_head_javascript_hmr_mode` (Webpack hot proxy) is marked `@deprecated tag:v6.8.0`; with the `v6.8.0.0` feature flag `layout_head_javascript_assets` is rendered directly and the dev server serves ES modules.

## Code check (6.7.15.1)
- confirmed `base_body_script` — still defined, empty, at the end of the body — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:143
- confirmed `layout_head_javascript_assets` — head block that outputs theme scripts — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:300
- confirmed `layout_head_javascript_prod` — loops `theme_scripts()` into deferred script tags — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:320
- confirmed `defer` — production theme scripts carry `defer` — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:325
- confirmed `DOMContentLoaded` — plugin initialization listener — vendor/shopware/storefront/Resources/app/storefront/src/main.js:200
- confirmed `PluginManager.initializePlugins()` — called on DOMContentLoaded — vendor/shopware/storefront/Resources/app/storefront/src/main.js:201
- confirmed `layout_head_javascript_router` — inline router data block in the head — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:217
- deprecated `layout_head_javascript_hmr_mode` — removed in v6.8.0 — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:283
