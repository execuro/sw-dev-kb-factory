---
id: platform/dev/6.7/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.md
title: Add possibility for plugins to add a HTML file
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.html
sourceHash: 9ffff4662c6ce0ca2129de6d86cf73805f61738a
codeCheckedAgainst: "6.7.15.1"
keywords: ["index.html", "admin extension api", "meteor admin sdk", "iframe", "plugin iframe view", "getAdminBaseUrl", "baseUrl", "injectIframe", "administration plugin", "webpack", "adr"]
summary: "ADR: a plugin can ship an index.html in its administration folder to get its own iFrame view, so plugins behave like apps in the Admin Extension API."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2021-11-23, area: administration) deciding that a plugin can add an `index.html` file to its administration folder. The admin build picks this file up automatically and serves it as a normal web application that the Administration loads in an iFrame — the same rendering model the Admin Extension API (ExtensionAPI) uses for apps.

## When to use

You maintain a plugin and want to render custom iFrame views through the Admin Extension API instead of (or in addition to) classic component overriding, or you are migrating plugin admin code toward the ExtensionAPI model.

## Key steps / config

1. Add an `index.html` file in the plugin's administration source folder (next to the usual admin entry point).
2. The admin webpack build uses this file automatically; treat it like a standalone web app that talks to the Administration through the ExtensionAPI.
3. At boot, the Administration iterates over all bundles from `Shopware.Context.app.config.bundles` and injects an iFrame for every bundle that has a `baseUrl` (`injectIframe({ ..., iframeSrc: bundle.baseUrl, ... })`).
4. In development mode the bundle's `baseUrl` is replaced with the dev server URL of the plugin's HTML entry (`entryFiles.html`) and made absolute against `window.origin`.
5. A bundle can also set its base URL in PHP by overriding `Bundle::getAdminBaseUrl()` (`Shopware\Core\Framework\Bundle`, default returns `null`).

## Essential identifiers

- `index.html` (plugin administration folder)
- `Shopware\Core\Framework\Bundle::getAdminBaseUrl()`
- `Shopware.Context.app.config.bundles`, `bundle.baseUrl`, `entryFiles.html`
- `injectIframe` / `iframeSrc`

## Gotchas

- Plugins without a resolved `baseUrl` get no iFrame — the boot loop skips them.
- Three admin extension models coexist: component overriding (plugins), the XML-based admin config of the old app system, and the iFrame-based ExtensionAPI; the ADR names the ExtensionAPI as the intended way forward.

## Code check (6.7.15.1)
- confirmed `Bundle::getAdminBaseUrl()` — base implementation returns null, documented as BaseUrl for the Admin Extension API — vendor/shopware/core/Framework/Bundle.php:129
- confirmed `entryFiles.html` — dev mode swaps bundle baseUrl for the plugin's HTML entry — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:663
- confirmed `bundle.baseUrl` — bundles without baseUrl are skipped — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:674
- confirmed `iframeSrc` — iFrame injected per bundle with its baseUrl — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:683
- unverified `index.html` — webpack pickup lives in the administration build config, outside the checked src root
