---
id: "platform/dev/6.6/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.md"
title: "Add possibility for plugins to add a HTML file"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.html"
sourceHash: "9ffff4662c6ce0ca2129de6d86cf73805f61738a"
keywords: ["ExtensionAPI", "iFrame", "index.html", "App system", "webpack", "admin extension", "plugin architecture", "component overriding", "administration folder"]
summary: "ADR: plugins can add an index.html file to their administration folder for an iFrame-based admin view, ahead of the full ExtensionAPI."
lastBuilt: "2026-09-15"
---
## What it is

This ADR adds support for plugins to ship a standalone `index.html` file in the administration, so plugin-based admin extensions can behave like Apps ahead of the full ExtensionAPI being introduced.

## When to use

Relevant when a plugin needs to render its own iFrame-based admin view instead of extending existing admin components, as a stepping stone toward the iFrame-communication-based ExtensionAPI.

## Key steps / config

- Context: three admin extension mechanisms are in play. The forthcoming ExtensionAPI is based on an iFrame communication architecture. The existing App system for the admin relies on an XML file. The normal plugin architecture in the admin is based on component overriding — the ExtensionAPI is intended to become the ideal way to build admin extensions once available.
- Decision: a plugin developer adds an `index.html` file to the plugin's administration folder.
- This file is automatically picked up and used by webpack and can be used like a normal web application, giving the plugin its own iFrame view inside the administration — mirroring how Apps already behave via their XML-driven iFrame views.
- This gives plugin developers a smooth transition path to the eventual ExtensionAPI, since they can already adopt an iFrame-based view pattern before ExtensionAPI itself ships.

## Essential identifiers

- `index.html` (plugin administration folder)

## Gotchas

This mechanism is a transitional solution for plugin developers ahead of the full ExtensionAPI; the ideal long-term way to build admin extensions remains the ExtensionAPI once it is available, not permanent reliance on a plugin-supplied `index.html`.
