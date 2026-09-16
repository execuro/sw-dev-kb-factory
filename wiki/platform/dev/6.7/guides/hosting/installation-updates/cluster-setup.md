---
id: platform/dev/6.7/guides/hosting/installation-updates/cluster-setup.md
title: Cluster Setup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/cluster-setup.html
sourceHash: 9a0cba87e7bda44b1a6d9c306ea007b0511a7189
codeCheckedAgainst: "6.7.13.0"
keywords: ["cluster setup", "shopware.deployment.cluster_setup", "multi app server", "high scaling", "COMPOSER_PLUGIN_LOADER", "plugin:install --activate", "shopware.auto_update.enabled", "redis", "var/services", "/api/_info/health-check", "s3 shared filesystem", "messenger:consume", "security plugin"]
summary: "Cluster setup checklist: deployment.cluster_setup, Composer plugin loader, split Redis, shared S3/var/services, CLI workers, health check."
lastBuilt: 2026-09-15
---
## What it is

Best-practice checklist for running Shopware as a high-scaling, multi-app-server cluster: Shopware config flags, plugin loading, Redis, database, shared filesystem, updates/security, message queue workers, monitoring and health checks.

## When to use

Planning or operating a large custom store on several app servers, or reviewing an existing cluster deployment.

## Key steps / config

1. Enable cluster mode (since 6.5.6.0) so Shopware does not run node-local operations that make nodes diverge, e.g. clearing Symfony cache files at runtime:

```yaml
shopware:
    deployment:
        cluster_setup: true
```

2. Use the Symfony Flex template (`github.com/shopware/template`) and pin Shopware versions in `composer.json`. Project code lives in `/src`, config in `/config`, bundles in `/config/bundles.php`.
3. Install plugins as Composer packages, not user-managed plugins. Set `COMPOSER_PLUGIN_LOADER=1` in `.env`: plugin state comes from Composer (installed = enabled), not the database. Run `bin/console plugin:install --activate <name>` during deployment.
4. Redis: at least five servers — (1) session + cart, (2) `cache.object`, (3) lock + increment storage, (4) number ranges, (5) message queue. Prefer the PHP Redis extension over Predis (persistent connections). With a Redis cluster set `redis.clusters.cache_slots=1` in `php.ini`.
5. Filesystem: assets, theme files, private and public filesystems on a shared S3-compatible bucket. Also share `<project-root>/var/services/` (writable; source files of installed services) — otherwise other nodes re-download them from the service registry on first use (e.g. compiling a service-managed theme, rotating the app secret).
6. Disable the built-in auto-update (not multi-app-server compatible):

```yaml
shopware:
    auto_update:
        enabled: false
```

7. Process the message queue with multiple CLI `messenger:consume` workers (not the Admin worker), supervised by systemd or supervisor; consider an own queue for project messages.
8. Configure static theme compilation, since the DB may be unreachable during deployment.
9. Monitor app servers via `GET /api/_info/health-check` — `200` when healthy, `50x` otherwise; usable as a Docker `HEALTHCHECK` running `curl --fail` against that path on the local app.
10. Security: use a staging environment for updates, install the Security plugin via Composer, patch affected dependencies with `composer update <dependency-name>`, and run `composer audit` regularly.

## Essential identifiers

- `shopware.deployment.cluster_setup`
- `COMPOSER_PLUGIN_LOADER`, `Shopware\Core\Framework\Plugin\KernelPluginLoader\ComposerPluginLoader`
- `bin/console plugin:install --activate <name>`
- `shopware.auto_update.enabled`
- `redis.clusters.cache_slots=1`
- `var/services`
- `/api/_info/health-check`

## Gotchas

- Do not rely on runtime plugin enabling/disabling via the database across nodes — the Composer plugin loader avoids that.
- Non-persistent Redis connections can exhaust the maximum number of open sockets.
- Local dev environments without Redis or Elasticsearch diverge too far from production.
- Third-party plugins/apps reduce the team's control over stability and performance.

## Version notes

- 6.5.6.0: `shopware.deployment.cluster_setup` available.

## Code check (6.7.13.0)
- confirmed `deployment.cluster_setup` — boolean node in deployment section — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:330
- confirmed `shopware.deployment.cluster_setup` — read by plugin lifecycle to skip node-local operations — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:551
- confirmed `auto_update.enabled` — boolean node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:266
- confirmed `plugin:install` — command with `--activate`/`-a` option — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `ComposerPluginLoader` — kernel plugin loader class — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- unverified `COMPOSER_PLUGIN_LOADER` — env var read by the project template front controller, outside checked roots
- confirmed `/api/_info/health-check` — route `api.info.health.check`, no auth required — vendor/shopware/core/Framework/Api/Controller/HealthCheckController.php:42
- confirmed `var/services` — temporary directory for service sources — vendor/shopware/core/Service/TemporaryDirectoryFactory.php:21
- unverified `redis.clusters.cache_slots` — php.ini setting of the PHP Redis extension, out of scope
