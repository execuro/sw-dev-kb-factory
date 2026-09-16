---
id: platform/dev/6.7/concepts/framework/architecture/administration-concept.md
title: Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/architecture/administration-concept.html
sourceHash: 80cd328d8d98a368aec363a128f2162eba9e5553
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration", "admin", "spa", "vue.js", "twig.js", "Component.extend", "Component.override", "module", "page", "view", "acl", "sw-order", "Admin API", "vue-i18n", "/admin"]
summary: Administration concept - Vue.js SPA in a Symfony bundle talking to the Admin API; src layout, module/page/view/component structure, extend/override, ACL roles.
lastBuilt: 2026-09-15
---
## What it is

The Administration is a Symfony bundle wrapping a Single Page Application written in JavaScript/TypeScript on Vue.js. It sits on top of the Core (like the Storefront), communicates with the Core only through the Admin API, uses Twig.js for extensible templates, SASS for styling and the Vue I18n plugin (`vue-i18n`) for translations. It contains no business logic; it is served at `/admin`.

## When to use

When orienting yourself before writing an Administration extension: locating SPA sources, understanding modules/pages/views/components, choosing between overriding and extending a component, or adding ACL privileges.

## Key steps / config

**Cross-cutting concerns:** inheritance (plugins/apps/themes override or extend the UI), data management (in-memory representations of API data), state management (long-running browser process; a router selects the page, each component manages its subcomponents' state).

**Location:** the SPA entry point is `Resources/app/administration` inside the Administration bundle; the rest of the bundle sets up the `/admin` routing, the main template `Resources/views/administration/index.html.twig` and translation handling.

**SPA `src` layout:**

```
src/
|- app      # application basis, framework-dependent components
|- core     # binding to the Admin API and services
|- module   # UI and state of view pages, along Core modules
```

**Module structure:** one module = one main-menu navigation entry. A `page` (at least one per module, mandatory) encapsulates `view`s, a view encapsulates `component`s, components nest. A component combines a Twig.js template, `index.js`/`index.ts` logic and an SCSS file.

Installed `sw-order` module layout:

```
module/sw-order/
|- acl/index.js
|- component/sw-order-address-modal/ ...
|- page/sw-order-create | sw-order-detail | sw-order-list
|- snippet/de.json, en.json
|- view/sw-order-create-base | sw-order-create-details | sw-order-create-general
|       sw-order-create-initial | sw-order-detail-details | sw-order-detail-documents | sw-order-detail-general
|- index.js
```

**Inheritance:** `Shopware.Component.extend()` creates a new component based on an existing one; `Shopware.Component.override()` changes the behavior of the existing component in place. Plugins can override or extend logic, customize templates via Twig.js, and extend methods and computed properties.

**ACL:** CRUD on module data requires privileges. Each module ships an `acl` directory mapping privileges for the default roles `viewer`, `editor`, `creator`, `deleter`; custom roles can be set up in the UI or provided by plugins.

## Essential identifiers

- `Shopware.Component.extend()`, `Shopware.Component.override()`
- `src/app`, `src/core`, `src/module`
- `acl` roles: `viewer`, `editor`, `creator`, `deleter`
- `/admin`, `Resources/views/administration/index.html.twig`
- `vue-i18n`

## Gotchas

- The docs' `sw-order` example lists a view `sw-order-details-base` and a `state` directory; the installed module instead has the `sw-order-create-*` / `sw-order-detail-*` views listed above.
- Module snippets are flat locale files (`de.json`, `en.json`), not locale subdirectories.

## Code check (6.7.13.0)
- confirmed `Component` — global `Shopware.Component` exposes `register`, `extend`, `override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:129
- confirmed `extend` — `Component.extend` maps to AsyncComponentFactory.extend — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:131
- confirmed `override` — `Component.override` maps to AsyncComponentFactory.override — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:132
- confirmed `viewer` — default ACL role key in sw-order acl — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/acl/index.js:22
- confirmed `deleter` — default ACL role key in sw-order acl — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/acl/index.js:112
- confirmed `vue-i18n` — admin creates its i18n instance from vue-i18n — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:5
- absent `sw-order-details-base` — view named in the docs example does not exist in the installed code
- unverified `index.html.twig` — bundle views live outside the administration src root in scope
- unverified `Webpack` — build tooling config is outside the administration src root in scope
