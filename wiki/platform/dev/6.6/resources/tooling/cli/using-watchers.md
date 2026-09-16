---
id: platform/dev/6.6/resources/tooling/cli/using-watchers.md
sourceHash: 41c8c273fac0f338a37a816f94d641913dbe755c
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/tooling/cli/using-watchers.html
title: Hot Module Reloading using watchers
version: "6.6"
versions: ["6.6"]
docType: developer
keywords: ["hot module replacement", "HMR", "watch:admin", "watch:storefront", "build:js:admin", "build:js:storefront", "build-administration.sh", "build-storefront.sh", "watch-administration.sh", "watch-storefront.sh", "APP_ENV", "IPV4FIRST"]
summary: "How to build and watch Administration/Storefront JS and CSS using composer commands or shell scripts, plus APP_ENV and IPV4FIRST env vars."
lastBuilt: 2026-09-15
---
## What it is

Explains how to build Shopware's Administration and Storefront JavaScript/CSS, and how to use Hot Module Replacement (HMR) watchers to auto-reload changes instead of running a full build each time.

## Key steps / config

Full builds (source code checkout):
- `composer run build:js:admin` — build the Administration.
- `composer run build:js:storefront` — build the Storefront.

Full builds (Production template):
- `./bin/build-administration.sh`
- `./bin/build-storefront.sh`

Watchers, in the Shopware source code (composer commands):
- `composer run watch:admin`
- `composer run watch:storefront`

Watchers, in the Shopware Production template (shell scripts):
- `./bin/watch-administration.sh`
- `./bin/watch-storefront.sh`

Environment variables can be prefixed to these commands, e.g.:

```bash
APP_ENV=prod composer run watch:storefront
```

## Essential identifiers

`composer run build:js:admin`, `composer run build:js:storefront`, `./bin/build-administration.sh`, `./bin/build-storefront.sh`, `composer run watch:admin`, `composer run watch:storefront`, `./bin/watch-administration.sh`, `./bin/watch-storefront.sh`, `APP_ENV`, `IPV4FIRST`.

## Gotchas

Using watchers does not replace the final build process once a feature is finished. `APP_ENV=dev` runs Shopware in development mode (enables debugging features such as the Symfony toolbar in the Storefront), while `APP_ENV=prod` disables such tooling. Since NodeJS v17.0.0, IPv6 is preferred over IPv4, which can cause problems with watchers in some setups; setting `IPV4FIRST=1` reverts that preference.
