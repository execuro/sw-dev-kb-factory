---
id: platform/dev/6.6/products/paas/shopware-paas/setup-template.md
title: Setup Template
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/setup-template.html"
sourceHash: "9957c83cf6a903b0d3634caca65238a58f6f2d62"
keywords: ["setup template", "shopware paas", ".platform/applications.yaml", ".platform/routes.yaml", ".platform/services.yaml", "build hook", "deploy hook", "post_deploy", "mounts", "workers", "relationships", "paas.yaml"]
summary: The PaaS meta-package's files and directories, applications.yaml sections, lifecycle hooks, mounts, and default services.
lastBuilt: "2026-09-15"
---
## What it is

This page describes the files and directories added by the Shopware PaaS meta-package when installed via Symfony Flex, and documents the sections of `.platform/applications.yaml`.

## When to use

Use this when customizing the PaaS build/deploy configuration: lifecycle hooks, mounts, workers, or the enabled services.

## Key steps / config

The meta-package adds:

```
./
├─ .platform/
│  ├─ applications.yaml
│  ├─ routes.yaml
│  ├─ services.yaml
├─ bin/
│  ├─ prestart_cacheclear.sh
├─ config/
│  ├─ packages/
│  │  ├─ paas.yaml
├─ files/
│  ├─ theme-config/
```

`.platform/applications.yaml` sections: `name` (app name, used e.g. in `shopware ssh -A app 'bin/console theme:dump'`, default `app`), `type` (base image / PHP version), `variables` (env vars and settings; `env` values override `.env`), `hooks` (build/deploy/post_deploy scripts), `relationships` (mapping between `services.yaml` services and the app), `mounts` (writable directories, either `local` or `service` type), `web` (routes dynamic requests to `public/index.php`), `workers` (copies of the app instance run after the build hook; two configured by default — message queue and scheduled tasks).

Hooks: the **build hook** builds composer/JS/CSS assets and disables the UI installer, with no access to services (database, Redis) since the app is not yet running. The **deploy hook** copies theme configuration, runs database migrations, sets sales channel domains for non-production environments, and clears the cache; on first deployment it also runs the setup script, sets the theme, generates secrets, and creates `install.lock`. Web traffic is cut off during the deploy hook. The **post_deploy** hook runs after the application container accepts connections.

`.platform/services.yaml` enables 4 services by default: `db`, `cacheredis`, `rabbitmq`, `fileshare`.

`files/theme-config` is suggested for checking theme configuration into version control.

## Essential identifiers

- `.platform/applications.yaml`
- `.platform/routes.yaml`
- `.platform/services.yaml`
- `config/packages/paas.yaml`
- `install.lock`

## Gotchas

During the build hook, write operations to the filesystem are only permitted in directories that are [mounted](#mounts). The deploy hook should be kept as short as possible since web traffic is suspended (not failed, but queued) for its duration.
