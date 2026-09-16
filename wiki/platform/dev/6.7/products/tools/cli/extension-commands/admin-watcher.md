---
id: platform/dev/6.7/products/tools/cli/extension-commands/admin-watcher.md
title: Standalone Admin Watcher
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/extension-commands/admin-watcher.html
sourceHash: 9784494b64f95709fbe7dd6c1416840baa6d20fb
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli extension admin-watch", "shopware-cli project admin-watch", "--listen", "--external-url", "admin watcher", "standalone admin watcher", "administration hot reload", "watch extension", "shopware-cli", "proxy"]
summary: "shopware-cli extension admin-watch: standalone Administration watcher for one or more extensions against a Shopware URL; --listen, --external-url."
lastBuilt: 2026-09-15
---
## What it is

`shopware-cli extension admin-watch` is a standalone Administration watcher built into Shopware CLI. It uses the regular built Administration and injects only the changed files of the watched extension, so it starts within milliseconds. It can also target an external Shopware 6 instance to debug JavaScript or CSS changes against that instance's data.

## When to use

- The regular Admin Watcher struggles with the number of installed extensions and you only want to watch a single extension.
- You want to debug Administration JS/CSS of an extension against a remote Shopware 6 instance.
- For the regular (full) Admin Watcher use `shopware-cli project admin-watch` instead.

## Key steps / config

```bash
shopware-cli extension admin-watch <path-to-extension> <url-to-shopware>
```

- First argument(s): path to the extension to watch. Several extension paths may be given; the **last** argument is always the Shopware 6 URL.
- Instead of an extension path, a Shopware project path can be passed; the CLI then detects the extensions automatically.
- The URL must be reachable from the machine running the CLI.
- Change the listening port with `--listen :<port>`.
- Behind a proxy (e.g. SSL termination), set `--external-url` to the URL under which the watcher is reachable in the browser.

## Essential identifiers

- `shopware-cli extension admin-watch`
- `shopware-cli project admin-watch`
- `--listen :<port>`
- `--external-url`

## Gotchas

- `extension admin-watch` can behave differently from the regular Admin Watcher (`project admin-watch`).

## Code check (6.7.13.0)
- unverified `shopware-cli extension admin-watch` — implemented in the standalone shopware-cli tool, out of scope
- unverified `shopware-cli project admin-watch` — shopware-cli, out of scope
- unverified `--listen` — shopware-cli option, out of scope
- unverified `--external-url` — shopware-cli option, out of scope
