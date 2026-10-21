---
id: platform/dev/6.7/resources/references/adr/2023-02-27-native-extension-system-with-vue.md
title: Native extension system with vue
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-02-27-native-extension-system-with-vue.html
sourceHash: e9a78325d144b5ad91a092a1dc7746db73922191
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-block", "component factory", "Twig.JS", "twigjs", "vue 3", "composition api", "administration plugin system", "admin extensibility", "native vue extension", "Component.register", "Component.override", "adr"]
summary: "ADR (2023): native Vue 3 extension system (sw-block plus Composition API hooks) was evaluated and rejected; admin keeps the Component Factory with Twig.JS."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (dated 2023-02-27, area `administration`) documenting an evaluated-and-rejected attempt to replace the administration's plugin extension system with one built only from native Vue 3 tools. Outcome: the administration keeps its existing Component Factory plus Twig.JS templates. Mirrored from `adr/2023-02-27-native-extension-system-with-vue.md` in the Shopware 6 repository.

## When to use

Read it to understand why administration components are not plain Vue single-file components, why templates are Twig.JS strings compiled in the browser, and why plugins extend components through the factory rather than through Vue-native mechanisms.

## Key steps / config

Status quo described by the ADR: the Component Factory generates native Vue components at runtime from a base Shopware component, which plugins can extend or override. Templates use Twig.JS and the Vue template is compiled in the client at runtime. Drawbacks named:

- Vue and its ecosystem cannot be used fully, because everything is wrapped by factories and generated at runtime.
- Vue tooling (template linting, static analysis) does not work without custom modifications.
- Upgrading Vue is hard, and performance suffers because components cannot be precompiled.

Evaluated alternative (Vue 3, native tools only):

- Template part: a native Vue component `sw-block` replaces Twig.JS blocks; plugins extend or overwrite a block by name:

```html
<sw-block name="sw-hello-world">
<div>Hello World</div>
</sw-block>
```

- Script part: the Composition API, with a hook point before the component returns its data and methods so plugins can modify or inject anything.

Why it was rejected: merging data was hard because the Vue compiler optimises many parts of a component, and passing all of a component's data to the block system (to give plugins full access) was not straightforward. Solving this would require internal Vue logic, which is not update-safe and could break on every Vue update.

Decision: no significant benefit over the current plugin system, which works for the use case; the administration stays on it until Vue offers new possibilities.

## Essential identifiers

- Component Factory API: `register`, `extend`, `override`, `build` (exported by the administration's async component factory)
- Twig.JS template factory (imports the `twig` package)
- `sw-block` (the evaluated block component name)

## Gotchas

- The ADR's script-part code example is empty in the mirrored source; no Composition API hook signature is defined by it.
- "Stick with the current system" means plugin authors continue to use Twig.JS `{% block %}` overrides and factory `extend`/`override`, not native Vue component extension.

## Version notes

In the installed 6.7.15.1 administration the Component Factory (`register`, `extend`, `override`, `build`) and Twig.JS template factory are still present. The template pipeline now also contains code that reconstructs Twig.JS block tokens as `<sw-block name="...">` markup and `{% parent %}` as `<sw-block-parent />`, using Twig.JS only as a parser, plus a transform for native `<sw-block>` templates with conditional chains. This is internal (`@private`) code; the ADR itself does not describe it.

## Code check (6.7.15.1)
- confirmed `register` — Component Factory export — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:42
- confirmed `extend` — Component Factory export — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:43
- confirmed `override` — Component Factory export — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:44
- confirmed `build` — builds the runtime component config — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:710
- confirmed `Twig` — template factory imports Twig.JS — vendor/shopware/administration/Resources/app/administration/src/core/factory/template.factory.js:6
- confirmed `sw-block` — Twig block tokens reconstructed as `sw-block` markup — vendor/shopware/administration/Resources/app/administration/src/core/factory/reconstruct-twig-template.ts:66
- confirmed `sw-block-parent` — replacement for `{% parent %}` — vendor/shopware/administration/Resources/app/administration/src/core/factory/reconstruct-twig-template.ts:61
- confirmed `transformNativeLegacyBlockConditionals` — handles native `sw-block` templates with conditionals — vendor/shopware/administration/Resources/app/administration/src/core/factory/transform-legacy-block-conditionals.ts:410
