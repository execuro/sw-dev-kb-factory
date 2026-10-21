---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-javascript-as-script-tag.md
title: Add JavaScript as Script Tag
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/add-javascript-as-script-tag.html
sourceHash: eeb14b347e452e225ed4f287fe7d3a936a2b6e07
codeCheckedAgainst: "6.7.15.1"
keywords: ["script tag", "external script", "layout_head_javascript_assets", "layout_head_javascript_hmr_mode", "base_body_script", "layout/meta.html.twig", "base.html.twig", "parent()", "defer", "async", "script order", "third-party library"]
summary: Add a separate script element to the Storefront via Twig blocks in layout/meta.html.twig or base.html.twig - ordering, defer/async, conditional loading.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md"]
---
## What it is

How to add JavaScript to the Storefront as a separate `script` element in a Twig template, instead of compiling it into the bundle via the main entry point `<plugin root>/src/Resources/app/storefront/src/main.js` (see [Add Custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md)).

## When to use

You need to load a script on its own, e.g. an external library whose documentation prescribes a script element, or a script rendered only under a condition.

## Key steps / config

1. Extend `@Storefront/storefront/layout/meta.html.twig` in your plugin and override the block that renders the Storefront JavaScript assets, `layout_head_javascript_assets`. Always call `{{ parent() }}` so the core Storefront JS is still rendered:

```twig
{% sw_extends '@Storefront/storefront/layout/meta.html.twig' %}

{% block layout_head_javascript_assets %}
    {# your script element BEFORE the Storefront JS #}
    {{ parent() }}
    {# your script element AFTER the Storefront JS #}
{% endblock %}
```

2. Conditional scripts: wrap your script element in a Twig `{% if ... %}` inside the block instead of rendering it on every page.
3. Order: put your script **after** the Storefront JavaScript unless code in your plugin's `main.js` needs access to what the script provides; then put it **before**.
4. Loading: use the `defer` attribute (script runs after the document is parsed). For libraries, follow their documentation - some expect `async`.
5. Alternative location: the empty block `base_body_script` in `@Storefront/storefront/base.html.twig` renders near the end of the body. Any Twig block can hold a script element, but use alternative locations only for a technical reason (e.g. a library requires it).

## Essential identifiers

- `@Storefront/storefront/layout/meta.html.twig`, block `layout_head_javascript_assets`
- `@Storefront/storefront/base.html.twig`, block `base_body_script`
- `{{ parent() }}`
- `defer`, `async`

## Gotchas

- Omitting `{{ parent() }}` in the overridden block removes the core Storefront JavaScript and breaks Storefront functionality - only do this deliberately.
- Non-async script elements placed before the Storefront JavaScript postpone its execution; external scripts without `defer` or `async` block rendering. Both hurt performance.
- The docs use block `layout_head_javascript_hmr_mode`; in 6.7.15.1 it is marked `@deprecated tag:v6.8.0` (use `layout_head_javascript_assets`). Without the `v6.8.0.0` feature flag the HMR block renders `layout_head_javascript_assets` via `sw_block`, so overriding the assets block works in both modes.
- Core production assets are rendered by `layout_head_javascript_prod` with `defer`.

## Version notes

- `layout_head_javascript_hmr_mode` (and its nested `layout_head_javascript_hmr_dev`) is removed with 6.8; `layout_head_javascript_assets` is the replacement.

## Code check (6.7.15.1)
- deprecated `layout_head_javascript_hmr_mode` — @deprecated tag:v6.8.0, use layout_head_javascript_assets — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:283
- confirmed `layout_head_javascript_assets` — renders dev-server or production theme scripts — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:300
- confirmed `sw_block` — HMR block renders layout_head_javascript_assets when not in HMR mode — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:294
- confirmed `layout_head_javascript_prod` — theme_scripts() emitted with defer — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:320
- confirmed `base_body_script` — empty block before closing body — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:143
- confirmed `app/storefront/src/main.js` — bundled entry alternative — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:187
