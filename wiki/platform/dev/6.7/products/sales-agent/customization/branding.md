---
id: platform/dev/6.7/products/sales-agent/customization/branding.md
title: Branding Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/customization/branding.html
sourceHash: fa5e52fecc327c0b9ee8795c620f9ffdd5d713b6
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales agent", "branding", "favicon.ico", "app title", "theme color", "--color-interaction-primary-default", "css variables", "meteor component library", "nuxt.config.ts", "defineNuxtConfig", "dark theme", "nuxt layer"]
summary: "Sales Agent branding in a Nuxt layer: favicon.ico in public/, app.head.title in nuxt.config.ts, Meteor CSS variable overrides loaded via the css option."
lastBuilt: 2026-09-15
---
## What it is

How to change the Sales Agent frontend's favicon, browser title and theme colors. All changes are made inside your own customization layer folder, not the default layer.

## When to use

When rebranding the Sales Agent app for a customer: logo icon, application name, primary colors.

## Key steps / config

Favicon:

1. Create a `public` folder inside your layer if missing.
2. Place the icon there, named exactly `favicon.ico`.

Web application title — in the layer's `nuxt.config.ts` (create it if missing):

```js
app: {
  head: {
    title: 'Your app name'
  }
}
```

Theme color — Sales Agent uses the Shopware Meteor Component Library, whose CSS variable system drives the (light and dark) themes. Override variables in your own CSS file and register that file in Nuxt:

```css
/* main.css */
:root {
  --color-interaction-primary-default: <your color>;
}
```

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  css: ["./main.css"],
});
```

The available variables are listed in the Meteor tokens deliverables for the administration light and dark themes (`packages/tokens/deliverables/administration/light.css` / `dark.css` in the shopware/meteor repository).

## Essential identifiers

- `public/favicon.ico`
- `nuxt.config.ts`: `app.head.title`, `css`
- `defineNuxtConfig`
- `--color-interaction-primary-default` (Meteor CSS variable, `:root` override)

## Code check (6.7.13.0)
- confirmed `--color-interaction-primary-default` — Meteor token consumed as a CSS variable in the Shopware administration — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-label/sw-label.scss:185
- unverified `favicon.ico` — Sales Agent app layer file; the Sales Agent frontend is not part of vendor/shopware
- unverified `defineNuxtConfig` — Nuxt API, out of scope of vendor/shopware
