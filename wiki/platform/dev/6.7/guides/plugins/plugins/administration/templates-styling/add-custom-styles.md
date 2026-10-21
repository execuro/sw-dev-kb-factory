---
id: platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md
title: Add Custom Styles
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/templates-styling/add-custom-styles.html
sourceHash: a67cefc091a345a2270018fe214aeb9801c900eb
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Component.register", "~scss/variables", "$color-shopware-brand-500", "scss", "sass", "css", "custom styles", "component styling", "administration", "sw-hello-world", "index.js", "scss variables"]
summary: Add a component-scoped .scss file to an Administration component by importing it in index.js, and use Shopware SCSS variables via ~scss/variables.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md"]
---
## What it is

How to attach custom CSS/SCSS to a custom Administration component: create a `.scss` file next to the component, import it in the component's `index.js`, and optionally import Shopware's SCSS variables. Basic CSS/SCSS knowledge and an existing custom component (see [Add a custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md)) are prerequisites.

## When to use

You built a custom Administration component or module and want it styled, e.g. colour, grid layout, or Shopware brand colours.

## Key steps / config

1. In the component directory (example: `sw-hello-world`), create the template `sw-hello-world.html.twig` with a root element whose CSS class is named after the component:

```html
{% block example_block %}
    <div class="sw-hello-world">
        <p>Hello world!</p>
    </div>
{% endblock %}
```

2. Create `sw-hello-world.scss` and import both template and styles in `index.js`:

```javascript
import template from './sw-hello-world.html.twig';
import './sw-hello-world.scss';

Shopware.Component.register('sw-hello-world', {
    template
});
```

3. Style the component class in the `.scss` file, e.g. `.sw-hello-world { color: blue; }`.

4. To reuse Shopware's SCSS variables, import them and reference the variable:

```css
@import "~scss/variables";

.sw-hello-world {
  color: $color-shopware-brand-500;
}
```

## Essential identifiers

- `Shopware.Component.register` — registers the component with its `template`
- `@import "~scss/variables";` — Administration SCSS variables import
- `$color-shopware-brand-500` — Shopware brand blue variable
- Files: `index.js`, `sw-hello-world.html.twig`, `sw-hello-world.scss`

## Gotchas

- The source registers `sw-hello-world` in the first snippet but `sw-sw-hello-world` in the later ones; use one consistent name matching your template class.
- The `.scss` import is a plain side-effect import (`import './sw-hello-world.scss';`) — no binding is needed.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.register` — maps to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `~scss/variables` — core Administration SCSS files use `@import "~scss/variables";` — vendor/shopware/administration/Resources/app/administration/src/app/assets/scss/typography.scss:1
- confirmed `$color-shopware-brand-500` — defined as `#189eff` in the variables file — vendor/shopware/administration/Resources/app/administration/src/app/assets/scss/variables.scss:53
- unverified `~scss` — alias resolution lives in the Administration build config, outside the checked package roots
