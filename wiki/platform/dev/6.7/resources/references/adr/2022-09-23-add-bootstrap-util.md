---
id: platform/dev/6.7/resources/references/adr/2022-09-23-add-bootstrap-util.md
title: Add bootstrap JS-plugin initialization utility to storefront JS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-09-23-add-bootstrap-util.html
sourceHash: 2a425969b732ea4bae3b94bf7f3634249aabc70f
codeCheckedAgainst: "6.7.15.1"
keywords: ["BootstrapUtil", "initBootstrapPlugins", "bootstrap.util", "TooltipUtil", "tooltip", "popover", "bootstrap", "data-bs-toggle", "event delegation", "storefront javascript", "main.js", "adr"]
summary: "ADR: storefront main.js calls BootstrapUtil.initBootstrapPlugins() to init Bootstrap Tooltip/Popover via selector delegation, replacing TooltipUtil."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-09-23, area storefront) introducing the storefront JS module `src/utility/bootstrap/bootstrap.util`, a utility that initializes Bootstrap JavaScript plugins which need manual initialization. It replaced the earlier tooltip-only utility.

## When to use

When tooltips or popovers do not appear on dynamically inserted storefront content (listing pagination, the AJAX OffCanvas cart, etc.), or when you want to know how the storefront wires up Bootstrap's Tooltip and Popover plugins. Some Bootstrap plugins (Tooltip, Popover) must be initialized manually on the DOM; others, such as Modal, work without extra initialization.

## Key steps / config

- `src/main.js` imports `BootstrapUtil from 'src/utility/bootstrap/bootstrap.util'` and calls `BootstrapUtil.initBootstrapPlugins()` once at startup.
- `initBootstrapPlugins()` calls `initTooltip()`, `initPopover()` and `setDropdownDefaultOffset()`.
- Tooltip and Popover are created once on a root element (`document.body` / `html`) with Bootstrap's `selector` option, i.e. event delegation. Elements added to the HTML later are covered automatically; no re-initialization after dynamic content changes is needed.
- Mark up elements with the Bootstrap 5 data attributes:

```html
<span data-bs-toggle="tooltip" title="...">...</span>
<button data-bs-toggle="popover" data-bs-content="...">...</button>
```

- Popovers are initialized with `trigger: 'focus'`.

## Essential identifiers

- `BootstrapUtil` (storefront, `src/utility/bootstrap/bootstrap.util.js`)
- `BootstrapUtil.initBootstrapPlugins()`, `initTooltip()`, `initPopover()`, `setDropdownDefaultOffset()`
- Selectors `[data-bs-toggle="tooltip"]`, `[data-bs-toggle="popover"]`

## Gotchas

- The ADR writes the selectors as `[data-toogle="tooltip"]` / `[data-toogle="popover"]` (typo, Bootstrap 4 era). The installed code uses `data-bs-toggle`; the old attribute is not matched.
- Only Tooltip and Popover are initialized, because they are the Bootstrap plugins with documented manual initialization.

## Version notes

- The ADR deprecated `TooltipUtil` (`src/utility/tooltip/tooltip.util.js`) in favour of `BootstrapUtil`; it no longer exists in 6.7.
- In 6.7 `initBootstrapPlugins()` additionally sets the Dropdown default offset to `[0, 6]`, which the ADR does not mention.

## Code check (6.7.15.1)
- confirmed `BootstrapUtil` — exported class in storefront utility — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:7
- confirmed `BootstrapUtil::initBootstrapPlugins()` — calls initTooltip, initPopover, setDropdownDefaultOffset — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:38
- confirmed `BootstrapUtil.initBootstrapPlugins()` — invoked from main.js — vendor/shopware/storefront/Resources/app/storefront/src/main.js:229
- confirmed `src/utility/bootstrap/bootstrap.util` — import path used by main.js — vendor/shopware/storefront/Resources/app/storefront/src/main.js:30
- corrected `[data-bs-toggle="tooltip"]` — docs: [data-toogle="tooltip"] — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:1
- corrected `[data-bs-toggle="popover"]` — docs: [data-toogle="popover"] — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:2
- confirmed `selector` — Tooltip uses selector option for delegation — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:15
- absent `TooltipUtil` — removed; no tooltip.util module in the installed code
