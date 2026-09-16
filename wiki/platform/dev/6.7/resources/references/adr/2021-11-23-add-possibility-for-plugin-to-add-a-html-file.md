---
id: platform/dev/6.7/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.md
title: Add possibility for plugins to add a HTML file
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-23-add-possibility-for-plugin-to-add-a-html-file.html
sourceHash: 9ffff4662c6ce0ca2129de6d86cf73805f61738a
codeCheckedAgainst: "6.7.13.0"
keywords: ["index.html", "plugin iframe", "extension api", "admin extension sdk", "administration", "baseUrl", "injectIframe", "plugin html file", "iframe view", "adr"]
summary: "ADR 2021-11-23: a plugin that adds an index.html to its administration folder gets it built and loaded as an iFrame view, like an app."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-11-23, area `administration`) that lets plugins behave like apps in the Administration: a plugin can ship its own iFrame view for the iFrame-based ExtensionAPI by adding an `index.html` file to its administration folder. Background: apps used an XML-based admin integration, plugins used component overriding, and the ExtensionAPI (iFrame communication) is intended to become the preferred way to build admin extensions.

## When to use

When a plugin (not an app) wants to render its own views in the Administration through the ExtensionAPI instead of, or while migrating away from, component overrides.

## Key steps / config

1. Add an `index.html` file to the plugin's administration folder (next to the admin source of the plugin).
2. The build picks this file up automatically; treat it as the entry of a normal web application that talks to the Administration via the ExtensionAPI.
3. At runtime the Administration injects the plugin bundle as an iFrame: in the installed code, `Application` iterates the bundles from the app config and, when a bundle has a `baseUrl`, calls `injectIframe()` with `iframeSrc: bundle.baseUrl`. In development mode, the `baseUrl` is replaced by the dev-server URL of the plugin's `html` entry file.

## Essential identifiers

- `index.html` (plugin administration folder)
- `bundle.baseUrl`
- `injectIframe()` in `src/core/application.ts`

## Gotchas

- The ADR says the file is used "by webpack"; the build configuration itself lives outside the checked administration `src` root, so that statement is not verified here.
- Bundles without a `baseUrl` get no iFrame injected.

## Code check (6.7.13.0)
- confirmed `bundle.baseUrl` — dev mode replaces it with the plugin's html entry file URL — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:672
- confirmed `injectIframe` — called per bundle with iframeSrc bundle.baseUrl — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:687
- confirmed `baseUrl` — bundles without it are skipped — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:683
- unverified `index.html` — build/webpack configuration is outside the three checked vendor roots
