---
id: platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md
title: Install with Docker
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/docker-setup.html
sourceHash: a9b5b8ae3b0eed4ef5ec107738da98c88ef1327d
codeCheckedAgainst: "6.7.13.0"
keywords: ["docker", "ghcr.io/shopware/docker-dev", "new-shopware-setup", "make up", "make setup", "make down", "compose.yaml", "Makefile", "docker compose ps", "orbstack", "opensearch", "shopware/dev-tools", "local development setup"]
summary: "Shopware dev setup via the ghcr.io/shopware/docker-dev image: new-shopware-setup, make up, make setup, admin/shopware login, full reset."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/docker.md", "platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/guides/installation/project-overview.md"]
---
## What it is

The Docker-based local development setup for Shopware: a `ghcr.io/shopware/docker-dev` image creates a project with `compose.yaml` and a `Makefile`, then installs an empty, running Shopware instance. For production Docker usage see [Docker for production](platform/dev/6.7/guides/hosting/installation-updates/docker.md).

## When to use

Starting a new Shopware project locally without installing PHP or Composer on the host. The image includes the [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md), available in the container shell.

## Key steps / config

Prerequisites: Docker or OrbStack running; ports (typically `80` or `8080`) free (`lsof -iTCP:80 -sTCP:LISTEN` on macOS/Linux, `netstat -aon | findstr LISTENING | findstr :80` on Windows); `make` installed (`apt install make` / `brew install make`).

1. Optional pre-pull: `docker pull ghcr.io/shopware/docker-dev:php8.3-node24-caddy`
2. Create and enter a directory: `mkdir my-project && cd my-project`
3. Create the project:
   ```bash
   docker run --rm -it -v $PWD:/var/www/html ghcr.io/shopware/docker-dev:php8.3-node24-caddy new-shopware-setup
   # specific version:
   docker run --rm -it -v $PWD:/var/www/html ghcr.io/shopware/docker-dev:php8.3-node24-caddy new-shopware-setup 6.6.10.0
   ```
   Answer the prompt "Do you want to use Elasticsearch? (y/N)": `y` adds an OpenSearch service to the stack; `N` uses MariaDB for search.
4. Start containers: `make up` (web server, database, search, Mailpit, ...). Check health with `docker compose ps`.
5. Install Shopware: `make setup`. It runs the Shopware installer in the web container (no browser wizard), creates a MariaDB database, and creates admin user `admin` / password `shopware`. The app connects to the database via the Docker service name `database`; credentials are defined in `compose.yaml`.
6. Open `localhost:8000` (http) to verify.

Environment management:

```bash
make up                 # start
make down               # stop
docker compose down -v  # full reset: removes containers, networks, volumes (data lost)
```

Next: [review the project structure](platform/dev/6.7/guides/installation/project-overview.md).

## Essential identifiers

- `ghcr.io/shopware/docker-dev:php8.3-node24-caddy`
- `new-shopware-setup`
- `make up`, `make setup`, `make down`
- `compose.yaml`, `Makefile`
- `docker compose ps`, `docker compose down -v`
- `shopware/dev-tools`

## Gotchas

- The setup installs `require-dev` dependencies and `shopware/dev-tools`, enabling the Symfony profiler, demo data, linting and test tooling; it is a development setup, not a production one.
- Project creation takes a few minutes; skipping the pre-pull just downloads the image during creation.
- Images include all required PHP extensions, so the installer's system check always passes.
- `docker compose down -v` deletes all stored data.

## Code check (6.7.13.0)
- confirmed `system:install` — installer command that a scripted setup runs without the browser wizard — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:27
- confirmed `admin` — basic setup creates admin user `admin` with password `shopware` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:130
- unverified `make setup` — Makefile from the docker-dev project template, outside vendor/shopware scope
- unverified `new-shopware-setup` — entry point of the docker-dev image, outside vendor/shopware scope
- unverified `ghcr.io/shopware/docker-dev` — container image, outside vendor/shopware scope
- unverified `compose.yaml` — generated project file, outside vendor/shopware scope
