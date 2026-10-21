---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/sw-block-parent.md
title: sw-block-parent
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/sw-block-parent.html
sourceHash: e12d9782608a9f4dabd264a0dc075c2f889eeaa6
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-block-parent", "sw-block", "extends", "parent block", "parent content", "override chain", "extension point", "v-if", "v-for", "sfc override", "twig parent replacement"]
summary: sw-block-parent renders the prior content of an extension point inside a <sw-block extends>; its position orders your markup, omitting it replaces.
lastBuilt: 2026-10-21
---
## What it is

`<sw-block-parent />` is a globally registered Administration component, used inside `<sw-block extends="…">`, that renders whatever the extension point held before this override: the default content or the previous override in the chain. It takes no props and needs no import.

## When to use

In a Single File Component override that should add to existing markup rather than replace it — the native equivalent of rendering the parent Twig block.

## Key steps / config

Where you place it decides where your markup goes relative to the existing content; leaving it out replaces the original markup.

```html
<sw-block extends="swag_greeting_card_body">
    <sw-block-parent />
    <p>I go after</p>
</sw-block>

<sw-block extends="swag_greeting_card_body">
    <p>I go before</p>
    <sw-block-parent />
</sw-block>

<sw-block extends="swag_greeting_card_body">
    <p>The original content is gone</p>
</sw-block>
```

Use exactly one `<sw-block-parent />` per extending block, always rendered.

## Essential identifiers

- `sw-block-parent`
- `sw-block` with `extends`

## Gotchas

- It claims its position in the chain when it is created, so a `v-if` on it or a `v-for` around it corrupts the chain.
- When several overrides target one block they stack, and each `<sw-block-parent />` renders the previous override's output, not the original default — this keeps other plugins' contributions when your change is additive.

## Code check (6.7.15.1)
- confirmed `sw-block-parent` — globally registered via the component factory — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `sw-block-parent` — component config defines only setup/render, no props — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block-parent/index.ts:9
- confirmed `initialParents.pop()` — claims its parent slot once in setup, hence the v-if/v-for caveat — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block-parent/index.ts:20
- confirmed `providedParents` — sw-block resets the ordered parent list each render for each sw-block-parent to pop — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:166
- confirmed `extends` — sw-block prop under which overrides register their content — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:92
