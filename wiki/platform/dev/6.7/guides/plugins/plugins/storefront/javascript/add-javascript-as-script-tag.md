---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-javascript-as-script-tag.md
title: Add JavaScript as Script Tag
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/add-javascript-as-script-tag.html
sourceHash: eeb14b347e452e225ed4f287fe7d3a936a2b6e07
codeCheckedAgainst: "6.7.13.0"
keywords: ["script tag", "external javascript", "layout_head_javascript_assets", "layout_head_javascript_hmr_mode", "base_body_script", "meta.html.twig", "base.html.twig", "defer", "async", "script order", "third-party library", "storefront head"]
summary: Output a separate JavaScript script element via Storefront Twig blocks (head JS assets, base_body_script), with order and defer/async rules.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md"]
---
## What it is

How to output JavaScript as a separate HTML `script` element from a Storefront template, instead of compiling it into the plugin entry point `<plugin root>/src/Resources/app/storefront/src/main.js` (see [Add custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md)).

## When to use

When code must not go through the Storefront build, e.g. an external library or third-party snippet loaded by URL, or a script that should only render under certain conditions.

## Key steps / config

1. **Extend the head template** `@Storefront/storefront/layout/meta.html.twig` in your plugin (`<plugin root>/src/Resources/views/storefront/layout/meta.html.twig`) and override the block that renders the Storefront JavaScript, `layout_head_javascript_assets`. Always call `{{ parent() }}` so the core Storefront JS is still rendered; place your own `script` element before or after it:
   ```twig
   {% sw_extends '@Storefront/storefront/layout/meta.html.twig' %}
   {% block layout_head_javascript_assets %}
       {# Storefront JS #}
       {{ parent() }}
       {# your script element here, e.g. with src and defer #}
   {% endblock %}
   ```
   In 6.7 this block is rendered in both modes: directly when `v6.8.0.0` is active, otherwise via `sw_block('layout_head_javascript_assets')` from the legacy head block.
2. **Conditional scripts**: wrap your element in a Twig `{% if ... %}` / `{% endif %}` inside the block instead of always rendering it.
3. **Order**:
   - If the Storefront JavaScript (from `main.js`) does **not** need access to your script's code, add your element **after** `{{ parent() }}`.
   - If it **does** need access, add it **before** `{{ parent() }}`.
4. **Loading behaviour**: prefer the `defer` attribute (execute after the document is parsed). For libraries, follow their documentation — some expect `async`.
5. **Alternative locations**: block `base_body_script` in `@Storefront/storefront/base.html.twig` (empty, just before the closing body tag), or any other Twig block. Use these only for a technical reason, such as a library's documentation requiring a specific location.

## Essential identifiers

- `@Storefront/storefront/layout/meta.html.twig`, block `layout_head_javascript_assets`
- `@Storefront/storefront/base.html.twig`, block `base_body_script`
- `{{ parent() }}`, `sw_extends`
- Attributes `defer`, `async`

## Gotchas

- Omitting `{{ parent() }}` in the head JS block removes the core Storefront JavaScript and breaks its functionality — only do this deliberately.
- Non-async external scripts placed before the Storefront JavaScript postpone its execution; external scripts without `defer` or `async` block rendering. Many scripts hurt shop performance.
- The docs name block `layout_head_javascript_hmr_mode`; in 6.7.13 it is `@deprecated tag:v6.8.0` and only rendered when `v6.8.0.0` is inactive — the core template points to `layout_head_javascript_assets` instead.

## Version notes

- 6.8.0: `layout_head_javascript_hmr_mode` (and its webpack hot-proxy dev branch) will be removed; `layout_head_javascript_assets` becomes the only head JS block.

## Code check (6.7.13.0)
- deprecated `layout_head_javascript_hmr_mode` — @deprecated tag:v6.8.0, use layout_head_javascript_assets — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:287
- confirmed `sw_block` — legacy block renders layout_head_javascript_assets when v6.8.0.0 inactive — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:298
- confirmed `layout_head_javascript_assets` — block renders theme_scripts with defer — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:304
- confirmed `base_body_script` — empty block before closing body — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:143
- confirmed `sw_extends` — Shopware extends tag — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
