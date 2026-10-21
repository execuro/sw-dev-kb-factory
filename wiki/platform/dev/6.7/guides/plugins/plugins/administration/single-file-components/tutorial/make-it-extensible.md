---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/make-it-extensible.md
title: 5. Make your component extensible
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/tutorial/make-it-extensible.html
sourceHash: 56a3aaa3a2edc98c4308fa275050dd2ff77c2046
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-block name", "sw-block-parent", "swDefineOverride", "useSwPreviousState", "tWithFallback", "swag-margin-hint", "previousState.message.value", "extension point", "override props", "snippet en-GB.json", "sfc extensible component", "this.$super"]
summary: SFC tutorial chapter 5 - add sw-block name extension points and replace a component's bindings via swDefineOverride(); props are not overridable.
lastBuilt: 2026-10-21
---
## What it is

Chapter 5 of the Administration Single File Component (SFC) tutorial: making your own component (`swag-margin-hint`) extensible the way core pages are, by declaring block extension points in its markup and exposing setup bindings that a second override can replace.

## When to use

When you ship an Administration component and want other extensions to change its markup or computed values without forking it.

## Key steps / config

1. **Declare extension points in the markup.** Wrap content in `<sw-block name="…">`; the wrapped content is the default and renders unchanged until someone extends the block with `<sw-block extends="…">`. An extension renders the default via `<sw-block-parent />` and adds its own content.
2. **Override your own component** with a second file named after it (`swag-margin-hint.override.vue`, e.g. in an `override-demo/` directory). In its setup code:
   - `const previousState = useSwPreviousState()`; the original value is `previousState.message.value`.
   - Build a new `message` from it and pass it to `swDefineOverride({ message })`. Every name passed replaces the binding of that name in the overridden component (a `computed`, a `ref` or a function alike).
3. **Snippets.** Use `$t()` in the template and `tWithFallback()` in the script. Add keys under `swag-margin.hint` in `component/snippet/en-GB.json` and `component/snippet/de-DE.json`:

```json
{
    "swag-margin": {
        "hint": { "tip": "…", "checkConditions": "…" }
    }
}
```

   A separate `snippet/` directory next to the override also works; Shopware merges every snippet file under the Administration source directory.
4. Run `shopware-cli project console cache:clear` before reloading, otherwise the banner shows the bare keys.

## Essential identifiers

- `<sw-block name="…">`, `<sw-block extends="…">`, `<sw-block-parent />`
- `swDefineOverride()`, `useSwPreviousState()`, `previousState.<name>.value`
- `tWithFallback()`, `$t()`
- Legacy mapping: `this.$super('message')` → `previousState.message.value`; `{% parent %}` → `<sw-block-parent />`; the override's `computed` block → the object passed to `swDefineOverride`; `$tc()`/`this.$tc()` → `$t()`/`tWithFallback()`

## Gotchas

- A **prop** cannot be overridden: listing a prop name in `swDefineOverride()` has no effect, the entry is skipped with a console error. Change it where the component is rendered (e.g. pass a different `warnBelow`).
- The filename is the whole identity of an override, so two overrides of the same component need two directories.
- `tWithFallback` (composable `useTranslateWithFallback`) is marked `@private` and experimental in the installed code.

## Version notes

- The tutorial targets 6.7.16.0+ / `trunk`; 6.7.15.1 contains the `sw-block` runtime and override merging, while the `swDefineOverride`/`useSwPreviousState` macros are compiled by build tooling outside the checked roots.

## Code check (6.7.15.1)
- confirmed `swDefineOverride` — used by the bundled override fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:7
- confirmed `useSwPreviousState` — used by the bundled override fixture — vendor/shopware/administration/Resources/app/administration/src/app/adapter/_mocks_/sw-jest-transform-fixture.override.vue:4
- confirmed `name` — `sw-block` prop declaring an extension point — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:74
- confirmed `extends` — `sw-block` prop extending a named block — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/index.ts:77
- confirmed `sw-block-parent` — globally registered component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:110
- confirmed `Cannot override props` — override keys matching a prop are skipped with console.error — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:399
- confirmed `syncRef` — an override ref is synced into the original binding of the same name — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:413
- confirmed `tWithFallback` — resolves active locale then fallback locale; experimental, @private — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-translate-with-fallback.ts:30
- confirmed `$super` — legacy Options API super call — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:996
