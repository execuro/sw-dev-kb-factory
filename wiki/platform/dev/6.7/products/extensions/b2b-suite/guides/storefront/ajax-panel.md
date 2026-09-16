---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/ajax-panel.md
title: Ajax Panel
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/ajax-panel.html
sourceHash: a3b71530e3f0d60b34731808e1431dad53d75480
codeCheckedAgainst: "6.7.13.0"
keywords: ["AjaxPanel", "b2b--ajax-panel", "ajax-panel-link", "ignore--b2b-ajax-panel", "AjaxPanelPluginLoader", "ajaxPanelFormDisable", "b2bAjaxPanelModal", "data-ajax-panel-trigger-reload", "is--b2b-tree-select-container", "TreeSelect", "b2b suite storefront", "xhr panel", "iframe-like ajax container"]
summary: B2B Suite AjaxPanel storefront mini-framework - b2b--ajax-panel container, data-url/data-id/data-target, panel plugins, modal, trigger reload, TreeSelect.
lastBuilt: 2026-09-15
---
## What it is

`AjaxPanel` is a B2B Suite mini-framework built on Storefront plugins. It mimics `iFrame` behavior: content from different controller actions is loaded via ajax into a single view, and link clicks and form submits inside the container are intercepted and turned into XHR requests.

## When to use

When building or extending B2B Suite storefront views that load controller output into a region of the page (grids, edit forms, modals) without full page reloads, or when one panel must reload or navigate another.

## Key steps / config

1. Mark a container with the trigger class `b2b--ajax-panel` and a `data-url`. The B2B frontend scans the page for this class; after document ready the panel issues an XHR GET to `data-url` and replaces its inner HTML with the response. Clicks on links and submitted forms inside it then become XHR requests.

```twig
<div class="b2b--ajax-panel"
     data-url="{{ path('frontend.b2b.b2bcontact.grid') }}"
     data-id="grid"
     data-plugins="ajaxPanelFormDisable">
</div>
```

2. Make any element act as a link inside a panel: class `ajax-panel-link` plus `data-href="{{ path('frontend.b2b.b2bcontact.grid') }}"`.
3. Keep default browser behavior for a link or form: add class `ignore--b2b-ajax-panel`.
4. Target another panel: give the target `data-id="foreign"` and the link `data-target="foreign"`.
5. Attach helper plugins via `data-plugins`; `AjaxPanelPluginLoader` initializes and reinitializes plugins inside panels. `ajaxPanelFormDisable` disables all form elements during panel reload.
6. Modal: the `b2bAjaxPanelModal` plugin opens panel content in a modal dialog; add class `b2b-modal-panel` next to `b2b--ajax-panel`.
7. Trigger reload of another panel: on the editing panel set `data-ajax-panel-trigger-reload="grid"` (the other panel's `data-id`); every change in that panel reloads the grid.
8. TreeSelect (drag-and-drop tree): the `div` needs class `is--b2b-tree-select-container` and `data-move-url="{{ path('frontend.b2b.b2brole.move') }}"`. The controller implements a move action accepting `roleId`, `relatedRoleId` and `type`, where `type` is one of `prev-sibling`, `last-child`, `next-sibling`.

## Essential identifiers

- `AjaxPanel`, `AjaxPanelPluginLoader`, `TreeSelect`
- Classes: `b2b--ajax-panel`, `ajax-panel-link`, `ignore--b2b-ajax-panel`, `b2b-modal-panel`, `is--b2b-tree-select-container`
- Attributes: `data-url`, `data-href`, `data-id`, `data-target`, `data-plugins`, `data-ajax-panel-trigger-reload`, `data-move-url`
- Plugins: `ajaxPanelFormDisable`, `b2bAjaxPanelModal`
- Routes used in examples: `frontend.b2b.b2bcontact.grid`, `frontend.b2b.b2bcontact.edit`, `frontend.b2b.b2brole.move`

## Gotchas

- Without `ignore--b2b-ajax-panel`, every link and form inside a panel is converted to XHR, including external links.

## Code check (6.7.13.0)
- unverified `AjaxPanel` — B2B Suite storefront JS; the B2B Suite plugin is not part of the installed core/storefront/administration packages
- unverified `AjaxPanelPluginLoader` — B2B Suite plugin code, not installed
- unverified `b2b--ajax-panel` — trigger class handled by B2B Suite JS, not installed
- unverified `ajaxPanelFormDisable` — B2B Suite panel plugin, not installed
- unverified `b2bAjaxPanelModal` — B2B Suite panel plugin, not installed
- unverified `data-ajax-panel-trigger-reload` — B2B Suite attribute, not installed
- unverified `frontend.b2b.b2bcontact.grid` — B2B Suite route, not installed
- unverified `frontend.b2b.b2brole.move` — B2B Suite route, not installed
