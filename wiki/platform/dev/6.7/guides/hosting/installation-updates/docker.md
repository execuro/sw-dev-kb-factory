---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/hosting/installation-updates/docker.md
relatedPages:
  - platform/dev/6.7/products/tools/cli/_index.md
  - platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md
  - platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md
sourceHash: d1008371ee0ecc3d76c101a891fffead241a8888
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/docker.html
title: Docker Image
version: "6.7"
versions:
  - "6.7"
keywords: ["docker", "ghcr.io/shopware/docker-base", "frankenphp", "Dockerfile", "compose.yaml", "shopware-cli project ci", "PHP_MAX_UPLOAD_SIZE", "PHP_MEMORY_LIMIT", "FPM_PM_MAX_CHILDREN", "install-php-extensions", "docker compose build --pull", "container", "monolog stderr", "php update"]
summary: "Shopware docker-base production image: Dockerfile, tags, PHP env vars, volumes, compose services, stderr logging, keeping PHP/Shopware updated."
lastBuilt: 2026-10-21
---
## What it is

`ghcr.io/shopware/docker-base` is Shopware's production base image (official PHP image plus required extensions/config). It does not contain Shopware: copy your project in, build, run. Create a project with [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md): `shopware-cli project create <folder>` (optionally `... <folder> 6.6.7.0`) or `npx @shopware-ag/shopware-cli project create <folder>`.

## When to use

Running Shopware 6 in containers in production, building the image in CI, or updating PHP/Shopware in a Docker-based shop.

## Key steps / config

**Dockerfile** (optionally pin to a sha256 digest):

```dockerfile
ARG PHP_VERSION=8.3
FROM ghcr.io/shopware/docker-base:$PHP_VERSION-frankenphp AS base-image
FROM ghcr.io/shopware/shopware-cli:latest-php-$PHP_VERSION AS shopware-cli
FROM shopware-cli AS build
ADD . /src
WORKDIR /src
RUN --mount=type=secret,id=packages_token,env=SHOPWARE_PACKAGES_TOKEN \
    --mount=type=secret,id=composer_auth,dst=/src/auth.json \
    /usr/local/bin/entrypoint.sh shopware-cli project ci /src
FROM base-image AS final
COPY --from=build --chown=82 --link /src /var/www/html
```

**Tags**: `8.3-frankenphp`, `8.3.12-frankenphp`, `8.3-frankenphp-otel`, `8.3.12-frankenphp-otel` (FrankenPHP recommended; Caddy, Nginx, FPM-only variants exist). Rebuilt daily; `8.3-frankenphp` is a rolling tag.

**Extensions**: `bcmath`, `gd`, `intl`, `mysqli`, `pdo_mysql`, `pcntl`, `sockets`, `bz2`, `gmp`, `soap`, `zip`, `ftp`, `ffi`, `opcache`, `redis`, `apcu`, `amqp`, `zstd`. Add more: `RUN install-php-extensions tideways` between `USER root` and `USER www-data`.

**Image env vars (default)**: `PHP_SESSION_HANDLER` (files; `redis` + `PHP_SESSION_SAVE_PATH=tcp://redis:6379`), `PHP_SESSION_COOKIE_LIFETIME` (0), `PHP_SESSION_GC_MAXLIFETIME` (1440), `PHP_MAX_UPLOAD_SIZE` (128m), `PHP_MAX_EXECUTION_TIME` (300), `PHP_MEMORY_LIMIT` (512m), `PHP_ERROR_REPORTING` (E_ALL), `PHP_DISPLAY_ERRORS` (0), `PHP_OPCACHE_ENABLE_CLI` (1), `PHP_OPCACHE_FILE_OVERRIDE` (1), `PHP_OPCACHE_VALIDATE_TIMESTAMPS` (1), `PHP_OPCACHE_INTERNED_STRINGS_BUFFER` (20), `PHP_OPCACHE_MAX_ACCELERATED_FILES` (10000), `PHP_OPCACHE_MEMORY_CONSUMPTION` (128), `PHP_OPCACHE_FILE_CACHE`, `PHP_OPCACHE_FILE_CACHE_ONLY` (0), `PHP_REALPATH_CACHE_TTL` (3600), `PHP_REALPATH_CACHE_SIZE` (4096k), `FPM_PM` (dynamic), `FPM_PM_MAX_CHILDREN` (5), `FPM_PM_START_SERVERS` (2), `FPM_PM_MIN_SPARE_SERVERS` (1), `FPM_PM_MAX_SPARE_SERVERS` (3). Shopware variables: [environment variables](platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md), [Deployment Helper env](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md).

