---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/directives.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md
sourceHash: 870bbc5e94b416faf12b39393210af467d230ff7
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/directives.html
title: Directives
version: "6.7"
versions:
  - "6.7"
keywords: ["directives", "vue directive", "Shopware.Directive.register", "autofocus", "draggable", "droppable", "dragdrop", "popover", "responsive", "tooltip", "click-outside", "v-tooltip", "admin global directives"]
summary: Globally registered Administration Vue directives in 6.7 - autofocus, draggable/droppable, popover, responsive, tooltip, click-outside.
lastBuilt: 2026-10-21
---
## What it is

Overview of the Vue directives the Shopware 6 Administration registers globally. They behave like ordinary Vue directives (`v-<name>` in templates); they are registered through `Shopware.Directive.register('<name>', { ... })` and live in `src/app/directive/` of the Administration package.

## When to use

When an admin component or plugin template needs focus handling, drag and drop, popover positioning, responsive classes or tooltips, use the core directive rather than writing your own. To register a new one, see [Using Directives](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md).

## Key steps / config

Directives registered in 6.7.15.1 (names as used in templates):

| Name | Task |
|---|---|
| `autofocus` | Focuses an `<input>` in an element on insertion |
| `draggable` | Drag source of the CMS drag-and-drop functionality |
| `droppable` | Drop target of the CMS drag-and-drop functionality |
| `popover` | Automatic edge detection of the element placement |
| `responsive` | Adds methods to add responsive element classes |
| `tooltip` | Displays tooltips |
| `click-outside` | Registered globally as well (not listed in the docs) |

Template usage follows Vue syntax, e.g. `v-tooltip="..."` or `v-autofocus`.

## Essential identifiers

- `Shopware.Directive.register()`
- `autofocus`, `draggable`, `droppable`, `popover`, `responsive`, `tooltip`, `click-outside`

## Gotchas

- The docs list a single `dragdrop` directive. That is only the file name (`dragdrop.directive.ts`); the file registers two directives, `draggable` and `droppable`. A `v-dragdrop` directive does not exist.

## Code check (6.7.15.1)
- confirmed `autofocus` — registered globally — vendor/shopware/administration/Resources/app/administration/src/app/directive/autofocus.directive.ts:5
- corrected `draggable` — docs: single `dragdrop` directive — vendor/shopware/administration/Resources/app/administration/src/app/directive/dragdrop.directive.ts:440
- corrected `droppable` — docs: single `dragdrop` directive — vendor/shopware/administration/Resources/app/administration/src/app/directive/dragdrop.directive.ts:500
- confirmed `popover` — registered via `Directive.register` — vendor/shopware/administration/Resources/app/administration/src/app/directive/popover.directive.ts:51
- confirmed `responsive` — registered globally — vendor/shopware/administration/Resources/app/administration/src/app/directive/responsive.directive.ts:22
- confirmed `tooltip` — registered globally — vendor/shopware/administration/Resources/app/administration/src/app/directive/tooltip.directive.ts:580
- confirmed `click-outside` — additional global directive missing from the docs table — vendor/shopware/administration/Resources/app/administration/src/app/directive/click-outside.directive.ts:11
