---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/sw-block.md
title: sw-block
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/block-components/sw-block.html
sourceHash: d3aa1c2cb957849df1d6478aa4131699e26c21f7
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-block", "sw-block-parent", "extension point", "block override", "name prop", "extends prop", "single file components", "override.vue", "twigjs block", "administration sfc", "block name convention", "vue template extension"]
summary: "sw-block in Administration SFCs: name declares an extension point, extends contributes to one; naming rules, binding limits and render order."
lastBuilt: 2026-10-21
---
## What it is

`sw-block` is the Administration's template extension point for single-file components. It is globally registered, so templates use the tag without importing it. The prop you pass decides its role:

| Prop | Type | Meaning |
|---|---|---|
| `name` | `string` | Declares an extension point; its children are the default content |
| `extends` | `string` | Contributes to the extension point of that name; renders nothing where it stands |

## When to use

- In a base component, to mark a region of the template that overrides may replace or extend.
- In an `.override.vue` file, to replace or extend a block declared by core or another plugin.

## Key steps / config

Use `name` (base components only) or `extends` (overrides only) as a static attribute and nothing else. The build rejects any other attribute or directive on the tag, including `class`, `v-if`, a bound `:extends`, `data`, `v-bind` and an authored `#default`.

Declare an extension point:

```html
<sw-block name="swag_greeting_card_body">
    <p>Default content</p>
</sw-block>
```

With nothing registered against the name, it renders as if the wrapper were absent.

Contribute to one:

```html
<sw-block extends="swag_greeting_card_body">
    <sw-block-parent />
    <p>Mine, underneath</p>
</sw-block>
```

The target block is replaced by the contributed content. Render `sw-block-parent` inside it to keep the previous content.

- An `<sw-block extends>` belongs at the root of the override's template and cannot be nested inside another element. Its position does not affect where its content renders: it registers the content, and the matching `<sw-block name>` renders it.
- Block names: an owner prefix, then the path through the component, in `snake_case` — core uses `sw_`, a plugin its own prefix (e.g. `sw_product_detail_base_price_form`, `swag_greeting_card_body`). Names must be unique per component.

## Essential identifiers

- `sw-block` — props `name`, `extends`
- `sw-block-parent` — renders the previous (parent) content inside an `extends` block

## Gotchas

- Nothing validates block names: a typo silently matches nothing.
- The component has further props an editor may suggest; they are internal.
- The override's bindings are available inside `<sw-block extends>` content, but mutating one in the template (`@click="counter++"`) is not supported — wrap the mutation in a function and call it.
- Order with several extensions: native `<sw-block extends>` contributions render in registration order, all after a TwigJS override of the same block. A legacy TwigJS override is therefore always the parent of a native one, regardless of plugin load order.

## Code check (6.7.15.1)
- confirmed `sw-block` — globally registered via `Shopware.Component.register` — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:113
- confirmed `sw-block-parent` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `name` — String prop on sw-block — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:74
- confirmed `extends` — String prop; registers the default slot via `addBlock` and returns no template — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:92
- confirmed `data` — the internal extra prop (Object, default null) the build rejects as an authored attribute — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:80
- confirmed `"name" prop is required` — throws when neither `name` nor `extends` is set — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:150
- confirmed `shimSlots` — render order default, then legacy Twig shim, then native blocks — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:158
- unverified `build attribute rejection` — enforced by the SFC build tooling, outside the checked vendor roots
