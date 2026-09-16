---
id: platform/dev/6.7/resources/references/adr/2021-07-22-move-storefront-scripts-to-head.md
title: Move storefront script to head with defer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-07-22-move-storefront-scripts-to-head.html
sourceHash: d38442ee73ed80b282a20850209be3fa9762be4e
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront javascript", "defer", "async", "DOMContentLoaded", "base_body_script", "meta.html.twig", "layout_head_javascript_prod", "theme_scripts", "all.js", "script loading", "head", "javascript plugins", "adr"]
summary: "ADR: storefront script tags live in the head with defer instead of async at body end; JS plugins init on DOMContentLoaded; move scripts to meta.html.twig."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (storefront area): the default storefront script tags were moved from the end of the body into the document head and load with the `defer` attribute instead of `async`; JavaScript plugins initialise on `DOMContentLoaded` instead of `document.readystatechange --> complete`.

## When to use

- Adding or overriding storefront JavaScript includes in a theme, plugin or app.
- Migrating templates that still extend child blocks of `base_body_script`.
- Understanding when storefront JS plugins are initialised.

## Key steps / config

Context (before): main scripts (inline scripts and `all.js`) sat near the body end tag with `async`. Because JS plugins depend on DOM elements and `DOMContentLoaded` is not compatible with `async` scripts, initialisation waited for `readystatechange` complete, i.e. for all resources including images.

Decision:

1. All default script tags are placed in the head with `defer`.
2. JS plugins initialise on `DOMContentLoaded`, so they wait only for the document, not images.
3. The browser fetches scripts as soon as the head is parsed; `defer` runs them after parsing, just before `DOMContentLoaded`, in declaration order.

Consequence for extensions: script tags that extended `base_body_script` child blocks must move to `Resources/views/storefront/layout/meta.html.twig`. In 6.7 the theme scripts are rendered there, inside `layout_head_javascript_prod`, roughly as:

```twig
{% block layout_head_javascript_prod %}
    {% for script in theme_scripts() %}
        {# script element: src="{{ asset(script, 'theme') }}", attribute defer #}
    {% endfor %}
{% endblock %}
```

Other head JS blocks in `meta.html.twig` include `layout_head_javascript_importmap`, `layout_head_javascript_feature`, `layout_head_javascript_router` and the empty `layout_head_javascript_jquery`.

## Essential identifiers

- `@Storefront/storefront/layout/meta.html.twig`
- `layout_head_javascript_assets`, `layout_head_javascript_prod`
- `theme_scripts()`
- `base_body_script` (block in `base.html.twig`, empty by default)
- `DOMContentLoaded`, `defer`

## Gotchas

- Do not use `async` on storefront scripts: they may run before `DOMContentLoaded` fires and miss plugin initialisation.
- Scripts left in `base_body_script` still render at body end and lose the head/defer ordering.

## Version notes

- In 6.7 `layout_head_javascript_assets` is only declared inside a `feature('v6.8.0.0')` check; without the flag the deprecated `layout_head_javascript_hmr_mode` block renders it via `sw_block`.

## Code check (6.7.13.0)
- confirmed `base_body_script` — still present but empty at body end — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:143
- confirmed `layout_head_javascript_prod` — theme scripts rendered in head with defer — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:324
- confirmed `theme_scripts()` — loop source for deferred theme scripts — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:328
- confirmed `DOMContentLoaded` — storefront main.js initialises on this event — vendor/shopware/storefront/Resources/app/storefront/src/main.js:198
- confirmed `layout_head_javascript_assets` — wrapped in feature('v6.8.0.0') check — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:304
- deprecated `layout_head_javascript_hmr_mode` — tag:v6.8.0, use layout_head_javascript_assets — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:287
- confirmed `layout_head_javascript_jquery` — empty head block for adding jQuery — vendor/shopware/storefront/Resources/views/storefront/layout/meta.html.twig:278
- confirmed `all.js` — referenced as theme script path — vendor/shopware/storefront/Theme/ThemeConfigValueAccessor.php:193
