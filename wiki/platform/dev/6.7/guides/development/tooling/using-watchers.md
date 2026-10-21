---
id: platform/dev/6.7/guides/development/tooling/using-watchers.md
title: Hot Module Replacement
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/using-watchers.html
sourceHash: a847ec74c0987c734b3e9a523792e0fce0e275c5
codeCheckedAgainst: "6.7.15.1"
keywords: ["hot module replacement", "hmr", "watcher", "watch:admin", "storefront:dev-server", "watch:storefront", "build:js:admin", "build:js:storefront", "shopware-cli project admin-watch", "shopware-cli project storefront-watch", "APP_ENV", "IPV4FIRST", "live reload"]
summary: "Admin/Storefront build and HMR watcher commands (composer, shopware-cli); storefront:dev-server since 6.7.11.0; APP_ENV and IPV4FIRST."
lastBuilt: 2026-10-21
---
## What it is

The commands that build Administration and Storefront JavaScript/CSS, and the watcher commands that enable Hot Module Replacement (HMR) so changes reload automatically during development — for both the Shopware source code (composer scripts) and the production template (`shopware-cli`).

## When to use

When JS/CSS changes in the Administration or Storefront need to be visible without rerunning a full build each time, or when you need the one-off build commands.

## Key steps / config

Full builds:

| Target | Source code | Production template |
|---|---|---|
| Administration | `composer run build:js:admin` | `shopware-cli project admin-build` |
| Storefront | `composer run build:js:storefront` | `shopware-cli project storefront-build` |

Watchers (HMR):

| Target | Source code | Production template |
|---|---|---|
| Administration | `composer run watch:admin` | `shopware-cli project admin-watch` |
| Storefront | `composer run storefront:dev-server` (since 6.7.11.0) | `shopware-cli project storefront-watch` |

Environment variables can be prefixed to the command, Unix-style:

```bash
APP_ENV=prod composer run watch:storefront
```

- `APP_ENV=dev` — development mode with debugging features (e.g. the Symfony toolbar in the Storefront); `APP_ENV=prod` disables them.
- `IPV4FIRST=1` — NodeJS v17.0.0+ prefers IPv6, which can break watchers in some setups; this reverts to IPv4-first. In the installed code the Storefront webpack config reads it and calls `dns.setDefaultResultOrder('ipv4first')`.

## Essential identifiers

- `composer run build:js:admin`, `composer run build:js:storefront`
- `composer run watch:admin`, `composer run storefront:dev-server`
- `shopware-cli project admin-build`, `shopware-cli project storefront-build`
- `shopware-cli project admin-watch`, `shopware-cli project storefront-watch`
- `APP_ENV`, `IPV4FIRST`

## Gotchas

- Watchers do not replace the final build; run the build commands when the feature is finished.
- The installed `IPV4FIRST` handling sits in the Storefront's webpack config, i.e. the old `watch:storefront` path; no reference to it was found in the Administration sources.

## Version notes

- Since 6.7.11.0 the Storefront watcher in the source code is `composer run storefront:dev-server` (Vite dev server); before that it was `composer run watch:storefront`. In 6.7.15.1 the old hot-reload script still runs but prints a warning that old HMR mode is deprecated as of v6.8.0 and to switch to `composer storefront:dev-server`.

## Code check (6.7.15.1)
- confirmed `storefront:dev-server` — recommended replacement printed by the old hot-reload script — vendor/shopware/storefront/Resources/app/storefront/build/start-hot-reload.js:173
- confirmed `watch:storefront` — still shipped as the webpack/proxy live-reload command; old HMR mode warns it is deprecated as of v6.8.0 — vendor/shopware/storefront/README.md:18
- confirmed `IPV4FIRST` — switches Node DNS order to ipv4first — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:16
- unverified `watch:admin` — composer script defined in the root composer.json, outside the code roots
- unverified `build:js:admin` — composer script in root composer.json, out of scope
- unverified `shopware-cli project storefront-watch` — shopware-cli subcommand, out of scope
- unverified `APP_ENV` — kernel environment handling, not checked in the code roots
