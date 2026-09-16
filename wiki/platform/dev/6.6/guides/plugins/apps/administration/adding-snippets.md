---
id: platform/dev/6.6/guides/plugins/apps/administration/adding-snippets.md
title: Add translations for apps
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/administration/adding-snippets.html
sourceHash: 860a60d05602b9fdf9219107a692c4032b26da4c
keywords: ["snippets", "translations", "administration", "apps", "plugins", "de-DE.json", "en-GB.json", "snippet directory", "language locale", "override"]
summary: "Apps add administration translation snippets as JSON files per locale but cannot override existing plugin snippet keys."
lastBuilt: "2026-09-15"
---
## What it is

Adding translation snippets to the administration for apps works the same way as for plugins, except apps use a different directory and are not allowed to override existing snippet keys.

## When to use

Use this when you need to add or translate administration UI strings shipped with an app.

## Key steps / config

Create new snippet files in `<app root>/Resources/app/administration/snippet`. Provide one JSON file per supported language, named with its specific language locale, e.g. `de-DE.json`, `en-GB.json`. Apps may only add new snippet keys — they cannot override existing ones. Aside from that restriction and the file location, snippet content works exactly as it does for plugins.

## Essential identifiers

- `<app root>/Resources/app/administration/snippet`
- `de-DE.json`
- `en-GB.json`

## Gotchas

Unlike plugins, apps cannot override existing administration snippet keys — only add new ones.
