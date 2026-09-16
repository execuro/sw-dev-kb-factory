---
id: platform/dev/6.7/products/digital-sales-rooms/customization/branding.md
title: Branding Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/customization/branding.html
sourceHash: 6ac53100e0f41ff85347d20887974174000daf44
codeCheckedAgainst: "6.7.13.0"
keywords: ["digital sales rooms", "dsr", "branding", "favicon.ico", "nuxt.config.ts", "uno.config.ts", "app.head.title", "theme color", "primary color", "unocss", "nuxt layer"]
summary: "DSR frontend branding in a custom Nuxt layer: favicon.ico in public/, page title via app.head.title in nuxt.config.ts, theme colors in uno.config.ts."
lastBuilt: 2026-09-15
---
## What it is

How to change favicon, web application title, and theme colors of the Digital Sales Rooms (DSR) Nuxt frontend. All changes are made inside your customization layer folder, not in the default `dsr` layer.

## When to use

You are branding a DSR frontend for a customer (logo icon, browser tab title, primary color).

## Key steps / config

### Favicon

1. Create a `public` folder inside your layer if missing.
2. Put your icon there, named exactly `favicon.ico`.

### Web application title

1. Create `nuxt.config.ts` inside your layer if missing.
2. Add, replacing the name:

```js
app: {
  head: {
    title: 'Your app name'
  }
}
```

### Theme color

1. Create `uno.config.ts` inside your layer if missing.
2. Override colors, e.g. primary set to black:

```js
theme: {
  colors: {
    primary: {
      DEFAULT: '#000000'
    }
  }
}
```

3. Check `uno.config.ts` in the `dsr` layer for the full key structure of overridable colors.

## Essential identifiers

- `public/favicon.ico`
- `nuxt.config.ts` — `app.head.title`
- `uno.config.ts` — `theme.colors.primary.DEFAULT`

## Gotchas

- The favicon file name must be `favicon.ico`.
- Color keys must follow the structure of the `dsr` layer's `uno.config.ts`.

## Code check (6.7.13.0)
- unverified `nuxt.config.ts` — DSR Nuxt frontend file, not part of the installed Shopware packages
- unverified `uno.config.ts` — DSR frontend UnoCSS config, out of scope of vendor/shopware
- unverified `app.head.title` — Nuxt config key, out of scope of vendor/shopware
- unverified `favicon.ico` — frontend layer asset, not in the installed Shopware code
