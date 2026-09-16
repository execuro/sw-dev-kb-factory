---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/modal-component.md
title: Modal component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/modal-component.html
sourceHash: e63058e888e901be04218eb96087dcdcb960595f
codeCheckedAgainst: "6.7.13.0"
keywords: ["_modal.html.twig", "_modal-content.html.twig", "modalSettings", "sw_extends", "SwagB2bPlatform", "b2b_modal_base_navigation_header", "b2b_modal_base_content_inner", "b2b_modal_base_navigation_entries", "b2b--tab-link", "b2b modal", "modal dialog", "detail window"]
summary: B2B Suite modal templates _modal.html.twig and _modal-content.html.twig - modalSettings (navigation, bottom, content.padding) and the twig blocks to override.
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite modal component is a pair of templates used for entity detail windows of grid items. The base template `components/SwagB2bPlatform/Resources/views/storefront/_partials/_b2bmodal/_modal.html.twig` gives the modal structure (navigation and content blocks); the content template `components/SwagB2bPlatform/Resources/views/storefront/_partials/_b2bmodal/_modal-content.html.twig` extends the content area with optional fixed top and bottom bars (used for filtering, sorting, pagination).

## When to use

When a B2B Suite storefront view needs a modal: a simple content holder, content from an ajax panel, a split view with sidebar navigation, or fixed action/pagination bars. Extending these templates gives the same look for every view without additional CSS classes.

## Key steps / config

1. Extend the base modal and configure `modalSettings`; set `navigation: true` for a sidebar:

```twig
{% sw_extends '@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal.html.twig' %}
{% set modalSettings = { navigation: true } %}
{% block b2b_modal_base_navigation_header %}Modal Title{% endblock %}
{% block b2b_modal_base_navigation_entries %}
    <li><a class="b2b--tab-link">Navigation Link</a></li>
{% endblock %}
{% block b2b_modal_base_content_inner %}
    <div class="b2b--ajax-panel" data-id="example-panel" data-url="{url}"></div>
{% endblock %}
```

With `navigation: false`, only `b2b_modal_base_navigation_header` and `b2b_modal_base_content_inner` are needed; the content block can hold static content or an ajax panel.

2. For the ajax-panel content, extend the content template and enable bars:

```twig
{% sw_extends "@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal-content.html.twig" %}
{% set modalSettings = { navigation: true, bottom: true, content: { padding: true } } %}
{% block b2b_modal_base_content_inner_topbar_headline %}...{% endblock %}
{% block b2b_modal_base_content_inner_scrollable_inner_actions_inner %}...{% endblock %}
{% block b2b_modal_base_content_inner_scrollable_inner_content_inner %}...{% endblock %}
{% block b2b_modal_base_content_inner_scrollable_inner_bottom_inner %}...{% endblock %}
```

Styling for each combination of settings is applied automatically. The top bar is used for action buttons (e.g. "create element"), the bottom bar e.g. for pagination.

## Essential identifiers

- `@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal.html.twig`
- `@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal-content.html.twig`
- `modalSettings` keys: `navigation`, `bottom`, `content.padding`
- Base blocks: `b2b_modal_base_navigation_header`, `b2b_modal_base_navigation_entries`, `b2b_modal_base_content_inner`
- Content blocks: `b2b_modal_base_content_inner_topbar_headline`, `b2b_modal_base_content_inner_scrollable_inner_actions_inner`, `b2b_modal_base_content_inner_scrollable_inner_content_inner`, `b2b_modal_base_content_inner_scrollable_inner_bottom_inner`
- CSS class `b2b--tab-link`

## Code check (6.7.13.0)
- confirmed `sw_extends` — Shopware Twig token parser tag — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- unverified `_modal.html.twig` — B2B Suite template; the B2B Suite plugin is not part of the installed core/storefront/administration packages
- unverified `_modal-content.html.twig` — B2B Suite template, not installed
- unverified `modalSettings` — B2B Suite template variable, not installed
- unverified `b2b_modal_base_content_inner` — B2B Suite twig block, not installed
- unverified `b2b--tab-link` — B2B Suite CSS class, not installed
