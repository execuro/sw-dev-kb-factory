---
id: platform/dev/6.7/products/paas/shopware/composable-frontends/_index.md
title: Composable Frontends
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/composable-frontends/
sourceHash: a818fdb39f5a2eed4cab5b5ae84ae3d1552a5c4f
codeCheckedAgainst: "6.7.15.1"
keywords: ["composable frontends", "kind: cfe", "application.yaml", "app.node.version", "dockerfile_path", "sw-paas application deploy create", "/api/healthz", "Surrogate-Control", "isr", "routeRules", "nuxt", "fastly purge", "paas native", "headless frontend"]
summary: "Composable frontends (kind: cfe) on Shopware PaaS Native: Node.js version, port 3000, /api/healthz, custom Dockerfile, Fastly, ISR."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/fundamentals/applications.md", "platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md", "platform/dev/6.7/products/paas/shopware/guides/monorepo.md", "platform/dev/6.7/products/paas/shopware/cdn/_index.md"]
---
## What it is

Configuration specific to deploying a composable frontend (Node.js, e.g. Nuxt) on Shopware PaaS Native. It uses the same project/application lifecycle, deployment commands, environment variables and Vault secrets as a Shopware application; the differences are the application kind `cfe` and the Node.js runtime settings. General workflow: [Applications](platform/dev/6.7/products/paas/shopware/fundamentals/applications.md), [Application YAML](platform/dev/6.7/products/paas/shopware/fundamentals/application-yaml.md), [Quickstart](platform/dev/6.7/products/paas/shopware/get-started/quickstart.md).

## When to use

When hosting a headless/composable storefront next to (or instead of) a Shopware shop application on PaaS Native, and when setting up CDN caching for it.

## Key steps / config

Prerequisites: a Git repository with the frontend code, the [`sw-paas` CLI](platform/dev/6.7/products/paas/shopware/get-started/cli.md), a project connected to the repository, and an `application.yaml` (by default at the repository root).

Minimal / extended `application.yaml`:

```yaml
apiVersion: v1
kind: cfe
app:
  build:
    dockerfile_path: Dockerfile   # optional, relative to the application.yaml directory
    context: ".."                 # optional, widen build context
  node:
    version: "24"                 # 22, 24 or 26
  environment_variables:
    - name: FOO
      value: BAR
      scope: RUN                  # RUN or BUILD
```

Runtime contract:
- Listen on port `3000`.
- Expose `/api/healthz`, returning success when ready (used for liveness and readiness).
- Filesystem is read-only; write temporary files to `/app/tmp`.

Custom Dockerfile requirements: run as non-root with `UID` and `GID` `1000`, keep packages updated, use an entrypoint that starts the server directly. The PaaS build system still builds and deploys.

Monorepo: `sw-paas application create --application-yaml-path apps/frontend/application.yaml`; the directory holding `application.yaml` is the application root, and `dockerfile_path` and the build context resolve against it ([Deploy from a monorepo](platform/dev/6.7/products/paas/shopware/guides/monorepo.md)).

Secrets: use [Vault secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md) — `env` at runtime, `buildenv` during builds; see [Environment variables](platform/dev/6.7/products/paas/shopware/fundamentals/environment-variables.md).

Deployment commands: `sw-paas application update`, `sw-paas application deploy create`, `sw-paas watch`, `sw-paas application build logs`, `sw-paas application logs` ([Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md)).

Caching / ISR headers sent by the frontend:
- cacheable: `Surrogate-Control: max-age=86400, stale-while-revalidate=86400`
- not cacheable: `Cache-Control: no-cache, no-store, must-revalidate` plus `Surrogate-Control: no-store`

In Nuxt, set them via `routeRules` in `nuxt.config.ts` (e.g. `"/"` with `isr: 60 * 60 * 24` and the `Surrogate-Control` header; `"/account/**"` with the no-cache headers).

## Essential identifiers

- `kind: cfe`, `app.node.version`, `app.build.dockerfile_path`, `app.build.context`
- `app.environment_variables` (`name`, `value`, `scope`)
- `/api/healthz`, port `3000`, `/app/tmp`
- `sw-paas application deploy create`, `sw-paas application update`
- `Surrogate-Control`, `routeRules`

## Gotchas

- `dockerfile_path` is relative to the directory containing `application.yaml`, not the repository root.
- Fastly is configured automatically (including HTTP to HTTPS redirect) and a full cache purge runs after every deployment. To purge only, run `sw-paas application deploy create` without changing the commit SHA — it redeploys the same build and runs the CDN purge action. See [CDN](platform/dev/6.7/products/paas/shopware/cdn/_index.md).
- Never commit sensitive values such as API tokens to `application.yaml`.

## Code check (6.7.15.1)
- unverified `kind: cfe` — PaaS application.yaml schema, not part of Shopware core/storefront/administration
- unverified `/api/healthz` — endpoint provided by the frontend app; no match in the Shopware code roots
- unverified `Surrogate-Control` — Fastly/frontend header, not referenced in the Shopware code roots
- unverified `sw-paas application deploy create` — sw-paas CLI, out of scope of vendor/shopware
