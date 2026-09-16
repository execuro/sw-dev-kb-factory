---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware-paas/build-deploy.md
sourceHash: c1a7045e6b47f145d9f1bb4a064bf8f6f260fb1a
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/build-deploy.html
title: Build & Deploy
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware paas", "build hook", "deploy hook", "git push", "install.lock", "COMPOSER_AUTH", "REBUILD_DATE", "shopware variable:create", "shopware variable:update", "ComposerPluginLoader", "auth.json", "rebuild", "deployment"]
summary: "Shopware PaaS build/deploy: git push to shopware remote, install.lock first install, COMPOSER_AUTH project variable, REBUILD_DATE forced rebuilds."
lastBuilt: 2026-09-15
---
## What it is

How code reaches a Shopware PaaS environment. The PaaS project is a git repository: every push builds a new version of the store from source and deploys it. Environments (dev previews, staging, production) map to branches.

## When to use

After the repository/setup template is in place and you want to deploy changes, provide Composer credentials for Shopware Store extensions, or force a rebuild without code changes.

## Key steps / config

**Push and deploy** (the `shopware` remote points to the PaaS environment):

```bash
git add .
git commit -m "Applied new configuration"
git push -u shopware main
```

A push triggers:

| Build | Deploy |
|---|---|
| Configuration validation | Hold app requests |
| Build container image | Unmount live containers |
| Installing dependencies | Mount file systems |
| Run build hook | Run deploy hook |
| Building app image | Serve requests |

The deployed store URL is shown at the end of the deployment log.

**First deployment**: Shopware's CLI installer runs once and initialises Shopware; it does not run again while `install.lock` exists. It creates an administrator with username `admin` and password `shopware` — change it immediately.

**Composer authentication** — store the content of `auth.json` as a sensitive, build-visible project variable instead of committing the file:

```bash
shopware variable:create --level project --name env:COMPOSER_AUTH --json true --visible-runtime false --sensitive true --visible-build true --value '{"bearer": {"packages.shopware.com": "%place your key here%"}}'
```

Replace `%place your key here%` with the token from "Install with Composer" in your Shopware Account.

**Extensions**: the PaaS recipe uses the Composer plugin loader (`Shopware\Core\Framework\Plugin\KernelPluginLoader\ComposerPluginLoader`), so all plugins and apps must be installed via Composer.

**Manual rebuild** of the `main` environment:

```bash
shopware variable:create --environment main --level environment --prefix env --name REBUILD_DATE --value "$(date)" --visible-build true
shopware variable:update --environment main --value "$(date)" "env:REBUILD_DATE"
```

Creating the variable triggers a build; updating it with a new value forces another build even without code changes.

## Essential identifiers

- `git push -u shopware main`
- `install.lock`
- `env:COMPOSER_AUTH`, `env:REBUILD_DATE`
- `shopware variable:create`, `shopware variable:update`
- `ComposerPluginLoader`

## Gotchas

- Removing `install.lock` makes the installer run again on the next deploy; the installer command itself skips when the file exists unless forced.
- Never commit `auth.json`; use the `COMPOSER_AUTH` variable.
- Default admin credentials are a security risk until changed.

## Code check (6.7.13.0)
- confirmed `install.lock` — install command aborts when the file exists unless `--force` is passed — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:70
- confirmed `user:create` — `--basic-setup` creates user `admin` with password `shopware` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:130
- confirmed `ComposerPluginLoader` — extends `KernelPluginLoader` — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- unverified `COMPOSER_AUTH` — Composer environment variable, not read by vendor/shopware code
- unverified `REBUILD_DATE` — PaaS build variable, not read by vendor/shopware code
- unverified `shopware variable:create` — PaaS CLI command, outside vendor/shopware
