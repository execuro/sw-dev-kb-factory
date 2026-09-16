---
id: platform/dev/6.7/resources/references/adr/2023-03-27-admin-text-editor-evaluation.md
title: Admin text editor evaluation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-03-27-admin-text-editor-evaluation.html
sourceHash: 444be9ce3cc79dfea0c5735f44bade3e557f481e
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-text-editor", "mt-text-editor", "tiptap", "@tiptap/core", "@tiptap/vue-3", "prosemirror", "quilljs", "ckeditor 5", "tinymce", "lexical", "wysiwyg editor", "rich text editor", "adr"]
summary: "ADR 2023: admin replaces sw-text-editor; CKEditor 5, TinyMCE, QuillJS, Prosemirror, Lexical rejected, TipTap chosen as headless, extensible base."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-03-27, area: admin) evaluating rich-text (WYSIWYG) editors to replace the Administration's legacy text editor component, which had many low-level bugs in basic WYSIWYG features and was hard to maintain. TipTap was chosen as the base of the new editor.

## When to use

Read this when you need the background for the Administration's rich-text editor choice, or when deciding how to extend or replace the admin text editor.

## Key steps / config

Building an editor from scratch was ruled out. Candidates and outcome:

| Editor | Outcome | Reason given |
|---|---|---|
| CKEditor 5 | skipped | requires a license for this use case, not 100% open source |
| TinyMCE | skipped | same licensing reason |
| Prosemirror | ruled out | low-level API only, much more implementation time |
| Lexical | ruled out | specialized for React, no official VueJS support |
| QuillJS | not chosen | full UI out of the box, less flexible, more complicated extension system |
| TipTap V2 | chosen | headless, flexible extension API, built on ProseMirror |

Decision drivers for TipTap over QuillJS:
1. Headless: only editor logic, so Shopware implements its own UI and edge cases.
2. Extensibility (main driver): own features via TipTap and ProseMirror plugins or custom plugins.
3. Stability: considered more stable, likely because it builds on ProseMirror.

Consequences: the legacy editor must be replaced; the existing UI and all current features have to be implemented on TipTap, with backward compatibility named as the hardest part.

For new admin code on 6.7.13.0, use the `mt-text-editor` component (admin wrapper around the Meteor component library's `MtTextEditor`, with a Shopware-specific link button).

## Essential identifiers

- `mt-text-editor` (current admin rich-text editor wrapper)
- TipTap (`@tiptap/core`, `@tiptap/vue-3`), ProseMirror

## Gotchas

- The legacy `sw-text-editor` named in the ADR, and its toolbar sub-components such as `sw-text-editor-toolbar-table-button`, carry `@deprecated tag:v6.8.0 - Will be removed, use mt-text-editor instead.` in 6.7.13.0.
- Both `sw-text-editor` and the `mt-text-editor` wrapper are marked `@private` in their docblocks.

## Version notes

- 6.7.13.0 still registers `sw-text-editor` as a global component but deprecates it for removal in 6.8.0; TipTap types are imported by admin code.

## Code check (6.7.13.0)
- deprecated `sw-text-editor` — file docblock (line 10) says removal in v6.8.0, use mt-text-editor — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-editor/index.js:5
- deprecated `sw-text-editor-toolbar-table-button` — docblock tags removal in v6.8.0 — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-editor/sw-text-editor-toolbar-table-button/index.js:4
- confirmed `mt-text-editor` — private wrapper component around Meteor MtTextEditor — vendor/shopware/administration/Resources/app/administration/src/app/component/meteor-wrapper/mt-text-editor/index.ts:11
- confirmed `MtTextEditor` — imported from the Meteor component library — vendor/shopware/administration/Resources/app/administration/src/app/component/meteor-wrapper/mt-text-editor/index.ts:1
- confirmed `@tiptap/core` — TipTap editor types imported — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:46
- confirmed `@tiptap/vue-3` — used by the custom link toolbar button — vendor/shopware/administration/Resources/app/administration/src/app/component/meteor-wrapper/mt-text-editor/sw-text-editor-toolbar-button-link/index.ts:1
