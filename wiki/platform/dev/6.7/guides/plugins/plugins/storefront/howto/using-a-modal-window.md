---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-a-modal-window.md
title: Using a Modal Window
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/using-a-modal-window.html
sourceHash: 3e3cbc9f108c8e6a148794fcc361e19097a4551a
codeCheckedAgainst: "6.7.13.0"
keywords: ["modal", "modal window", "popup", "dialog", "PseudoModalUtil", "AjaxModal", "data-ajax-modal", "data-url", "PluginBaseClass", "PluginManager", "base_main_inner", "updateContent", "js-pseudo-modal-template", "bootstrap modal"]
summary: Open modals in the Storefront via Bootstrap markup, the AjaxModal plugin (data-ajax-modal + data-url) or PseudoModalUtil (open, close, updateContent).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md"]
---
## What it is

Three ways to show a modal window from a Storefront plugin: plain Bootstrap modal markup, the built-in `AjaxModal` plugin triggered by data attributes, and the `PseudoModalUtil` JavaScript utility for programmatic control.

## When to use

You need a dialog in the Storefront — static content (Bootstrap), content loaded from a URL on click (`AjaxModal`), or a modal opened, updated and closed from your own JS plugin (`PseudoModalUtil`). See [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md).

## Key steps / config

All examples override block `base_main_inner` in `<plugin root>/src/Resources/views/storefront/page/content/index.html.twig` via `{% sw_extends '@Storefront/storefront/page/content/index.html.twig' %}`.

### 1. Bootstrap

Add a trigger button with `data-bs-toggle="modal"` and `data-bs-target="#exampleModal"` plus Bootstrap modal markup (`modal-body`, `modal-footer`, a close button with `data-bs-dismiss="modal"`), then `{{ parent() }}`.

### 2. AjaxModal

```twig
<button class="btn btn-primary" data-ajax-modal="true" data-url="...">Launch ajax modal</button>
```

The Storefront registers `AjaxModal` on `[data-ajax-modal][data-url]`; it renders via `PseudoModalUtil` and the pseudo modal template from `base.html.twig`.

### 3. PseudoModalUtil

1. Add an element with `data-example-plugin` in the template, register the plugin in `<plugin root>/src/Resources/app/storefront/src/main.js`: `window.PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]')`.
2. In the plugin, use it:

```javascript
const { PluginBaseClass } = window;
import PseudoModalUtil from 'src/utility/modal-extension/pseudo-modal.util';

export default class ExamplePlugin extends PluginBaseClass {
    init() {
        const content = `<div class="js-pseudo-modal-template">
            <div class="js-pseudo-modal-template-title-element">Modal title</div>
            <div class="js-pseudo-modal-template-content-element">Modal content</div></div>`;
        this.modal = new PseudoModalUtil(content);
        this.modal.open(this.onOpenModal.bind(this));
    }
}
```

3. Build: `shopware-cli project storefront-build` (template project) or `composer run build:js:storefront` (platform contribution setup).

API:
- `new PseudoModalUtil(content, useBackdrop = true, templateSelector, templateContentSelector, templateTitleSelector)` — selectors default to `.js-pseudo-modal-template`, `.js-pseudo-modal-template-content-element`, `.js-pseudo-modal-template-title-element`; pass custom ones (e.g. `.custom-js-pseudo-modal-template`) to use different classes.
- `open(cb)` — shows the modal, calls `cb` once opened.
- `close()` — hides it.
- `updateContent(content, callback)` — replaces content, repositions, then calls `callback`.

## Essential identifiers

- `PseudoModalUtil` (`src/utility/modal-extension/pseudo-modal.util`)
- `PseudoModalUtil::open()`, `close()`, `updateContent()`, `getModal()`
- `AjaxModal` plugin, attributes `data-ajax-modal`, `data-url`
- `window.PluginBaseClass`, `window.PluginManager`
- Block `base_main_inner`

## Gotchas

- Without content, `new PseudoModalUtil()` shows a blank modal containing `undefined`.
- `AjaxModal` does not work when the trigger element is replaced via JavaScript (e.g. after an AJAX content swap).
- The source's update example calls `this.modal.updateModal(...)`; that method does not exist on `PseudoModalUtil` — use `updateContent()`.
- The title element class also tells `PseudoModalUtil` which `div` holds the title text.

## Code check (6.7.13.0)
- confirmed `PseudoModalUtil` — default export of pseudo-modal utility — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:12
- confirmed `PseudoModalUtil::constructor()` — content, useBackdrop = true, three selectors — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:13
- confirmed `js-pseudo-modal-template-title-element` — default title selector class — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:6
- confirmed `PseudoModalUtil::open()` — accepts callback — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:33
- confirmed `PseudoModalUtil::close()` — hides bootstrap modal instance — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:42
- corrected `PseudoModalUtil::updateContent()` — docs: sample calls updateModal(); method is updateContent(content, callback) — vendor/shopware/storefront/Resources/app/storefront/src/utility/modal-extension/pseudo-modal.util.js:75
- confirmed `AjaxModal` — registered on data-ajax-modal + data-url — vendor/shopware/storefront/Resources/app/storefront/src/main.js:108
- confirmed `window.PluginBaseClass` — exposed globally — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `base_main_inner` — block in content page template — vendor/shopware/storefront/Resources/views/storefront/page/content/index.html.twig:8
- unverified `shopware-cli project storefront-build` — external CLI, out of scope
