---
id: platform/dev/6.7/resources/references/adr/2026-04-15-keep-administration-top-bar-under-shopware-control.md
title: Keep the Administration top bar under Shopware control
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-15-keep-administration-top-bar-under-shopware-control.html
sourceHash: 3c12100ccc013c79ac3f4b1e930075145d1892eb
codeCheckedAgainst: "6.7.15.1"
keywords: ["displaySearchBar", "Meteor Admin SDK", "admin sdk module", "sw-extension-sdk-module", "showSearchBar", "sw-page", "top bar", "search bar", "administration shell", "full-screen mode", "extension module page", "hide search bar"]
summary: "ADR: extensions may no longer hide the Administration top/search bar via the Admin SDK displaySearchBar option; deprecated for removal in the next major."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-04-15, area administration) stating that the Administration top/search bar is part of the minimal, stable UI shell and stays under Shopware control. Extensions may no longer hide it; the existing Meteor Admin SDK capability to do so (`displaySearchBar` on SDK-registered module pages) is deprecated for the next major release and removed in it.

## When to use

- Building an app or plugin that registers a module page through the Meteor Admin SDK and currently hides the top/search bar.
- Planning layout work for extension module pages and needing to know which shell elements are off-limits.
- Evaluating immersive or chrome-less experiences inside the Administration.

## Key steps / config

Context given by the ADR: alongside the navigation sidebar, the top bar is one of the few shell elements relevant across modules and viewport sizes. The page head area holds globally relevant controls:

- the Administration search
- extension entry points rendered in the top bar
- notifications and help center entry points
- the button that opens the navigation sidebar on smaller viewports

If one extension removes these via `displaySearchBar`, it removes capabilities other extensions and the Administration rely on: Shopware loses control of parts that must stay available, other extensions' top-bar integrations stop being discoverable, and small-screen navigation is no longer guaranteed.

Decision and required migration:

1. Do not hide the top/search bar from an extension module page; plan to stop passing `displaySearchBar: false` before its removal.
2. SDK layout-parity work must exclude top/search-bar hiding from the supported layout controls. Further layout parity with first-party modules may be explored separately.
3. Public examples and documentation should stop encouraging hiding the bar.
4. Any immersive/chrome-less need must go through an explicit Shopware-controlled full-screen mode, which requires separate discovery and its own ADR; this ADR defines no such API.

How the option is wired in the installed 6.7.15.1 Administration: the extension SDK module store keeps `displaySearchBar` per module; `main-module.init.ts` defaults it to `true`; the `sw-extension-sdk-module` page maps it to its `showSearchBar` computed (default `true`), which is passed to `sw-page` as `show-search-bar`.

## Essential identifiers

- `displaySearchBar` (Admin SDK module option)
- `sw-extension-sdk-module` page, `showSearchBar` computed
- `sw-page` prop `showSearchBar`
- `displaySmartBar` (separate SDK option, not covered by this ADR)

## Gotchas

- In 6.7.15.1 `displaySearchBar` still works and the Administration source carries no deprecation marker for it; the deprecation announced by the ADR is not yet visible in the code.
- The ADR only covers the top/search bar. It does not restrict `displaySmartBar` or other layout controls.

## Code check (6.7.15.1)
- confirmed `displaySearchBar` — stored per SDK module, no deprecation marker — vendor/shopware/administration/Resources/app/administration/src/app/store/extension-sdk-module.store.ts:13
- confirmed `displaySearchBar` — defaults to true on main module registration — vendor/shopware/administration/Resources/app/administration/src/app/init/main-module.init.ts:22
- confirmed `showSearchBar` — SDK module page reads module.displaySearchBar — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension-sdk/page/sw-extension-sdk-module/index.js:42
- confirmed `displaySmartBar` — separate option on the same page — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension-sdk/page/sw-extension-sdk-module/index.js:47
- confirmed `showSearchBar` — sw-page prop controlling the search bar — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-page/index.js:65
