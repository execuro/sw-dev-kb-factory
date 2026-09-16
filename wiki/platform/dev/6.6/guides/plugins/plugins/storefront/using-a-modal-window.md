---
id: platform/dev/6.6/guides/plugins/plugins/storefront/using-a-modal-window.md
title: Using a modal window
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/using-a-modal-window.html
sourceHash: b5ef502fc8f6021560976d3849ef8390db3ce959
keywords: ["PseudoModalUtil", "modal window", "data-ajax-modal", "data-url", "AjaxModalPlugin", "bootstrap modal", "base_main_inner", "open()", "close()", "updateContent()", "js-pseudo-modal-template"]
summary: Three ways to show a modal in the Storefront: Bootstrap DOM modal, data-ajax-modal AjaxModalPlugin, and manual PseudoModalUtil usage.
lastBuilt: 2026-09-15
---

## What it is

Describes three approaches to creating modal windows in a Storefront plugin: a manual Bootstrap DOM modal, the built-in AJAX modal triggered by data attributes, and the `PseudoModalUtil` JS class for full manual control.

## When to use

When a plugin needs to display content in a modal/popup — either a static Bootstrap modal, an AJAX-loaded modal, or a custom-styled modal driven from JS.

## Key steps / config

Trigger the built-in AJAX modal declaratively via data attributes (no JS needed):

```twig
<button class="btn btn-primary"
        data-ajax-modal="true"
        data-url="https://example.org/ajax-url">
    Launch ajax modal
</button>
```

Manual `PseudoModalUtil` usage from a registered plugin:

```javascript
import PseudoModalUtil from 'src/utility/modal-extension/pseudo-modal.util';

export default class ExamplePlugin extends PluginBaseClass {
    init() {
        this.modal = new PseudoModalUtil(content);
        this.modal.open(this.onOpenModal.bind(this));
    }
}
```

Register the plugin in `main.js`:

```javascript
PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]');
```

Constructor accepts `(content, useBackdrop, templateSelector, contentSelector, titleSelector)` to override the default CSS class selectors.

## Essential identifiers

- `PseudoModalUtil` class: `open(callback)`, `close()`, `updateContent(html, callback)`
- `data-ajax-modal="true"` / `data-url` attributes
- CSS structure selectors: `js-pseudo-modal-template`, `js-pseudo-modal-template-title-element`, `js-pseudo-modal-template-content-element`
- `window.PluginManager.register(name, PluginClass, selector)`

## Gotchas

- The `data-ajax-modal` trigger does not work if the trigger selector is changed via JavaScript, e.g. after an AJAX call replaces the content.
- The Storefront must be rebuilt (e.g. `./bin/build-storefront.sh` or `composer run build:js:storefront`) for JS/template changes to take effect.
