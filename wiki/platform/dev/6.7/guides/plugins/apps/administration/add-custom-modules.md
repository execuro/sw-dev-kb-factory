---
id: platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md
title: Add Custom Module
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/add-custom-modules.html
sourceHash: c3d778adfd7bc060593a584af749edd10cfae69a
codeCheckedAgainst: "6.7.13.0"
keywords: ["module", "main-module", "manifest.xml", "sw-app-loaded", "shopware-shop-signature", "app-<appName>-<moduleName>", "parent", "admin menu", "iframe module", "custom module", "navigation id", "sw-version"]
summary: Add iframe-based Administration modules and a main module from an app manifest; attributes, signed query params, sw-app-loaded message, menu nesting.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md"]
---
## What it is

How an app adds its own Administration modules via `<module>` and `<main-module>` elements in the `<admin>` section of `manifest.xml`. Each module is an iframe loading a page from the app server. For advanced UIs the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) is recommended.

## When to use

An app needs its own page in the Administration menu, a grouping menu entry for several app modules, or a main module opened from the installed-apps list / app detail page.

## Key steps / config

1. Add `<module>` elements (any number) to `<admin>` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`, see [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md)):

```xml
<admin>
    <module name="myModules" source="https://example.com/promotion/view/promotion-module"
            parent="sw-catalogue" position="50">
        <label>My apps modules</label>
        <label lang="de-DE">Module meiner app</label>
    </module>
    <module name="someModule" source="..." parent="app-myApp-myModules" position="1">
        <label>...</label>
    </module>
    <main-module source="https://example.com/main"/>
</admin>
```

Attributes:
- `name` (required): technical module name.
- `parent` (required by the schema): Administration navigation id of the parent menu item, e.g. `sw-marketing`, `sw-catalogue`.
- `source` (optional): URL the iframe loads; omit for a pure parent menu entry.
- `position` (optional, integer, schema default `0`): order among siblings.
- `<label>` children, translatable with `lang`.

2. Nesting: every app module gets the navigation id `app-<appName>-<moduleName>`; use it as another module's `parent` (third menu level, since 6.4.0.0).
3. Main module: `<main-module source="..."/>` (only `source`, required; at most one). Can share a URL with a menu module.
4. Request handling: the iframe URL gets query parameters `shop-id`, `shop-url`, `timestamp`, `sw-version`, plus `shopware-shop-signature` — SHA256 HMAC of the rest of the query string signed with the shop secret from [registration](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md). Verify it before serving content. App PHP SDK: `ContextResolver::assembleModule()`; Symfony bundle: `Shopware\App\SDK\Context\Module\ModuleAction`.
5. Leave the loading state once the page is ready:

```javascript
window.parent.postMessage('sw-app-loaded', '*');
```

## Essential identifiers

- `<module>` attributes `name`, `parent`, `source`, `position`; `<main-module source>`
- Navigation id pattern `app-<appName>-<moduleName>`
- Message `sw-app-loaded`
- Query params `shop-id`, `shop-url`, `timestamp`, `sw-version`, `shopware-shop-signature`

## Gotchas

- The source page lists `parent` both as required and as optional (falling back to "My apps"); the installed schema declares it `use="required"`.
- If `sw-app-loaded` is not received within 5 seconds, the module view is marked timed out.
- Main modules are not compatible with themes; they always open the theme config.
- The iframe cannot use Administration CSS/JS; use `sw-version` to pick matching stylesheets from the `shopware/administration` package's `Resources/public/static` folder.
- Signed URLs additionally carry `app-version`, `in-app-purchases`, `sw-context-language`, `sw-user-language` and `sw-user-id`.

## Code check (6.7.13.0)
- corrected `parent` — docs also call it optional; XSD marks module parent required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:259
- confirmed `source` — optional module attribute — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:257
- confirmed `position` — integer, default 0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:260
- confirmed `main-module` — maxOccurs 1, `source` required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:263
- confirmed `app-${app.name}-${appModule.name}` — navigation id pattern — vendor/shopware/administration/Resources/app/administration/src/app/service/menu.service.js:49
- confirmed `sw-app-loaded` — loaded message expected from iframe — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension/page/sw-extension-app-module-page/index.ts:141
- confirmed `5000` — loading times out after 5 seconds — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension/page/sw-extension-app-module-page/index.ts:165
- confirmed `shopware-shop-signature` — HMAC of query string appended to signed URI — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:55
- confirmed `sw-version` — added to signed module query — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:45
- unverified `ModuleAction` — App PHP SDK / Symfony bundle, out of scope
