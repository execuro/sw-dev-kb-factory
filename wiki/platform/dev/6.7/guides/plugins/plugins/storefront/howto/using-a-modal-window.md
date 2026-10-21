---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-a-modal-window.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md
sourceHash: 3e3cbc9f108c8e6a148794fcc361e19097a4551a
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/using-a-modal-window.html
title: Using a Modal Window
version: "6.7"
versions:
  - "6.7"
keywords: ["PseudoModalUtil", "AjaxModal", "data-ajax-modal", "data-url", "PluginBaseClass", "PluginManager", "updateContent", "js-pseudo-modal-template", "base_main_inner", "shopware-cli project storefront-build", "modal window", "popup", "dialog"]
summary: Open Storefront modals via Bootstrap markup, the AjaxModal plugin (data-ajax-modal + data-url), or the PseudoModalUtil JS utility (open/close/updateContent).
lastBuilt: 2026-10-21
---
## What it is

Three ways to show a modal window in the Shopware Storefront from a plugin: plain Bootstrap modal markup, the built-in `AjaxModal` plugin triggered by data attributes, and the `PseudoModalUtil` JavaScript utility for programmatic control.

## When to use

You need a dialog/popup in the Storefront: static content (Bootstrap), content loaded from a URL on click (`AjaxModal`), or a modal opened, updated and closed from your own JS plugin (`PseudoModalUtil`).

## Key steps / config

### 1. Bootstrap markup

Extend `@Storefront/storefront/page/content/index.html.twig`, override `base_main_inner`, add a trigger with `data-bs-toggle="modal" data-bs-target="#exampleModal"` plus the Bootstrap modal DOM, then `{{ parent() }}`.

### 2. AjaxModal

```twig
<button class="btn btn-primary"
        data-ajax-modal="true"
        data-url="https://example.org/ajax-url">Launch ajax modal</button>
```

Shopware's `AjaxModal` plugin (registered on `[data-ajax-modal][data-url]`) fetches the URL and renders it via `PseudoModalUtil`.

### 3. PseudoModalUtil in a JS plugin

- Add a template element with `data-example-plugin` in `base_main_inner`, register in `<plugin root>/src/Resources/app/storefront/src/main.js`: `window.PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]');`

```javascript
const { PluginBaseClass } = window;
import PseudoModalUtil from 'src/utility/modal-extension/pseudo-modal.util';

export default class ExamplePlugin extends PluginBaseClass {
    init() {
        this.modal = new PseudoModalUtil(content, true);
        this.modal.open(this.onOpenModal.bind(this));
        // later: this.modal.updateContent(updated, this.onUpdateModal.bind(this));
        // this.modal.close();
    }
}
```

- Content skeleton: `<div class="js-pseudo-modal-template">` containing `.js-pseudo-modal-template-title-element` (title) and `.js-pseudo-modal-template-content-element` (body).
- Constructor: `new PseudoModalUtil(content, useBackdrop = true, templateSelector, templateContentSelector, templateTitleSelector)`; the selectors default to `.js-pseudo-modal-template`, `.js-pseudo-modal-template-content-element`, `.js-pseudo-modal-template-title-element` and can be overridden with custom class selectors.
- Methods: `open(cb, delay)`, `close()`, `getModal()`, `updatePosition()`, `updateContent(content, callback)`.
- Build the Storefront: `shopware-cli project storefront-build` (template projects) or `composer run build:js:storefront` (platform contribution setup).

## Essential identifiers

- `PseudoModalUtil` — `src/utility/modal-extension/pseudo-modal.util`
- `AjaxModal` plugin, attributes `data-ajax-modal`, `data-url`
- `window.PluginBaseClass`, `window.PluginManager`
- Block `base_main_inner` in `@Storefront/storefront/page/content/index.html.twig`
- CSS classes `js-pseudo-modal-template`, `js-pseudo-modal-template-title-element`, `js-pseudo-modal-template-content-element`

## Gotchas

- `AjaxModal` does not work when the trigger element is replaced via JavaScript (e.g. an AJAX content swap) after page load.
- Without content, `new PseudoModalUtil()` opens a modal showing `undefined`.
- The source's update example calls `this.modal.updateModal(...)`; the installed class only has `updateContent(content, callback)` — use that.

## Code check (6.7.15.1)
- confirmed `PseudoModalUtil` — utility class export — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:12
- confirmed `useBackdrop` — second constructor arg, default true; selectors follow — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:15
- confirmed `PseudoModalUtil::open()` — accepts callback and delay — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:33
- confirmed `PseudoModalUtil::close()` — hides bootstrap modal instance — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:42
- corrected `PseudoModalUtil::updateContent()` — docs example: updateModal(); only updateContent exists — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:75
- confirmed `js-pseudo-modal-template-title-element` — default title selector class — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:6
- confirmed `AjaxModal` — registered on [data-ajax-modal][data-url] — vendor/shopware/storefront/Resources/app/storefront/src/main.js:110
- confirmed `PseudoModalUtil` — used by AjaxModal plugin to render — vendor/shopware/storefront/Resources/app/storefront/src/plugin/ajax-modal/ajax-modal.plugin.js:69
- confirmed `PluginBaseClass` — exposed on window — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:972
- confirmed `base_main_inner` — block in page/content/index.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/index.html.twig:8
