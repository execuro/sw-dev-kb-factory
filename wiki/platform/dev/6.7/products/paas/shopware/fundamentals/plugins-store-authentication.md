---
id: platform/dev/6.7/products/paas/shopware/fundamentals/plugins-store-authentication.md
title: Plugin Store Authentication
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/plugins-store-authentication.html
sourceHash: f06917d02479780a199c363f85edb91ff8be2366
codeCheckedAgainst: "6.7.15.1"
keywords: ["SHOPWARE_PACKAGES_TOKEN", "COMPOSER_AUTH", "sw-paas vault create", "buildenv", "http-basic", "bearer", "composer auth", "plugin store authentication", "third-party plugin repository", "build secret", "paas native", "private composer repository"]
summary: Shopware PaaS Native build auth for plugin stores via buildenv secrets SHOPWARE_PACKAGES_TOKEN and COMPOSER_AUTH (composer auth JSON).
lastBuilt: 2026-10-21
---
## What it is

How the Shopware PaaS Native build process authenticates against plugin stores (the official Shopware store and third-party stores/repositories). Plugins are fetched with `composer` at build time, configured through two environment variables stored as build secrets: `SHOPWARE_PACKAGES_TOKEN` and `COMPOSER_AUTH`.

## When to use

- The build fails to download plugins from the official Shopware plugin store because the token secret is missing.
- The project requires plugins from a third-party plugin store or a private composer repository that needs credentials.

## Key steps / config

### Shopware plugin store

During provisioning of the organization, the secret `SHOPWARE_PACKAGES_TOKEN` is normally created automatically; it holds the token for the official Shopware plugin store. If it is missing, recreate it and enter the token provided by Shopware:

```sh
sw-paas vault create --type buildenv --key SHOPWARE_PACKAGES_TOKEN
```

### Third-party plugin store

Create a secret named `COMPOSER_AUTH` whose value is the composer-compatible JSON string required by the store/repository:

```sh
sw-paas vault create --type buildenv --key COMPOSER_AUTH
```

Basic auth shape:

```json
{
  "http-basic": {
    "git.mycompany.com": { "password": "...", "username": "..." }
  }
}
```

Token shape:

```json
{
  "bearer": { "git.mycompany.com": "..." }
}
```

## Essential identifiers

- `SHOPWARE_PACKAGES_TOKEN` — build secret for the official Shopware plugin store
- `COMPOSER_AUTH` — build secret holding composer auth JSON for other stores/repositories
- `sw-paas vault create --type buildenv --key <KEY>` — creates the build-time secret
- `http-basic`, `bearer` — composer auth JSON top-level keys

## Gotchas

- Both secrets must be of type `buildenv` so they are available during the build, where composer runs.
- The `COMPOSER_AUTH` value must be a JSON string composer accepts; it is keyed by repository host.

## Code check (6.7.15.1)
- unverified `SHOPWARE_PACKAGES_TOKEN` — PaaS build environment variable, not referenced in vendor/shopware core/storefront/administration
- unverified `COMPOSER_AUTH` — composer environment variable, consumed by composer, out of scope of vendor/shopware
- unverified `sw-paas vault create` — Shopware PaaS CLI command, not part of the installed Shopware packages
