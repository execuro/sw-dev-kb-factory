---
id: platform/dev/6.7/products/paas/shopware-paas/build-deploy.md
title: Build & Deploy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/build-deploy.html
sourceHash: c1a7045e6b47f145d9f1bb4a064bf8f6f260fb1a
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware paas", "build and deploy", "git push", "install.lock", "COMPOSER_AUTH", "auth.json", "REBUILD_DATE", "shopware variable:create", "shopware variable:update", "composer plugin loader", "ComposerPluginLoader", "build hook", "deploy hook", "rebuild"]
summary: "Shopware PaaS build/deploy via git push: build and deploy phases, first-run installer and install.lock, COMPOSER_AUTH variable, forced rebuilds."
lastBuilt: 2026-10-21
---
## What it is

How code reaches a Shopware PaaS environment. The PaaS project is a git repository: every push builds a new version of the store from source and deploys it. Environments (dev previews, staging, production) map to branches.

## When to use

When pushing changes to a PaaS environment, preparing the first deployment, giving the build access to Shopware Store extensions via Composer, or forcing a rebuild without a code change.

## Key steps / config

1. Push the `main` branch to the `shopware` remote (the PaaS origin):
   ```bash
   git add .
   git commit -m "Applied new configuration"
   git push -u shopware main
   ```
2. The push triggers a build, then a deploy:

   | Build | Deploy |
   |---|---|
   | Configuration validation | Hold app requests |
   | Build container image | Unmount live containers |
   | Installing dependencies | Mount file systems |
   | Run build hook | Run deploy hook |
   | Building app image | Serve requests |

   After both succeed, the deployed store's link is printed at the end of the log.
3. First deployment: Shopware's command-line installer runs once and initializes the system. It does not run again while `install.lock` exists in the project root. It creates an administrator with username `admin` and password `shopware` — change the password immediately.
4. Composer authentication for Shopware Store extensions: do not commit `auth.json`; store its content as a project-level sensitive variable visible at build time:
   ```bash
   shopware variable:create --level project --name env:COMPOSER_AUTH --json true --visible-runtime false --sensitive true --visible-build true --value '{"bearer": {"packages.shopware.com": "%place your key here%"}}'
   ```
   Replace `%place your key here%` with the token shown under "Install with Composer" in the Shopware Account.
5. Extensions: the PaaS recipe uses the Composer plugin loader, so every plugin/app must be installed via Composer.
6. Force a rebuild of the `main` environment without new code by creating, then updating, a `REBUILD_DATE` variable:
   ```bash
   shopware variable:create --environment main --level environment --prefix env --name REBUILD_DATE --value "$(date)" --visible-build true
   shopware variable:update --environment main --value "$(date)" "env:REBUILD_DATE"
   ```

## Essential identifiers

- `git push -u shopware main`
- `install.lock`
- `env:COMPOSER_AUTH`, `auth.json`
- `env:REBUILD_DATE`
- `shopware variable:create`, `shopware variable:update`
- `Shopware\Core\Framework\Plugin\KernelPluginLoader\ComposerPluginLoader`

## Gotchas

- Removing `install.lock` makes the installer run again on the next deploy. In the core, `system:install` refuses to run while `install.lock` exists unless `--force` is passed.
- The default `admin` / `shopware` credentials are a security risk until changed.
- Extensions not installed through Composer are not loaded by the Composer plugin loader.

## Code check (6.7.15.1)
- confirmed `install.lock` — installer skips when the lock file exists unless `--force` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:74
- confirmed `SystemLocker::lock()` — writes `install.lock` into the project dir after install — vendor/shopware/core/Installer/Finish/SystemLocker.php:17
- confirmed `admin` — basic setup creates user `admin` with password `shopware` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:134
- confirmed `ComposerPluginLoader` — extends `KernelPluginLoader` — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- unverified `COMPOSER_AUTH` — Composer/PaaS environment variable, not read by Shopware code
- unverified `REBUILD_DATE` — PaaS-side variable, not part of Shopware code
- unverified `shopware variable:create` — PaaS CLI command, out of scope
