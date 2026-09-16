---
id: platform/dev/6.6/guides/plugins/apps/administration/meteor-admin-sdk.md
title: Meteor Admin SDK
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/administration/meteor-admin-sdk.html
sourceHash: 040d33e34f4a9ec9e68866e52c282a8fc7dd4b8c
keywords: ["Meteor Admin SDK", "admin-sdk", "NPM library", "Administration", "apps", "plugins", "extend UI", "notifications", "context information", "TypeScript", "tree-shakable", "installation"]
summary: "Meteor Admin SDK is an NPM library shared by Shopware apps and plugins to extend or customize the Administration UI."
lastBuilt: "2026-09-15"
---
## What it is

The Meteor Admin SDK is an NPM library for Shopware 6 apps and plugins that need a way to extend or customize the Administration. It is hosted in the `shopware/meteor` repository, under the `packages/admin-sdk` package. It is recommended for writing advanced apps because it contains helper functions to communicate with the Administration, execute actions, subscribe to data, or extend the user interface.

## When to use

Use it whenever an app or plugin needs to interact with the Administration beyond basic manifest configuration — for example, subscribing to data changes, throwing notifications, accessing context information, or extending the current UI.

## Key steps / config

The SDK is shared between apps and plugins with identical API usage, so the same code works for both extension types. Its documented characteristics are:

- Works with both Shopware 6 apps and plugins, using the same API for either.
- Shallow learning curve: no extensive knowledge of the Administration internals is required.
- Many extension capabilities: throwing notifications, accessing context information, and extending the current UI, with the feature set growing gradually over time.
- A stable API with strong backwards compatibility, so apps and plugins built on it stay stable across Shopware updates without frequent maintenance.
- Written entirely in TypeScript, providing autocompletion support and type safety.
- Lightweight and fully tree-shakable: every functionality can be imported granularly to keep the bundle small.

## Essential identifiers

- Meteor Admin SDK (`admin-sdk`)
- `shopware/meteor` repository, `packages/admin-sdk`
- Administration
- Shopware 6 apps and plugins
