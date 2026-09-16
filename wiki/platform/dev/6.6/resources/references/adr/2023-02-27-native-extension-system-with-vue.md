---
id: platform/dev/6.6/resources/references/adr/2023-02-27-native-extension-system-with-vue.md
title: Native extension system with vue
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-27-native-extension-system-with-vue.html
sourceHash: e9a78325d144b5ad91a092a1dc7746db73922191
keywords: ["Component Factory", "Twig.JS", "sw-block", "Vue 3", "Composition API", "administration", "plugin extension system", "extensibility", "vue", "admin frontend"]
summary: "ADR: Shopware evaluated and rejected a native Vue 3 sw-block extension system, keeping the current Component Factory."
lastBuilt: 2026-09-15
---
## What it is
An architecture decision record evaluating a native Vue 3-based plugin extension system for the administration (using an `sw-block` component and Composition API hooks) as a replacement for the current Twig.JS-based Component Factory, and deciding against it.

## When to use
Relevant when considering how the administration's plugin extension system works or why it still relies on the Component Factory rather than native Vue extension mechanisms.

## Key steps / config
- Context: the current administration plugin system is based on the Component Factory, which generates native Vue components at runtime from a base Shopware component, using Twig.JS to compile templates client-side. Drawbacks: cannot use Vue tooling (linting, static analysis) without custom modifications, Vue upgrades are challenging, and runtime template compilation hurts performance.
- The evaluated alternative used a native `sw-block` Vue component to replace Twig.JS templates, and the Composition API with plugin hook points for script/logic:
```html
<sw-block name="sw-hello-world">
<div>Hello World</div>
</sw-block>
```
- The evaluation found it infeasible: merging component data was hard because the Vue compiler optimizes parts of the component, and passing all component data to the block system for plugin access was difficult without relying on internal, update-unsafe Vue logic.
- Decision: stick with the current Component Factory-based plugin system until new Vue capabilities solve these problems.

## Essential identifiers
- Component Factory
- `sw-block` (evaluated, not adopted)
- Twig.JS
