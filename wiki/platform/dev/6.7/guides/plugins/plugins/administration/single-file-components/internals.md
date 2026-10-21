---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/internals.md
title: Internals
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/internals.html
sourceHash: bd747a66fd284c293f1dc20b74d12111995d4f7d
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-block", "sw-block-parent", "swDefinePublic", "attachOverrides", "overrideComponentSetup", "registerOverrideComponent", "getExposedProps", "_renderedBySfcTemplate", "useSwPreviousState", "$dataScope", "single file component", "vue override", "administration extension system", "twig shim"]
summary: How Admin SFC .vue files are rewritten at build time and how sw-block/sw-block-parent resolve override chains at runtime (internal, not API).
lastBuilt: 2026-10-21
---
## What it is

An explanation of the internal machinery behind the Administration's Single File Component (SFC) extension system: a build-time transform that rewrites `.vue` base and override files into Composition API code wired to the extension system, and the runtime behaviour of `sw-block` / `sw-block-parent`. The page itself states that nothing on it is API — generated code and every name in it can change without deprecation, and extensions must not depend on it.

## When to use

Read it when debugging why an override does not render, why a binding is `undefined`, or why a `<sw-block-parent />` renders the wrong content — not as a contract to code against.

## Key steps / config

**Build time**

1. A Vite plugin reads component identity from the filename: `swag-margin-hint.vue` or `swag-margin-hint/index.vue` is base component `swag-margin-hint`; `sw-product-detail-base.override.vue` or `swag-margin-hint/index.override.vue` overrides the named component. Renaming the file changes what it is/targets.
2. Overrides are auto-registered: the entry file gets generated imports plus `Shopware.Component.registerOverrideComponent(_swOverride0);` per `*.override.vue` (sorted for stable output).
3. A new base component is not scanned; import it, or register it by name:

```ts
Shopware.Component.register('swag-margin-hint', async () => {
    const component = (await import('./swag-margin-hint.vue')).default;
    return { ...component, _renderedBySfcTemplate: true } as never;
});
```

   Without `_renderedBySfcTemplate` the component factory warns that the component needs a template, because a production build inlines the render function into `setup()`.
4. Base transform: every top-level binding is renamed with the reserved `__swSetup` prefix (props from `defineProps()` stay native); the `swDefinePublic()` call is deleted and replaced by a footer:

```ts
const { margin, variant } = Shopware.Component.attachOverrides({
    name: 'swag-margin-hint',
    public: { margin: __swSetupAuthor_margin, /* ... */ },
    private: { /* unpublished bindings */ },
});
defineExpose({ ...Shopware.Component.getExposedProps(), margin, variant });
```

   Only `public` bindings can be replaced by overrides; `private` ones stay readable by the template. Hand-written `defineExpose()` is rejected.
5. Template transform: each `<sw-block name>` gains a generated `:data="$dataScope"` (plus a component-name attribute, see Gotchas). Authoring these, or any other attribute/directive on `sw-block`, is rejected.
6. Override transform: the whole script body becomes a callback passed to `Shopware.Component.overrideComponentSetup()('swag-margin-hint', (previousState, props, context) => { ... })`.

**Runtime**

1. `sw-admin` mounts every registered override once, hidden, so its callback and `<sw-block extends>` slots register; nothing renders there.
2. When a base component is set up, its own setup runs, then each override's setup in order, inside the base setup.
3. `<sw-block extends>` pushes its default slot into a shared reactive `blockContext` registry and renders nothing. `<sw-block name>` renders a chain `[default content, ...Twig shim slots, ...native extends slots]`, each called with `props.data`; the **last** entry renders, the rest are provided to `sw-block-parent`.
4. `sw-block-parent` pops one entry from the injected parents stack once in its setup and keeps that index.

**Twig interop**: a Twig `{% block %}` that a `.vue` override extends is wrapped in `<sw-block name="...">`; `useSwPreviousState()` exposes the Options API instance's `data`, `computed`, `methods`. In reverse, a Twig override of a `.vue` block joins the chain, with `{% parent %}` becoming `<sw-block-parent />`. Twig contributions always sit before native ones. `v-if`/`v-else` split across Twig blocks are compiled into helper calls so they keep working.

## Essential identifiers

- `Shopware.Component.registerOverrideComponent`, `Shopware.Component.attachOverrides`, `Shopware.Component.overrideComponentSetup`, `Shopware.Component.getExposedProps`
- `_renderedBySfcTemplate`, `swDefinePublic()`, `useSwPreviousState()`, `$dataScope`
- `sw-block` (`name`, `extends`, `data` props), `sw-block-parent`
- ESLint rule `valid-shopware-setup`; Vite plugins `shopware-vite-plugin-override-component`, `shopware-vite-plugin-shopware-setup` (virtual id `<realpath>.shopware-setup.vue`)

## Gotchas

- A top-level binding must not share a declared prop's name: prop keys are stripped from the returned state, so the binding becomes `undefined`. Overrides cannot replace props.
- `<sw-block-parent />` must render unconditionally and exactly once per extending block — inside `v-if`/`v-for` the stack claims misalign.
- `name` on `sw-block` is static; a change after mount only warns in development builds.
- The docs describe the block registry key as component name + block name (via a generated `sw-internal-component-name` attribute and `componentBlockKey`). In the installed 6.7.15.1 `sw-block`, `addBlock`/`getBlocks` are keyed by the block name alone, so same-named blocks in different components share contributions there.
- A Twig block whose content mixes a named slot template with other markup cannot host a native extension point; the `.vue` override is ignored with a `[TemplateFactory]` warning (development only).

## Version notes

Experimental; the docs state availability since 6.7.16.0, while the 6.7.15.1 checkout already ships the runtime parts (`attachOverrides`, `sw-block`, `registerOverrideComponent`) but the build plugins/validator were not found in the checked package roots.

## Code check (6.7.15.1)
- confirmed `registerOverrideComponent` — pushes to the hidden override list read by sw-admin — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:159
- confirmed `attachOverrides` — takes `name`, `public`, `private`, delegates to createExtendableSetup — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:559
- confirmed `overrideComponentSetup` — curried `(componentName, (previousState, props, context) => ...)` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:507
- confirmed `getExposedProps` — props as read-only computeds for the generated defineExpose — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:536
- confirmed `_renderedBySfcTemplate` — skips the "needs a template to be functional" warning — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:527
- confirmed `blockContext` — module-level reactive `Record<string, Slot[]>` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-block-context.ts:6
- corrected `addBlock` — docs: key built with componentBlockKey(component, block) and a wrapper slot; code adds `slots.default` keyed by `props.extends` only — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:92
- confirmed `blocksAndParent` — chain order default, shim slots, native blocks; last renders — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:158
- confirmed `initialParents?.pop()` — sw-block-parent claims one entry once in setup — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block-parent/index.ts:20
- unverified `sw-internal-component-name` — not found in the administration src root at 6.7.15.1; generated by the build transform, which is outside the checked roots
