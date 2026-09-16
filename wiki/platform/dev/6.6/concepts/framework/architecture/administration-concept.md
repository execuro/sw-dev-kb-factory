---
id: platform/dev/6.6/concepts/framework/architecture/administration-concept.md
title: Administration
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/architecture/administration-concept.html
sourceHash: 7c4fc7dc26d8d2248ad82b967fa6d80ceb0700f1
keywords: ["administration", "spa", "vue.js", "twig.js", "admin api", "acl", "component", "module", "page", "view", "inheritance", "component.extend", "component.override"]
summary: "Describes the Administration SPA: Vue.js components organized as modules/pages/views, Admin API access, inheritance, and ACL."
lastBuilt: "2026-09-15"
---
## What it is

The Administration component is a Symfony bundle containing a Vue.js Single Page Application (SPA) that sits on top of the Core, communicating with it exclusively through the Admin API, and provides the UI for all administrative tasks. It contains no business logic.

## When to use

Relevant when building or overriding Administration modules, components, or ACL rules, or when understanding how the SPA relates to Core data and REST-API communication.

## Key steps / config

The SPA lives at `./Resources/app/administration`, with the bundle setting up the initial routing (`/admin`) and main template `./Resources/views/administration/index.html.twig`. Its `src` directory is structured as:

```bash
<shopware/src/Administration/Resources/app/administration/src/>
|- app
|- core
|- module
```

- `app` — application basis / framework-dependent computational components
- `core` — binding to the Admin API and services
- `module` — UI and state management per navigation entry, structured along Core modules

Each module is a navigation entry, built from `component`s (styling + markup + logic via a Twig.js template, `index.js`, and SCSS). A module's general structure: at least one `page` (entry point) contains `view`s, which contain `component`s, which may nest further components.

Example — the `sw-order` module structure:

```bash
<shopware/src/Administration/Resources/app/administration/src/module/sw-order/>
|- acl
|- component
|- page
  |- sw-order-create
  |- sw-order-detail
  |- sw-order-list
|- snippet
|- state
|- view
  |- sw-order-create-base
  |- sw-order-details-base
|- index.js
```

Inheritance for plugins: `Component.extend()` creates a new component; `Component.override()` overwrites the previous behavior of an existing component. Plugins can also customize a component's Twig.js template, and extend methods/computed properties.

## Essential identifiers

- `Component.extend()`, `Component.override()` — component inheritance methods
- `./Resources/app/administration` — SPA entry point
- `./Resources/views/administration/index.html.twig` — main Administration template
- `acl` directory — per-module privilege mapping for roles `viewer`, `editor`, `creator`, `deleter`

## Gotchas

By default, ACL data access (CRUD) is restricted per module until the user has the specific privilege; custom roles can be set up in the Administration UI or via plugin-defined privileges.
