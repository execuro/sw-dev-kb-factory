---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-with-deployer.md
relatedPages:
  - platform/dev/6.7/guides/installation/project-overview.md
  - platform/dev/6.7/concepts/framework/system-check.md
  - platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md
sourceHash: 03a38451cbc507bb2e5c9aefde31e4e2cefd1b13
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-with-deployer.html
title: Deployment with Deployer
version: "6.7"
versions:
  - "6.7"
keywords: ["deployer", "deploy.php", "deployer/deployer", "shopware/deployment-helper", "sw:deployment:helper", "sw:touch_install_lock", "install.lock", "system:check --context=pre_rollout", "shared_dirs", "project-deployer", "continuous deployment", "gitlab ci", "github actions"]
summary: "Shopware 6 deploys with Deployer via GitLab CI or GitHub Actions: deploy.php, shared dirs, deployment-helper, install.lock, pre_rollout check."
lastBuilt: 2026-10-21
---
## What it is

Continuous deployment of a Shopware 6 project (based on the Symfony Flex template, see [project overview](platform/dev/6.7/guides/installation/project-overview.md)) with Deployer, driven by GitLab CI or GitHub Actions. Deployer keeps `.dep`, `releases/<n>`, `shared/` (e.g. `.env`, `config`) and a `current -> releases/<n>` symlink under the deploy path.

## When to use

Setting up or migrating to automated, reproducible SSH-based releases with symlink switching and state shared between releases.

## Key steps / config

1. Install dependencies: `composer require deployer/deployer shopware/deployment-helper`.
2. Set the web server document root to `<deploy_path>/current/public` (e.g. `/var/www/shopware/current/public`) and make sure it follows symlinks.
3. CI runner needs PHP, Node.js, npm, OpenSSH; image `ghcr.io/shopware/shopware-cli:latest-php-8.3` satisfies this. The project is built with Shopware CLI.
4. Use the shipped CI components: GitLab `component: gitlab.com/shopware/ci-components/project-deployer@main` (input `php_version`), GitHub `uses: shopware/github-actions/project-deployer@main` with `sshPrivateKey: ${{ secrets.SSH_PRIVATE_KEY }}`. Generate a key with `ssh-keygen -t ed25519`.
5. `deploy.php` skeleton (condensed):

```php
namespace Deployer;
require_once 'recipe/common.php';
require_once 'contrib/cachetool.php';
host('SSH-HOSTNAME')->setRemoteUser('www-data')
    ->set('deploy_path', '/var/www/shopware')->set('http_user', 'www-data')
    ->set('writable_mode', 'chmod')->set('keep_releases', 3);
set('shared_files', ['.env.local', 'install.lock', 'public/.htaccess', 'public/.user.ini']);
set('shared_dirs', ['config/jwt', 'files', 'var/log', 'public/media', 'public/plugins', 'public/thumbnail', 'public/sitemap']);
task('sw:deployment:helper', static function () { run('cd {{release_path}} && vendor/bin/shopware-deployment-helper run'); });
task('sw:touch_install_lock', static function () { run('cd {{release_path}} && touch install.lock'); });
task('sw:health_checks', static function () { run('cd {{release_path}} && bin/console system:check --context=pre_rollout'); });
task('deploy', ['deploy:prepare', 'deploy:clear_paths', 'sw:deployment:helper', 'sw:touch_install_lock', 'sw:health_checks', 'deploy:publish']);
```

The full source file also sets `writable_dirs` (`config/jwt`, `custom/plugins`, `files`, `public/bundles`, `public/css`, `public/fonts`, `public/js`, `public/media`, `public/sitemap`, `public/theme`, `public/thumbnail`, `var`) and `default_timeout` 3600, overrides `deploy:update_code` with `upload('.', '{{release_path}}')` excluding `.git`, `deploy.php`, `node_modules`, and adds hooks `after('deploy:failed', 'deploy:unlock')` and `after('deploy:symlink', 'cachetool:clear:opcache')`.

6. Run `dep deploy env=prod`. `deploy:symlink` switches `current` to the new release last.

**Migrating an existing instance**: after the first deploy, copy every `shared_files`/`shared_dirs` path from the old instance into `<deploy_path>/shared` (e.g. `.env.local`, `custom/plugins`, `config/jwt`, `config/packages`, `files`, `var/log`, `public/media`, `public/thumbnail`, `public/sitemap`).

## Essential identifiers

- `deploy.php`, `deploy_path`, `shared_files`, `shared_dirs`, `writable_dirs`
- `sw:deployment:helper`, `sw:touch_install_lock`, `sw:health_checks`, `deploy:update_code`, `deploy:symlink`
- `vendor/bin/shopware-deployment-helper run`, `bin/console system:check --context=pre_rollout`
- `shopware/github-actions/project-deployer`, `shopware/ci-components/project-deployer`

## Gotchas

- In a cluster with several web servers, run migrations (the deployment-helper step) on one server only.
- Without `install.lock` in the release root, Shopware redirects every request to the installer.
- Learn the [system check concepts](platform/dev/6.7/concepts/framework/system-check.md) and [exit codes](platform/dev/6.7/guides/plugins/plugins/framework/system-check/_index.md) before adding `sw:health_checks`.
- `keep_releases` rollbacks are only meant for releases where no DB migrations were executed.

## Code check (6.7.15.1)
- confirmed `system:check` — core console command with a `context` option (default `cli`) — vendor/shopware/core/Framework/SystemCheck/Command/SystemCheckCommand.php:21
- confirmed `SystemCheckExecutionContext::PRE_ROLLOUT` — value `pre_rollout` — vendor/shopware/core/Framework/SystemCheck/Check/SystemCheckExecutionContext.php:17
- confirmed `install.lock` — core installer writes it in the project root on finish — vendor/shopware/core/Installer/Finish/SystemLocker.php:19
- confirmed `install.lock` — `system:install` refuses to run when it exists unless `--force` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:74
- unverified `vendor/bin/shopware-deployment-helper` — separate shopware/deployment-helper package, out of scope
- unverified `deploy.php` — Deployer recipes and tasks belong to vendor/deployer, out of scope
