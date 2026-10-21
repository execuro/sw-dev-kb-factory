---
id: platform/dev/6.7/products/sales-agent/customization/branding.md
title: Branding Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/customization/branding.html
sourceHash: fa5e52fecc327c0b9ee8795c620f9ffdd5d713b6
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "branding", "favicon.ico", "public folder", "nuxt.config.ts", "app.head.title", "theme color", "--color-interaction-primary-default", "meteor component library", "css variables", "defineNuxtConfig", "dark theme"]
summary: Sales Agent branding in your Nuxt layer; favicon.ico in public/, app.head.title in nuxt.config.ts, and Meteor CSS variable overrides for theme colors.
lastBuilt: 2026-10-21
---
## What it is

How to change the favicon, the web application title and the theme colors of the Sales Agent frontend. All changes are made inside your own customization layer folder, not in the default `sales-agent` layer.

## When to use

When the Sales Agent must carry your brand: your own icon in the browser tab, your app name as page title, and your primary colors.

## Key steps / config

**Favicon**

1. Create a `public` folder inside your layer (if missing).
2. Place your favicon there, named exactly `favicon.ico`.

**Web application title**

1. Create `nuxt.config.ts` inside your layer (if missing).
2. Add the following, replacing "Your app name":

```js
app: {
  head: {
    title: 'Your app name'
  }
}
```

**Theme color**

The Sales Agent uses the Shopware Meteor Component Library, whose CSS variable system drives the theme. It ships a [light theme](https://github.com/shopware/meteor/blob/main/packages/tokens/deliverables/administration/light.css) and a [dark theme](https://github.com/shopware/meteor/blob/main/packages/tokens/deliverables/administration/dark.css) token file listing the available variables.

1. Override variables in your own CSS file:

```css
/* main.css */
:root {
  --color-interaction-primary-default: #80A1BA;
}
```

2. Register the file in your layer's Nuxt config:

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  css: ["./main.css"],
});
```

## Essential identifiers

- `public/favicon.ico` — favicon location inside the layer
- `nuxt.config.ts` — `app.head.title`, `css` array
- `defineNuxtConfig` — Nuxt config wrapper
- `--color-interaction-primary-default` — Meteor primary interaction color token

## Gotchas

- The favicon must be named `favicon.ico`; any other name is not picked up as the favicon.
- A custom CSS file has no effect until it is listed in the `css` array of `nuxt.config.ts`.

## Code check (6.7.15.1)
- confirmed `--color-interaction-primary-default` — Meteor token consumed by the Shopware administration styles as well — vendor/shopware/administration/Resources/app/administration/src/app/component/grid/sw-pagination/sw-pagination.scss:3
- confirmed `@shopware-ag/meteor-component-library` — Meteor library imported by the administration — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:60
- unverified `favicon.ico` — Sales Agent frontend file, separate repository, out of scope
- unverified `defineNuxtConfig` — Nuxt API, not part of the installed Shopware packages
- unverified `app.head.title` — Nuxt config key of the Sales Agent app, out of scope
