---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/modal-component.md
title: Modal component
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/modal-component.html
sourceHash: e63058e888e901be04218eb96087dcdcb960595f
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "modal component", "b2b modal", "_modal.html.twig", "_modal-content.html.twig", "modalSettings", "sw_extends", "b2b_modal_base_content_inner", "b2b_modal_base_navigation_entries", "b2b--ajax-panel", "b2b--tab-link", "SwagB2bPlatform", "ajax panel"]
summary: B2B Suite storefront modal templates _modal.html.twig and _modal-content.html.twig - modalSettings options, navigation, ajax panel and twig blocks.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite modal component is the modal view used for entity detail windows that hold additional content for a selected grid item. It is built from two templates:

- Base modal `components/SwagB2bPlatform/Resources/views/storefront/_partials/_b2bmodal/_modal.html.twig` — base structure, with Twig blocks for the modal navigation and the content area.
- Content modal `components/SwagB2bPlatform/Resources/views/storefront/_partials/_b2bmodal/_modal-content.html.twig` — extends the content block; configurable with fixed top and bottom bars (used for filtering, sorting, pagination).

## When to use

Extend these templates instead of building your own modal: every view gets the same experience, no additional CSS classes are needed, and modifications are simple because all views share the same classes. Supported states: simple content holder, content delivered by an ajax panel, split view with sidebar navigation and ajax-ready content, fixed top/bottom bars for action buttons and pagination.

## Key steps / config

**Simple modal** — extend the base modal, disable navigation:

```twig
{% sw_extends '@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal.html.twig' %}
{% set modalSettings = { navigation: false } %}
{% block b2b_modal_base_navigation_header %}Modal Title{% endblock %}
{% block b2b_modal_base_content_inner %}Modal Content{% endblock %}
```

**With navigation sidebar** — set `navigation: true` and fill `b2b_modal_base_navigation_entries` with `<li><a class="b2b--tab-link">…</a></li>` items.

**With navigation and ajax panel** — in `b2b_modal_base_content_inner` place an ajax panel:

```twig
<div class="b2b--ajax-panel" data-id="example-panel" data-url="{url}"></div>
```

**Ajax panel content template** — the loaded content extends the content modal; top and bottom bars can be switched on/off and styling for each combination is applied automatically:

```twig
{% sw_extends "@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal-content.html.twig" %}
{% set modalSettings = { navigation: true, bottom: true, content: { padding: true } } %}
{% block b2b_modal_base_content_inner_topbar_headline %}…{% endblock %}
{% block b2b_modal_base_content_inner_scrollable_inner_actions_inner %}…{% endblock %}
{% block b2b_modal_base_content_inner_scrollable_inner_content_inner %}…{% endblock %}
{% block b2b_modal_base_content_inner_scrollable_inner_bottom_inner %}…{% endblock %}
```

The top bar is used for action buttons such as "create element", the bottom bar e.g. for pagination.

## Essential identifiers

- Templates: `@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal.html.twig`, `@SwagB2bPlatform/storefront/_partials/_b2bmodal/_modal-content.html.twig`
- Settings variable `modalSettings` with keys `navigation`, `bottom`, `content.padding`
- Blocks: `b2b_modal_base_navigation_header`, `b2b_modal_base_navigation_entries`, `b2b_modal_base_content_inner`, `b2b_modal_base_content_inner_topbar_headline`, `b2b_modal_base_content_inner_scrollable_inner_actions_inner`, `b2b_modal_base_content_inner_scrollable_inner_content_inner`, `b2b_modal_base_content_inner_scrollable_inner_bottom_inner`
- CSS classes: `b2b--tab-link`, `b2b--ajax-panel`

## Code check (6.7.15.1)
- confirmed `sw_extends` — core Twig tag used to extend the modal templates — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `SwagB2bPlatform` — separate plugin, listed among translatable plugins — vendor/shopware/core/System/Resources/translation.yaml:9
- unverified `_modal.html.twig` — B2B Suite plugin template, not in the core/storefront/administration checkout
- unverified `_modal-content.html.twig` — B2B Suite plugin template, out of scope
- unverified `modalSettings` — B2B Suite template variable, out of scope
- unverified `b2b_modal_base_content_inner` — B2B Suite Twig block, out of scope
- unverified `b2b--ajax-panel` — B2B Suite CSS class/JS hook, out of scope
