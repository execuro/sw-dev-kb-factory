---
id: platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md
title: Add custom styles
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/templates-styling/add-custom-styles.html
sourceHash: 6517a5a8b80869f639cbfea954b6de65fe81dec9
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.md
keywords: ["custom styles", "scss import", "sw-hello-world", "component template", "shopware scss variables", "color-shopware-brand-500", "index.js import", "Component.register", "html.twig template", "administration styling", "CSS class"]
summary: How to add a custom SCSS stylesheet to an Administration component, import it in index.js, and use Shopware's SCSS variables.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to add custom styles to an Administration component or module, on top of the component's own template. It walks through a worked example: a `sw-hello-world` component that prints "Hello world!".

## When to use

Use this once a custom component already exists and needs its own visual styling, rather than relying only on default Administration styles. The guide assumes the reader already knows how to create a custom component (covered separately) and has basic CSS/SCSS knowledge.

## Key steps / config

The example component is registered and given a template:

```javascript
Shopware.Component.register('sw-hello-world', {
    template
});
```

with a template file `sw-hello-world.html.twig` defining the markup:

```html
{% block example_block %}
    <div class="sw-hello-world">
        <p>Hello world!</p>
    </div>
{% endblock %}
```

The template is imported into `index.js`:

```javascript
import template from './sw-hello-world.html.twig';

Shopware.Component.register('sw-sw-hello-world', {
    template
});
```

To add custom styling, create a `.scss` file for the component and import it alongside the template in `index.js`:

```javascript
import template from './sw-hello-world.html.twig';
import './sw-hello-world.scss';

Shopware.Component.register('sw-sw-hello-world', {
    template
});
```

Inside the `.scss` file, styles target the component's root CSS class (named after the component), for example setting the text color:

```css
.sw-hello-world {
    color: blue;
}
```

Because the Administration uses Sass, Shopware's own SCSS variables can be imported and reused, for example to match the Shopware brand color:

```css
/* Import statement */
@import "~scss/variables";

.sw-hello-world {
  /* Usage of variable */
  color: $color-shopware-brand-500;
}
```

## Essential identifiers

- `./sw-hello-world.scss` — the custom stylesheet imported in the component's `index.js`.
- `@import "~scss/variables";` — the import path for Shopware's SCSS variables.
- `$color-shopware-brand-500` — an example Shopware brand-color SCSS variable.
- `sw-hello-world` — the CSS class name matching the example component, used as the styling target.

## Gotchas

The `.scss` file has no effect until it is explicitly imported from the component's `index.js`, in the same way a template file must be imported before it takes effect.
