---
id: platform/dev/6.6/resources/references/adr/2023-03-27-admin-text-editor-evaluation.md
title: Admin text editor evaluation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-03-27-admin-text-editor-evaluation.html"
sourceHash: "444be9ce3cc79dfea0c5735f44bade3e557f481e"
keywords: ["sw-text-editor", "TipTap", "QuillJS", "CKEditor 5", "TinyMCE", "Prosemirror", "Lexical", "WYSIWYG", "administration text editor", "headless editor", "VueJS editor", "backward compatibility"]
summary: "ADR replacing the administration's `sw-text-editor` WYSIWYG with TipTap V2, chosen over QuillJS for extensibility and stability."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents the evaluation and selection of a replacement for the administration's `sw-text-editor`, whose existing WYSIWYG implementation has numerous low-level bugs and is difficult to maintain or extend.

## When to use
Relevant when integrating with, extending, or replacing the administration's rich-text/WYSIWYG editing component, or when evaluating why TipTap-specific APIs appear in administration editor code.

## Key steps / config
Six candidate editors were evaluated: CKEditor 5, TinyMCE, QuillJS, Prosemirror, TipTap V2, and Lexical.

- CKEditor 5 and TinyMCE were rejected because they require a license for this use case and are not fully open source.
- Prosemirror was rejected as too low-level, requiring significantly more implementation effort.
- Lexical was rejected because it is specialized for React and has no official VueJS support.
- Between the two finalists, TipTap is a headless editor (editor logic only, UI implemented separately) while QuillJS ships a full UI out of the box; headless was preferred to allow a custom UI fitting edge cases.
- TipTap's extension API (building on TipTap/ProseMirror plugins, or custom plugins) was judged more flexible than QuillJS's more complicated extension system.
- TipTap, built on ProseMirror, was judged more stable than QuillJS, which has had reported issues.

Decision driver: extensibility. TipTap V2 was selected as the base for the new administration text editor.

## Essential identifiers
- `sw-text-editor` (current/legacy component being replaced)
- TipTap V2 (chosen editor library)

## Gotchas
Replacing `sw-text-editor` requires building a UI on top of TipTap's headless core and re-implementing all current editor features; the ADR calls out backward compatibility with existing features as the most challenging part of the migration, even though some features had already been prototyped during the evaluation.
