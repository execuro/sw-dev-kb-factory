---
id: platform/dev/6.6/products/digital-sales-rooms/customization/branding.md
title: Branding Customization
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/customization/branding.html
sourceHash: b97a69c6b4a5a20174eaef4dbc34d552cb03ab70
keywords: ["Digital Sales Rooms", "DSR", "branding", "favicon", "nuxt.config.ts", "uno.config.ts", "theme color", "customization layer", "web application title"]
summary: "Customizing DSR branding: favicon, web app title, and theme color, all set within your Nuxt customization layer."
lastBuilt: 2026-09-15
---
## What it is
How to customize DSR branding — favicon, browser/app title, and primary theme color — all done inside your own customization layer folder, not the default `dsr` layer.

## When to use
Use this to give a DSR deployment its own visual identity (icon, title, primary color) without editing the core frontend files.

## Key steps / config
- **Favicon**: create a `public` folder in your layer (if missing) and place `favicon.ico` inside it.
- **Web application title**: create `nuxt.config.ts` in your layer (if missing) and add:

```js
app: {
  head: {
    title: 'Your app name'
  }
}
```

- **Theme color**: create `uno.config.ts` in your layer (if missing) and add, e.g. to set the primary color to `#000000`:

```js
theme: {
  colors: {
    primary: {
      DEFAULT: '#000000'
    }
  }
}
```

- Refer to the `uno.config.ts` file in the `dsr` layer for the full key structure used to override colors.

## Essential identifiers
- `nuxt.config.ts`
- `uno.config.ts`
- `favicon.ico`
