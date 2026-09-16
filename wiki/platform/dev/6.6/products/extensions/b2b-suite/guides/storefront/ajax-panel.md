---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/ajax-panel.md
title: Ajax Panel
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/storefront/ajax-panel.html"
sourceHash: a3b71530e3f0d60b34731808e1431dad53d75480
keywords: ["ajax panel", "b2b suite", "b2b--ajax-panel", "AjaxPanelPluginLoader", "ajaxPanelFormDisable", "b2bAjaxPanelModal", "TriggerReload", "TreeSelect", "ignore--b2b-ajax-panel", "storefront plugin", "xhr"]
summary: "AjaxPanel mimics iframes: integrates controller responses into a view via XHR, with plugins for modal, form-disable, reload trigger, and tree select."
lastBuilt: "2026-09-15"
---
## What it is
Describes `AjaxPanel`, a Storefront-plugin-based mini-framework that mimics iframe behavior by merging content from different controller actions into a single view, intercepting page-changing events and turning them into XHR requests.

## Key steps / config
The plugin scans the page for the trigger class `b2b--ajax-panel`:

```twig
<div class="b2b--ajax-panel" data-url="{{ path('frontend.b2b.b2bcontact.grid') }}"></div>
```

After the document is ready, the panel issues an XHR GET and swaps its inner HTML with the response; subsequent clicks/submits inside it also become XHR requests.

- Make any element trigger a location change: add class `ajax-panel-link` and `data-href="..."`.
- Opt an element out of the ajax behavior: add class `ignore--b2b-ajax-panel` to a link or form (the link then follows its `href` normally).
- Link panels together: set `data-id="foreign"` on one panel and `data-target="foreign"` on a triggering element.
- Load extra behavior plugins via `data-plugins="..."`, e.g. `ajaxPanelFormDisable` (disables form elements during reload).
- Open panel content in a modal box by adding class `b2b-modal-panel` alongside `b2b--ajax-panel` (uses the `b2bAjaxPanelModal` plugin).
- Trigger a reload of another panel with `data-ajax-panel-trigger-reload="<target panel's data-id>"`.
- `TreeSelect`: a `div` with class `is--b2b-tree-select-container` and a `data-move-url` attribute enables drag-and-drop; the controller needs a move action accepting `roleId`, `relatedRoleId`, and `type` (`prev-sibling`, `last-child`, `next-sibling`).

`AjaxPanelPluginLoader` initializes and reinitializes plugins inside b2b panels.

## Essential identifiers
- `b2b--ajax-panel`, `ajax-panel-link`, `ignore--b2b-ajax-panel`
- `AjaxPanelPluginLoader`, `ajaxPanelFormDisable`, `b2bAjaxPanelModal`
- `data-id`, `data-target`, `data-ajax-panel-trigger-reload`
- `is--b2b-tree-select-container`, `data-move-url`
