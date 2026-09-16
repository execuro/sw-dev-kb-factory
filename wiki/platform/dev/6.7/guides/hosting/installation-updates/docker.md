---
id: platform/dev/6.7/guides/hosting/installation-updates/docker.md
title: Docker Image
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/docker.html
sourceHash: d1008371ee0ecc3d76c101a891fffead241a8888
codeCheckedAgainst: "6.7.13.0"
keywords: ["docker", "ghcr.io/shopware/docker-base", "frankenphp", "Dockerfile", "compose.yaml", "shopware-cli project ci", "PHP_MAX_UPLOAD_SIZE", "PHP_MEMORY_LIMIT", "shopware-deployment-helper", "install-php-extensions", "monolog stderr", "container", "php security updates"]
summary: "Shopware production Docker image ghcr.io/shopware/docker-base: Dockerfile build, tags, PHP env vars, mounts, compose services and keeping PHP patched."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md", "platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md", "platform/dev/6.7/products/tools/cli/_index.md"]
---
## What it is

The Shopware Docker base image `ghcr.io/shopware/docker-base` for production containers: official PHP image plus required extensions and config, but **without** Shopware. You copy your project in, build it, and run it. Create a project with `shopware-cli project create <folder>` (optionally a version, e.g. `6.6.7.0`) or `npx @shopware-ag/shopware-cli project create <folder>`.

## When to use

Containerized production hosting, scaling web/worker instances, and keeping the PHP runtime patched.

## Key steps / config

Dockerfile skeleton:

```dockerfile
ARG PHP_VERSION=8.3
FROM ghcr.io/shopware/docker-base:$PHP_VERSION-frankenphp AS base-image
FROM ghcr.io/shopware/shopware-cli:latest-php-$PHP_VERSION AS shopware-cli
FROM shopware-cli AS build
ADD . /src
WORKDIR /src
RUN --mount=type=secret,id=packages_token,env=SHOPWARE_PACKAGES_TOKEN --mount=type=secret,id=composer_auth,dst=/src/auth.json \
    /usr/local/bin/entrypoint.sh shopware-cli project ci /src
FROM base-image AS final
COPY --from=build --chown=82 --link /src /var/www/html
```

**Tags** (FrankenPHP recommended): `8.3-frankenphp`, `8.3.12-frankenphp`, `8.3-frankenphp-otel`, `8.3.12-frankenphp-otel`; Caddy, Nginx and FPM-only variants exist on Docker Hub and GHCR. Rebuilt daily; `8.3-frankenphp` is a rolling tag.

**Extensions**: `bcmath`, `gd`, `intl`, `mysqli`, `pdo_mysql`, `pcntl`, `sockets`, `bz2`, `gmp`, `soap`, `zip`, `ftp`, `ffi`, `opcache`, `redis`, `apcu`, `amqp`, `zstd`. Add more with `RUN install-php-extensions tideways` (as `USER root`, then `USER www-data`). Custom INI goes to `/usr/local/etc/php/conf.d/`; Nginx `/etc/nginx/conf.d/*.conf` (http block) or `*.inc` (server block).

**Image env vars (defaults)**: `PHP_SESSION_HANDLER` files (`redis` with `PHP_SESSION_SAVE_PATH`), `PHP_MAX_UPLOAD_SIZE` 128m, `PHP_MAX_EXECUTION_TIME` 300, `PHP_MEMORY_LIMIT` 512m, `PHP_OPCACHE_VALIDATE_TIMESTAMPS` 1, `PHP_OPCACHE_MEMORY_CONSUMPTION` 128, `FPM_PM` dynamic, `FPM_PM_MAX_CHILDREN` 5. Shopware [environment variables](platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md) and Deployment Helper env vars also apply.

**Volumes** (only with local files): `/var/www/html/files`, `/var/www/html/public/theme`, `/var/www/html/public/media`, `/var/www/html/public/thumbnail`, `/var/www/html/public/sitemap`. Ideal: S3-like external storage (no mounts) plus Redis/Valkey for cache and sessions.

**Logging**: in `config/packages/prod/monolog.yaml`, send the `nested` stream handler to `php://stderr` with `formatter: monolog.formatter.json`; `main` is `fingers_crossed` with `action_level: "%env(MONOLOG_LOG_LEVEL)%"`; also set `business_event_handler_buffer.level`.

**Compose services** (example only): `init-perm` (`chown 82:82` on volumes), `init` running the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md), and `web` (port 8000), `worker`, `scheduler` depending on `init` completing:

```yaml
init:      { entrypoint: ["php", "vendor/bin/shopware-deployment-helper", "run"] }
worker:    { entrypoint: ["php", "bin/console", "messenger:consume", "async", "low_priority", "--time-limit=300", "--memory-limit=512M"] }
scheduler: { entrypoint: ["php", "bin/console", "scheduled-task:run"] }
```

**Keeping PHP patched**: scan on a schedule (`trivy image <image>`), check `docker compose exec web php -v`, and on findings run `docker compose build --pull` then `docker compose up -d`. Building alone does not update the running shop.

## Essential identifiers

- `ghcr.io/shopware/docker-base:<php>-frankenphp`, `ghcr.io/shopware/shopware-cli:latest-php-<php>`
- `shopware-cli project ci`, `install-php-extensions`
- `PHP_MAX_UPLOAD_SIZE`, `PHP_MEMORY_LIMIT`, `PHP_SESSION_HANDLER`
- `bin/console scheduled-task:run`, `messenger:consume async low_priority`

## Gotchas

- On Nginx images, `PHP_MAX_UPLOAD_SIZE` above 128M also needs `client_max_body_size` raised in `/etc/nginx/nginx.conf`.
- "No transport supports the given Messenger DSN": install the required package and the PHP Redis extension locally.
- Pin the image by sha256 digest; let Dependabot/Renovate propose updates.
- Shopware updates: update Composer deps, rebuild, redeploy; the Deployment Helper runs `system:update:finish`. See [Performing updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md).

## Version notes

- Major upgrade (e.g. 6.6 on PHP 8.2 to 6.7 on PHP 8.5): back up, then change one thing at a time — check with `shopware-cli project upgrade-check` (deprecated, removed October 2026; use `shopware-cli project upgrade`) and the [system requirements](platform/dev/6.7/guides/installation/system-requirements.md); raise `PHP_VERSION` to one both majors support (8.3); update Shopware; then raise PHP to the target. Never skip Shopware majors.

## Code check (6.7.13.0)
- confirmed `system:update:finish` — core console command run by the Deployment Helper — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `scheduled-task:run` — core console command — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:19
- confirmed `async` — core messenger transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:67
- confirmed `low_priority` — core messenger transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:75
- confirmed `business_event_handler_buffer` — monolog handler defined by core — vendor/shopware/core/Framework/DependencyInjection/services.xml:50
- unverified `messenger:consume` — Symfony Messenger command, vendor/symfony out of scope
- unverified `ghcr.io/shopware/docker-base` — external image, not in installed code
- unverified `PHP_MAX_UPLOAD_SIZE` — image-level env var, not in installed code
- unverified `vendor/bin/shopware-deployment-helper` — shopware/deployment-helper package, out of scope
- unverified `shopware-cli project ci` — external CLI tool, out of scope
