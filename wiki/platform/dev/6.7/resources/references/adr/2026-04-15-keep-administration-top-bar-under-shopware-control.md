---
id: platform/dev/6.7/resources/references/adr/2026-04-15-keep-administration-top-bar-under-shopware-control.md
title: Keep the Administration top bar under Shopware control
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-04-15-keep-administration-top-bar-under-shopware-control.html
sourceHash: 3c12100ccc013c79ac3f4b1e930075145d1892eb
codeCheckedAgainst: "6.7.13.0"
keywords: ["displaySearchBar", "administration top bar", "search bar", "meteor admin sdk", "extension sdk module", "mainModuleAdd", "sw-extension-sdk-module", "ui shell", "page chrome", "full-screen mode", "extensionSdkModules"]
summary: "ADR: extensions may no longer hide the Administration top/search bar via displaySearchBar; option to be deprecated and removed in the next major."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2026-04-15) declaring the Administration top bar (search bar) part of the minimal, stable Administration shell that stays under Shopware control. Extension module pages registered through the Meteor Admin SDK may no longer hide it via `displaySearchBar`.

## When to use

- You build an app or plugin that registers a module page through the Meteor Admin SDK and currently sets `displaySearchBar` to `false`.
- You plan an immersive or chrome-less extension UI and need to know what layout control is supported.

## Key steps / config

- The top bar holds global controls other extensions and the Administration depend on: the Administration search, extension entry points rendered in the top bar, notifications and help center entry points, and the button that opens the navigation sidebar on small viewports.
- Decision: hiding the top/search bar through the extension API is deprecated for the next major release and removed in that release. Migrate extension modules away from `displaySearchBar: false` before removal.
- In 6.7.13.0 the option is still honoured: the `mainModuleAdd` handler stores `displaySearchBar` (default `true`) in the `extensionSdkModules` store, and the `sw-extension-sdk-module` page reads it in its `showSearchBar` computed property.
- Separate layout-parity work for extension modules may continue, but must exclude hiding the top/search bar.
- Immersive experiences, if ever supported, require an explicit Shopware-controlled full-screen mode decided in a separate ADR.

## Essential identifiers

- `displaySearchBar` (Meteor Admin SDK module option)
- `mainModuleAdd` (Extension API handler)
- `sw-extension-sdk-module` page component, `showSearchBar` computed
- `extensionSdkModules` store

## Gotchas

- Public extension examples and documentation should stop encouraging top/search bar hiding.
- No deprecation annotation for `displaySearchBar` exists yet in the installed Administration source; the removal is announced by this ADR only.

## Code check (6.7.13.0)
- confirmed `displaySearchBar` — `mainModuleAdd` handler defaults it to `true`; no `@deprecated` marker in administration src — vendor/shopware/administration/Resources/app/administration/src/app/init/main-module.init.ts:22
- confirmed `showSearchBar` — SDK module page reads `module.displaySearchBar ?? true` — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension-sdk/page/sw-extension-sdk-module/index.js:43
- confirmed `mainModuleAdd` — Extension API handler registering SDK modules — vendor/shopware/administration/Resources/app/administration/src/app/init/main-module.init.ts:7
- confirmed `extensionSdkModules` — store the handler adds the module to — vendor/shopware/administration/Resources/app/administration/src/app/init/main-module.init.ts:18
