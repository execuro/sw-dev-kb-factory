---
id: platform/dev/6.7/resources/references/adr/2023-03-27-admin-text-editor-evaluation.md
title: Admin text editor evaluation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-03-27-admin-text-editor-evaluation.html
sourceHash: 444be9ce3cc79dfea0c5735f44bade3e557f481e
codeCheckedAgainst: "6.7.15.1"
keywords: ["text editor", "wysiwyg", "rich text editor", "TipTap", "tiptap v2", "ProseMirror", "QuillJS", "CKEditor 5", "TinyMCE", "Lexical", "mt-text-editor", "sw-text-editor", "headless editor", "administration", "adr"]
summary: "ADR (2023): admin WYSIWYG editor evaluation; CKEditor 5, TinyMCE, Prosemirror, Lexical and QuillJS rejected, headless TipTap V2 chosen as the new base."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (dated 2023-03-27, area `admin`, tags `admin`, `text-editor`, `evaluation`) that evaluates third-party WYSIWYG editors to replace the administration's old built-in text editor and picks TipTap V2. Mirrored from `adr/2023-03-27-admin-text-editor-evaluation.md` in the Shopware 6 repository.

## When to use

Read it to understand why the administration's rich text editing is built on TipTap (and therefore ProseMirror), or when extending the editor with your own features or plugins.

## Key steps / config

Context: the old administration text editor had many low-level bugs in basic WYSIWYG features and was hard to maintain and understand. The requirement was an editor that is easy to maintain, has a good feature set, is flexible to extend and is more stable. Building one from scratch was ruled out.

Candidates and outcome:

| Editor | Result | Reason given |
|---|---|---|
| CKEditor 5 | skipped | needs a licence for this use case, not 100% open source |
| TinyMCE | skipped | needs a licence for this use case, not 100% open source |
| Prosemirror | ruled out | only a low-level API, much more implementation time |
| Lexical | ruled out | specialised for React, no official VueJS support |
| QuillJS | not chosen | full editor with built-in UI; less flexible, more complicated extension system |
| TipTap V2 | chosen | headless, flexible extension API, stable |

TipTap vs QuillJS, the three differences named:

1. **Headless vs full UI** — TipTap provides only editor logic and needs a UI implementation; QuillJS ships a UI. Headless was preferred so the UI fits Shopware's needs, including edge cases hard to implement in QuillJS.
2. **Extensibility** — TipTap's API allows own features using existing TipTap and ProseMirror plugins, or new plugins; the main TipTap API already covers most use cases.
3. **Stability** — TipTap was found more stable, probably because it is built on ProseMirror; other developers reported issues with QuillJS.

The main decision driver was extensibility: implementing Shopware's own features and design without overwriting another editor's design.

## Essential identifiers

- `mt-text-editor` — the replacement administration text editor component (meteor wrapper)
- `@tiptap/core`, `@tiptap/vue-3` — TipTap packages referenced by the administration code

## Gotchas

- The ADR names backward compatibility as the hardest part of the replacement: the existing UI and all current features of the old `sw-text-editor` had to be re-implemented on TipTap.
- In 6.7.15.1 `sw-text-editor` is still registered but marked `@deprecated tag:v6.8.0` ("use mt-text-editor instead") — do not build new features on it.

## Version notes

The ADR (2023) planned to replace `sw-text-editor`. The installed 6.7.15.1 administration registers `mt-text-editor` alongside the deprecated `sw-text-editor`, which is scheduled for removal in 6.8.0.

## Code check (6.7.15.1)
- deprecated `sw-text-editor` — old editor scheduled for removal in v6.8.0, use mt-text-editor — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-editor/sw-text-editor-link-menu/sw-text-editor-link-menu.spec.js:282
- confirmed `mt-text-editor` — registered as a global component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:173
- confirmed `@tiptap/core` — editor types imported in global admin types — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:49
- confirmed `@tiptap/extension-link` — TipTap link extension type import — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:50
- confirmed `@tiptap/vue-3` — toolbar button typed against the TipTap Vue editor — vendor/shopware/administration/Resources/app/administration/src/app/component/meteor-wrapper/mt-text-editor/sw-text-editor-toolbar-button-link/index.ts:1
- unverified `QuillJS` — rejected candidate, not present in shipped code by design
