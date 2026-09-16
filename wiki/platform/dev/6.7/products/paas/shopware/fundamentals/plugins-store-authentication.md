---
id: platform/dev/6.7/products/paas/shopware/fundamentals/plugins-store-authentication.md
title: Plugin Store Authentication
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/plugins-store-authentication.html
sourceHash: f06917d02479780a199c363f85edb91ff8be2366
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin store authentication", "SHOPWARE_PACKAGES_TOKEN", "COMPOSER_AUTH", "sw-paas vault create", "buildenv", "composer auth", "http-basic", "bearer", "private composer repository", "plugin store token", "paas native build"]
summary: "PaaS Native build auth for plugin stores: vault buildenv secrets SHOPWARE_PACKAGES_TOKEN (Shopware store) and COMPOSER_AUTH JSON (third-party repos)."
lastBuilt: 2026-09-15
---
## What it is

How the Shopware PaaS Native build authenticates against plugin stores. Plugins are fetched with `composer` at build time, configured through two environment variables stored as vault secrets: `SHOPWARE_PACKAGES_TOKEN` and `COMPOSER_AUTH`.

## When to use

When the build fails to download plugins from the official Shopware plugin store or from a third-party store/plugin repository.

## Key steps / config

### Shopware plugin store

`SHOPWARE_PACKAGES_TOKEN` is normally created automatically when the organization is provisioned and holds the token for the official Shopware plugin store. If it is missing, recreate it and paste the token provided by Shopware:

```sh
sw-paas vault create --type buildenv --key SHOPWARE_PACKAGES_TOKEN
```

### Third-party plugin store or repository

Create a secret named `COMPOSER_AUTH` whose content is a Composer-compatible JSON string for the store/repository:

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

- `SHOPWARE_PACKAGES_TOKEN`
- `COMPOSER_AUTH` (keys `http-basic`, `bearer`)
- `sw-paas vault create --type buildenv --key <NAME>`

## Gotchas

- Both secrets are created with `--type buildenv`; they are used by Composer during the build to fetch plugins.
- `COMPOSER_AUTH` must be a JSON string compatible with Composer, keyed by the repository host.

## Code check (6.7.13.0)
- unverified `SHOPWARE_PACKAGES_TOKEN` — consumed by Composer in the PaaS build, not read by vendor/shopware
- unverified `COMPOSER_AUTH` — Composer auth env var, out of scope of vendor/shopware
- unverified `sw-paas vault create` — sw-paas CLI, out of scope of vendor/shopware
- unverified `http-basic` — Composer auth format key, out of scope of vendor/shopware
