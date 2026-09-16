---
id: platform/dev/6.7/guides/plugins/apps/storefront/_index.md
title: Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/
sourceHash: 6e94b1aab26911e84b03ee0fa2d8abee168c9b65
codeCheckedAgainst: "6.7.13.0"
keywords: ["template-load-priority", "Resources/views/storefront", "Resources/public", "main.js", "base.scss", "manifest.xml", "app storefront", "storefront customization", "app templates", "app assets", "template priority", "app javascript"]
summary: "App Storefront customization: Resources folder layout for twig/js/scss, public assets (6.4.8.0+), and manifest template-load-priority (6.4.12.0+, default 0)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md", "platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md"]
---
## What it is

Overview of how an app changes the Storefront: [customizing templates](platform/dev/6.7/guides/plugins/apps/storefront/customize-templates.md), [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) and [custom styling](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-styling.md). The Shopware server builds the Storefront, so no external app server is needed — the `.html.twig`, `.js` and `.scss` files ship inside the app's `Resources` folder.

## When to use

When an app needs to alter Storefront templates, scripts, styles or ship static assets, or needs its templates to load before/after other extensions.

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

   The Storefront JS entry is `Resources/app/storefront/src/main.ts` or, if absent, `main.js`. Styles are picked up from `Resources/app/storefront/src/scss`. App templates are read from `Resources/views` (`*.twig` under `storefront`, `documents`, `components`, `files`).
2. Custom assets (since 6.4.8.0): put fonts etc. into `Resources/public`; they are copied into the [asset system](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-custom-assets.md).
3. Template priority (since 6.4.12.0): set `template-load-priority` (integer) in `manifest.xml`. Default `0`; per the docs, positive values load your templates earlier, negative values later.

```xml
<manifest xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd">
    <meta>...</meta>
    <storefront>
        <template-load-priority>100</template-load-priority>
    </storefront>
</manifest>
```

## Essential identifiers

- `<storefront>` / `template-load-priority` (manifest)
- `Resources/views/storefront`, `Resources/app/storefront/src/main.js`, `Resources/app/storefront/src/scss/base.scss`, `Resources/public`

## Gotchas

- App templates only take part in the Twig namespace hierarchy while the app and its templates are active.
- The app's `template-load-priority` is sorted together with plugin/bundle template priorities; the exact before/after direction was not traced in code beyond the docs' statement.

## Version notes

- Custom assets in apps: Shopware 6.4.8.0+.
- `template-load-priority`: Shopware 6.4.12.0+.

## Code check (6.7.13.0)
- confirmed `template-load-priority` — optional `xs:int` in `<storefront>` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:216
- confirmed `templateLoadPriority` — defaults to 0 — vendor/shopware/core/Framework/App/AppDefinition.php:82
- confirmed `template_load_priority` — merged and sorted with bundle priorities — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:54
- confirmed `app_template` — only active apps/templates included — vendor/shopware/core/Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:81
- confirmed `TemplateLoader::TEMPLATE_DIR` — `/Resources/views`, dirs storefront/documents/components/files — vendor/shopware/core/Framework/App/Template/TemplateLoader.php:17
- confirmed `main.js` — entry file, `main.ts` checked first — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:186
- confirmed `scss` — styles read from `Resources/app/storefront/src/scss` — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:126
- confirmed `AssetService::copyAssetsFromApp()` — copies app `Resources/public` — vendor/shopware/core/Framework/Plugin/Util/AssetService.php:101
