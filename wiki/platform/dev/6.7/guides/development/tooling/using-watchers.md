---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/tooling/using-watchers.md
sourceHash: a847ec74c0987c734b3e9a523792e0fce0e275c5
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/using-watchers.html
title: Hot Module Replacement
version: "6.7"
versions:
  - "6.7"
keywords: ["hot module replacement", "hmr", "watcher", "composer run watch:admin", "composer run storefront:dev-server", "composer run build:js:admin", "composer run build:js:storefront", "shopware-cli project admin-watch", "shopware-cli project storefront-watch", "APP_ENV", "IPV4FIRST", "vite dev server", "live reload"]
summary: "Build and HMR watcher commands for Administration and Storefront (composer scripts vs shopware-cli), plus APP_ENV and IPV4FIRST env vars."
lastBuilt: 2026-09-15
---
## What it is

Commands to build Administration/Storefront JS and CSS, and to start watchers with Hot Module Replacement (HMR) that reload and preview changes automatically, both for the Shopware source code (composer scripts) and the Production template (`shopware-cli`).

## When to use

During local development when rebuilding assets after every JS/SCSS change is too slow. HMR does not replace the final build: run the build commands once the feature is finished.

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

The Storefront dev server is Vite-based. The installed Storefront build README lists the overrides `STOREFRONT_VITE_PORT` (default `5175`), `STOREFRONT_VITE_HOST` (default `localhost`) and `STOREFRONT_VITE_ORIGIN`; when the dev server stops, Shopware falls back to production assets.

Environment variables are applied by prefixing the command, Unix-style, e.g. `APP_ENV=prod composer run storefront:dev-server`:

- `APP_ENV=dev`: development mode with debugging features (e.g. Symfony toolbar in the Storefront). `APP_ENV=prod`: production mode, debug tools disabled.
- `IPV4FIRST=1`: NodeJS v17.0.0+ prefers IPv6; setting this reverts to IPv4-first when IPv6 breaks the watcher.

## Essential identifiers

- `composer run watch:admin`, `composer run storefront:dev-server`
- `composer run build:js:admin`, `composer run build:js:storefront`
- `shopware-cli project admin-watch`, `shopware-cli project storefront-watch`, `shopware-cli project admin-build`, `shopware-cli project storefront-build`
- `APP_ENV`, `IPV4FIRST`
- `STOREFRONT_VITE_PORT`, `STOREFRONT_VITE_HOST`, `STOREFRONT_VITE_ORIGIN`

## Gotchas

- `IPV4FIRST` is read by the legacy Storefront webpack config (`dns.setDefaultResultOrder('ipv4first')`); the source's own env example is `APP_ENV=prod composer run watch:storefront`.
- The legacy webpack HMR (`watch:storefront`) prints a warning in 6.7.13.0 that the old HMR mode is deprecated as of Shopware v6.8.0 and asks you to switch to `composer storefront:dev-server`.

## Version notes

- Since 6.7.11.0 the Storefront watcher is `composer run storefront:dev-server`; before 6.7.11.0 it was `composer run watch:storefront`.

## Code check (6.7.13.0)
- confirmed `storefront:dev-server` — Vite dev server command recommended by the legacy watcher — vendor/shopware/storefront/Resources/app/storefront/build/start-hot-reload.js:172
- deprecated `watch:storefront` — legacy webpack HMR; warns old HMR mode is deprecated as of v6.8.0 — vendor/shopware/storefront/Resources/app/storefront/build/start-hot-reload.js:127
- confirmed `IPV4FIRST` — sets DNS result order to ipv4first in storefront webpack config — vendor/shopware/storefront/Resources/app/storefront/webpack.config.js:16
- confirmed `STOREFRONT_VITE_PORT` — default port 5175 — vendor/shopware/storefront/Resources/app/storefront/build/README.md:51
- confirmed `STOREFRONT_VITE_HOST` — default localhost — vendor/shopware/storefront/Resources/app/storefront/build/README.md:52
- unverified `watch:admin` — composer script defined in the project root composer.json, out of scope
- unverified `build:js:admin` — composer script defined in the project root composer.json, out of scope
- unverified `build:js:storefront` — composer script defined in the project root composer.json, out of scope
- unverified `shopware-cli project admin-watch` — external shopware-cli tool, out of scope
- unverified `APP_ENV` — Symfony kernel env, out of scope
