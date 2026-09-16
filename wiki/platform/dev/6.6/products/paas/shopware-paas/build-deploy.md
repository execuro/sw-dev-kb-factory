---
id: platform/dev/6.6/products/paas/shopware-paas/build-deploy.md
title: Build & Deploy
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/build-deploy.html
sourceHash: 415284f25aa36815bb6508ec2fd250c29baf417a
keywords: ["build and deploy", "PaaS deploy", "git push shopware main", "install.lock", "COMPOSER_AUTH", "shopware variable:create", "REBUILD_DATE", "build hook", "deploy hook", "PaaS branches"]
summary: "Pushing to the PaaS git remote triggers a build/deploy; covers first deployment, composer auth, and manual rebuilds."
lastBuilt: "2026-09-15"
---
## What it is

Explains that a Shopware PaaS project is a git repository: pushing to it builds a new store version and deploys it, with different environments (dev-previews, staging, production) mapped to different branches.

## Key steps / config

- Push the main branch to trigger a build and deploy:
  ```bash
  git add .
  git commit -m "Applied new configuration"
  git push -u shopware main
  ```
- Build runs: configuration validation, build container image, install dependencies, run the build hook, build app image. Deploy runs: hold app requests, unmount live containers, mount file systems, run the deploy hook, serve requests.
- First deployment runs Shopware's command-line installer automatically; it will not run again unless the `install.lock` file is removed — do not remove it unless you intend the installer to run again on the next deploy. The installer creates an administrator account with default credentials `admin` / `shopware`, which must be changed immediately in the Administration.
- Composer authentication for installing Shopware store extensions: add the auth token as an environment variable instead of committing `auth.json`:
  ```bash
  shopware variable:create --level project --name env:COMPOSER_AUTH --json true --visible-runtime false --sensitive true --visible-build true --value '{"bearer": {"packages.shopware.com": "%place your key here%"}}'
  ```
- To force a rebuild without new code, create or update a `REBUILD_DATE` variable:
  ```bash
  shopware variable:create --environment main --level environment --prefix env --name REBUILD_DATE --value "$(date)" --visible-build true
  shopware variable:update --environment main --value "$(date)" "env:REBUILD_DATE"
  ```

## Essential identifiers

- `git push -u shopware main`
- `install.lock`
- `env:COMPOSER_AUTH`, `shopware variable:create`, `shopware variable:update`
- `REBUILD_DATE`

## Gotchas

Removing `install.lock` causes the installer to run again on the next deploy — only do this intentionally. The default installer admin credentials (`admin`/`shopware`) are a security risk if not changed immediately. The `COMPOSER_AUTH` value shown is a placeholder token and must be replaced with your real Shopware Account composer token before use.
