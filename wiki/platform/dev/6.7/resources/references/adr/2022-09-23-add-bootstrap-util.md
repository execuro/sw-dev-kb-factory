---
id: platform/dev/6.7/resources/references/adr/2022-09-23-add-bootstrap-util.md
title: Add bootstrap JS-plugin initialization utility to storefront JS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-09-23-add-bootstrap-util.html
sourceHash: 2a425969b732ea4bae3b94bf7f3634249aabc70f
codeCheckedAgainst: "6.7.13.0"
keywords: ["BootstrapUtil", "BootstrapUtil.initBootstrapPlugins", "src/utility/bootstrap/bootstrap.util", "TooltipUtil", "tooltip", "popover", "bootstrap", "storefront js", "main.js", "event delegation", "selector option", "offcanvas cart"]
summary: "ADR: storefront BootstrapUtil.initBootstrapPlugins() replaces TooltipUtil and initializes Bootstrap Tooltip and Popover via delegated selectors in main.js."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2022) for the Storefront JS code. A utility module `src/utility/bootstrap/bootstrap.util` (`BootstrapUtil`) initializes the Bootstrap plugins that need manual initialization, replacing the tooltip-only `TooltipUtil`.

## When to use

- Tooltips or popovers do not work on content added dynamically (listing pagination, AJAX off-canvas cart) and you want to know how the Storefront initializes them.
- You are adding tooltips/popovers to Storefront templates or plugin JS and need the attribute the delegated selector listens for.

## Key steps / config

Context from the ADR: some Bootstrap plugins (Tooltip, Popover) must be initialized manually on DOM elements; others, like Modal, work without it. Previously only tooltips were initialized, by `src/utility/tooltip/tooltip.util.js`, and they broke after dynamic content changes.

Decision and installed behaviour:

1. `main.js` imports the utility and calls it once:

```js
import BootstrapUtil from 'src/utility/bootstrap/bootstrap.util';
BootstrapUtil.initBootstrapPlugins();
```

2. `BootstrapUtil.initBootstrapPlugins()` calls `initTooltip()`, `initPopover()` and (in the installed code) `setDropdownDefaultOffset()`.
3. Both plugins are initialized with Bootstrap's `selector` option (event delegation) on a root element (`document.body` for Tooltip, the `html` element for Popover), so elements added later work without re-initialization.
4. The installed selectors are `[data-bs-toggle="tooltip"]` and `[data-bs-toggle="popover"]`. Popovers use the focus trigger.
5. `setDropdownDefaultOffset()` sets `bootstrap.Dropdown.Default.offset` to `[0, 6]` so focus outlines are not cut off.

## Essential identifiers

- `BootstrapUtil` (`src/utility/bootstrap/bootstrap.util`)
- `BootstrapUtil.initBootstrapPlugins()`
- `BootstrapUtil.initTooltip()`, `BootstrapUtil.initPopover()`, `BootstrapUtil.setDropdownDefaultOffset()`
- Selectors `[data-bs-toggle="tooltip"]`, `[data-bs-toggle="popover"]`

## Gotchas

- The ADR text lists the selectors with a Bootstrap 4 style attribute and a typo (`data-toogle`); the installed Storefront uses the Bootstrap 5 attribute `data-bs-toggle`. Markup using the old attribute is not picked up.
- `TooltipUtil` was deprecated by this ADR; it no longer exists in the installed Storefront source, so do not import `src/utility/tooltip/tooltip.util.js`.
- Only Tooltip and Popover are initialized, because those were the Bootstrap plugins with documented manual initialization.

## Version notes

- The ADR from 2022 referenced Bootstrap 4.3 documentation; the installed utility references Bootstrap 5 docs and adds the dropdown offset default.

## Code check (6.7.13.0)
- confirmed `BootstrapUtil` — default export class — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:7
- confirmed `BootstrapUtil.initBootstrapPlugins()` — calls tooltip, popover and dropdown offset setup — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:38
- confirmed `initBootstrapPlugins` — called in main.js — vendor/shopware/storefront/Resources/app/storefront/src/main.js:227
- confirmed `initTooltip` — Tooltip on document.body with selector option — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:13
- confirmed `initPopover` — Popover with selector option and focus trigger — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:23
- corrected `TOOLTIP_SELECTOR` — docs: tooltip selector with data-toogle attribute; installed uses data-bs-toggle — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:1
- corrected `POPOVER_SELECTOR` — docs: popover selector with data-toogle attribute; installed uses data-bs-toggle — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:2
- confirmed `setDropdownDefaultOffset` — not in ADR, added in installed code — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:34
