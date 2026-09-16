---
id: platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md
title: Meteor Admin SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/meteor-admin-sdk.html
sourceHash: 4301099566f95ff3bc921b6f74fdc98066afe5a5
codeCheckedAgainst: "6.7.13.0"
keywords: ["@shopware-ag/meteor-admin-sdk", "meteor admin sdk", "admin extension sdk", "Shopware.ExtensionAPI", "administration extension", "app administration", "plugin administration", "npm library", "typescript sdk", "iframe messaging", "notificationDispatch", "MissingPrivilegesError"]
summary: "Meteor Admin SDK is the NPM/TypeScript library apps and plugins use to extend the Shopware 6 Administration (notifications, context, data, UI)."
lastBuilt: 2026-09-15
---
## What it is

The Meteor Admin SDK (source: https://github.com/shopware/meteor/tree/main/packages/admin-sdk, npm package `@shopware-ag/meteor-admin-sdk`) is an NPM library for Shopware 6 apps and plugins to extend or customize the Administration. It provides helper functions to communicate with the Administration, execute actions, subscribe to data and extend the user interface.

## When to use

Recommended for advanced apps instead of manifest-only Administration extensions, and usable from plugins as well; the API usage is identical for apps and plugins. Getting started: https://developer.shopware.com/resources/admin-extension-sdk/getting-started/

## Key steps / config

- Add the npm package `@shopware-ag/meteor-admin-sdk` to the app/plugin frontend and import only the functionality you need — the library is tree-shakable and dependency-free, so granular imports keep the bundle small.
- Capabilities named by the source: dispatching notifications, reading context information, extending the current UI; the feature set is extended over time.
- The SDK is written in TypeScript, so typings are available for autocompletion and type safety.
- Administration side (installed code): each SDK message type is answered by a handler registered through `Shopware.ExtensionAPI.handle(<type>, handler)`, e.g. `notificationDispatch`, `contextCurrency`, `actionButtonAdd`. The wrapper checks any `privileges` sent with a message against the ACL service before running the handler.

## Essential identifiers

- `@shopware-ag/meteor-admin-sdk`
- `Shopware.ExtensionAPI` (`handle`, `publishData`, `getPublishedDataSets`)
- Message types: `notificationDispatch`, `contextCurrency`, `actionButtonAdd`

## Gotchas

- A message requesting privileges the current Administration user lacks is rejected with `MissingPrivilegesError` instead of reaching the handler.
- The source states breaking changes in the SDK are intended to be the exception, so extensions built on it should need less maintenance across Shopware updates.

## Code check (6.7.13.0)
- confirmed `ExtensionAPI` — Administration global wraps the SDK message channel — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:241
- confirmed `@shopware-ag/meteor-admin-sdk/es/channel` — handle() wraps SDK handler with ACL privilege check — vendor/shopware/administration/Resources/app/administration/src/core/extension-api.ts:8
- confirmed `MissingPrivilegesError` — rejected when ACL privileges are missing — vendor/shopware/administration/Resources/app/administration/src/core/extension-api.ts:41
- confirmed `publishData` — exported alongside handle — vendor/shopware/administration/Resources/app/administration/src/core/extension-api.ts:56
- confirmed `notificationDispatch` — Administration handles SDK notification messages — vendor/shopware/administration/Resources/app/administration/src/app/init/notification.init.ts:10
- confirmed `contextCurrency` — Administration answers SDK context requests — vendor/shopware/administration/Resources/app/administration/src/app/init/context.init.ts:13
- confirmed `actionButtonAdd` — Administration handles SDK UI extension for action buttons — vendor/shopware/administration/Resources/app/administration/src/app/init/action-button.init.ts:10
- unverified `@shopware-ag/meteor-admin-sdk` — npm package source itself is outside the checked roots
