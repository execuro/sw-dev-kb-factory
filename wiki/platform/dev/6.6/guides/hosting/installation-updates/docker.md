---
docType: developer
id: platform/dev/6.6/guides/hosting/installation-updates/docker.md
sourceHash: 0a9d50c779f4c603c85aed7eb56ed3fa2636be33
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/installation-updates/docker.html
title: Docker Image
version: "6.6"
versions: ["6.6"]
keywords: ["Docker Image", "shopware/docker-base", "shopware-cli", "FrankenPHP", "Caddy", "Nginx", "PHP-FPM", "compose.yaml", "Deployment Helper", "docker-php-extension-installer", "install-php-extensions", "OpenTelemetry", "PHP extensions"]
summary: "Shopware's Docker base image for production, its tags, PHP extensions, mounts, and typical compose.yaml setup."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/hosting/configurations/shopware/environment-variables.md", "platform/dev/6.6/guides/hosting/installation-updates/deployments/deployment-helper.md"]
---
## What it is

This page documents the official Shopware Docker image, based on the PHP image with required extensions, intended to be combined with an existing Shopware project (it does not contain Shopware itself).

## When to use

Use it to run Shopware 6 in a containerized production environment, or when choosing a web server variant (Caddy, FrankenPHP, Nginx) and PHP extension set.

## Key steps / config

Create a project and add the Docker package:

```bash
composer create-project shopware/production <folder>
cd <folder>
composer require shopware/docker
```

Typical Dockerfile:

```dockerfile
#syntax=docker/dockerfile:1.4
ARG PHP_VERSION=8.3
FROM ghcr.io/shopware/docker-base:$PHP_VERSION-caddy AS base-image
FROM shopware/shopware-cli:latest-php-$PHP_VERSION AS shopware-cli
FROM shopware-cli AS build
ADD . /src
WORKDIR /src
RUN /usr/local/bin/entrypoint.sh shopware-cli project ci /src
FROM base-image AS final
COPY --from=build --chown=82 --link /src /var/www/html
```

Tags follow `shopware/docker-base:<php-version>[-patch]-<variant>[-otel]`, e.g. `shopware/docker-base:8.3-caddy`, `shopware/docker-base:8.3-frankenphp`, `shopware/docker-base:8.3-nginx`, `shopware/docker-base:8.3-fpm`. FrankenPHP is recommended over Caddy/Nginx.

Default PHP extensions: `bcmath`, `gd`, `intl`, `mysqli`, `pdo_mysql`, `pcntl`, `sockets`, `bz2`, `gmp`, `soap`, `zip`, `ffi`, `opcache`, `redis`, `apcu`, `amqp`, `zstd`.

Add a custom extension via `docker-php-extension-installer`:

```dockerfile
USER root
RUN install-php-extensions tideways
USER www-data
```

Add custom PHP config with a file at `/usr/local/etc/php/conf.d/`, e.g. `COPY custom.ini /usr/local/etc/php/conf.d/`.

Required volumes when storing files locally: `/var/www/html/files`, `/var/www/html/public/theme`, `/var/www/html/public/media`, `/var/www/html/public/thumbnail`, `/var/www/html/public/sitemap`. Logs go to `var/log` by default but to stdout once `shopware/docker` is installed.

## Essential identifiers

- `shopware/docker-base`
- `shopware/docker`
- `shopware-cli project ci`
- `docker-php-extension-installer` / `install-php-extensions`
- `PHP_SESSION_HANDLER`, `PHP_MEMORY_LIMIT`, `FPM_PM`

## Gotchas

Pin the Docker image to a specific sha256 digest to avoid unexpected updates. Redis/Valkey is required for shared session storage and cache across instances. The `messenger:consume`/scheduled-task worker/scheduler containers are separate entrypoints from the main web container; a dedicated init container (entrypoint `/setup`) is needed to run maintenance tasks like install/update. "No transport supports the given Messenger DSN for Redis" errors usually mean a missing package or an unresolved dependency and require the PHP Redis extension locally.
