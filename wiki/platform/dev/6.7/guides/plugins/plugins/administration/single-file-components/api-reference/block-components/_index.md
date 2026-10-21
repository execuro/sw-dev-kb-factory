---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/_index.md
title: Block components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/
sourceHash: 7f0fe64011f04139f400e4cf724ae6ffbb6e0758
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-block", "sw-block-parent", "extends", "name", "extension point", "block name", "native blocks", "override chain", "snake_case", "sw_product_detail_base_price_form", "sfc override", "twig block replacement"]
summary: How sw-block declares (name) or contributes to (extends) an Administration extension point, block naming conventions, and how override chains stack.
lastBuilt: 2026-10-21
---
## What it is

Overview of the two globally registered components that carry the native (SFC) block system in the Administration: `sw-block` (declare an extension point, or contribute to one) and `sw-block-parent` (render what the extension point held before you). Both are used as tags without imports.

## When to use

When a Single File Component needs to expose an extension point, or an override needs to add to, wrap or replace markup at an existing one — the native replacement for TwigJS `{% block %}` extension points.

## Key steps / config

1. **Declare** an extension point by wrapping markup in `<sw-block name="…">`. The children are the default content; with nothing registered against the name it renders as if the wrapper were absent.
2. **Contribute** from an override with `<sw-block extends="…">`. That tag renders nothing where it stands; it registers its default slot, and the matching `<sw-block name>` renders it.
3. Inside the contributing block, place `<sw-block-parent />` where the previous content should appear, or omit it to replace.

```html
<sw-block name="swag_greeting_card_body">
    <p>Default content</p>
</sw-block>

<sw-block extends="swag_greeting_card_body">
    <sw-block-parent />
    <p>Mine, underneath</p>
</sw-block>
```

`sw-block` props in 6.7.15.1: `name`, `extends`, and `data` (object passed to the block content, default `null`).

### Names

A plain string, unvalidated; unique per component. Convention: owner prefix, then the path through the component, in `snake_case` — core uses `sw_` (e.g. `sw_product_detail_base_price_form`), a plugin its own prefix (e.g. `swag_greeting_card_body`).

## Essential identifiers

- `sw-block` with `name` / `extends` / `data`
- `sw-block-parent`

## Gotchas

- A typo in a block name matches nothing and fails silently.
- `sw-block` without `extends` throws `[sw-block] The "name" prop is required when "extends" is not set.`
- Changing `name` after mount is unsupported; a development-only warning is logged.
- Chains: several overrides of one block stack in registration order; each `<sw-block-parent />` renders the previous override's output, not the original default. Leaving it out replaces everything below, which is how one plugin removes another plugin's contribution. In code, legacy Twig plugin overrides (shim slots) sit between the default and native `extends` overrides.

## Version notes

Core block names fall under the backwards-compatibility promise: they stay until the next major, and removals are named in the changelog. When core converts a component to an SFC, its block names stay the same.

## Code check (6.7.15.1)
- confirmed `sw-block` — globally registered — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:113
- confirmed `sw-block-parent` — globally registered — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `extends` — prop; when set the default slot is registered via addBlock and nothing renders — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:92
- confirmed `data` — prop with default null passed to block content — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:80
- confirmed `name` — required when extends is not set, else throws — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:150
- confirmed `nativeBlocks` — stack order default, shim slots, native overrides — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:158
- confirmed `sw_product_detail_base_price_form` — existing core block name — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/view/sw-product-detail-base/sw-product-detail-base.html.twig:54
