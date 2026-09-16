---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md
title: Add Custom Styles
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/add-custom-styles.html
sourceHash: a67cefc091a345a2270018fe214aeb9801c900eb
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration styles", "scss", "css", "sass", "component styling", "Shopware.Component.register", "sw-hello-world", "~scss/variables", "$color-shopware-brand-500", "scss variables", "index.js import", "html.twig template"]
summary: Add SCSS styles to a custom Administration component by importing a .scss file in index.js; reuse Shopware SCSS variables via ~scss/variables.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md"]
---
## What it is

How to attach custom styles to an Administration component in a plugin: create a `.scss` file next to the component, import it in the component's `index.js`, and optionally import Shopware's Administration SCSS variables.

## When to use

A custom Administration component (see [Add a custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md)) needs its own CSS/SCSS. Basic CSS/SCSS knowledge is assumed.

## Key steps / config

Example component `sw-hello-world`, in its own directory:

1. Create the template `sw-hello-world.html.twig` with a root element whose class is named after the component:

```twig
{% block example_block %}
    <div class="sw-hello-world">
        <p>Hello world!</p>
    </div>
{% endblock %}
```

2. Create `sw-hello-world.scss` and import both files in `index.js`, then register the component:

```javascript
import template from './sw-hello-world.html.twig';
import './sw-hello-world.scss';

Shopware.Component.register('sw-hello-world', {
    template
});
```

3. Style the component's root class:

```css
.sw-hello-world {
    color: blue;
}
```

4. Optional — use Shopware's Administration SCSS variables (Sass import):

```css
@import "~scss/variables";

.sw-hello-world {
  color: $color-shopware-brand-500;
}
```

## Essential identifiers

- `Shopware.Component.register`
- `sw-hello-world.html.twig`, `sw-hello-world.scss`, `index.js`
- `~scss/variables`
- `$color-shopware-brand-500`

## Gotchas

- The source's later snippets register `sw-sw-hello-world` while the first snippet and the CSS class use `sw-hello-world`; keep the registered name consistent with the tag you use.
- The `.scss` import in `index.js` is required — creating the file alone does not load it.
- The `~scss/...` alias is resolved by the Administration build configuration, not by the component code.

## Code check (6.7.13.0)
- confirmed `Shopware.Component.register` — used by core modules to register components — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-services/index.ts:5
- confirmed `$color-shopware-brand-500` — defined as `#189eff` in the Administration variables file — vendor/shopware/administration/Resources/app/administration/src/app/assets/scss/variables.scss:53
- unverified `~scss/variables` — alias is defined in the Administration build/Vite config, outside the checked src root
