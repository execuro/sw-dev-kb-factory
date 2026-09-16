---
id: platform/dev/6.6/guides/installation/setups/docker.md
title: Docker
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/installation/setups/docker.html
sourceHash: 16b9f84da7952b188b70aca404c9379327b75729
keywords: ["docker setup", "docker compose", "compose.yaml", "new-shopware-setup", "makefile", "make up", "make setup", "orbstack", "devcontainer", "image proxy", "xdebug docker"]
summary: "Development Docker setup for Shopware 6.6: creates a project with compose.yaml and a Makefile via a devcontainer image."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/hosting/installation-updates/docker.md
---

## What it is

A Docker-based development setup for Shopware 6 that runs PHP, Node and required services
(MariaDB, Mailpit, Nginx+PHP-FPM) in containers, generated via the
`ghcr.io/shopwarelabs/devcontainer/base-slim` image.

## When to use

For local development with Docker instead of Symfony CLI or Devenv; for Docker in
production, the separate hosting Docker guide applies instead.

## Key steps / config

- Prerequisites: Docker, Docker Compose, `make` (`apt install make` / `brew install make`).
- Create the project:
  ```bash
  mkdir my-project && cd my-project
  docker run --rm -it -v $PWD:/var/www/html ghcr.io/shopwarelabs/devcontainer/base-slim:8.3 new-shopware-setup
  ```
  Optionally pin a Shopware version by appending it, e.g. `new-shopware-setup 6.6.10.0`.
  This creates `compose.yaml` and a `Makefile`.
- Start containers: `make up`. Install Shopware: `make setup` (creates admin user
  `admin`/`shopware`). Stop: `make stop`; remove containers only: `make down`; remove
  containers and data: `docker compose down -v`.
- Enter the container for `bin/console`: `make shell`, or run commands directly from the
  host: `docker compose exec web bin/console cache:clear`.
- Build/watch assets: `make build-administration`, `make build-storefront`,
  `make watch-admin`, `make watch-storefront`.
- Enable a profiler via a `compose.override.yaml` setting `XDEBUG_MODE`, `XDEBUG_CONFIG`,
  `PHP_PROFILER` env vars (`xdebug`, `blackfire`, `tideways`, or `pcov`); `blackfire`
  additionally needs its own service container.
- Proxy production images locally with an `imageproxy` service (image
  `ghcr.io/shopwarelabs/devcontainer/image-proxy`) and a `shopware.filesystem.public.url`
  config pointing Shopware at it.

## Essential identifiers

- `ghcr.io/shopwarelabs/devcontainer/base-slim`, `new-shopware-setup`
- `make up`, `make setup`, `make shell`, `make stop`, `make down`
- `compose.yaml`, `compose.override.yaml`, `Makefile`
- `shopware.filesystem.public.url`

## Gotchas

- On Linux, the host user id must be 1000, or the container setup runs into a known issue
  (check with `id -u`).
- On macOS, OrbStack is recommended over Docker Desktop; OrbStack also exposes each
  container at a generated per-project URL, avoiding manual port mapping.
