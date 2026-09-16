---
id: platform/dev/6.6/guides/plugins/apps/storefront/_index.md
title: Storefront
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/storefront/
sourceHash: 9edfad5a87b9e27314373ee1a2cbcfedf7513c6c
keywords: ["Storefront", "app", "manifest.xml", "Resources folder", "template-load-priority", "custom assets", "custom templates", "custom Javascript", "custom styling", "asset system", "theme", "app resources", "template priority"]
summary: "Apps can modify the Storefront's templates, JavaScript, styling and custom assets without an external server."
lastBuilt: "2026-09-15"
---
## What it is

This page explains how an app can modify the whole appearance of the Storefront: customizing templates, adding custom JavaScript and adding custom styling, all without setting up any external server, since Shopware itself builds the Storefront.

## When to use

Use this when an app needs to change how the Storefront looks or behaves by shipping `.html.twig`, `.js` or `.scss` files, or when the app needs to bundle custom assets such as fonts, or control the load order of its templates relative to other extensions.

## Key steps / config

Place Storefront modifications inside the `Resources` folder of the app. The base folder structure looks like this:

```text
DemoApp
  Resources
    app
      storefront
        src
          scss/base.scss
          main.js
    views/storefront/...
    public/...
  manifest.xml
```

To include custom assets (fonts, etc.), place them in the `/Resources/public` folder; they are then available through the asset system. This was introduced in Shopware 6.4.8.0 and is not supported before that.

To control template load order relative to other extensions, define `template-load-priority` inside `manifest.xml`. The default is 0; positive numbers load the template earlier, negative numbers later. This was introduced in Shopware 6.4.12.0.

```xml
<manifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-2.0.xsd">
    <meta>...</meta>
    <storefront>
        <template-load-priority>100</template-load-priority>
    </storefront>
</manifest>
```

## Essential identifiers

- `Resources` folder — where app Storefront modifications live.
- `manifest.xml` — app manifest, holds `<storefront><template-load-priority>`.
- `template-load-priority` — controls template load order.
- `/Resources/public` — folder for custom assets served via the asset system.

## Version notes

- Custom assets in apps: available from Shopware 6.4.8.0 onward, not supported before.
- `template-load-priority`: available from Shopware 6.4.12.0 onward, not supported before.
