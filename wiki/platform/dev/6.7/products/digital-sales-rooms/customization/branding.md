---
id: platform/dev/6.7/products/digital-sales-rooms/customization/branding.md
title: Branding Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/customization/branding.html
sourceHash: 6ac53100e0f41ff85347d20887974174000daf44
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "branding", "favicon.ico", "nuxt.config.ts", "uno.config.ts", "app.head.title", "theme color", "primary color", "unocss", "nuxt layer", "customization layer"]
summary: "Digital Sales Rooms frontend branding in a Nuxt customization layer: favicon.ico in public/, app title in nuxt.config.ts, theme colors in uno.config.ts."
lastBuilt: 2026-10-21
---
## What it is

How to change the branding of the Digital Sales Rooms (DSR) frontend app — favicon, web application title and theme colors — from your own customization layer folder (a Nuxt layer on top of the `dsr` layer). All changes are made inside the customization layer, not in the default layer.

## When to use

You run the DSR frontend template and need your own favicon, browser tab title or color palette without editing the shipped `dsr` layer.

## Key steps / config

**Favicon**

1. Create a `public` folder inside your layer if it is missing.
2. Place the favicon there, named exactly `favicon.ico`.

**Web application title**

1. Create `nuxt.config.ts` inside your layer if it is missing.
2. Add the title under `app.head`:

```js
app: {
  head: {
    title: 'Your app name'
  }
}
```

**Theme color**

1. Create `uno.config.ts` inside your layer if it is missing.
2. Override colors under `theme.colors`, e.g. the primary color:

```js
theme: {
  colors: {
    primary: {
      DEFAULT: '#000000'
    }
  }
}
```

3. Use the `uno.config.ts` file in the `dsr` layer as the reference for the available color key structure.

## Essential identifiers

- `public/favicon.ico`
- `nuxt.config.ts` → `app.head.title`
- `uno.config.ts` → `theme.colors.primary.DEFAULT`

## Gotchas

- The favicon file name must be `favicon.ico`; other names are not picked up per the guide.
- Color keys must follow the structure of the `dsr` layer's `uno.config.ts`, otherwise the override does not map to existing theme colors.

## Code check (6.7.15.1)
- unverified `favicon.ico` — DSR frontend Nuxt layer file, not part of vendor/shopware core, storefront or administration
- unverified `nuxt.config.ts` — Nuxt config of the DSR frontend app, outside the checked vendor roots
- unverified `uno.config.ts` — UnoCSS config of the DSR frontend app, outside the checked vendor roots
