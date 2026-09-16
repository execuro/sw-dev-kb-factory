---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vue-native.md
title: Native Vue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue-native.html
sourceHash: 832b6ee8b0ef47ad3435c0910de140e3b6d1e2e1
codeCheckedAgainst: "6.7.13.0"
keywords: ["native vue", "composition api", "options api", "sw-block", "native blocks", "twig.js", "single file components", "*.override.vue", "Shopware.Component.register", "Shopware.Component.override", "Shopware.Component.createExtendableSetup", "Shopware.Store", "pinia", "vuex", "administration roadmap"]
summary: Direction of the Shopware Administration toward native Vue - Composition API extension system, sw-block native blocks replacing Twig.js, Vuex to Pinia.
lastBuilt: 2026-09-15
---
## What it is

Direction-setting article for the Shopware 6 Administration moving from custom systems (component factory registration with the Options API, Twig.js templates, Vuex) toward native Vue: the Composition API, native blocks in `.vue` single-file components, and Pinia. The Composition API extension system and native blocks (`sw-block`) are **experimental**, with no committed release version.

## When to use

- Deciding how to write new Administration components or overrides in a plugin.
- Assessing whether existing overrides (`Shopware.Component.override`/`extend`, Twig.js blocks) will keep working.

## Key steps / config

Stable extension system today (Options API + Twig.js):

```javascript
Shopware.Component.register('sw-text-field', {
    template: `{% block sw-text-field %}...{% endblock %}`,
    data() { return { value: null }; },
});
Shopware.Component.override('sw-text-field', {
    template: `{% block sw-text-field %}{% parent %}{{ helpText }}{% endblock %}`,
    props: { helpText: { type: String, required: false } },
});
```

Experimental native extension system:

- Core components are single-file `*.vue` components using the Composition API and native blocks.
- Overrides must match the `*.override.vue` pattern; they are loaded automatically in the plugin's main entry file (the Vite `override-component` plugin registers them via `Shopware.Component.registerOverrideComponent`).
- New extension components can still use `Shopware.Component.register` with the Options API, or a `*.vue` file.
- `Shopware.Component.createExtendableSetup` makes a component's setup extendable and has built-in TypeScript support; `Shopware.Component.overrideComponentSetup` adds an override for a specific component.

Migration status:

| System | Today | Long-term |
|---|---|---|
| Options API | Standard | deprecated and removed after migration |
| Composition API extension system | Experimental | standard |
| Twig.js blocks | Standard | deprecated and removed after migration |
| Native blocks (`sw-block`) | Experimental | standard |

State: the public API moves from Vuex to `Shopware.Store` (Pinia).

## Essential identifiers

- `Shopware.Component.register`, `Shopware.Component.override`, `Shopware.Component.extend`
- `Shopware.Component.createExtendableSetup`, `Shopware.Component.overrideComponentSetup`
- `sw-block`, `*.override.vue`, `Shopware.Store`

## Gotchas

- Components registered only via `Shopware.Component.register` keep working. Using `extend`/`override` on a core component already migrated to the Composition API requires the Composition API extension approach instead.
- You cannot extend core components with the old system when they use the new one, or vice versa.
- Overrides of components migrated to `.vue` files must move to native blocks.
- `registerOverrideComponent` is marked `@experimental stableVersion:v6.8.0` in the installed code; experimental APIs can change.
- Apps are not affected; plugins are.

## Version notes

- 6.7: Pinia is standard for core; extensions may still register Vuex states, but core stores are accessed via Pinia. `Shopware.State` is deprecated (`tag:v6.8.0`) in the installed code.
- 6.8 (per source): Vuex removed completely.
- Removal of the Options API and Twig.js templates only in a future major version; no committed date.

## Code check (6.7.13.0)
- confirmed `Shopware.Component.register` — maps to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
- confirmed `Shopware.Component.extend` — maps to `AsyncComponentFactory.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:131
- confirmed `Shopware.Component.override` — maps to `AsyncComponentFactory.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:132
- confirmed `Shopware.Component.createExtendableSetup` — exposed on the global Component API — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:142
- confirmed `overrideComponentSetup` — exported function adding a component override — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system.ts:422
- confirmed `registerOverrideComponent` — `@experimental stableVersion:v6.8.0` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:148
- confirmed `sw-block` — globally registered native block component — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:109
- confirmed `Shopware.Store` — `public Store = Store.instance` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:171
- deprecated `Shopware.State` — `@deprecated tag:v6.8.0 - Will be removed, use Store instead.` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:169
