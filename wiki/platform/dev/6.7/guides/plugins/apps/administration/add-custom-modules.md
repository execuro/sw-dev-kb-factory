---
id: platform/dev/6.7/guides/plugins/apps/administration/add-custom-modules.md
title: Add Custom Module
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/add-custom-modules.html
sourceHash: 26b99f6feb733e63d25f8e5e07dc09d3522b963e
codeCheckedAgainst: "6.7.15.1"
keywords: ["module", "main-module", "manifest.xml", "custom admin module", "iframe module", "sw-app-loaded", "app-<appName>-<moduleName>", "shopware-shop-signature", "admin menu entry", "parent navigation id", "sw-version", "ModuleAction"]
summary: App manifest <module> and <main-module> elements that embed iframe pages in the Administration, signed query params, and the sw-app-loaded handshake.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md"]
---
## What it is

Apps add their own Administration pages by declaring `<module>` elements (with a menu entry) and an optional `<main-module>` in the `<admin>` section of `manifest.xml`. Each module is an iframe that loads the app server URL given in `source`. For advanced apps the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) is recommended.

## When to use

An app needs its own page, menu entry or grouped menu structure in the Administration, or a main page opened from the installed-apps list / app detail page.

## Key steps / config

1. Declare modules in `manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`):

```xml
<admin>
    <module name="exampleModule"
            source="https://example.com/promotion/view/promotion-module"
            parent="sw-marketing"
            position="50">
        <label>Example module</label>
        <label lang="de-DE">Beispiel Modul</label>
    </module>
    <main-module source="https://example.com/main"/>
</admin>
```

   - `name` (required): technical name of the module.
   - `parent` (required by the schema): Administration navigation id of the parent menu item, e.g. `sw-marketing`, `sw-catalogue`.
   - `source` (optional): app endpoint serving the iframe; may be omitted for a module that only acts as a parent menu item.
   - `position` (optional, default `0`): order among siblings.
   - At least one `<label>`; `lang` for translations.
   - `<main-module>`: at most one; its only attribute `source` is required.

2. Verify the incoming request. Shopware appends `shop-id`, `shop-url`, `timestamp` and `shopware-shop-signature` (SHA256 HMAC of the rest of the query string, signed with the shop secret from [registration](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md)); the installed code also adds `sw-version`, `app-version`, `sw-context-language`, `sw-user-language` among others. App PHP SDK: `ContextResolver::assembleModule()`; Symfony bundle injects `Shopware\App\SDK\Context\Module\ModuleAction`.

3. Leave the loading state once the page is ready:

```javascript
window.parent.postMessage('sw-app-loaded', '*');
```

   Without it the spinner stays; after 5 seconds the module is marked timed out.

4. Nest modules (third menu level): every module gets the navigation id `app-<appName>-<moduleName>`, usable as `parent` of another module, e.g. `parent="app-myApp-myModules"`.

## Essential identifiers

- `<module>` attributes `name`, `parent`, `source`, `position`; `<label lang="...">`
- `<main-module source="..."/>`
- Navigation id pattern `app-<appName>-<moduleName>`
- `postMessage` string `sw-app-loaded`
- Query params `shop-id`, `shop-url`, `timestamp`, `shopware-shop-signature`, `sw-version`

## Gotchas

- The source page lists `parent` once as required and once as optional ("listed under My apps if omitted"); the installed 6.7 schema requires it.
- Main modules are not compatible with themes; themes always open the theme config.
- Iframe content cannot use Administration CSS/JS directly; load the compiled stylesheets for the given `sw-version` from `Resources/public/static` in the tagged `shopware/administration` release.

## Version notes

- 6.4.0.0 added the third menu level (module nesting) and `<main-module>`.

## Code check (6.7.15.1)
- corrected `parent` — docs: optional, falls back to "My apps"; schema has `use="required"` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:270
- confirmed `name` — module attribute required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:269
- confirmed `source` — optional module attribute — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:268
- confirmed `position` — default 0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:271
- confirmed `main-module` — maxOccurs 1, `source` required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:221
- confirmed `sw-app-loaded` — message the module page waits for — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension/page/sw-extension-app-module-page/index.ts:137
- confirmed `appLoaded` — 5000 ms timeout before timedOut — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension/page/sw-extension-app-module-page/index.ts:161
- confirmed `app-${app.name}-${appModule.name}` — navigation id pattern — vendor/shopware/administration/Resources/app/administration/src/app/service/menu.service.js:49
- confirmed `shopware-shop-signature` — added to signed query with shop-id, shop-url, timestamp, sw-version — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:55
- unverified `ModuleAction` — App PHP SDK class, outside the installed Shopware packages
