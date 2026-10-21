---
id: platform/dev/6.7/concepts/framework/architecture/administration-concept.md
title: Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/architecture/administration-concept.html
sourceHash: 80cd328d8d98a368aec363a128f2162eba9e5553
codeCheckedAgainst: "6.7.15.1"
keywords: ["administration", "admin spa", "Component.extend", "Component.override", "Module.register", "sw-order", "acl", "viewer", "editor", "creator", "deleter", "twig.js", "vue.js", "admin api", "module page view component"]
summary: Administration concept - Vue.js SPA on the Admin API, src layout (app/core/module), module/page/view/component structure, inheritance, ACL roles.
lastBuilt: 2026-10-20
---
## What it is

The Administration is a Symfony bundle wrapping a single-page application written in JavaScript (Vue.js components, Twig.js templates, SASS styling, Vue I18n for translations). It sits on top of the Core, like the Storefront, and talks to the Core exclusively through the Admin API. It contains no business logic: it is the UI for all administrative tasks of a shop owner, reachable under `/admin`.

## When to use

Read this before building or customizing Administration modules, components or ACL privileges in a plugin or app, or when you need to locate where a given admin screen lives in the source tree.

## Key steps / config

Cross-cutting concerns of the Administration:

- **Inheritance** - plugins/apps/themes override or extend existing components.
- **Data management** - pages and views read/write Core entities via the REST Admin API and work on in-memory representations of the API data.
- **State management** - the SPA is a long-running browser process; a router handles page selection and each component manages the state of its subcomponents.

Source layout: SPA entry point is `./Resources/app/administration` inside `shopware/src/Administration`; the bundle around it sets up the `/admin` routing, the main template `./Resources/views/administration/index.html.twig`, and translation handling.

```bash
<shopware/src/Administration/Resources/app/administration/src/>
|- app      # application basis, framework-dependent components
|- core     # Admin API binding and services
|- module   # UI + state of view pages, structured along Core modules
```

Module hierarchy: one module = one main-menu navigation entry. A `page` (at least one per module, mandatory) encapsulates `view`s, a `view` encapsulates `component`s, and components nest freely. A component combines template (Twig.js), logic (`index.js`) and styling (SCSS).

Example - the order module `module/sw-order/` contains `acl`, `component`, `page` (`sw-order-create`, `sw-order-detail`, `sw-order-list`), `snippet`, `state`, `view` and `index.js`, which calls `Module.register('sw-order', { ... })` and registers its components.

Inheritance from a plugin:

- `Component.extend()` creates a new component based on an existing one.
- `Component.override()` overwrites the behavior of the existing component.
- Templates can be customized with Twig.js blocks; methods and computed properties can be extended.

ACL: each module ships an `acl` directory mapping privileges for the default roles `viewer`, `editor`, `creator` and `deleter`. Custom roles can be set up in the Administration UI; plugins can add individual privileges.

## Essential identifiers

- `Shopware.Component.extend`, `Shopware.Component.override`, `Shopware.Component.register`
- `Module.register`
- `src/app`, `src/core`, `src/module`
- `module/sw-order/acl/index.js` - roles `viewer`, `editor`, `creator`, `deleter`
- `/admin` route, `index.html.twig`

## Gotchas

- In 6.7.15.1 the order module's view directories are `sw-order-create-base`, `sw-order-create-initial`, `sw-order-create-general`, `sw-order-create-details`, `sw-order-detail-general`, `sw-order-detail-details`, `sw-order-detail-documents` - the docs' `sw-order-details-base` does not exist.
- Several module files are now TypeScript (`index.ts`), e.g. `page/sw-order-create/index.ts`, not only `index.js`.
- ACL role dependencies are declared per role, e.g. `editor` depends on `order.viewer`.

## Code check (6.7.15.1)
- confirmed `Component.extend` — global `Shopware.Component` maps `extend` to `AsyncComponentFactory.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:136
- confirmed `Component.override` — mapped to `AsyncComponentFactory.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- confirmed `override` — exported by the component factory alongside `register`/`extend` — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:44
- confirmed `Module.register` — order module registered as `sw-order` — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/index.js:143
- confirmed `sw-order-create` — page component of the order module — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/index.js:170
- corrected `sw-order-detail-details` — docs: view `sw-order-details-base`; installed detail views are `sw-order-detail-general/details/documents` — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/index.js:233
- confirmed `sw-order-create-base` — view registered by the order module — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/index.js:21
- confirmed `viewer` — default ACL role in the order module acl mapping — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/acl/index.js:22
- confirmed `deleter` — default ACL role, depends on `order.viewer` — vendor/shopware/administration/Resources/app/administration/src/module/sw-order/acl/index.js:108
- unverified `index.html.twig` — Administration bundle PHP/views outside the checked SPA src root
