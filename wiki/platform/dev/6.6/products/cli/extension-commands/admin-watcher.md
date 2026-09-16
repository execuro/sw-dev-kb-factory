---
id: platform/dev/6.6/products/cli/extension-commands/admin-watcher.md
title: Standalone Admin Watcher
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/extension-commands/admin-watcher.html
sourceHash: 70f47a97ec75b27eb207ece7efa1625e2b6c16f9
keywords: ["shopware-cli extension admin-watch", "shopware-cli project admin-watch", "Standalone Admin Watcher", "Admin Watcher", "--listen", "--external-url", "admin build watch", "injects changed files", "proxy watcher"]
summary: shopware-cli extension admin-watch watches one extension's Administration files against an external Shopware instance, faster than the regular watcher.
lastBuilt: "2026-09-15"
---
## What it is

The Standalone Admin Watcher (`shopware-cli extension admin-watch`) watches a single extension's Administration files by using the regular built Administration and injecting only the changed files, instead of rebuilding everything.

## When to use

Use it when the regular Admin Watcher struggles with many installed extensions and only one extension needs to be watched, or to debug JavaScript/CSS changes against an external Shopware 6 instance.

## Key steps / config

```bash
shopware-cli extension admin-watch <path-to-extension> <url-to-shopware>
```

- The first parameter(s) are the path(s) to the extension(s) to watch (multiple extensions can be passed).
- The last parameter must be the URL to the Shopware 6 instance, which must be reachable from the machine running the CLI.
- A Shopware project path can be passed instead of an extension path; the CLI then auto-detects the extensions.
- Change the listening port with `--listen :<port>`.
- Behind a proxy (e.g. SSL), set `--external-url` to the URL where the Admin Watcher will be reachable in the browser.

## Essential identifiers

- `shopware-cli extension admin-watch <path...> <url>`
- `shopware-cli project admin-watch` (the regular, non-standalone Admin Watcher)
- `--listen`, `--external-url` (flags)

## Gotchas

- `shopware-cli extension admin-watch` behaves differently from the regular `shopware-cli project admin-watch`.
