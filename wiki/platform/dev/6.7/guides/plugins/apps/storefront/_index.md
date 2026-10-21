---
id: platform/dev/6.7/guides/plugins/apps/storefront/_index.md
title: Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/
sourceHash: 6e94b1aab26911e84b03ee0fa2d8abee168c9b65
codeCheckedAgainst: "6.7.15.1"
keywords: ["template-load-priority", "templateLoadPriority", "Resources/views/storefront", "Resources/app/storefront/src", "Resources/public", "main.js", "base.scss", "app storefront", "app templates", "custom assets", "manifest.xml", "storefront customization"]
summary: App Storefront changes - twig, JS and SCSS under the app's Resources folder, assets in Resources/public, and template-load-priority in manifest.xml.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md"]
---
## What it is

Overview of how an app changes the Storefront: templates (platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md), JavaScript (platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) and styling (platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md). The Shopware server builds the Storefront itself, so no external app server is needed — the app only ships `.html.twig`, `.js` or `.scss` files in its `Resources` folder.

## When to use

You want an app to override Storefront templates, add JS/SCSS, ship static assets such as fonts, or control the order in which its templates load relative to other extensions.

## Key steps / config

1. Lay out the app:

```text
DemoApp/
  Resources/
    app/storefront/src/scss/base.scss
    app/storefront/src/main.js
    views/storefront/...
    public/...            (public assets)
  manifest.xml
```

2. Assets: place files in `Resources/public`; they are published through the asset system like plugin assets (platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md).
3. Template order: set `template-load-priority` under `<storefront>` in `manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). Default `0`; positive values load the app's templates earlier, negative later.

```xml
<manifest>
    <meta>...</meta>
    <storefront>
        <template-load-priority>100</template-load-priority>
    </storefront>
</manifest>
```

## Essential identifiers

- `Resources/views/storefront`, `Resources/app/storefront/src` (`main.js`, `scss/base.scss`), `Resources/public`
- `<storefront>` / `<template-load-priority>` in `manifest.xml` (stored as app field `templateLoadPriority`)

## Gotchas

- The entry script may also be `main.ts`; the installed code checks `main.ts` before `main.js`.

## Version notes

- Custom assets in apps: since Shopware 6.4.8.0.
- `template-load-priority`: since Shopware 6.4.12.0.

## Code check (6.7.15.1)
- confirmed `template-load-priority` — optional `xs:int` in `<storefront>` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:227
- confirmed `Storefront::$templateLoadPriority` — defaults to 0 — vendor/shopware/core/Framework/App/Manifest/Xml/Storefront/Storefront.php:15
- confirmed `templateLoadPriority` — persisted from manifest, 0 without `<storefront>` — vendor/shopware/core/Framework/App/Lifecycle/AppManager.php:462
- confirmed `template_load_priority` — used to order app template namespaces — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:54
- confirmed `AssetService::copyAssetsFromApp()` — copies app `Resources/public` — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:100
- confirmed `Resources/app/storefront/src/scss` — style entry dir for non-theme apps — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:126
- confirmed `main.js` — JS entry, `main.ts` checked first — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:186
- unverified `6.4.8.0` — introduction versions are historical, not checkable in 6.7 code
