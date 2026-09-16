---
docType: developer
id: platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-with-deployer.md
sourceHash: 7f85887d5f58524e145057768f5a716da3204dd3
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/installation-updates/deployments/deployment-with-deployer.html
title: Deployment with Deployer
version: "6.6"
versions: ["6.6"]
keywords: ["Deployer", "deploy.php", "shopware-deployment-helper", "install.lock", "system:check", "shared_files", "shared_dirs", "writable_dirs", "GitLab CI", "GitHub Actions", "shopware-cli project ci", "continuous deployment", "dep deploy"]
summary: "Guide to continuous deployment of Shopware 6 with the PHP tool Deployer, GitLab CI/GitHub Actions, and the deployment-helper."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/concepts/framework/system-check.md", "platform/dev/6.6/guides/plugins/plugins/framework/system-check/_index.md"]
---
## What it is

This page explains the fundamental steps to deploy Shopware 6 to infrastructure using continuous deployment with GitLab CI or GitHub Actions and Deployer, a PHP deployment tool.

## When to use

Use this when setting up automated, repeatable Shopware deployments via a CI/CD pipeline with Deployer's symlinked release directory structure.

## Key steps / config

Deployer's release layout:

```text
├── .dep
├── current -> releases/1
├── releases
│   └── 1
└── shared
    ├── .env
    └── config
```

Webserver document root must point to `/var/www/shopware/current/public` (symlink following enabled). Require dependencies:

```bash
composer require deployer/deployer shopware/deployment-helper
```

Deployment steps defined as `deploy.php` tasks: clone repo, build with Shopware CLI, upload via `deploy:update_code` (`task('deploy:update_code')`), run `sw:deployment:helper` (`vendor/bin/shopware-deployment-helper run`), create `install.lock` via `sw:touch_install_lock` (`touch install.lock`), optionally run health checks via `sw:health_checks` (`bin/console system:check --context=pre_rollout`), then `deploy:symlink` switches the document root.

Key `deploy.php` settings: `set('deploy_path', ...)`, `set('shared_files', [...])` (e.g. `.env.local`, `install.lock`, `public/.htaccess`), `set('shared_dirs', [...])` (e.g. `config/jwt`, `files`, `var/log`, `public/media`), `set('writable_dirs', [...])`, `set('keep_releases', 3)`.

Migrating an existing instance copies files/dirs into `shared/`, e.g.:

```bash
cp /var/www/shopware_backup/.env.local /var/www/shopware/shared/.env.local
cp -R /var/www/shopware_backup/custom/plugins /var/www/shopware/shared/custom
```

CI pipeline runs `shopware-cli project ci .` then `vendor/bin/dep deploy` (GitLab) or the `deployphp/action@v1` action (GitHub Actions).

## Essential identifiers

- `deployer/deployer`, `shopware/deployment-helper`
- `deploy.php`
- `vendor/bin/shopware-deployment-helper run`
- `bin/console system:check --context=pre_rollout`
- `install.lock`
- `shopware-cli project ci`
- `vendor/bin/dep deploy`

## Gotchas

If deploying to a cluster with multiple web servers, run migrations only on one of them. Before running `sw:health_checks`, be familiar with the System Checks concepts (see linked pages) and how to interpret result error codes.
