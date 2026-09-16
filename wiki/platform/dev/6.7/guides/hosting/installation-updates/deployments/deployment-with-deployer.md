---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-with-deployer.md
title: Deployment with Deployer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-with-deployer.html
sourceHash: 03a38451cbc507bb2e5c9aefde31e4e2cefd1b13
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployer", "deploy.php", "deployer/deployer", "shopware/deployment-helper", "sw:deployment:helper", "sw:touch_install_lock", "install.lock", "system:check", "pre_rollout", "shared_dirs", "continuous deployment", "gitlab ci", "github actions"]
summary: "Deploy Shopware 6 with Deployer via GitLab CI or GitHub Actions: deploy.php hosts, shared dirs, deployment-helper, install.lock and system:check tasks."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/installation/project-overview.md", "platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md"]
---
## What it is

Continuous deployment of a Shopware 6 project with Deployer (PHP deployment tool), driven by GitLab CI (`shopware/ci-components/project-deployer`) or GitHub Actions (`shopware/github-actions/project-deployer`). Requires a project based on the Symfony Flex template ([project overview](platform/dev/6.7/guides/installation/project-overview.md)).

## When to use

Setting up reproducible, automated deployments with release directories and symlink switching on SSH-reachable servers.

## Key steps / config

1. Dependencies: `composer require deployer/deployer shopware/deployment-helper`.
2. Server layout: `.dep`, `current -> releases/N`, `releases/`, `shared/` (e.g. `.env`, `config`). Document root `/var/www/shopware/current/public`; the web server must follow symlinks.
3. Runner needs PHP, NodeJS, npm, OpenSSH; image `ghcr.io/shopware/shopware-cli:latest-php-8.3` meets this. The build uses Shopware CLI.
4. Pipeline: clone, build, upload (`deploy:update_code`), `sw:deployment:helper` (migrations, plugin install/update), `sw:touch_install_lock`, optional `sw:health_checks`, `deploy:symlink`. Run with `dep deploy env=prod`.

`deploy.php` skeleton:

```php
host('SSH-HOSTNAME')->setRemoteUser('www-data')
    ->set('deploy_path', '/var/www/shopware')
    ->set('http_user', 'www-data')->set('writable_mode', 'chmod')->set('keep_releases', 3);
set('shared_files', ['.env.local', 'install.lock', 'public/.htaccess', 'public/.user.ini']);
set('shared_dirs', ['config/jwt', 'files', 'var/log', 'public/media', 'public/plugins', 'public/thumbnail', 'public/sitemap']);
task('sw:deployment:helper', fn () => run('cd {{release_path}} && vendor/bin/shopware-deployment-helper run'));
task('sw:touch_install_lock', fn () => run('cd {{release_path}} && touch install.lock'));
task('sw:health_checks', fn () => run('cd {{release_path}} && bin/console system:check --context=pre_rollout'));
task('deploy', ['deploy:prepare', 'deploy:clear_paths', 'sw:deployment:helper', 'sw:touch_install_lock', 'sw:health_checks', 'deploy:publish']);
after('deploy:symlink', 'cachetool:clear:opcache');
```

The full file also requires `recipe/common.php` and `contrib/cachetool.php`, sets `writable_dirs`, `default_timeout` 3600, and overrides `deploy:update_code` to `upload('.', '{{release_path}}')` excluding `.git`, `deploy.php`, `node_modules`.

CI entry points: GitLab `include: - component: gitlab.com/shopware/ci-components/project-deployer@main` with `inputs: php_version`; GitHub step `uses: shopware/github-actions/project-deployer@main` with `sshPrivateKey`.

Migrating an existing instance: after the first deploy, copy the `shared_files`/`shared_dirs` paths from the old instance into `/var/www/shopware/shared`. Generate an SSH key with `ssh-keygen -t ed25519`.

## Essential identifiers

- `deploy.php`, `deploy_path`, `shared_files`, `shared_dirs`, `writable_dirs`
- `sw:deployment:helper`, `sw:touch_install_lock`, `sw:health_checks`, `deploy:update_code`
- `bin/console system:check --context=pre_rollout`
- `install.lock`

## Gotchas

- With multiple web servers, run migrations on only one server.
- Without `install.lock` in the release root, Shopware redirects every request to the installer.
- Understand system check results and error codes before adding `sw:health_checks` ([system checks](platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md)).
- `keep_releases` rollbacks apply only if no DB migrations were executed.

## Code check (6.7.13.0)
- confirmed `system:check` — core console command — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:20
- confirmed `context` — `system:check` option, default `cli`, restricted to allowed contexts — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:39
- confirmed `pre_rollout` — `SystemCheckExecutionContext::PRE_ROLLOUT` value — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:17
- confirmed `install.lock` — `system:install` aborts when it exists unless `--force` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:70
- confirmed `install.lock` — written by the web installer on finish — vendor/shopware/core/Installer/Finish/SystemLocker.php:19
- unverified `public/index.php` — installer redirect on missing `install.lock` lives in the project template, outside checked roots
- unverified `vendor/bin/shopware-deployment-helper` — shopware/deployment-helper package, out of scope
- unverified `deploy:symlink` — Deployer recipe task, out of scope
- unverified `shopware/github-actions/project-deployer` — external CI component, out of scope
