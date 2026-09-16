---
id: platform/dev/6.6/resources/references/adr/2022-09-23-add-bootstrap-util.md
title: Add bootstrap JS-plugin initialization utility to storefront JS
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-09-23-add-bootstrap-util.html"
sourceHash: 2a425969b732ea4bae3b94bf7f3634249aabc70f
keywords: ["bootstrap.util", "BootstrapUtil.initBootstrapPlugins", "TooltipUtil", "Tooltip", "Popover", "storefront javascript", "selector option", "event delegation", "OffCanvas cart", "dynamic content"]
summary: "Documents the bootstrap.util module that replaces TooltipUtil to init Tooltip/Popover via event delegation on dynamic content."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting a new Storefront JavaScript utility module that initializes Bootstrap JS plugins (Tooltip, Popover) on dynamically added DOM content, replacing the narrower `TooltipUtil`.

## When to use

Relevant when a Bootstrap plugin (like a Tooltip) needs to work after dynamic content changes — e.g. listing pagination or the ajax OffCanvas cart — where manual re-initialization was previously required, or when migrating code that still calls `TooltipUtil`.

## Key steps / config

- Context: some Bootstrap JS plugins (e.g. Tooltip) require manual initialization on their target DOM elements, while others (e.g. Modals) work without it. Shopware only initialized Tooltips, via `src/utility/tooltip/tooltip.util.js`, and Tooltips stopped working after dynamic content changes such as listing pagination or the ajax OffCanvas cart.
- Decision: add a new module `src/utility/bootstrap/bootstrap.util` in favor of `TooltipUtil`, so more Bootstrap plugins can be covered in the future. It currently initializes `Tooltip` and `Popover`, the only two Bootstrap plugins with documented manual initialization at the time.
- The module uses Bootstrap's `"selector"` option so plugins are initialized via event delegation, meaning they automatically apply to elements added dynamically to the HTML, without extra re-initialization code.
- In `main.js`, `BootstrapUtil.initBootstrapPlugins()` replaces the previous `new TooltipUtil()` call, and now also covers Popovers.

## Essential identifiers

- `src/utility/bootstrap/bootstrap.util`
- `BootstrapUtil.initBootstrapPlugins()`
- `TooltipUtil` (deprecated)
- `[data-toogle="tooltip"]`, `[data-toogle="popover"]` selectors

## Gotchas

`TooltipUtil` is deprecated in favor of `BootstrapUtil`. The selector attribute is spelled `data-toogle` (not `data-toggle`) in the source's consequence note — this is the exact string given, so it should be treated as the literal selector referenced rather than a typo to "fix" when reading or writing matching code.
