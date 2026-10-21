---
id: platform/dev/6.7/guides/upgrades-migrations/administration/vue-native.md
title: Native Vue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue-native.html
sourceHash: 1936056e45924cad2a3150755b5fbf6c64ce4b7a
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Component.register", "Shopware.Component.override", "Shopware.Store", "Shopware.State", "sw-block", "*.override.vue", "composition api", "options api", "single file components", "sfc", "twig.js", "pinia", "vuex", "native blocks"]
summary: Migration direction for the 6.7 Administration from Options API, Twig.js templates and Vuex towards Composition API, native sw-block SFCs and Pinia.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/roadmap.md", "platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/set-up-your-environment.md"]
---
## What it is

A direction-setting article for the Shopware 6 Administration: it explains why Shopware is moving towards a more native Vue.js implementation and outlines the migration path. Three changes are covered: Options API to Composition API, Twig.js templates to native blocks (`sw-block`) in `.vue` Single File Components (SFCs), and Vuex to Pinia. The current plan and target versions live in the [Single File Components roadmap](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/roadmap.md); the hands-on guide is the [Single File Components guide](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/_index.md).

The Composition API extension system and the native block system are **experimental**; their APIs can still change.

## When to use

- You maintain an Administration plugin and need to know which of today's extension mechanisms will be deprecated and what replaces them.
- You want to try SFCs, native blocks or Composition API overrides in an extension now.
- You are planning team training or migration effort for upcoming major versions.

Apps are not affected at all; plugins need to respect these changes.

## Key steps / config

### Today: the stable extension system

The Administration is built on Vue.js with custom systems on top. Core and extensions register components via `Shopware.Component.register` (Options API) with Twig.js templates, and extensions modify them via `Shopware.Component.override`:

```javascript
Shopware.Component.override('sw-text-field', {
    template: `
 {% block sw-text-field %}
 {% parent %}
 {{ helpText }}
 {% endblock %}
 `,
    props: { helpText: { type: String, required: false } },
});
```

### Change 1: Options API to Composition API

Components will be transformed gradually. Breaking changes such as removing the Options API only happen in a future major version.

| System | Status today | Long-term direction |
|---|---|---|
| Options API | Standard | Deprecated and removed once the migration is complete |
| Composition API extension system | Experimental | Standard for core components and extensions |

### Change 2: Twig.js to native blocks

Vue slots do not work like blocks; Shopware implemented blocks as native Vue components, which allows SFCs while keeping Twig.js-style extendability, and lets standard tooling (VSCode, ESLint, Prettier) work out of the box. Templates move from external `*.html.twig` files to `.vue` files.

| System | Status today | Long-term direction |
|---|---|---|
| Twig.js blocks | Standard | Deprecated and removed once native blocks are complete |
| Native blocks (`sw-block`) | Experimental | Standard for core components and extensions |

### Change 3: Vuex to Pinia

All core Vuex states move to Pinia stores; the public API is `Shopware.Store`.

| Version | Vuex | Pinia |
|---|---|---|
| 6.7 | Still supported for extensions (core stores accessed via Pinia) | Standard for core components |
| 6.8 | Removed completely | Standard |

### Experimental: the native extension system

- Core components become single-file `*.vue` components using the Composition API.
- Overrides use a new convention: files must match `*.override.vue`; such files are loaded automatically from your main entry file.
- New extension components may be a `*.vue` file, but registering them via `Shopware.Component.register` with the Options API still works.
- SFCs work with TypeScript, including type checking and editor support (see [Turn on editor support](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/set-up-your-environment.md)).

Long term, once the new systems leave the experimental state, registering components via `Shopware.Component.register` with the Options API or Twig.js templates will no longer be possible — only in a future major version.

## Essential identifiers

- `Shopware.Component.register`, `Shopware.Component.override`
- `Shopware.Store` (Pinia)
- `sw-block` (native block component), `*.override.vue`, `*.html.twig`, `.vue`

## Gotchas

- Experimental APIs (Composition API extension system, `sw-block`) can still change; check the roadmap before relying on them.
- Existing Options API overrides keep working, including overrides of components already migrated to SFCs: a compatibility layer keeps them running and logs a deprecation warning. Migrate them before that layer is removed in a future major version.
- Extensions still using Twig.js templates stop working once Twig.js support is removed (future major).
- Composition API and Options API components can be mixed during the transition, within the limits of the migration paths above.
- A codemod converting components to SFCs is under development; it will not cover every case, so expect manual work.
- `Shopware.State` (Vuex) is deprecated in 6.7.15.1 with the note "use Store instead"; switch core-state access to `Shopware.Store`.
- No performance issues were observed in tests with both systems active.

## Version notes

- 6.7: Pinia standard for core; Vuex still allowed for extension-registered states; `Shopware.State` deprecated (tag v6.8.0).
- 6.8: Vuex removed completely.
- Removal of the Options API and Twig.js templates: a future major version, timing tracked in the roadmap.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.register` — Component.register maps to AsyncComponentFactory.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `Shopware.Component.override` — Component.override maps to AsyncComponentFactory.override — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- confirmed `createExtendableSetup` — Composition API extension helper exposed on Shopware.Component — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:147
- confirmed `Shopware.Store` — Pinia store instance on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:184
- deprecated `Shopware.State` — tag:v6.8.0, use Store instead — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:182
- confirmed `sw-block` — native block component registered globally — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:113
- unverified `*.override.vue` — auto-loading is done by build tooling outside the scanned admin src root
