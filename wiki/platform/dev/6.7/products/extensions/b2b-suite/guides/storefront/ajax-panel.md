---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/ajax-panel.md
title: Ajax Panel
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/ajax-panel.html
sourceHash: a3b71530e3f0d60b34731808e1431dad53d75480
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "AjaxPanel", "ajax panel", "b2b--ajax-panel", "data-url", "data-plugins", "AjaxPanelPluginLoader", "ajaxPanelFormDisable", "b2bAjaxPanelModal", "TreeSelect", "data-ajax-panel-trigger-reload", "xhr", "iframe"]
summary: B2B Suite AjaxPanel - b2b--ajax-panel containers load controller actions via XHR; data-url, data-id/data-target, plugins (form disable, modal, reload, tree).
lastBuilt: 2026-10-21
---
## What it is

`AjaxPanel` is a B2B Suite mini-framework built on Storefront plugins. It mimics `iFrame` behaviour: content from different controller actions is loaded via ajax into one view, and normally page-changing events (link clicks, form submits) inside a panel are intercepted and turned into XHR requests.

## When to use

When building B2B Suite storefront views that combine several controller actions on one page, open content in modals, reload one panel after a change in another, or show a drag-and-drop tree.

## Key steps / config

**Basic panel** — the plugin scans the page for the trigger class `b2b--ajax-panel`; on document ready it sends an XHR GET to `data-url` and replaces the inner HTML with the response:

```twig
<div class="b2b--ajax-panel"
     data-url="{{ path('frontend.b2b.b2bcontact.grid') }}"
     data-plugins="ajaxPanelFormDisable">
</div>
```

**Panel behaviour attributes/classes**

- Clickable non-link element: class `ajax-panel-link` plus `data-href="{{ path(...) }}"`.
- Opt out of interception (real navigation/submit): class `ignore--b2b-ajax-panel` on the `a` or `form`.
- Target another panel: give the panel `data-id="foreign"`, link with `data-target="foreign"`.

**Ajax panel plugins** — `AjaxPanelPluginLoader` initialises and reinitialises plugins inside panels; activate them via `data-plugins`:

- `ajaxPanelFormDisable` — disables all form elements in the panel during reload.
- Modal (`b2bAjaxPanelModal`) — add class `b2b-modal-panel` to open the panel content in a modal box.
- TriggerReload — `data-ajax-panel-trigger-reload="grid"` on a panel reloads the panel with `data-id="grid"` on every change (e.g. edit dialog over a grid).
- `TreeSelect` — tree view with drag and drop: the `div` needs class `is--b2b-tree-select-container` and `data-move-url="{{ path('frontend.b2b.b2brole.move') }}"`. The controller must implement a move action accepting `roleId`, `relatedRoleId` and `type`, where `type` is `prev-sibling`, `last-child` or `next-sibling`.

## Essential identifiers

- `AjaxPanel`, `AjaxPanelPluginLoader`
- Classes: `b2b--ajax-panel`, `ajax-panel-link`, `ignore--b2b-ajax-panel`, `b2b-modal-panel`, `is--b2b-tree-select-container`
- Attributes: `data-url`, `data-href`, `data-id`, `data-target`, `data-plugins`, `data-ajax-panel-trigger-reload`, `data-move-url`
- Plugins: `ajaxPanelFormDisable`, `b2bAjaxPanelModal`, `TreeSelect`
- Example routes: `frontend.b2b.b2bcontact.grid`, `frontend.b2b.b2bcontact.edit`, `frontend.b2b.b2brole.move`

## Gotchas

- All clicks and form submits inside a panel become XHR requests unless marked `ignore--b2b-ajax-panel`.
- The ajax panel code ships with the B2B Suite; the installed platform packages only provide the generic Storefront plugin system it is built on.

## Code check (6.7.15.1)
- confirmed `Plugin` — Storefront JS plugin base class the B2B frontend plugins build on — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:9
- confirmed `PluginManager.register` — registers a Storefront plugin for a selector — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:26
- unverified `AjaxPanelPluginLoader` — B2B Suite storefront JS, outside the platform packages
- unverified `b2b--ajax-panel` — B2B Suite trigger class, outside the platform packages
- unverified `ajaxPanelFormDisable` — B2B Suite panel plugin, outside the platform packages
- unverified `b2bAjaxPanelModal` — B2B Suite panel plugin, outside the platform packages
- unverified `frontend.b2b.b2bcontact.grid` — B2B Suite route, no such route in the platform packages