**Volumes** (only with local files; external storage like S3 recommended): `/var/www/html/files`, `/var/www/html/public/theme`, `/var/www/html/public/media`, `/var/www/html/public/thumbnail`, `/var/www/html/public/sitemap`.

**Logging**: in `config/packages/prod/monolog.yaml`, route the `nested` stream handler to `path: php://stderr` with `formatter: monolog.formatter.json`, level `%env(MONOLOG_LOG_LEVEL)%`.

**Compose services** (shared build, `DATABASE_URL`, `APP_URL`, volumes): `database`, `init-perm` (root, `chown 82:82` volumes), `init` (`php vendor/bin/shopware-deployment-helper run`), `web` (port 8000), `worker` (`php bin/console messenger:consume async low_priority --time-limit=300 --memory-limit=512M`), `scheduler` (`php bin/console scheduled-task:run`); the last three depend on `init` with `service_completed_successfully`.

**Update PHP**: `docker compose build --pull`, then `docker compose up -d`. Check with `docker compose exec web php -v`; scan on a schedule with `trivy image <image>` and rebuild on findings.

**Update Shopware**: update Composer deps, rebuild, redeploy; the Deployment Helper runs `system:update:finish`. See [Performing Shopware Updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md).

**Custom config**: PHP `.ini` into `/usr/local/etc/php/conf.d/`; Nginx `.conf` (`http` block) or `.inc` (`server` block) into `/etc/nginx/conf.d/`.

## Essential identifiers

- `ghcr.io/shopware/docker-base`, `ghcr.io/shopware/shopware-cli`, `PHP_VERSION` build arg
- `shopware-cli project ci`, `install-php-extensions`, `docker compose build --pull`

## Gotchas

- A built image keeps its PHP version forever; building alone does not update the live shop — redeploy.
- Nginx `client_max_body_size` is 128M; raising `PHP_MAX_UPLOAD_SIZE` beyond needs a `sed` on `/etc/nginx/nginx.conf`.
- Installs and updates need an extra container running the Deployment Helper (`/setup`).
- Multiple instances need Redis/Valkey for cache and sessions.
- `No transport supports the given Messenger DSN` (Redis): install the package and the PHP Redis extension locally.

## Version notes

- Major upgrade (e.g. 6.6/PHP 8.2 to 6.7/PHP 8.5): backup; check with `shopware-cli project upgrade` (`upgrade-check` is deprecated, removed October 2026); raise `PHP_VERSION` to one both majors support (8.3); update Shopware; then raise PHP — rebuild, redeploy, test after each. Never skip a major.

## Code check (6.7.15.1)
- confirmed `system:update:finish` — core console command run during updates — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- confirmed `scheduled-task:run` — core console command for the scheduler container — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:20
- confirmed `async` — messenger transport defined by core framework config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:69
- confirmed `low_priority` — messenger transport defined by core framework config — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:77
- confirmed `business_event_handler_buffer` — monolog handler registered by core — vendor/shopware/core/Framework/DependencyInjection/services.php:199
- confirmed `DATABASE_URL` — read by the core MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- unverified `ghcr.io/shopware/docker-base` — image contents, env vars and tags are defined in the shopware/docker repository, out of scope
- unverified `shopware-cli project ci` — Shopware CLI, out of scope
