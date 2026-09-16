---
id: platform/dev/6.7/products/paas/shopware/composable-frontends/_index.md
title: Composable Frontends
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/composable-frontends/
sourceHash: 4bc98ae72c654d9611915afbae0bfc2afe89ef05
codeCheckedAgainst: "6.7.13.0"
keywords: ["composable frontends", "kind: cfe", "application.yaml", "/api/healthz", "dockerfile_path", "Surrogate-Control", "routeRules", "isr", "nuxt", "sw-paas application update", "sw-paas application deploy create", "headless frontend", "shopware paas native"]
summary: "Deploy composable frontends on Shopware PaaS Native: application.yaml kind: cfe, Node 22/24/26, port 3000, /api/healthz, custom Dockerfile, ISR headers."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/fundamentals/applications.md", "platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md", "platform/dev/6.7/products/paas/shopware/cdn/_index.md"]
---
## What it is

Configuration specific to deploying composable (Node.js) frontends on Shopware PaaS Native. They share the application lifecycle, deployment commands, environment variables and Vault secret handling of Shopware applications; see [Applications](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md) and [Application YAML](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md).

## When to use

When hosting a composable frontend (e.g. Nuxt) on PaaS Native.

## Key steps / config

Prerequisites: Git repo with the frontend, [`sw-paas` CLI](platform/dev/6.7/products/paas/shopware/get-started/cli.md) access, a project connected to the repo ([Quickstart](platform/dev/6.7/products/paas/shopware/get-started/quickstart.md)), and `application.yaml` in the repo root.

```yaml
apiVersion: v1
kind: cfe
app:
  build:
    dockerfile_path: Dockerfile   # optional custom Dockerfile
  node:
    version: "24"                 # 22, 24 or 26
  environment_variables:
    - name: FOO
      value: BAR
      scope: RUN                  # RUN or BUILD
```

Runtime requirements:

- Listen on port `3000`.
- Expose `/api/healthz` (liveness and readiness; return success when ready).
- Filesystem is read-only; write temporary files to `/app/tmp`.

Custom Dockerfile: non-root user with `UID`/`GID` `1000`, packages up to date, entrypoint starts the server directly.

Secrets: use [Vault secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md) — `env` at runtime, `buildenv` at build ([Environment variables](platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md)).

Deployment: `sw-paas application update` after source or `application.yaml` changes; `sw-paas application deploy create` for a specific build; `sw-paas watch` to monitor; `sw-paas application build logs` / `sw-paas application logs` ([Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md)).

Caching / ISR: cache at the CDN with `Surrogate-Control: max-age=86400, stale-while-revalidate=86400`; for uncached routes send `Cache-Control: no-cache, no-store, must-revalidate` plus `Surrogate-Control: no-store`. In Nuxt, set these under `routeRules` in `nuxt.config.ts` (e.g. `"/"` with `isr: 60 * 60 * 24` and the headers, `"/account/**"` with the no-store headers).

## Essential identifiers

- `kind: cfe`, `app.node.version`, `app.build.dockerfile_path`, `scope: RUN|BUILD`
- `/api/healthz`, port `3000`, `/app/tmp`
- `Surrogate-Control`, `routeRules`, `sw-paas watch`

## Gotchas

- Fastly is configured automatically (incl. HTTP to HTTPS redirect) and a full cache purge runs after every deployment. To purge only, run `sw-paas application deploy create` without changing the commit SHA — it redeploys the same build and runs the CDN purge ([CDN](platform/dev/6.7/products/paas/shopware/cdn/_index.md)).
- Never commit sensitive values such as API tokens to `application.yaml`; use Vault secrets.

## Code check (6.7.13.0)
- unverified `kind: cfe` — PaaS `application.yaml` kind, outside vendor/shopware scope
- unverified `/api/healthz` — frontend health endpoint required by PaaS, outside vendor/shopware scope
- unverified `dockerfile_path` — PaaS build option, outside vendor/shopware scope
- unverified `Surrogate-Control` — header consumed by Fastly in front of the frontend; not referenced in vendor/shopware core
- unverified `sw-paas watch` — PaaS CLI, outside vendor/shopware scope
