---
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md
title: Directives
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/directives.html
sourceHash: 870bbc5e94b416faf12b39393210af467d230ff7
codeCheckedAgainst: "6.7.13.0"
keywords: ["directives", "Directive.register", "v-autofocus", "autofocus", "draggable", "droppable", "drag and drop", "popover", "responsive", "tooltip", "click-outside", "vue directive", "administration"]
summary: "Reference of global Vue directives in the Shopware 6.7 Administration: autofocus, draggable/droppable, popover, responsive, tooltip, click-outside."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md"]
---
## What it is

An overview of the directives registered globally to Vue in the Shopware Administration. They behave like ordinary Vue directives and are used in templates as `v-<name>`. The core directives live in `src/app/directive/` of the Administration package, each registered via `Shopware.Directive.register('<name>', { ... })`.

## When to use

When you need to know which built-in directive exists before writing your own, or which name to use in an Administration template. For registering a custom directive see [Adding directives](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md).

## Key steps / config

Globally registered directives in the installed 6.7 Administration:

| Name | Task |
|---|---|
| `autofocus` | On mount, focuses the first `<input>` inside the element. |
| `draggable` | Makes an element draggable (drag and drop, used by the CMS); value is a drag config such as `{ data: {...}, onDrop() {...} }`. |
| `droppable` | Marks an element as a drop target for `draggable` elements. |
| `popover` | Automatic edge detection for element placement. |
| `responsive` | Adds responsive element classes. |
| `tooltip` | Displays tooltips. |
| `click-outside` | Registered from the `v-click-outside` package; not listed in the docs table. |

## Essential identifiers

- `Shopware.Directive.register`
- `autofocus`, `draggable`, `droppable`, `popover`, `responsive`, `tooltip`, `click-outside`

## Gotchas

- The docs table lists a single `dragdrop` directive. There is no directive registered under that name: the file `dragdrop.directive.ts` registers two directives, `draggable` and `droppable`.

## Code check (6.7.13.0)
- confirmed `autofocus` — registered, focuses first input on mount — vendor/shopware/administration/Resources/app/administration/src/app/directive/autofocus.directive.ts:5
- corrected `draggable` — docs: single `dragdrop` directive — vendor/shopware/administration/Resources/app/administration/src/app/directive/dragdrop.directive.ts:440
- corrected `droppable` — docs: single `dragdrop` directive — vendor/shopware/administration/Resources/app/administration/src/app/directive/dragdrop.directive.ts:500
- confirmed `popover` — registered via Directive.register — vendor/shopware/administration/Resources/app/administration/src/app/directive/popover.directive.ts:51
- confirmed `responsive` — registered via Shopware.Directive.register — vendor/shopware/administration/Resources/app/administration/src/app/directive/responsive.directive.ts:22
- confirmed `tooltip` — registered via Shopware.Directive.register — vendor/shopware/administration/Resources/app/administration/src/app/directive/tooltip.directive.ts:580
- confirmed `click-outside` — additional global directive not in docs table — vendor/shopware/administration/Resources/app/administration/src/app/directive/click-outside.directive.ts:11
