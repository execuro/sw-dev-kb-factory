---
id: platform/dev/6.7/products/tools/cli/extension-commands/admin-watcher.md
title: Standalone Admin Watcher
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/extension-commands/admin-watcher.html
sourceHash: 9784494b64f95709fbe7dd6c1416840baa6d20fb
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli extension admin-watch", "shopware-cli project admin-watch", "--listen", "--external-url", "admin watcher", "standalone admin watcher", "administration hot reload", "watch single extension", "remote shop debugging", "proxy", "ssl"]
summary: shopware-cli extension admin-watch serves a single extension's admin JS/CSS changes on top of a built Administration, optionally against a remote shop.
lastBuilt: 2026-10-21
---
## What it is

Shopware CLI ships a Standalone Admin Watcher (`shopware-cli extension admin-watch`). It uses the regular built Administration and injects only the changed files of the watched extension(s), so it starts within milliseconds. It can target an external Shopware 6 instance to debug JavaScript or CSS changes against that instance's data. It may behave differently from the regular Admin Watcher, which is started with `shopware-cli project admin-watch`.

## When to use

When the regular Admin Watcher struggles with the number of installed extensions and you only want to watch one extension, or when you want to debug admin JS/CSS changes against a remote shop.

## Key steps / config

```bash
shopware-cli extension admin-watch <path-to-extension> <url-to-shopware>
```

- First parameter(s): path to the extension. Multiple extension paths are allowed; the **last** parameter must always be the Shopware 6 URL.
- Instead of an extension path you can pass the path of a Shopware project; the CLI then detects the extensions automatically.
- The Shopware URL must be reachable from the machine running the CLI.
- Change the listening port with `--listen :<port>`.
- Behind a proxy (for example SSL termination), set `--external-url` to the URL where the watcher is reachable in the browser.

## Essential identifiers

- `shopware-cli extension admin-watch`
- `shopware-cli project admin-watch`
- `--listen :<port>`
- `--external-url`

## Gotchas

- The standalone watcher is not identical to the regular Admin Watcher; use `shopware-cli project admin-watch` if you need the regular one.

## Code check (6.7.15.1)
- unverified `shopware-cli extension admin-watch` — command of the Go-based shopware-cli, not present in vendor/shopware core/storefront/administration
- unverified `shopware-cli project admin-watch` — shopware-cli command, out of scope
- unverified `--listen` — shopware-cli flag, out of scope
- unverified `--external-url` — shopware-cli flag, out of scope
