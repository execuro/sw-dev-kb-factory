---
id: platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md
title: Meteor Admin SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/meteor-admin-sdk.html
sourceHash: 4301099566f95ff3bc921b6f74fdc98066afe5a5
codeCheckedAgainst: "6.7.15.1"
keywords: ["Meteor Admin SDK", "@shopware-ag/meteor-admin-sdk", "admin extension sdk", "administration", "app", "plugin", "npm", "typescript", "notifications", "context information", "extend ui", "admin sdk"]
summary: "Meteor Admin SDK (@shopware-ag/meteor-admin-sdk): TypeScript NPM library for apps and plugins to extend the Shopware 6 Administration."
lastBuilt: 2026-10-21
---
## What it is

The Meteor Admin SDK is an NPM library for Shopware 6 apps and plugins that need to extend or customize the Administration. Its source lives in the Shopware Meteor monorepo at `https://github.com/shopware/meteor/tree/main/packages/admin-sdk`; the package name used in imports is `@shopware-ag/meteor-admin-sdk`. It contains helper functions to communicate with the Administration, execute actions, subscribe to data, and extend the user interface. The docs recommend it for writing advanced apps, because it offers more features and is more flexible.

## When to use

Use it when an app or a plugin has to interact with the Administration: throwing notifications, accessing context information, extending the current UI, executing actions or subscribing to data. Because API usage is identical for apps and plugins, the same SDK code serves both extension types.

## Key steps / config

1. Add the package `@shopware-ag/meteor-admin-sdk` to the extension's JavaScript project via NPM.
2. Import only the functionality you need; the library is tree-shakable and dependency-free, so each feature can be imported granularly to keep the bundle small.
3. Follow the getting-started guide at `https://developer.shopware.com/resources/admin-extension-sdk/getting-started/` for setup and the first extension.

Properties the source lists:

- Works with Shopware 6 apps and plugins; API usage is identical for both.
- No extensive knowledge of Administration internals is needed; the SDK hides them behind its API.
- Extension capabilities include notifications, context information and extending the current UI; the feature set is extended gradually.
- Stable API with backwards compatibility: breaking changes are meant to be the exception, so extensions built on it need less maintenance across Shopware updates.
- Written fully in TypeScript, giving type safety and autocompletion support.
- Lightweight: tree-shakable and without dependencies.

## Essential identifiers

- `@shopware-ag/meteor-admin-sdk` — NPM package name
- `https://github.com/shopware/meteor/tree/main/packages/admin-sdk` — source repository path

## Code check (6.7.15.1)
- confirmed `@shopware-ag/meteor-admin-sdk` — the Administration itself imports the package (telemetry) — vendor/shopware/administration/Resources/app/administration/src/core/service/util.service.ts:44
