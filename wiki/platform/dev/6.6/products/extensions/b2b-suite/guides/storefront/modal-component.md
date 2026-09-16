---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/modal-component.md
title: Modal component
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/storefront/modal-component.html"
sourceHash: e63058e888e901be04218eb96087dcdcb960595f
keywords: ["modal component", "b2b suite", "sw_extends", "_modal.html.twig", "_modal-content.html.twig", "b2b_modal_base_navigation_header", "b2b_modal_base_content_inner", "modalSettings", "b2b--tab-link", "ajax panel modal"]
summary: "B2B modal component: extend @SwagB2bPlatform's _modal.html.twig / _modal-content.html.twig via sw_extends and configurable modalSettings blocks."
lastBuilt: "2026-09-15"
---
## What it is
Explains the B2B modal component used for entity detail windows, built from two chained templates: the base modal template `components/SwagB2bPlatform/Resources/views/storefront/_partials/_b2bmodal/_modal.html.twig` for structure and navigation, and the content template `_modal-content.html.twig` for a fixed top/bottom bar (used for filtering, sorting, pagination).

## When to use
When building a new entity detail view or grid-item popup for the B2B Suite storefront, instead of writing a bespoke modal from scratch (extending gives a consistent look, no extra CSS classes, and easy modifications).

## Key steps / config
Simple content modal, extending the base template:

```twig
{% sw_extends '@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal.html.twig' %}
{% set modalSettings = { navigation: false } %}
{% block b2b_modal_base_navigation_header %}Modal Title{% endblock %}
{% block b2b_modal_base_content_inner %}Modal Content{% endblock %}
```

Set `navigation: true` and fill `b2b_modal_base_navigation_entries` (list items with class `b2b--tab-link`) for a sidebar. Content can be an ajax panel by placing a `b2b--ajax-panel` div inside `b2b_modal_base_content_inner`.

For fixed top/bottom bars, extend `_modal-content.html.twig` instead and set `modalSettings` with `bottom: true` and `content.padding: true`, then fill blocks `b2b_modal_base_content_inner_topbar_headline`, `b2b_modal_base_content_inner_scrollable_inner_actions_inner`, `b2b_modal_base_content_inner_scrollable_inner_content_inner`, `b2b_modal_base_content_inner_scrollable_inner_bottom_inner`.

Available states: simple content holder, ajax-panel-delivered content, split view with sidebar navigation, and fixed top/bottom action/pagination bars.

## Essential identifiers
- `@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal.html.twig`
- `@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal-content.html.twig`
- `modalSettings` (`navigation`, `bottom`, `content.padding`)
- `b2b_modal_base_navigation_header`, `b2b_modal_base_navigation_entries`, `b2b_modal_base_content_inner`
